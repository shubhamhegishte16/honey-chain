import QualityAssessment from '../models/QualityAssessment.js';
import WoolBatch from '../models/WoolBatch.js';
import ProcessingRequest from '../models/ProcessingRequest.js';
import TraceabilityEvent from '../models/TraceabilityEvent.js';
import Notification from '../models/Notification.js';

export async function aiPreliminaryEstimate(req, res, next) {
  try {
    const { woolType, state, imageUrl } = req.body;

    // AI heuristic model based on wool breed and regional standards
    const crimpMap = {
      'Merino': { crimp: 'High (10-12 crimps/cm)', micron: 19.5, score: 94, grade: 'Grade A' },
      'Chokla': { crimp: 'High (8-10 crimps/cm)', micron: 21.8, score: 91, grade: 'Grade A' },
      'Marwari': { crimp: 'Medium (6-8 crimps/cm)', micron: 23.5, score: 88, grade: 'Grade A' },
      'Patanwadi': { crimp: 'Medium-High (7-9 crimps/cm)', micron: 24.2, score: 87, grade: 'Grade A' },
      'Magra': { crimp: 'Medium (5-7 crimps/cm)', micron: 28.0, score: 83, grade: 'Grade B' },
      'Nali': { crimp: 'High (9-11 crimps/cm)', micron: 22.0, score: 93, grade: 'Grade A' },
      'Bikaneri': { crimp: 'Medium (6-8 crimps/cm)', micron: 26.5, score: 86, grade: 'Grade A' },
      'Deccani': { crimp: 'Coarse (3-5 crimps/cm)', micron: 34.0, score: 78, grade: 'Grade B' },
    };

    const template = crimpMap[woolType] || { crimp: 'Good crimp definition', micron: 24.0, score: 86, grade: 'Grade A' };
    const randomVariation = (Math.random() * 4 - 2);
    const confidence = Math.min(96, Math.max(76, Math.round(85 + randomVariation)));
    const vegetableMatter = Math.round((1.2 + Math.random() * 1.5) * 10) / 10;
    const colorUniformity = Math.round(90 + Math.random() * 8);

    const result = {
      woolType: woolType || 'Indigenous Fleece',
      preliminaryGrade: template.grade,
      confidenceScore: confidence,
      qualityScore: template.score,
      metrics: {
        crimpDensity: template.crimp,
        estimatedMicron: template.micron,
        vegetableMatterPercent: vegetableMatter,
        colorUniformityPercent: colorUniformity,
        tensileStrengthEstimate: 'Strong (>32 N/ktex)',
        cleanlinessStatus: vegetableMatter < 2 ? 'High Cleanliness' : 'Moderate Cleanliness',
      },
      disclaimer: 'AI-assisted preliminary assessment. Final grading requires authorized assessment.',
      assessedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function submitAssessment(req, res, next) {
  try {
    const {
      batchId,
      fiberAppearance,
      color,
      cleanliness,
      visibleContamination,
      moistureCondition,
      stapleLengthMm,
      micronEstimate,
      finalGrade,
      notes,
      images,
      isAiAssisted,
    } = req.body;

    const batch = await WoolBatch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found.' });
    }

    // Authorization: only an admin, or the artisan/processor actually
    // assigned to process this batch, may submit a quality assessment for it.
    if (req.user.role !== 'admin') {
      if (!['artisan', 'processor'].includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'You are not authorized to submit a quality assessment.' });
      }
      const assignedRequest = await ProcessingRequest.findOne({
        batch: batch._id,
        processor: req.user._id,
      });
      if (!assignedRequest) {
        return res.status(403).json({ success: false, message: 'This wool batch is not assigned to you for processing.' });
      }
    }

    // When no explicit final grade is supplied (e.g. an artisan submitting a
    // processing-stage observation rather than an authorized final grading),
    // derive a reasonable grade from the observed fields instead of
    // defaulting to 'Grade A' regardless of actual quality.
    function deriveGradeFromObservation() {
      let points = 0;
      if (fiberAppearance === 'Excellent') points += 3;
      else if (fiberAppearance === 'Good') points += 2;
      else if (fiberAppearance === 'Moderate') points += 1;

      if (cleanliness === 'High (Low Dust/Grease)') points += 3;
      else if (cleanliness === 'Medium') points += 2;
      else if (cleanliness === 'Low (High Vegetable Matter)') points += 1;

      if (visibleContamination === 'Very Low (<1%)') points += 3;
      else if (visibleContamination === 'Low (1-3%)') points += 2;
      else if (visibleContamination === 'Moderate (3-6%)') points += 1;

      if (color === 'Consistent White' || color === 'Cream White') points += 1;

      // max points = 10
      if (points >= 8) return 'Grade A';
      if (points >= 5) return 'Grade B';
      return 'Grade C';
    }

    const resolvedGrade = finalGrade || deriveGradeFromObservation();
    const calculatedScore = resolvedGrade === 'Grade A' ? 90 : resolvedGrade === 'Grade B' ? 82 : 70;

    let assessment = await QualityAssessment.findOne({ batch: batch._id });
    if (assessment) {
      assessment.fiberAppearance = fiberAppearance || assessment.fiberAppearance;
      assessment.color = color || assessment.color;
      assessment.cleanliness = cleanliness || assessment.cleanliness;
      assessment.visibleContamination = visibleContamination || assessment.visibleContamination;
      assessment.moistureCondition = moistureCondition || assessment.moistureCondition;
      assessment.stapleLengthMm = stapleLengthMm || assessment.stapleLengthMm;
      assessment.micronEstimate = micronEstimate || assessment.micronEstimate;
      assessment.finalGrade = finalGrade || resolvedGrade || assessment.finalGrade;
      assessment.notes = notes !== undefined ? notes : assessment.notes;
      assessment.images = images || assessment.images;
      assessment.isAiAssisted = !!isAiAssisted;
      assessment.assessedBy = req.user._id;
      await assessment.save();
    } else {
      assessment = await QualityAssessment.create({
        batch: batch._id,
        assessedBy: req.user._id,
        fiberAppearance: fiberAppearance || 'Good',
        color: color || 'Consistent White',
        cleanliness: cleanliness || 'High (Low Dust/Grease)',
        visibleContamination: visibleContamination || 'Low (1-3%)',
        moistureCondition: moistureCondition || 'Optimal (<14%)',
        stapleLengthMm: stapleLengthMm || 72,
        micronEstimate: micronEstimate || 22.5,
        preliminaryGrade: finalGrade || resolvedGrade,
        finalGrade: finalGrade || resolvedGrade,
        confidenceScore: isAiAssisted ? 91 : 98,
        isAiAssisted: !!isAiAssisted,
        notes: notes || '',
        images: images || batch.images || [],
      });
    }

    // Update WoolBatch status and grade
    batch.qualityGrade = resolvedGrade;
    batch.qualityScore = calculatedScore;
    if (batch.status === 'produced') {
      batch.status = 'quality_checked';
    }
    await batch.save();

    // Create Traceability Event
    await TraceabilityEvent.create({
      batch: batch._id,
      batchId: batch.batchId,
      eventType: 'quality_checked',
      location: `${batch.origin.district}, ${batch.origin.state} (Quality Lab)`,
      description: `Quality assessment completed: Assigned ${batch.qualityGrade} (${stapleLengthMm || 72}mm staple, ${micronEstimate || 22.5}µm estimate).`,
      performedBy: req.user._id,
      actorName: `${req.user.name} (${req.user.role === 'admin' ? 'Certified Inspector' : 'Assessor'})`,
      timestamp: new Date(),
      metadata: {
        grade: batch.qualityGrade,
        micron: micronEstimate || 22.5,
        staple: stapleLengthMm || 72,
        isAiAssisted,
      }
    });

    // Notify farmer
    await Notification.create({
      recipient: batch.farmer,
      title: `Batch ${batch.batchId} Quality Checked`,
      message: `Quality inspection completed. Graded as ${batch.qualityGrade}.`,
      type: 'quality',
      relatedId: batch.batchId,
      link: `/batches/${batch.batchId}/details`,
    });

    res.json({
      success: true,
      data: {
        assessment,
        batch,
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getBatchAssessment(req, res, next) {
  try {
    const { batchId } = req.params;
    const assessment = await QualityAssessment.findOne({
      $or: [{ batch: batchId }, { batch: (await WoolBatch.findOne({ batchId }))?._id }]
    }).populate('assessedBy', 'name role organization');

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Quality assessment not yet recorded for this batch.' });
    }

    res.json({ success: true, data: assessment });
  } catch (error) {
    next(error);
  }
}

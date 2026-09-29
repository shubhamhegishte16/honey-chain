import TrainingResource from '../models/TrainingResource.js';

export async function getTrainingResources(req, res, next) {
  try {
    const { category, level, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { summary: searchRegex },
        { tags: searchRegex },
      ];
    }

    const resources = await TrainingResource.find(query).sort({ views: -1 });
    res.json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    next(error);
  }
}

export async function getTrainingResourceById(req, res, next) {
  try {
    const { id } = req.params;
    const resource = await TrainingResource.findById(id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Training module not found.' });
    }
    resource.views += 1;
    await resource.save();
    res.json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
}

export async function aiAssistantChat(req, res, next) {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, message: 'Question prompt is required.' });
    }

    const q = question.toLowerCase();
    let responseText = '';
    let recommendations = [];

    if (q.includes('moisture') || q.includes('ferment') || q.includes('water') || q.includes('damp')) {
      responseText = `**Honey Moisture Management & Fermentation Prevention:**
1. **Harvest Only Sealed Combs**: Only extract frames where at least 75-80% of honey cells are wax-capped by bees. Capped cells indicate natural moisture < 18%.
2. **Dehumidification**: In humid coastal or monsoon harvest zones, use solar or low-temperature dehumidifiers before extraction.
3. **Moisture Standard**: FSSAI requires moisture content ≤ 20.0%. Honey below 18% never ferments and maintains unlimited shelf life.
4. **Hermetic Storage**: Store extracted raw honey in food-grade, airtight 304-grade stainless steel barrels with food-grade silicone gaskets.`;
      recommendations = ['Extract only 80%+ sealed honeycombs', 'Check refractometer reading before extraction', 'Use airtight food-grade storage drums'];
    } else if (q.includes('nmr') || q.includes('purity') || q.includes('adulterat') || q.includes('c4') || q.includes('hmf')) {
      responseText = `**Official Honey Quality & NMR Standards (FSSAI & KVIC):**
* **NMR Spectroscopy**: Analyzes botanical signature; detects all forms of foreign inverted sugar syrups (rice syrup, corn syrup, beet sugar).
* **Moisture**: Must be < 20% (Grade A+ requires < 18%).
* **HMF (Hydroxymethylfurfural)**: Must be < 40 mg/kg (High HMF indicates overheating or aging).
* **C4 Sugar Isotope Ratio**: Must be negative (< 1%).
* **Fructose to Glucose Ratio**: Minimum 0.95 (Ensures natural enzymatic balance).

**Tip for Higher Value:** NMR-certified pure unifloral honey commands a 40-60% export and domestic premium!`;
      recommendations = ['Request digital NMR test certificate via KVIC lab', 'Avoid heating raw honey above 45°C', 'Register batch with Honey Chain QR passport'];
    } else if (q.includes('price') || q.includes('sell') || q.includes('market') || q.includes('buyer') || q.includes('mandi')) {
      responseText = `**Maximizing Honey Revenue on Honey Chain:**
1. **Direct Mandi Listing**: Connect directly with FMCG brands, Ayurvedic pharmacies, and organic buyers without middleman cuts.
2. **QR Traceability Badge**: Verified batch origin in Bharatpur, Kashmir, or Sundarbans with blockchain proof commands premium rates.
3. **Check APMC Benchmarks**: Consult our live Mandi Intelligence to track daily prices for Mustard, Sidr, Acacia, and Multifloral varieties.`;
      recommendations = ['Generate QR batch passport for each harvest', 'Check state price trends on Mandi Prices page', 'Respond promptly to buyer procurement RFQs'];
    } else if (q.includes('extract') || q.includes('centrifug') || q.includes('filter') || q.includes('bottle')) {
      responseText = `**Honey Processing & Bottling Best Practices:**
* **Centrifugal Extraction**: Use stainless steel food-grade radial extractors without damaging comb foundations.
* **Micro-Filtration**: Gravity filter through 80-micron food-grade stainless mesh to remove wax fragments while preserving natural pollen grains.
* **Hermetic Bottling**: Clean sterilized glass or PET jars with induction heat seals protect aroma and prevent moisture re-absorption.`;
      recommendations = ['Send raw lots to verified processing facilities on the Processing tab', 'Store bottled honey away from direct sunlight'];
    } else {
      responseText = `**Honey Chain AI Apiculture Advisory:**
To optimize your apiary yield and honey quality:
1. **Log Every Harvest Lot**: Create a batch record immediately upon comb extraction to assign an immutable Batch ID and QR token.
2. **Certified Quality Testing**: Request inspection or use our AI camera preliminary scanner to determine moisture, pollen density, and floral grade.
3. **Direct Procurement**: List on the platform marketplace to connect with certified Ayurvedic processors and direct consumers across India.

*Note: AI-generated advisory aligned with National Bee Board (NBB) and KVIC Honey Mission guidelines.*`;
      recommendations = ['Browse Knowledge Center apiculture articles', 'View Mandi Prices for your state', 'Log a new Honey Batch'];
    }

    res.json({
      success: true,
      data: {
        question,
        answer: responseText,
        recommendedActions: recommendations,
        disclaimer: 'AI-assisted advisory. Please consult regional apiculture extension officers for colony disease management.',
      }
    });
  } catch (error) {
    next(error);
  }
}

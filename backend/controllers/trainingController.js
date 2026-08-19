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

    if (q.includes('monsoon') || q.includes('rain') || q.includes('moisture') || q.includes('wet')) {
      responseText = `**Monsoon Wool Care & Storage Protocol:**
1. **Never shear sheep in wet conditions**: Shearing damp fleece causes immediate mildew formation and fibre rotting inside packed bales.
2. **Elevated Pallet Stacking**: Store all wool bags at least 15 cm off damp concrete/earthen floors on wooden or plastic pallets.
3. **Humidity Barrier**: Wrap stacks in breathable waterproof tarpaulins with silica desiccants; avoid airtight plastic wrap which traps internal condensation.
4. **Regular Aeration**: On dry overcast days, open side ventilators to circulate air without exposing fleece to direct rain splashes.`;
      recommendations = ['Store wool on pallets', 'Check warehouse relative humidity (<65%)', 'Use moisture-proof gunny bags'];
    } else if (q.includes('grade') || q.includes('grading') || q.includes('quality') || q.includes('micron')) {
      responseText = `**Official Wool Grading & Valuation Guidelines:**
* **Grade A (Apparel Grade)**: Micron < 25µm, Staple Length > 65mm, Vegetable Matter < 2%, Moisture < 14%. Sells at 30-40% premium.
* **Grade B (Carpet & Medium)**: Micron 25-32µm, Staple Length 45-65mm, Vegetable Matter 2-5%.
* **Grade C (Industrial/Coarse)**: Staple Length < 45mm, high burr and dirt content.

**Tip for Maximum Return:** Skirt your fleece immediately after shearing to remove belly and leg stained wool. Skirting takes 3 minutes and upgrades the entire main fleece to Grade A!`;
      recommendations = ['Perform immediate post-shearing skirting', 'Use WoolConnect AI scanner for instant preliminary check', 'Register batch with digital test report'];
    } else if (q.includes('price') || q.includes('sell') || q.includes('market') || q.includes('buyer')) {
      responseText = `**Maximizing Sales Value on WoolConnect:**
1. **Direct Marketplace Listing**: Eliminate 20-30% middleman margins by creating a direct verified listing with photo evidence.
2. **QR Traceability Badge**: Buyers and textile mills pay top rates when they can scan your batch QR code and verify authentic origin in Rajasthan/Gujarat/J&K.
3. **Check Live Mandi Prices**: Consult our Market Intelligence board before quoting prices to ensure you capture current upward price momentum.`;
      recommendations = ['Generate QR batch code for every shearing', 'Check state price trends on Market Prices page', 'Respond promptly to buyer inquiries'];
    } else if (q.includes('scour') || q.includes('process') || q.includes('card') || q.includes('dye')) {
      responseText = `**Wool Processing & Value Addition:**
* **Scouring**: Removes grease (lanolin), dirt, and sweat salts. Always use neutral non-ionic detergents at 50-55°C.
* **Carding**: Aligns tangled fibres into uniform slivers. Increases raw fleece value by over 60%.
* **Dyeing**: Natural dyes (walnut hull, madder, pomegranate) with alum mordant produce organic eco-certified yarn that commands premium export pricing.`;
      recommendations = ['Connect with verified processing mills on the Processing tab', 'Store scoured wool in clean dust-free covers'];
    } else {
      responseText = `**WoolConnect AI Expert Advice:**
To optimize your wool yield and profitability:
1. **Record Every Clip**: Create a batch record immediately upon shearing to assign an immutable Batch ID and QR token.
2. **Certified Quality Testing**: Request inspection or use our AI camera preliminary scanner to determine micron class and grade.
3. **Direct Procurement**: List on the platform marketplace to connect with textile mills and artisan cooperatives directly across India.

*Note: AI-generated advisory based on Central Wool Development Board guidelines and pastoralist best practices.*`;
      recommendations = ['Browse Knowledge Center articles', 'View Market Prices for your state', 'Add a new Wool Batch'];
    }

    res.json({
      success: true,
      data: {
        question,
        answer: responseText,
        recommendedActions: recommendations,
        disclaimer: 'AI-assisted advisory. Please consult regional veterinary and agricultural extension officers for clinical livestock treatments.',
      }
    });
  } catch (error) {
    next(error);
  }
}

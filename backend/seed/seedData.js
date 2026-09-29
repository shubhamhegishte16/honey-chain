import User from '../models/User.js';
import WoolBatch from '../models/WoolBatch.js';
import QualityAssessment from '../models/QualityAssessment.js';
import TraceabilityEvent from '../models/TraceabilityEvent.js';
import MarketplaceListing from '../models/MarketplaceListing.js';
import Order from '../models/Order.js';
import Warehouse from '../models/Warehouse.js';
import ProcessingRequest from '../models/ProcessingRequest.js';
import MarketPrice from '../models/MarketPrice.js';
import Producer from '../models/Producer.js';
import TrainingResource from '../models/TrainingResource.js';
import Notification from '../models/Notification.js';

export async function seedDatabase() {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already contains data, skipping seed.');
      return;
    }

    console.log('🌱 Seeding database with realistic Honey Chain & KVIC Honey Mission ecosystem data...');

    // 1. Create Users
    const users = await User.create([
      {
        name: 'Ramesh Singh',
        email: 'ramesh.farmer@example.com',
        mobile: '9829011223',
        password: 'password123',
        role: 'farmer',
        state: 'Rajasthan',
        district: 'Bharatpur',
        village: 'Uchain',
        address: 'Apiary Sector 4, Bharatpur Mustard Belt',
        organization: 'Brij Beekeepers Co-operative (KVIC Cluster)',
        isVerified: true,
        hiveCount: 120,
        flockSize: 120,
        beeSpecies: ['Apis mellifera', 'Apis cerana indica'],
        primaryBreeds: ['Apis mellifera', 'Apis cerana indica'],
      },
      {
        name: 'Anita Deshmukh',
        email: 'anita.buyer@example.com',
        mobile: '9822011224',
        password: 'password123',
        role: 'buyer',
        state: 'Maharashtra',
        district: 'Pune',
        address: 'Dabur India Ayurvedic Raw Honey Procurement Wing',
        organization: 'Dabur Ayurvedic Sourcing Division',
        isVerified: true,
      },
      {
        name: 'Vikramjit Sahni',
        email: 'karan.processor@example.com',
        mobile: '9800011225',
        password: 'password123',
        role: 'processor',
        state: 'Punjab',
        district: 'Amritsar',
        address: 'Amritsar Agro-Industrial Zone, Unit 8',
        organization: 'Golden Nectar Micro-Filtration & Packaging Facility',
        isVerified: true,
      },
      {
        name: 'Suraj Mal Rathore',
        email: 'suraj.warehouse@example.com',
        mobile: '9829011228',
        password: 'password123',
        role: 'warehouse',
        state: 'Rajasthan',
        district: 'Jaipur',
        address: 'RIICO Agro-Logistics Park, Sitapura',
        organization: 'Jaipur Honey Climate-Controlled Storage Hub',
        isVerified: true,
      },
      {
        name: 'Meera Thakur',
        email: 'meera.artisan@example.com',
        mobile: '9800011226',
        password: 'password123',
        role: 'artisan',
        state: 'Himachal Pradesh',
        district: 'Kullu',
        address: 'Naggar Road, Kullu Valley',
        organization: 'Himalayan Wild Flora Honey Self-Help Group',
        isVerified: true,
      },
      {
        name: 'Honey Chain Central Admin',
        email: 'admin@woolconnect.in',
        mobile: '9800011227',
        password: 'password123',
        role: 'admin',
        state: 'Delhi',
        district: 'New Delhi',
        address: 'Khadi & Village Industries Commission, New Delhi',
        organization: 'National Honey Mission Central Portal',
        isVerified: true,
      },
      {
        name: 'Govind Rabari',
        email: 'govind.farmer@example.com',
        mobile: '9825011990',
        password: 'password123',
        role: 'farmer',
        state: 'Gujarat',
        district: 'Kutch',
        village: 'Nakhatrana',
        address: 'Banni Flora Apiary Camp',
        organization: 'Kutch Desert Flora Beekeeping Society',
        isVerified: true,
        hiveCount: 160,
        flockSize: 160,
        beeSpecies: ['Apis mellifera', 'Apis florea'],
        primaryBreeds: ['Apis mellifera', 'Apis florea'],
      },
      {
        name: 'Farooq Ahmad Mir',
        email: 'tsering.farmer@example.com',
        mobile: '9819011881',
        password: 'password123',
        role: 'farmer',
        state: 'Jammu & Kashmir',
        district: 'Srinagar',
        village: 'Tral',
        address: 'Kashmir Valley Acacia & Sidr Apiary, Tral',
        organization: 'Kashmir Valley Organic Honey Guild',
        isVerified: true,
        hiveCount: 140,
        flockSize: 140,
        beeSpecies: ['Apis cerana indica'],
        primaryBreeds: ['Apis cerana indica'],
      }
    ]);

    const [farmerRamesh, buyerAnita, processorVikram, warehouseSuraj, artisanMeera, adminUser, farmerGovind, farmerFarooq] = users;

    // 2. Create Warehouses
    const warehouses = await Warehouse.create([
      {
        name: 'Jaipur Central Honey Storage & Logistics Hub',
        code: 'WH-RJ-JPR-01',
        manager: warehouseSuraj._id,
        state: 'Rajasthan',
        district: 'Jaipur',
        address: 'RIICO Industrial Area, Sitapura, Jaipur',
        totalCapacityKg: 180000,
        availableCapacityKg: 95000,
        pricePerKgMonth: 3.5,
        facilities: ['Climate Control (<24°C)', 'Moisture Proofing', '24/7 CCTV & Security', 'Nitrogen Blanketed Tanks', 'Digital Weighbridge', 'FSSAI Certified'],
        isVerified: true,
        rating: 4.9,
        contactPhone: '+91 98290 11228',
      },
      {
        name: 'Bharatpur Honey Mandi Storage Depot',
        code: 'WH-RJ-BHT-02',
        state: 'Rajasthan',
        district: 'Bharatpur',
        address: 'Mustard Agro-Corridor, Bharatpur',
        totalCapacityKg: 120000,
        availableCapacityKg: 42000,
        pricePerKgMonth: 4.0,
        facilities: ['Drum Settling Bay', 'Quality Inspection Lab', 'Digital Barcode Tracking', 'Pest Free Clean Room'],
        isVerified: true,
        rating: 4.8,
        contactPhone: '+91 98290 44556',
      }
    ]);

    // 3. Create Honey Batches
    const honeyImg1 = '/honey-hero.jpg';
    const honeyImg2 = '/honey-harvest.jpg';
    const honeyImg3 = '/smart-apiary.jpg';

    const batches = await WoolBatch.create([
      {
        batchId: 'HC-RJ-2026-000108',
        farmer: farmerRamesh._id,
        floralSource: 'Mustard Blossom',
        woolType: 'Mustard Blossom',
        beeSpecies: 'Apis mellifera (European Honeybee)',
        hiveCount: 45,
        quantityKg: 180,
        unit: 'kg',
        origin: {
          state: 'Rajasthan',
          district: 'Bharatpur',
          village: 'Uchain',
          farmLocation: 'Apiary Box #1 to #45, Mustard Fields',
        },
        harvestDate: new Date('2026-06-12'),
        shearingDate: new Date('2026-06-12'),
        color: 'Light Amber',
        initialCondition: 'Raw Organic Unprocessed Honey',
        moisturePercent: 17.2,
        hmfLevel: 11.5,
        notes: 'Premium unifloral mustard bloom honey, extracted from sealed comb frames. High natural pollen density.',
        images: [honeyImg1, honeyImg2],
        qualityGrade: 'Grade A+ (NMR Certified 100% Pure)',
        qualityScore: 96,
        blockchainHash: '0x8f4c2e1a9b7d3f5e2c8a1b4d6e9f0a3c5e7b9d1f3a5c7e9b1d3f5a7c9e1b3d5f',
        currentLocation: 'Online Marketplace / Listed',
        status: 'listed',
      },
      {
        batchId: 'HC-JK-2026-000045',
        farmer: farmerFarooq._id,
        floralSource: 'Kashmir White Sidr',
        woolType: 'Kashmir White Sidr',
        beeSpecies: 'Apis cerana indica',
        hiveCount: 30,
        quantityKg: 95,
        unit: 'kg',
        origin: {
          state: 'Jammu & Kashmir',
          district: 'Srinagar',
          village: 'Tral',
          farmLocation: 'Tral Alpine Meadow Apiary',
        },
        harvestDate: new Date('2026-06-28'),
        shearingDate: new Date('2026-06-28'),
        color: 'Water White',
        initialCondition: 'Raw High-Altitude Honey',
        moisturePercent: 16.4,
        hmfLevel: 8.2,
        notes: 'Extremely rare white sidr nectar from pristine high-altitude flora. Zero commercial heating.',
        images: [honeyImg2],
        qualityGrade: 'Grade A+ (NMR Certified 100% Pure)',
        qualityScore: 99,
        blockchainHash: '0x3e1a9b7d8f4c5e2c8a1b4d6e9f0a3c5e7b9d1f3a5c7e9b1d3f5a7c9e1b3d5f8f',
        currentLocation: 'Marketplace / Active',
        status: 'listed',
      },
      {
        batchId: 'HC-PB-2026-000140',
        farmer: farmerRamesh._id,
        floralSource: 'Wild Forest Multifloral',
        woolType: 'Wild Forest Multifloral',
        beeSpecies: 'Apis mellifera',
        hiveCount: 50,
        quantityKg: 240,
        unit: 'kg',
        origin: {
          state: 'Punjab',
          district: 'Hoshiarpur',
          village: 'Mahilpur',
          farmLocation: 'Shivalik Foothills Forest Boundary',
        },
        harvestDate: new Date('2026-07-20'),
        shearingDate: new Date('2026-07-20'),
        color: 'Golden Amber',
        initialCondition: 'Centrifuged & Settled Raw Honey',
        moisturePercent: 17.6,
        hmfLevel: 13.1,
        notes: 'Bottled in 500g sterilized jars with tamper-proof induction foil seal and QR traceability passport.',
        images: [honeyImg3],
        qualityGrade: 'Grade A+ (NMR Certified 100% Pure)',
        qualityScore: 94,
        processor: processorVikram._id,
        blockchainHash: '0x7b9d1f3a5c7e9b1d3f5a7c9e1b3d5f8f8f4c2e1a9b7d3f5e2c8a1b4d6e9f0a3c',
        currentLocation: 'Golden Nectar Bottling Facility, Amritsar',
        status: 'bottled',
      }
    ]);

    // 4. Create Quality Assessments
    await QualityAssessment.create([
      {
        batch: batches[0]._id,
        assessedBy: adminUser._id,
        appearance: 'Clear & Translucent',
        color: 'Light Amber',
        cleanliness: 'High (Micro-Filtered, Zero Comb Residue)',
        visibleContamination: 'None (<0.1%)',
        moisturePercent: 17.2,
        moistureCondition: 'Optimal (<18% FSSAI Certified)',
        hmfLevel: 11.5,
        fructoseGlucoseRatio: 1.28,
        c4SugarAdulteration: 'Negative (100% C3 Natural Nectar)',
        pollenDensity: '> 85,000 grains/10g (Unifloral Brassica napus)',
        diastaseActivity: 18.4,
        nmrSpectrumStatus: 'NMR Certified Authentic Botanical Profile',
        preliminaryGrade: 'Grade A+ (NMR Certified 100% Pure)',
        finalGrade: 'Grade A+ (NMR Certified 100% Pure)',
        confidenceScore: 98,
        isAiAssisted: true,
        notes: 'NMR 400MHz profiling confirms 100% genuine mustard nectar with zero inverted syrup or rice syrup markers.',
        images: [honeyImg1],
      }
    ]);

    // 5. Create Traceability Events
    await TraceabilityEvent.create([
      {
        batch: batches[0]._id,
        batchId: 'HC-RJ-2026-000108',
        eventType: 'produced',
        location: 'Uchain, Bharatpur, Rajasthan',
        description: 'Honey harvested from 45 sealed Langstroth hive frames and recorded on Honey Chain ledger by Ramesh Singh.',
        performedBy: farmerRamesh._id,
        actorName: 'Ramesh Singh (KVIC Beekeeper)',
        timestamp: new Date('2026-06-12T06:30:00.000Z'),
        metadata: { hiveCount: 45, extractionMethod: 'Radial Stainless Centrifuge', moisture: '17.2%' },
      },
      {
        batch: batches[0]._id,
        batchId: 'HC-RJ-2026-000108',
        eventType: 'quality_checked',
        location: 'KVIC Central Testing Lab, Jaipur',
        description: 'AI & NMR Spectrometry testing completed: Certified Grade A+ (17.2% Moisture, 11.5 mg/kg HMF, Zero C4 sugars).',
        performedBy: adminUser._id,
        actorName: 'Dr. V. Sharma (KVIC Certified Lab Officer)',
        timestamp: new Date('2026-06-14T10:00:00.000Z'),
        metadata: { grade: 'Grade A+', moisture: '17.2%', hmf: '11.5 mg/kg' },
      },
      {
        batch: batches[0]._id,
        batchId: 'HC-RJ-2026-000108',
        eventType: 'listed',
        location: 'Honey Chain National Mandi',
        description: 'Listed for commercial procurement at ₹285/kg with verified QR traceability passport.',
        performedBy: farmerRamesh._id,
        actorName: 'Ramesh Singh (Seller)',
        timestamp: new Date('2026-07-02T09:00:00.000Z'),
        metadata: { listingPrice: 285, availableKg: 180 },
      }
    ]);

    // 6. Create Marketplace Listings
    const listings = await MarketplaceListing.create([
      {
        batch: batches[0]._id,
        batchId: 'HC-RJ-2026-000108',
        seller: farmerRamesh._id,
        sellerName: 'Ramesh Singh',
        floralSource: 'Mustard Blossom',
        woolType: 'Mustard Blossom',
        grade: 'Grade A+ (NMR Certified 100% Pure)',
        initialQuantityKg: 180,
        availableQuantityKg: 180,
        pricePerKg: 285,
        state: 'Rajasthan',
        district: 'Bharatpur',
        processingStatus: 'Raw Organic Unprocessed',
        imageUrl: honeyImg1,
        description: 'Pure single-origin Mustard Blossom honey harvested from Bharatpur agricultural belt. 100% raw, unheated, NMR verified.',
        status: 'active',
        views: 384,
      },
      {
        batch: batches[1]._id,
        batchId: 'HC-JK-2026-000045',
        seller: farmerFarooq._id,
        sellerName: 'Farooq Ahmad Mir',
        floralSource: 'Kashmir White Sidr',
        woolType: 'Kashmir White Sidr',
        grade: 'Grade A+ (NMR Certified 100% Pure)',
        initialQuantityKg: 95,
        availableQuantityKg: 95,
        pricePerKg: 650,
        state: 'Jammu & Kashmir',
        district: 'Srinagar',
        processingStatus: 'Raw High-Altitude Honey',
        imageUrl: honeyImg2,
        description: 'Rare white sidr nectar from Tral alpine pastures in Kashmir Valley. Exceptional antioxidant and medicinal properties.',
        status: 'active',
        views: 520,
      }
    ]);

    // 7. Create Orders
    await Order.create([
      {
        orderId: 'ORD-2026-000101',
        listing: listings[0]._id,
        batch: batches[0]._id,
        batchId: 'HC-RJ-2026-000108',
        buyer: buyerAnita._id,
        buyerName: 'Anita Deshmukh',
        buyerEmail: 'anita.buyer@example.com',
        seller: farmerRamesh._id,
        sellerName: 'Ramesh Singh',
        floralSource: 'Mustard Blossom',
        woolType: 'Mustard Blossom',
        quantityKg: 60,
        pricePerKg: 285,
        totalAmount: 60 * 285,
        deliveryAddress: {
          street: 'Plot 12, Dabur Raw Herb & Nectar Sourcing Center',
          district: 'Pune',
          state: 'Maharashtra',
          pinCode: '411014',
          contactPhone: '+91 98220 11224',
        },
        notes: 'Please ship in food-grade sealed 30kg stainless drums.',
        status: 'dispatched',
        statusHistory: [
          { status: 'placed', timestamp: new Date('2026-08-10T10:00:00.000Z'), note: 'Order placed by Anita Deshmukh (Dabur Sourcing)' },
          { status: 'confirmed', timestamp: new Date('2026-08-11T09:00:00.000Z'), note: 'Confirmed by Ramesh Singh' },
          { status: 'dispatched', timestamp: new Date('2026-08-14T14:30:00.000Z'), note: 'Dispatched via Temperature-Controlled Cold Chain' },
        ]
      }
    ]);

    // 8. Create Processing Requests
    await ProcessingRequest.create([
      {
        requestId: 'PR-2026-00054',
        batch: batches[2]._id,
        batchId: 'HC-PB-2026-000140',
        farmer: farmerRamesh._id,
        farmerName: 'Ramesh Singh',
        processor: processorVikram._id,
        processorName: 'Vikramjit Sahni (Golden Nectar)',
        serviceType: 'Hermetic Sterilized Bottling & QR Labelling',
        quantityKg: 240,
        preferredDate: new Date('2026-08-05'),
        completionDate: new Date('2026-08-10'),
        bottlesPacked: 480,
        jarSizeGrams: 500,
        notes: 'Micro-filtration at 50-micron followed by hermetic induction sealing in 500g glass jars with batch QR stamps.',
        status: 'completed',
        estimatedCost: 240 * 25,
      }
    ]);

    // 9. Create 30-Day Market Prices
    function generateHistory(basePrice, days = 30) {
      const history = [];
      const startDate = new Date('2026-08-19');
      let current = basePrice;
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(startDate);
        d.setDate(d.getDate() - i);
        const dayString = d.toISOString().split('T')[0];
        const drift = (Math.random() - 0.44) * 4.2;
        current = Math.max(160, Math.round((current + drift) * 10) / 10);
        history.push({ date: dayString, price: Math.round(current) });
      }
      return history;
    }

    await MarketPrice.create([
      {
        state: 'Rajasthan',
        floralSource: 'Mustard Blossom',
        woolType: 'Mustard Blossom',
        pricePerKg: 285,
        changePercent: 3.8,
        history: generateHistory(275, 30),
      },
      {
        state: 'Jammu & Kashmir',
        floralSource: 'Kashmir White Sidr',
        woolType: 'Kashmir White Sidr',
        pricePerKg: 650,
        changePercent: 5.4,
        history: generateHistory(620, 30),
      },
      {
        state: 'Jammu & Kashmir',
        floralSource: 'Acacia (Kashmir Valley)',
        woolType: 'Acacia (Kashmir Valley)',
        pricePerKg: 480,
        changePercent: 4.1,
        history: generateHistory(460, 30),
      },
      {
        state: 'Bihar',
        floralSource: 'Muzaffarpur Shahi Lychee',
        woolType: 'Muzaffarpur Shahi Lychee',
        pricePerKg: 340,
        changePercent: 2.8,
        history: generateHistory(330, 30),
      },
      {
        state: 'Punjab',
        floralSource: 'Wild Forest Multifloral',
        woolType: 'Wild Forest Multifloral',
        pricePerKg: 310,
        changePercent: 2.2,
        history: generateHistory(302, 30),
      },
      {
        state: 'Maharashtra',
        floralSource: 'Jamun Blossom',
        woolType: 'Jamun Blossom',
        pricePerKg: 395,
        changePercent: 3.5,
        history: generateHistory(380, 30),
      }
    ]);

    // 10. Create Producers Directory
    await Producer.create([
      {
        name: 'Ramesh Singh',
        user: farmerRamesh._id,
        role: 'farmer',
        state: 'Rajasthan',
        district: 'Bharatpur',
        address: 'Uchain Tehsil, Bharatpur',
        honeyVarieties: ['Mustard Blossom', 'Multifloral Forest'],
        woolTypes: ['Mustard Blossom', 'Multifloral Forest'],
        annualProductionKg: 3200,
        hiveCount: 120,
        flockSize: 120,
        beeSpecies: ['Apis mellifera'],
        breeds: ['Apis mellifera'],
        specialty: 'Pure unifloral Mustard Blossom honey with NMR certified lab grading',
        isVerified: true,
        contactEmail: 'ramesh.farmer@example.com',
        contactPhone: '+91 98290 11223',
        rating: 4.95,
      },
      {
        name: 'Farooq Ahmad Mir Apiaries',
        user: farmerFarooq._id,
        role: 'farmer',
        state: 'Jammu & Kashmir',
        district: 'Srinagar',
        address: 'Tral Sector, Kashmir Valley',
        honeyVarieties: ['Kashmir White Sidr', 'Acacia (Kashmir Valley)'],
        woolTypes: ['Kashmir White Sidr', 'Acacia (Kashmir Valley)'],
        annualProductionKg: 1850,
        hiveCount: 140,
        flockSize: 140,
        beeSpecies: ['Apis cerana indica'],
        breeds: ['Apis cerana indica'],
        specialty: 'Rare pristine high-altitude white sidr & crystal clear acacia honey',
        isVerified: true,
        contactEmail: 'farooq.honey@example.com',
        contactPhone: '+91 98190 11881',
        rating: 5.0,
      }
    ]);

    // 11. Create Training Resources
    await TrainingResource.create([
      {
        title: 'Modern Hive Management & Seasonal Colony Inspection',
        category: 'Apiary Management',
        level: 'Beginner',
        duration: '12 min read',
        summary: 'Essential guidelines for weekly brood frame inspection, swarm prevention, and feeding schedules during lean floral seasons.',
        content: `### 1. Hive Inspection Protocol
Perform hive examinations on sunny, calm mornings when field worker bees are foraging. Never disturb brood frames in windy or rainy weather.

### 2. Swarm Prevention
Monitor queen cell construction during peak nectar flow. Provide additional super boxes to give the queen ample room for egg laying.`,
        keyTakeaways: [
          'Inspect hives weekly during nectar flow to detect queen cells early',
          'Add honey supers before brood chambers become congested',
          'Maintain clean bottom boards to prevent wax moth larvae infestation'
        ],
        tags: ['Apiary Management', 'Swarm Control', 'Hive Health'],
        views: 340,
        youtubeUrl: 'https://www.youtube.com/watch?v=JYASAHeFRKg',
        targetProblems: ['poor-quality'],
        recommendedSeasons: ['monsoon', 'processing'],
        interests: ['sheep-care'],
        practicalSteps: [
          { step: 1, title: "Wear Protective Veil & Light Smoker", description: "Use cool pine needle or burlap smoke gently at hive entrance.", icon: "🐝" },
          { step: 2, title: "Examine Brood Pattern", description: "Verify compact worker brood pattern and presence of single centered eggs.", icon: "🔍" },
          { step: 3, title: "Check Honey Stores", description: "Ensure the colony retains at least 2-3 frames of capped honey for emergencies.", icon: "🍯" }
        ]
      },
      {
        title: 'Comb Extraction & Centrifugation Best Practices',
        category: 'Comb Extraction & Centrifugation',
        level: 'Beginner',
        duration: '10 min read',
        summary: 'Step-by-step guidance on decapping sealed combs, operating radial extractors, and preventing honey contamination.',
        content: `### 1. Harvesting Only Sealed Combs
Never harvest unripened honey. At least 75-80% of comb cells must be wax-capped by bees to guarantee natural moisture below 18%.

### 2. Clean Extraction Technique
Use stainless steel decapping knives and centrifugal extractors to protect the drawn wax foundation for subsequent re-use by the colony.`,
        keyTakeaways: [
          'Only harvest 80%+ sealed combs to prevent fermentation',
          'Use food-grade stainless steel equipment with zero galvanized parts',
          'Store extracted raw honey in hermetic drums with silicone gaskets'
        ],
        tags: ['Extraction', 'Harvesting', 'Purity'],
        views: 410,
        youtubeUrl: 'https://www.youtube.com/watch?v=N7CpW1mBodc',
        targetProblems: ['shearing-problem', 'dirty-wool'],
        recommendedSeasons: ['shearing'],
        interests: ['shearing', 'wool-quality'],
        practicalSteps: [
          { step: 1, title: "Select Capped Frames", description: "Choose frames with >80% wax capping.", icon: "📦" },
          { step: 2, title: "Decap Wax Cells", description: "Slice cappings smoothly using a warm stainless knife.", icon: "🔪" },
          { step: 3, title: "Centrifugal Extraction", description: "Spin frames gently in the radial extractor.", icon: "⚙️" }
        ]
      },
      {
        title: 'FSSAI & KVIC Honey Quality Testing: NMR & Moisture Standards',
        category: 'Honey Quality & NMR Standards',
        level: 'Intermediate',
        duration: '15 min read',
        summary: 'Understanding NMR spectroscopy, HMF thresholds, C4 isotope testing, and moisture benchmarks to secure maximum price realization.',
        content: `### Official Indian Honey Standards (IS 4941:1994 & FSSAI 2020)
* **Moisture**: Maximum 20.0% (Export Grade A+ requires < 18%).
* **HMF**: Maximum 40 mg/kg (Higher values denote overheating or adulteration).
* **C4 Sugar Isotope Ratio**: Negative (< 1%).
* **NMR Profiling**: Confirms botanical floral identity and absence of all synthetic sugar syrups.`,
        keyTakeaways: [
          'NMR testing is the definitive global proof of 100% natural honey',
          'Low moisture (<18%) ensures infinite natural shelf life without preservatives',
          'Digital batch certification unlocks direct corporate and export procurement'
        ],
        tags: ['NMR', 'Quality', 'FSSAI', 'Testing'],
        views: 520,
        youtubeUrl: 'https://www.youtube.com/watch?v=Ksc8wY_VFJk',
        targetProblems: ['discolored-wool', 'poor-quality'],
        recommendedSeasons: ['shearing', 'processing'],
        interests: ['wool-quality'],
        practicalSteps: [
          { step: 1, title: "Take Representative Core Sample", description: "Draw 100g sample from bottom, middle, and top of barrel.", icon: "🧪" },
          { step: 2, title: "Check Refractometer Brix", description: "Measure moisture percentage on calibrated refractometer.", icon: "📏" },
          { step: 3, title: "Generate Blockchain Test Seal", description: "Link verified lab certificate to batch QR passport.", icon: "🏆" }
        ]
      }
    ]);

    // 12. Create Initial Notifications
    await Notification.create([
      {
        recipient: farmerRamesh._id,
        title: 'Batch HC-RJ-2026-000108 Quality Certified',
        message: 'NMR spectroscopy completed: Grade A+ (100% Pure Mustard Honey) sealed onto Honey Chain.',
        type: 'quality',
        relatedId: 'HC-RJ-2026-000108',
        link: '/batches/HC-RJ-2026-000108/details',
        isRead: false,
      },
      {
        recipient: farmerRamesh._id,
        title: 'Bottling Job Completed',
        message: 'Golden Nectar has completed 50-micron filtration & hermetic bottling for batch HC-PB-2026-000140.',
        type: 'processing',
        relatedId: 'HC-PB-2026-000140',
        link: '/batches/HC-PB-2026-000140/traceability',
        isRead: false,
      },
      {
        recipient: buyerAnita._id,
        title: 'Order Dispatched',
        message: 'Your honey procurement order ORD-2026-000101 has been dispatched by Ramesh Singh.',
        type: 'order',
        relatedId: 'ORD-2026-000101',
        link: '/buyer/orders',
        isRead: false,
      }
    ]);

    console.log('✅ Seed completed successfully! All Honey Chain apiculture entities initialized.');
  } catch (error) {
    console.error('❌ Database seed error:', error);
  }
}

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

    console.log('🌱 Seeding database with realistic Indian wool ecosystem data...');

    // 1. Create Users
    const users = await User.create([
      {
        name: 'Ramesh Choudhary',
        email: 'ramesh.farmer@example.com',
        mobile: '9829011223',
        password: 'password123',
        role: 'farmer',
        state: 'Rajasthan',
        district: 'Bikaner',
        village: 'Kolayat',
        address: 'Kolayat Farm Sector 3, Bikaner Highway',
        organization: 'Bikaner Wool Growers Association',
        isVerified: true,
        flockSize: 240,
        primaryBreeds: ['Marwari', 'Chokla', 'Magra'],
      },
      {
        name: 'Anita Deshmukh',
        email: 'anita.buyer@example.com',
        mobile: '9822011224',
        password: 'password123',
        role: 'buyer',
        state: 'Maharashtra',
        district: 'Solapur',
        address: 'Solapur Textile Park, Unit 12',
        organization: 'Deshmukh Apparel Mills',
        isVerified: true,
      },
      {
        name: 'Karan Patel',
        email: 'karan.processor@example.com',
        mobile: '9800011225',
        password: 'password123',
        role: 'processor',
        state: 'Gujarat',
        district: 'Kutch',
        address: 'Bhuj Industrial Estate, Plot 45',
        organization: 'Karan Textiles & Wool Scouring Pvt Ltd',
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
        organization: 'Jaipur Wool Central Logistics Hub',
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
        organization: 'Meera Himalayan Handlooms Co-op',
        isVerified: true,
      },
      {
        name: 'WoolConnect Central Admin',
        email: 'admin@woolconnect.in',
        mobile: '9800011227',
        password: 'password123',
        role: 'admin',
        state: 'Rajasthan',
        district: 'Jaipur',
        address: 'Central Wool Board Campus, Jaipur',
        organization: 'WoolConnect National Portal',
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
        address: 'Banni Grasslands Pasture Camp',
        organization: 'Kutch Pastoralist Cooperative',
        isVerified: true,
        flockSize: 320,
        primaryBreeds: ['Patanwadi', 'Kachchhi'],
      },
      {
        name: 'Tsering Dorje',
        email: 'tsering.farmer@example.com',
        mobile: '9819011881',
        password: 'password123',
        role: 'farmer',
        state: 'Jammu & Kashmir',
        district: 'Leh',
        village: 'Changthang',
        address: 'Nomadic Herders Camp, Nyoma',
        organization: 'Ladakh High-Altitude Wool Guild',
        isVerified: true,
        flockSize: 180,
        primaryBreeds: ['Nali', 'Changthangi Pashmina'],
      }
    ]);

    const [farmerRamesh, buyerAnita, processorKaran, warehouseSuraj, artisanMeera, adminUser, farmerGovind, farmerTsering] = users;

    // 2. Create Warehouses
    const warehouses = await Warehouse.create([
      {
        name: 'Jaipur Central Wool Storage & Logistics Hub',
        code: 'WH-RJ-JPR-01',
        manager: warehouseSuraj._id,
        state: 'Rajasthan',
        district: 'Jaipur',
        address: 'RIICO Industrial Area, Sitapura, Jaipur',
        totalCapacityKg: 150000,
        availableCapacityKg: 84000,
        pricePerKgMonth: 3.5,
        facilities: ['Climate Control', 'Moisture Proofing', '24/7 CCTV & Security', 'Covered Loading Dock', 'Fire Suppression', 'Digital Weighbridge'],
        isVerified: true,
        rating: 4.9,
        contactPhone: '+91 98290 11228',
      },
      {
        name: 'Bikaner Wool Mandi Warehouse',
        code: 'WH-RJ-BKN-02',
        state: 'Rajasthan',
        district: 'Bikaner',
        address: 'Karni Industrial Area, Bikaner',
        totalCapacityKg: 95000,
        availableCapacityKg: 32000,
        pricePerKgMonth: 4.0,
        facilities: ['Dry Storage', 'Quality Inspection Bay', 'Digital Inventory Tracking', 'Pest Control Certified'],
        isVerified: true,
        rating: 4.7,
        contactPhone: '+91 98290 44556',
      },
      {
        name: 'Kutch Regional Agro-Storage',
        code: 'WH-GJ-KTC-01',
        state: 'Gujarat',
        district: 'Kutch',
        address: 'Near Madhapar Highway, Bhuj',
        totalCapacityKg: 60000,
        availableCapacityKg: 28500,
        pricePerKgMonth: 3.8,
        facilities: ['Dust Free Bay', 'Ventilated Storage', 'Security'],
        isVerified: true,
        rating: 4.6,
        contactPhone: '+91 98250 33441',
      },
      {
        name: 'Solapur Textile Supply Depot',
        code: 'WH-MH-SLP-01',
        state: 'Maharashtra',
        district: 'Solapur',
        address: 'MIDC Chhatrapati Sambhaji Nagar Road, Solapur',
        totalCapacityKg: 75000,
        availableCapacityKg: 41000,
        pricePerKgMonth: 4.2,
        facilities: ['Dehumidification', 'Automated Pallet Racks', 'Security'],
        isVerified: true,
        rating: 4.8,
        contactPhone: '+91 98220 77889',
      }
    ]);

    // 3. Create Wool Batches
    const woolImg1 = 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&auto=format&fit=crop&q=60';
    const woolImg2 = 'https://images.unsplash.com/photo-1584447141399-be686c4295ba?w=800&auto=format&fit=crop&q=60';
    const woolImg3 = 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?w=800&auto=format&fit=crop&q=60';

    const batches = await WoolBatch.create([
      {
        batchId: 'WV-RJ-2026-000124',
        farmer: farmerRamesh._id,
        woolType: 'Marwari',
        quantityKg: 180,
        unit: 'kg',
        origin: {
          state: 'Rajasthan',
          district: 'Bikaner',
          village: 'Kolayat',
          farmLocation: 'Kolayat Pasture Shed #2',
        },
        shearingDate: new Date('2026-06-12'),
        color: 'Natural White',
        initialCondition: 'Clean Spring Greasy Fleece',
        notes: 'Premium spring clip, high staple length, optimal crimp definition.',
        images: [woolImg1, woolImg2],
        qualityGrade: 'Grade A',
        qualityScore: 92,
        currentLocation: 'Online Marketplace / Listed',
        status: 'listed',
      },
      {
        batchId: 'WV-RJ-2026-000118',
        farmer: farmerRamesh._id,
        woolType: 'Chokla',
        quantityKg: 120,
        unit: 'kg',
        origin: {
          state: 'Rajasthan',
          district: 'Bikaner',
          village: 'Kolayat',
          farmLocation: 'Kolayat Central Shed',
        },
        shearingDate: new Date('2026-07-02'),
        color: 'Off-White',
        initialCondition: 'Raw Greasy Fleece',
        notes: 'Chokla breed renowned as Indian Merino; ideal for carpet and fine knitwear.',
        images: [woolImg2],
        qualityGrade: 'Grade A',
        qualityScore: 89,
        currentLocation: 'Bikaner Quality Inspection Center',
        status: 'quality_checked',
      },
      {
        batchId: 'WV-RJ-2026-000131',
        farmer: farmerRamesh._id,
        woolType: 'Magra',
        quantityKg: 250,
        unit: 'kg',
        origin: {
          state: 'Rajasthan',
          district: 'Bikaner',
          village: 'Napasar',
          farmLocation: 'Napasar Grazing Ground',
        },
        shearingDate: new Date('2026-07-20'),
        color: 'Natural White',
        initialCondition: 'Dry Stored',
        notes: 'Magra lustrous fleece, stored in certified moisture-controlled warehouse.',
        images: [woolImg1],
        qualityGrade: 'Grade B',
        qualityScore: 84,
        warehouse: warehouses[0]._id,
        currentLocation: 'Jaipur Central Wool Storage & Logistics Hub',
        status: 'stored',
      },
      {
        batchId: 'WV-RJ-2026-000140',
        farmer: farmerRamesh._id,
        woolType: 'Bikaneri',
        quantityKg: 310,
        unit: 'kg',
        origin: {
          state: 'Rajasthan',
          district: 'Bikaner',
          village: 'Lunkaransar',
          farmLocation: 'Lunkaransar North Farm',
        },
        shearingDate: new Date('2026-08-01'),
        color: 'Cream',
        initialCondition: 'Scoured and Carded',
        notes: 'Processed through scouring line and carded into smooth slivers.',
        images: [woolImg3],
        qualityGrade: 'Grade A',
        qualityScore: 90,
        processor: processorKaran._id,
        currentLocation: 'Karan Textiles Processing Mill, Bhuj',
        status: 'processed',
      },
      {
        batchId: 'WV-GJ-2026-000088',
        farmer: farmerGovind._id,
        woolType: 'Patanwadi',
        quantityKg: 210,
        unit: 'kg',
        origin: {
          state: 'Gujarat',
          district: 'Kutch',
          village: 'Nakhatrana',
          farmLocation: 'Banni Pasture Camp 4',
        },
        shearingDate: new Date('2026-05-18'),
        color: 'Natural White',
        initialCondition: 'Sorted Raw',
        notes: 'Patanwadi fleece with soft handle and fine crimp.',
        images: [woolImg1],
        qualityGrade: 'Grade A',
        qualityScore: 88,
        currentLocation: 'Marketplace / Active',
        status: 'listed',
      },
      {
        batchId: 'WV-JK-2026-000045',
        farmer: farmerTsering._id,
        woolType: 'Nali',
        quantityKg: 95,
        unit: 'kg',
        origin: {
          state: 'Jammu & Kashmir',
          district: 'Leh',
          village: 'Changthang',
          farmLocation: 'Nyoma Plateau Pasture',
        },
        shearingDate: new Date('2026-06-28'),
        color: 'Natural White',
        initialCondition: 'Hand Combed Fleece',
        notes: 'High-altitude cold climate wool, exceptional thermal insulation.',
        images: [woolImg2],
        qualityGrade: 'Grade A',
        qualityScore: 95,
        currentLocation: 'Marketplace / Active',
        status: 'listed',
      }
    ]);

    // 4. Create Quality Assessments
    await QualityAssessment.create([
      {
        batch: batches[0]._id,
        assessedBy: adminUser._id,
        fiberAppearance: 'Excellent',
        color: 'Consistent White',
        cleanliness: 'High (Low Dust/Grease)',
        visibleContamination: 'Very Low (<1%)',
        moistureCondition: 'Optimal (<14%)',
        stapleLengthMm: 78,
        micronEstimate: 21.2,
        preliminaryGrade: 'Grade A',
        finalGrade: 'Grade A',
        confidenceScore: 92,
        isAiAssisted: true,
        notes: 'Consistent staple length, minimal burr content, high tensile resilience.',
        images: [woolImg1],
      },
      {
        batch: batches[1]._id,
        assessedBy: adminUser._id,
        fiberAppearance: 'Good',
        color: 'Consistent White',
        cleanliness: 'High (Low Dust/Grease)',
        visibleContamination: 'Low (1-3%)',
        moistureCondition: 'Optimal (<14%)',
        stapleLengthMm: 72,
        micronEstimate: 23.4,
        preliminaryGrade: 'Grade A',
        finalGrade: 'Grade A',
        confidenceScore: 89,
        isAiAssisted: true,
        notes: 'Excellent Chokla characteristics. Ready for scouring or direct spinning.',
        images: [woolImg2],
      }
    ]);

    // 5. Create Traceability Events for Batches
    await TraceabilityEvent.create([
      // Batch 0 (WV-RJ-2026-000124) Events
      {
        batch: batches[0]._id,
        batchId: 'WV-RJ-2026-000124',
        eventType: 'produced',
        location: 'Kolayat, Bikaner, Rajasthan',
        description: 'Wool sheared and batch recorded on WoolConnect ledger by Ramesh Choudhary.',
        performedBy: farmerRamesh._id,
        actorName: 'Ramesh Choudhary (Farmer)',
        timestamp: new Date('2026-06-12T06:30:00.000Z'),
        metadata: { sheepCount: 80, shearingMethod: 'Machine Clipper' },
      },
      {
        batch: batches[0]._id,
        batchId: 'WV-RJ-2026-000124',
        eventType: 'quality_checked',
        location: 'Bikaner Wool Grading Lab, Rajasthan',
        description: 'AI & physical inspection completed: Graded Grade A (21.2 Micron, 78mm staple, 92% score).',
        performedBy: adminUser._id,
        actorName: 'Dr. V. Sharma (Certified Wool Inspector)',
        timestamp: new Date('2026-06-14T10:00:00.000Z'),
        metadata: { grade: 'Grade A', micron: 21.2, moisture: '13.2%' },
      },
      {
        batch: batches[0]._id,
        batchId: 'WV-RJ-2026-000124',
        eventType: 'sorted',
        location: 'Bikaner Central Depot',
        description: 'Sorted by staple length and color uniformity.',
        performedBy: farmerRamesh._id,
        actorName: 'Bikaner Sorting Crew',
        timestamp: new Date('2026-06-18T11:15:00.000Z'),
        metadata: { sortCategory: 'Fine Apparel' },
      },
      {
        batch: batches[0]._id,
        batchId: 'WV-RJ-2026-000124',
        eventType: 'stored',
        location: 'Jaipur Central Wool Storage & Logistics Hub',
        description: 'Transferred and vaulted in Bay 4 under monitored humidity (55% RH).',
        performedBy: warehouseSuraj._id,
        actorName: 'Jaipur Logistics Hub Staff',
        timestamp: new Date('2026-06-25T14:00:00.000Z'),
        metadata: { warehouseCode: 'WH-RJ-JPR-01', bay: '4B' },
      },
      {
        batch: batches[0]._id,
        batchId: 'WV-RJ-2026-000124',
        eventType: 'listed',
        location: 'WoolConnect National Marketplace',
        description: 'Listed for commercial sale at ₹320/kg with verified QR traceability.',
        performedBy: farmerRamesh._id,
        actorName: 'Ramesh Choudhary (Seller)',
        timestamp: new Date('2026-07-02T09:00:00.000Z'),
        metadata: { listingPrice: 320, availableKg: 180 },
      },

      // Batch 1 (WV-RJ-2026-000118) Events
      {
        batch: batches[1]._id,
        batchId: 'WV-RJ-2026-000118',
        eventType: 'produced',
        location: 'Kolayat, Bikaner, Rajasthan',
        description: 'Chokla spring clip sheared and registered with QR token.',
        performedBy: farmerRamesh._id,
        actorName: 'Ramesh Choudhary',
        timestamp: new Date('2026-07-02T07:00:00.000Z'),
      },
      {
        batch: batches[1]._id,
        batchId: 'WV-RJ-2026-000118',
        eventType: 'quality_checked',
        location: 'Bikaner Wool Testing Lab',
        description: 'Certified Grade A Chokla wool by authorized grader.',
        performedBy: adminUser._id,
        actorName: 'Quality Directorate',
        timestamp: new Date('2026-07-05T09:30:00.000Z'),
      },

      // Batch 3 (WV-RJ-2026-000140) Events
      {
        batch: batches[3]._id,
        batchId: 'WV-RJ-2026-000140',
        eventType: 'produced',
        location: 'Lunkaransar, Bikaner',
        description: 'Bikaneri raw fleece sheared and recorded.',
        performedBy: farmerRamesh._id,
        actorName: 'Ramesh Choudhary',
        timestamp: new Date('2026-08-01T08:00:00.000Z'),
      },
      {
        batch: batches[3]._id,
        batchId: 'WV-RJ-2026-000140',
        eventType: 'processed',
        location: 'Karan Textiles Processing Mill, Bhuj',
        description: 'Scouring and carding completed. Converted to carded slivers with 0.8% residual grease.',
        performedBy: processorKaran._id,
        actorName: 'Karan Patel (Processing Engineer)',
        timestamp: new Date('2026-08-10T15:30:00.000Z'),
      }
    ]);

    // 6. Create Marketplace Listings
    const listings = await MarketplaceListing.create([
      {
        batch: batches[0]._id,
        batchId: 'WV-RJ-2026-000124',
        seller: farmerRamesh._id,
        sellerName: 'Ramesh Choudhary',
        woolType: 'Marwari',
        grade: 'Grade A',
        initialQuantityKg: 180,
        availableQuantityKg: 180,
        pricePerKg: 320,
        state: 'Rajasthan',
        district: 'Bikaner',
        processingStatus: 'Graded & Sorted',
        imageUrl: woolImg1,
        description: 'Premium graded Marwari fine wool from Kolayat pasture. High staple strength, pure white color, low vegetation contamination. QR verifiable.',
        status: 'active',
        views: 312,
      },
      {
        batch: batches[4]._id,
        batchId: 'WV-GJ-2026-000088',
        seller: farmerGovind._id,
        sellerName: 'Govind Rabari',
        woolType: 'Patanwadi',
        grade: 'Grade A',
        initialQuantityKg: 210,
        availableQuantityKg: 150,
        pricePerKg: 275,
        state: 'Gujarat',
        district: 'Kutch',
        processingStatus: 'Raw Greasy',
        imageUrl: woolImg2,
        description: 'Fresh Patanwadi wool from Kutch grasslands. High crimp and softness suitable for blended knitting yarns.',
        status: 'active',
        views: 184,
      },
      {
        batch: batches[5]._id,
        batchId: 'WV-JK-2026-000045',
        seller: farmerTsering._id,
        sellerName: 'Tsering Dorje',
        woolType: 'Nali',
        grade: 'Grade A',
        initialQuantityKg: 95,
        availableQuantityKg: 95,
        pricePerKg: 340,
        state: 'Jammu & Kashmir',
        district: 'Leh',
        processingStatus: 'Raw Greasy',
        imageUrl: woolImg3,
        description: 'High-altitude Himalayan Nali wool from Changthang plateau with exceptional loft and thermal warmth.',
        status: 'active',
        views: 265,
      },
      {
        batch: batches[1]._id,
        batchId: 'WV-RJ-2026-000118',
        seller: farmerRamesh._id,
        sellerName: 'Ramesh Choudhary',
        woolType: 'Chokla',
        grade: 'Grade A',
        initialQuantityKg: 120,
        availableQuantityKg: 120,
        pricePerKg: 310,
        state: 'Rajasthan',
        district: 'Bikaner',
        processingStatus: 'Raw Greasy',
        imageUrl: woolImg1,
        description: 'True Indian Merino quality Chokla wool. Uniform crimp and high spinning count.',
        status: 'active',
        views: 140,
      }
    ]);

    // 7. Create Orders
    await Order.create([
      {
        orderId: 'ORD-2026-000101',
        listing: listings[1]._id,
        batch: batches[4]._id,
        batchId: 'WV-GJ-2026-000088',
        buyer: buyerAnita._id,
        buyerName: 'Anita Deshmukh',
        buyerEmail: 'anita.buyer@example.com',
        seller: farmerGovind._id,
        sellerName: 'Govind Rabari',
        woolType: 'Patanwadi',
        quantityKg: 60,
        pricePerKg: 275,
        totalAmount: 60 * 275,
        deliveryAddress: {
          street: 'Plot 12, Solapur Textile Park',
          district: 'Solapur',
          state: 'Maharashtra',
          pinCode: '413006',
          contactPhone: '+91 98220 11224',
        },
        notes: 'Please pack in moisture-resistant gunny bales.',
        status: 'dispatched',
        statusHistory: [
          { status: 'placed', timestamp: new Date('2026-08-10T10:00:00.000Z'), note: 'Order placed by Anita Deshmukh' },
          { status: 'confirmed', timestamp: new Date('2026-08-11T09:00:00.000Z'), note: 'Confirmed by Govind Rabari' },
          { status: 'dispatched', timestamp: new Date('2026-08-14T14:30:00.000Z'), note: 'Dispatched via Rajasthan Fast Logistics' },
        ]
      }
    ]);

    // 8. Create Processing Requests
    await ProcessingRequest.create([
      {
        requestId: 'PR-2026-00054',
        batch: batches[3]._id,
        batchId: 'WV-RJ-2026-000140',
        farmer: farmerRamesh._id,
        farmerName: 'Ramesh Choudhary',
        processor: processorKaran._id,
        processorName: 'Karan Patel (Karan Textiles)',
        serviceType: 'Scouring & Carding',
        quantityKg: 310,
        preferredDate: new Date('2026-08-05'),
        completionDate: new Date('2026-08-10'),
        notes: 'Full scouring to remove sand and grease, followed by smooth carding.',
        status: 'completed',
        estimatedCost: 310 * 18,
      },
      {
        requestId: 'PR-2026-00059',
        batch: batches[2]._id,
        batchId: 'WV-RJ-2026-000131',
        farmer: farmerRamesh._id,
        farmerName: 'Ramesh Choudhary',
        processor: processorKaran._id,
        processorName: 'Karan Patel (Karan Textiles)',
        serviceType: 'Sorting & Grading',
        quantityKg: 250,
        preferredDate: new Date('2026-08-22'),
        notes: 'Sort according to micron thickness and staple uniformity.',
        status: 'requested',
        estimatedCost: 250 * 12,
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
        const drift = (Math.random() - 0.46) * 3.5;
        current = Math.max(120, Math.round((current + drift) * 10) / 10);
        history.push({ date: dayString, price: Math.round(current) });
      }
      return history;
    }

    await MarketPrice.create([
      {
        state: 'Rajasthan',
        woolType: 'Merino',
        pricePerKg: 345,
        changePercent: 3.2,
        history: generateHistory(332, 30),
      },
      {
        state: 'Rajasthan',
        woolType: 'Marwari',
        pricePerKg: 320,
        changePercent: 2.1,
        history: generateHistory(310, 30),
      },
      {
        state: 'Rajasthan',
        woolType: 'Chokla',
        pricePerKg: 310,
        changePercent: 1.8,
        history: generateHistory(302, 30),
      },
      {
        state: 'Gujarat',
        woolType: 'Patanwadi',
        pricePerKg: 275,
        changePercent: -0.6,
        history: generateHistory(278, 30),
      },
      {
        state: 'Maharashtra',
        woolType: 'Deccani',
        pricePerKg: 248,
        changePercent: 1.2,
        history: generateHistory(242, 30),
      },
      {
        state: 'Jammu & Kashmir',
        woolType: 'Nali',
        pricePerKg: 340,
        changePercent: 4.5,
        history: generateHistory(322, 30),
      },
      {
        state: 'Himachal Pradesh',
        woolType: 'Merino',
        pricePerKg: 360,
        changePercent: 2.8,
        history: generateHistory(348, 30),
      },
      {
        state: 'Uttarakhand',
        woolType: 'Chokla',
        pricePerKg: 295,
        changePercent: 0.9,
        history: generateHistory(290, 30),
      },
      {
        state: 'Karnataka',
        woolType: 'Deccani',
        pricePerKg: 240,
        changePercent: -0.4,
        history: generateHistory(242, 30),
      },
      {
        state: 'Telangana',
        woolType: 'Deccani',
        pricePerKg: 242,
        changePercent: 0.8,
        history: generateHistory(238, 30),
      }
    ]);

    // 10. Create Producers Directory
    await Producer.create([
      {
        name: 'Ramesh Choudhary',
        user: farmerRamesh._id,
        role: 'farmer',
        state: 'Rajasthan',
        district: 'Bikaner',
        address: 'Kolayat Tehsil, Bikaner',
        woolTypes: ['Marwari', 'Chokla', 'Magra'],
        annualProductionKg: 1450,
        flockSize: 240,
        breeds: ['Marwari', 'Chokla'],
        specialty: 'High-crimp fine apparel fleece & certified carpet clip',
        isVerified: true,
        contactEmail: 'ramesh.farmer@example.com',
        contactPhone: '+91 98290 11223',
        rating: 4.9,
      },
      {
        name: 'Govind Rabari Pastoralist Farm',
        user: farmerGovind._id,
        role: 'farmer',
        state: 'Gujarat',
        district: 'Kutch',
        address: 'Nakhatrana Grazing Pastures, Bhuj',
        woolTypes: ['Patanwadi', 'Kachchhi'],
        annualProductionKg: 2200,
        flockSize: 320,
        breeds: ['Patanwadi'],
        specialty: 'Soft, naturally white desert fleece with superior spinning handle',
        isVerified: true,
        contactEmail: 'govind.farmer@example.com',
        contactPhone: '+91 98250 11990',
        rating: 4.8,
      },
      {
        name: 'Changthang High-Altitude Herders Cooperative',
        user: farmerTsering._id,
        role: 'farmer',
        state: 'Jammu & Kashmir',
        district: 'Leh',
        address: 'Nyoma Sector, Changthang Plateau',
        woolTypes: ['Nali', 'Changthangi Pashmina'],
        annualProductionKg: 890,
        flockSize: 180,
        breeds: ['Nali', 'Changthangi'],
        specialty: 'Superfine sub-zero thermal fleece & luxury insulation wool',
        isVerified: true,
        contactEmail: 'tsering.farmer@example.com',
        contactPhone: '+91 98190 11881',
        rating: 5.0,
      },
      {
        name: 'Solapur Wool Growers Cooperative Society',
        role: 'farmer',
        state: 'Maharashtra',
        district: 'Solapur',
        address: 'Pandharpur Road, Solapur',
        woolTypes: ['Deccani'],
        annualProductionKg: 3500,
        flockSize: 520,
        breeds: ['Deccani'],
        specialty: 'Rugged coarse wool ideal for industrial felting and traditional rugs',
        isVerified: true,
        contactEmail: 'solapur.wool@example.com',
        contactPhone: '+91 98220 33221',
        rating: 4.7,
      },
      {
        name: 'Meera Himalayan Handlooms & Artisans',
        user: artisanMeera._id,
        role: 'artisan',
        state: 'Himachal Pradesh',
        district: 'Kullu',
        address: 'Naggar Road, Kullu Valley',
        woolTypes: ['Merino', 'Gaddi'],
        annualProductionKg: 620,
        flockSize: 90,
        breeds: ['Gaddi', 'Crossbred Merino'],
        specialty: 'Hand-spun naturally dyed Kullu shawls and organic wool blankets',
        isVerified: true,
        contactEmail: 'meera.artisan@example.com',
        contactPhone: '+91 98000 11226',
        rating: 4.95,
      }
    ]);

    // 11. Create Training Resources across 10 Categories
    await TrainingResource.create([
      {
        title: 'Sheep Care & Disease Prevention Guidelines',
        category: 'Sheep Management',
        level: 'Beginner',
        duration: '12 min read',
        summary: 'Essential guidelines for vaccine scheduling, nutritional feeds, and shelter sanitation to prevent flock outbreaks.',
        content: `### 1. Vaccination and Healthcare
Maintain a strict vaccination log for enterotoxemia, sheep pox, and PPR. Deworm the flock pre-monsoon and post-monsoon.

### 2. Nutrition
Supplement grazing with protein-rich mineral blocks and legumes to ensure high quality staple growth and prevent fleece shedding.`,
        keyTakeaways: [
          'Vaccinate pre-monsoon for sheep pox and PPR to prevent major losses',
          'Deworm twice a year to ensure good nutritional absorption',
          'Provide mineral blocks to encourage thick, strong wool staples'
        ],
        tags: ['Sheep Health', 'Disease Prevention', 'Nutrition'],
        views: 185,
        youtubeUrl: 'https://www.youtube.com/watch?v=JYASAHeFRKg',
      },
      {
        title: 'Modern Shearing Practices & Sheep Welfare',
        category: 'Wool Shearing',
        level: 'Beginner',
        duration: '10 min read',
        summary: 'Step-by-step guidance on humane shearing techniques, reducing second cuts, and avoiding fleece damage.',
        content: `### 1. Pre-Shearing Preparation
Ensure sheep are kept off wet pastures 12 hours prior to shearing. Wet wool creates mildew hazards during baling and reduces market value.

### 2. Blade Angle and Stroke Technique
Maintain continuous flat contact between clipper and skin. Avoid multiple short strokes ("second cuts") which create short fibers that are discarded during combing.

### 3. Fleece Throwing and Table Skirting
Immediately skirt the belly wool, leg pieces, and heavily soiled tags away from the main blanket fleece. Separate skirting improves the main batch grade from Grade C to Grade A.`,
        keyTakeaways: [
          'Never shear wet sheep to prevent mold and bacterial staining',
          'Avoid second cuts to maximize staple length and market price',
          'Separate stained tags and belly wool immediately upon shearing'
        ],
        tags: ['Shearing', 'Staple Length', 'Wool Quality'],
        views: 240,
        youtubeUrl: 'https://www.youtube.com/watch?v=N7CpW1mBodc',
      },
      {
        title: 'Central Wool Board Grading Standards & Micron Metrics',
        category: 'Wool Grading',
        level: 'Intermediate',
        duration: '14 min read',
        summary: 'Understanding Grade A, B, and C parameters, micron measurements, and moisture limits for maximum pricing.',
        content: `### Official Indian Wool Grading Parameters
* **Grade A (Fine Apparel / Carpet)**: Staple length > 65mm, Micron < 25µm, Vegetable Matter < 2%, Moisture < 14%.
* **Grade B (Medium)**: Staple length 45-65mm, Micron 25-32µm, Vegetable Matter 2-5%.
* **Grade C (Coarse / Heavy Tags)**: Short staple < 45mm, High vegetable matter (> 5%).

### Quality Optimization
Clean skirting before weighing increases batch valuation by up to 25-30% on the WoolConnect marketplace.`,
        keyTakeaways: [
          'Micron count determines whether fleece enters apparel or industrial supply chains',
          'Low vegetable matter is the primary factor determining Grade A qualification',
          'Digital batch certification locks in buyer trust'
        ],
        tags: ['Grading', 'Micron', 'Standards', 'Pricing'],
        views: 315,
        youtubeUrl: 'https://www.youtube.com/watch?v=Ksc8wY_VFJk',
      },
      {
        title: 'Monsoon Wool Storage & Moisture Prevention Protocol',
        category: 'Wool Storage',
        level: 'Beginner',
        duration: '8 min read',
        summary: 'Critical protocols to protect wool inventory against humidity, yellowing, and moth infestation during monsoon.',
        content: `### 1. Elevated Pallet Stacking
Never store wool bags directly on concrete or earthen floors. Maintain at least 15 cm clearance on wooden or plastic pallets.

### 2. Humidity Control
Keep relative humidity below 65%. If storing in farm sheds, ensure cross-ventilation during dry days and seal during high-humidity storms.

### 3. Periodic Bag Turning
Turn stacked wool sacks fortnightly to prevent core temperature build-up and sweating.`,
        keyTakeaways: [
          'Keep wool bags at least 15 cm above ground on pallets',
          'Monitor warehouse humidity to stay below 65% RH',
          'Turn bales periodically to dissipate trapped heat'
        ],
        tags: ['Storage', 'Monsoon', 'Warehousing'],
        views: 198,
        youtubeUrl: 'https://www.youtube.com/watch?v=ZrcRCIPuoKY',
      },
      {
        title: 'Wool Scouring, Carding, & Processing Basics',
        category: 'Wool Processing',
        level: 'Beginner',
        duration: '12 min read',
        summary: 'Understanding the step-by-step process of scouring, carding, and spinning raw wool into premium yarn.',
        content: `### 1. Scouring
Raw fleece contains lanolin, dirt, and sweat salts. Scouring washes the fleece in warm soapy water to clean it.

### 2. Carding and Combing
Carding aligns the tangled wool fibers into straight rows, creating a soft web of wool ready to spin.`,
        keyTakeaways: [
          'Scouring removes grease and debris',
          'Carding separates and aligns fibers for spinning',
          'Adding values through processing yields over 60% higher pricing'
        ],
        tags: ['Processing', 'Carding', 'Scouring'],
        views: 210,
        youtubeUrl: 'https://www.youtube.com/watch?v=MXM31v49Xtw',
      },
      {
        title: 'Natural Dyeing with Himalayan Botanicals & Mineral Mordants',
        category: 'Dyeing',
        level: 'Intermediate',
        duration: '12 min read',
        summary: 'Techniques for sustainable plant dyeing using walnut hull, madder root, pomegranate rind, and alum mordants.',
        content: `### Scouring Before Dyeing
Wool must be thoroughly scoured to remove natural oils before dye uptake. Use neutral pH soap at 50°C.

### Mordanting with Alum
Premordant with 10% weight of fibre potassium alum to lock natural pigments and achieve lightfastness ratings of 4+.`,
        keyTakeaways: [
          'Scour greasy fleece before dyeing for uniform color penetration',
          'Use non-toxic potassium alum for lightfast hues',
          'Natural dyed yarn commands a 40% price premium'
        ],
        tags: ['Dyeing', 'Artisan', 'Natural Colors'],
        views: 180,
        youtubeUrl: 'https://www.youtube.com/watch?v=GKuRnyD5q6k',
      },
      {
        title: 'Maximizing Direct-to-Buyer Revenue on Digital Marketplaces',
        category: 'Digital Selling',
        level: 'Beginner',
        duration: '9 min read',
        summary: 'How sheep farmers eliminate middleman commissions by utilizing WoolConnect QR traceability and transparent testing.',
        content: `### Traceability Builds Buyer Confidence
Buyers pay premium prices when they can verify the exact district, shearing date, and lab grade via QR code. 

### Accurate Listing Details
Always state exact quantity, provide high-resolution natural light photos, and link to certified quality tests.`,
        keyTakeaways: [
          'Direct listings yield 20-35% higher net returns than local middlemen',
          'Verified QR badges attract industrial textile mills and artisan guilds',
          'Clear descriptions and photos accelerate order closures'
        ],
        tags: ['Marketplace', 'Direct Selling', 'Farmer Profit'],
        views: 420,
        youtubeUrl: 'https://youtu.be/aQs3p0zV6gE',
      }
    ]);

    // 12. Create Initial Notifications
    await Notification.create([
      {
        recipient: farmerRamesh._id,
        title: 'Batch WV-RJ-2026-000124 Quality Graded',
        message: 'Quality assessment completed: Grade A assigned with 92% confidence.',
        type: 'quality',
        relatedId: 'WV-RJ-2026-000124',
        link: '/batches/WV-RJ-2026-000124/details',
        isRead: false,
      },
      {
        recipient: farmerRamesh._id,
        title: 'Processing Job Completed',
        message: 'Karan Textiles has completed scouring & carding for batch WV-RJ-2026-000140.',
        type: 'processing',
        relatedId: 'WV-RJ-2026-000140',
        link: '/batches/WV-RJ-2026-000140/traceability',
        isRead: false,
      },
      {
        recipient: farmerGovind._id,
        title: 'New Commercial Order Received',
        message: 'Anita Deshmukh placed an order for 60 kg Patanwadi wool (₹16,500 total).',
        type: 'order',
        relatedId: 'ORD-2026-000101',
        link: '/farmer/orders',
        isRead: false,
      },
      {
        recipient: buyerAnita._id,
        title: 'Order Dispatched',
        message: 'Your order ORD-2026-000101 has been dispatched by Govind Rabari.',
        type: 'order',
        relatedId: 'ORD-2026-000101',
        link: '/buyer/orders',
        isRead: false,
      }
    ]);

    console.log('✅ Seed completed successfully! All Indian wool ecosystem entities initialized.');
  } catch (error) {
    console.error('❌ Database seed error:', error);
  }
}

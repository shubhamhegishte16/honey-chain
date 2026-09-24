import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, MapPin, Search, ChevronDown, BookOpen, ArrowRight, X } from 'lucide-react';
import Card from '../../components/ui/Card';
import { useLanguage } from '../../context/LanguageContext';

// ─── Static state → region map ─────────────────────────────────────────────
export const STATE_REGIONS = {
  'Rajasthan':        ['Bikaner', 'Jaisalmer', 'Jodhpur', 'Nagaur', 'Pali'],
  'Gujarat':          ['Kutch', 'Banaskantha', 'Patan', 'Surendranagar'],
  'Maharashtra':      ['Ahmednagar', 'Sangli', 'Satara'],
  'Jammu & Kashmir':  ['Leh', 'Kargil', 'Srinagar', 'Anantnag'],
  'Himachal Pradesh': ['Kinnaur', 'Lahaul & Spiti', 'Kullu', 'Shimla'],
  'Uttarakhand':      ['Chamoli', 'Pithoragarh', 'Uttarkashi'],
  'Karnataka':        ['Bellary', 'Bijapur', 'Gadag'],
  'Telangana':        ['Mahbubnagar', 'Nalgonda', 'Warangal'],
};

// ─── Demo producer/artisan dataset ─────────────────────────────────────────
// NOTE: These are fictional sample profiles for the HoneyChain prototype.
const PRODUCERS = [
  // Rajasthan
  { id: 'p-001', name: 'Demo Honey Beekeeper – Bharatpur', type: 'Beekeeper', state: 'Rajasthan', region: 'Bikaner',
    specialization: 'Honey Purity & Extraction', skills: ['Honey Grading', 'Centrifugal Extraction', 'Moisture Testing'],
    description: 'Demo profile for the HoneyChain prototype. Focuses on pure Mustard Blossom honey extraction and low-moisture storage.',
    trainingCategories: ['honey-quality', 'storage'] },
  { id: 'p-002', name: 'Demo Honey Cooperative – Jaisalmer', type: 'Artisan', state: 'Rajasthan', region: 'Jaisalmer',
    specialization: 'Desert Blossom & Wax Crafts', skills: ['Processing', 'Wax Crafts', 'Packaging'],
    description: 'Demo cooperative profile. Harvests desert flora honey and crafts organic beeswax candles.',
    trainingCategories: ['processing', 'selling'] },
  { id: 'p-003', name: 'Demo Honey Beekeeper – Jodhpur', type: 'Beekeeper', state: 'Rajasthan', region: 'Jodhpur',
    specialization: 'Apiary Care & Box Management', skills: ['Bee Care', 'Honey Harvesting', 'Honey Grading'],
    description: 'Demo profile focusing on scientific hive inspection and seasonal bee colony migration.',
    trainingCategories: ['bee-care', 'harvesting'] },
  { id: 'p-004', name: 'Demo Honey Beekeeper – Nagaur', type: 'Beekeeper', state: 'Rajasthan', region: 'Nagaur',
    specialization: 'Digital Marketplace & Traceability', skills: ['Digital Selling', 'QR Traceability', 'Pricing'],
    description: 'Demo profile. Sells raw unprocessed honey directly to Ayurvedic processors via HoneyChain QR codes.',
    trainingCategories: ['selling', 'honey-quality'] },
  { id: 'p-005', name: 'Demo Honey Artisan – Pali', type: 'Artisan', state: 'Rajasthan', region: 'Pali',
    specialization: 'Herbal Infused Honey & Value Addition', skills: ['Honey Processing', 'Infusions', 'Packaging'],
    description: 'Demo artisan profile. Specialises in ginger, tulsi, and cinnamon infused forest honey.',
    trainingCategories: ['processing', 'honey-quality'] },

  // Gujarat
  { id: 'p-006', name: 'Demo Honey Beekeeper – Kutch', type: 'Beekeeper', state: 'Gujarat', region: 'Kutch',
    specialization: 'Wild Mangrove Honey Harvesting', skills: ['Hive Care', 'Raw Filtration', 'Storage'],
    description: 'Demo profile. Harvests coastal mangrove honey and practices sustainable apiary management.',
    trainingCategories: ['harvesting', 'storage'] },
  { id: 'p-007', name: 'Demo Honey Artisan – Banaskantha', type: 'Artisan', state: 'Gujarat', region: 'Banaskantha',
    specialization: 'Beeswax Cosmetics & Pollen Products', skills: ['Processing', 'Wax Crafts', 'Product Design'],
    description: 'Demo artisan SHG creating natural beeswax balms and collected bee pollen dietary supplements.',
    trainingCategories: ['processing', 'selling'] },
  { id: 'p-008', name: 'Demo Honey Beekeeper – Patan', type: 'Beekeeper', state: 'Gujarat', region: 'Patan',
    specialization: 'Honey Grading & Cold Filtration', skills: ['Honey Grading', 'Storage', 'Filtration'],
    description: 'Demo profile. Maintains Grade-A Agmark certified honey with strict HMF and moisture controls.',
    trainingCategories: ['honey-quality', 'storage'] },
  { id: 'p-009', name: 'Demo Honey Artisan – Surendranagar', type: 'Artisan', state: 'Gujarat', region: 'Surendranagar',
    specialization: 'Custom Honey Bottling & Direct Retail', skills: ['Bottling', 'Digital Selling', 'Processing'],
    description: 'Demo artisan bottling raw single-origin honey and marketing directly to health consumers online.',
    trainingCategories: ['processing', 'selling'] },

  // Maharashtra
  { id: 'p-010', name: 'Demo Honey Beekeeper – Ahmednagar', type: 'Beekeeper', state: 'Maharashtra', region: 'Ahmednagar',
    specialization: 'Sunflower & Jamun Honey Apiaries', skills: ['Bee Care', 'Honey Harvesting', 'Honey Grading'],
    description: 'Demo profile. Migrates Apis mellifera bee boxes across sunflower and jamun orchards.',
    trainingCategories: ['bee-care', 'harvesting'] },
  { id: 'p-011', name: 'Demo Honey Artisan – Sangli', type: 'Artisan', state: 'Maharashtra', region: 'Sangli',
    specialization: 'Raw Honey Processing & Lab Testing', skills: ['Processing', 'Filtration', 'Digital Selling'],
    description: 'Demo cooperative profile. Operates hygienic honey settling tanks and moisture reduction units.',
    trainingCategories: ['processing', 'selling'] },
  { id: 'p-012', name: 'Demo Honey Beekeeper – Satara', type: 'Beekeeper', state: 'Maharashtra', region: 'Satara',
    specialization: 'Mahabaleshwar Forest Honey & Storage', skills: ['Storage', 'Honey Grading', 'Purity Testing'],
    description: 'Demo profile. Harvests GI-tagged Mahabaleshwar flora honey with digital batch passports.',
    trainingCategories: ['storage', 'honey-quality'] },

  // Jammu & Kashmir
  { id: 'p-013', name: 'Demo Honey Beekeeper – Leh', type: 'Beekeeper', state: 'Jammu & Kashmir', region: 'Leh',
    specialization: 'High Altitude Flora Honey', skills: ['Hive Care', 'Honey Grading', 'Cold Extraction'],
    description: 'Demo profile. Manages cold-hardy bee colonies for rare Himalayan high-altitude blossom honey.',
    trainingCategories: ['honey-quality', 'harvesting'] },
  { id: 'p-014', name: 'Demo Honey Artisan – Kargil', type: 'Artisan', state: 'Jammu & Kashmir', region: 'Kargil',
    specialization: 'Wild Mountain Honey Crafts', skills: ['Processing', 'Wax Crafts', 'Product Design'],
    description: 'Demo artisan cooperative crafting pure mountain wildflower honey glass jar collections.',
    trainingCategories: ['processing', 'selling'] },
  { id: 'p-015', name: 'Demo Honey Beekeeper – Srinagar', type: 'Beekeeper', state: 'Jammu & Kashmir', region: 'Srinagar',
    specialization: 'Kashmir White Honey & Sidr', skills: ['Bee Care', 'Digital Selling', 'Honey Grading'],
    description: 'Demo profile. Harvests prized Kashmir White Honey with blockchain-verified NMR purity certificates.',
    trainingCategories: ['bee-care', 'selling'] },
  { id: 'p-016', name: 'Demo Honey Artisan – Anantnag', type: 'Artisan', state: 'Jammu & Kashmir', region: 'Anantnag',
    specialization: 'Acacia Blossom Honey Bottling', skills: ['Processing', 'Bottling', 'Filtration'],
    description: 'Demo artisan team packing premium clear Acacia blossom honey with tamper-evident NFC tags.',
    trainingCategories: ['processing', 'honey-quality'] },

  // Himachal Pradesh
  { id: 'p-017', name: 'Demo Honey Beekeeper – Kinnaur', type: 'Beekeeper', state: 'Himachal Pradesh', region: 'Kinnaur',
    specialization: 'Apple Orchard Pollination & Honey', skills: ['Bee Care', 'Pollination Services', 'Storage'],
    description: 'Demo profile. Provides managed pollination services to apple orchards and harvests pure blossom honey.',
    trainingCategories: ['bee-care', 'harvesting'] },
  { id: 'p-018', name: 'Demo Honey Artisan – Lahaul & Spiti', type: 'Artisan', state: 'Himachal Pradesh', region: 'Lahaul & Spiti',
    specialization: 'Alpine Honey Gift Packaging', skills: ['Processing', 'Packaging', 'Product Design'],
    description: 'Demo artisan producing artisanal glass-packaged alpine honey gifts.',
    trainingCategories: ['processing', 'selling'] },
  { id: 'p-019', name: 'Demo Honey Artisan – Kullu', type: 'Artisan', state: 'Himachal Pradesh', region: 'Kullu',
    specialization: 'Forest Wild Honey & Propolis Tinctures', skills: ['Propolis Extraction', 'Processing', 'Selling'],
    description: 'Demo artisan profile. Formulates immunity propolis tinctures and wild forest raw honey jars.',
    trainingCategories: ['processing', 'selling'] },
  { id: 'p-020', name: 'Demo Honey Beekeeper – Shimla', type: 'Beekeeper', state: 'Himachal Pradesh', region: 'Shimla',
    specialization: 'Honey Quality & Purity Testing', skills: ['Honey Grading', 'Extraction', 'Storage'],
    description: 'Demo profile. Sources and grades raw Himalayan forest honey near Shimla districts.',
    trainingCategories: ['honey-quality', 'storage'] },

  // Uttarakhand
  { id: 'p-021', name: 'Demo Honey Beekeeper – Chamoli', type: 'Beekeeper', state: 'Uttarakhand', region: 'Chamoli',
    specialization: 'Apis Cerana Native Bee Care', skills: ['Bee Care', 'Honey Harvesting', 'Hive Maintenance'],
    description: 'Demo profile. Conserves indigenous Apis cerana indica wall hives in Himalayan villages.',
    trainingCategories: ['bee-care', 'harvesting'] },
  { id: 'p-022', name: 'Demo Honey Artisan – Pithoragarh', type: 'Artisan', state: 'Uttarakhand', region: 'Pithoragarh',
    specialization: 'Raw Unheated Honey & Honeycomb Cut', skills: ['Comb Cut', 'Processing', 'Product Design'],
    description: 'Demo artisan packaging raw honeycomb cut sections directly inside food-grade clear boxes.',
    trainingCategories: ['processing', 'selling'] },
  { id: 'p-023', name: 'Demo Honey Beekeeper – Uttarkashi', type: 'Beekeeper', state: 'Uttarakhand', region: 'Uttarkashi',
    specialization: 'Cold Storage & Bulk Honey Supply', skills: ['Storage', 'Digital Selling', 'Honey Grading'],
    description: 'Demo profile. Supplies bulk food-grade stainless drums of verified organic forest honey.',
    trainingCategories: ['storage', 'selling'] },

  // Karnataka
  { id: 'p-024', name: 'Demo Honey Beekeeper – Bellary', type: 'Beekeeper', state: 'Karnataka', region: 'Bellary',
    specialization: 'Stingless Dammer Bee Honey', skills: ['Bee Care', 'Stingless Bee Extraction', 'Purity Testing'],
    description: 'Demo profile. Cultivates medicinal stingless bee honey (Tetragonula iridipennis) in Coorg and Western Ghats.',
    trainingCategories: ['bee-care', 'harvesting'] },
  { id: 'p-025', name: 'Demo Honey Artisan – Bijapur', type: 'Artisan', state: 'Karnataka', region: 'Bijapur',
    specialization: 'Ayurvedic Honey & Royal Jelly', skills: ['Processing', 'Product Design', 'Selling'],
    description: 'Demo cooperative producing royal jelly supplements and medicated honey formulations.',
    trainingCategories: ['processing', 'selling'] },
  { id: 'p-026', name: 'Demo Honey Beekeeper – Gadag', type: 'Beekeeper', state: 'Karnataka', region: 'Gadag',
    specialization: 'Honey Moisture Control & Storage', skills: ['Honey Grading', 'Storage', 'Filtration'],
    description: 'Demo profile. Utilizes low-temperature vacuum moisture reducers to protect enzyme diastase levels.',
    trainingCategories: ['honey-quality', 'storage'] },

  // Telangana
  { id: 'p-027', name: 'Demo Honey Beekeeper – Mahbubnagar', type: 'Beekeeper', state: 'Telangana', region: 'Mahbubnagar',
    specialization: 'Commercial Apiary & Direct Selling', skills: ['Bee Care', 'Digital Selling', 'Honey Grading'],
    description: 'Demo profile. Manages 200+ migratory bee boxes supplying fresh eucalyptus and neem blossom honey.',
    trainingCategories: ['bee-care', 'selling'] },
  { id: 'p-028', name: 'Demo Honey Artisan – Nalgonda', type: 'Artisan', state: 'Telangana', region: 'Nalgonda',
    specialization: 'Cooperative Honey Bottling & Branding', skills: ['Processing', 'Bottling', 'Product Design'],
    description: 'Demo SHG cooperative running hygienic honey bottling lines for local farmer producer organizations.',
    trainingCategories: ['processing', 'honey-quality'] },
  { id: 'p-029', name: 'Demo Honey Beekeeper – Warangal', type: 'Beekeeper', state: 'Telangana', region: 'Warangal',
    specialization: 'Storage & Stainless Steel Handling', skills: ['Storage', 'Honey Processing', 'Centrifugal Extraction'],
    description: 'Demo profile. Operates community food-grade SS304 extraction hubs for local beekeeper groups.',
    trainingCategories: ['storage', 'processing'] },
];

// ─── Translation Lookups for Demo Data ──────────────────────────────────────
const STATE_TRANSLATIONS = {
  hi: {
    'Rajasthan': 'राजस्थान',
    'Gujarat': 'गुजरात',
    'Maharashtra': 'महाराष्ट्र',
    'Jammu & Kashmir': 'जम्मू और कश्मीर',
    'Himachal Pradesh': 'हिमाचल प्रदेश',
    'Uttarakhand': 'उत्तराखंड',
    'Karnataka': 'कर्नाटक',
    'Telangana': 'तेलंगाना'
  },
  mr: {
    'Rajasthan': 'राजस्थान',
    'Gujarat': 'गुजरात',
    'Maharashtra': 'महाराष्ट्र',
    'Jammu & Kashmir': 'जम्मू आणि काश्मीर',
    'Himachal Pradesh': 'हिमाचल प्रदेश',
    'Uttarakhand': 'उत्तराखंड',
    'Karnataka': 'कर्नाटक',
    'Telangana': 'तेलंगणा'
  }
};

const REGION_TRANSLATIONS = {
  hi: {
    'Bikaner': 'बीकानेर',
    'Jaisalmer': 'जैसलमेर',
    'Jodhpur': 'जोधपुर',
    'Nagaur': 'नागौर',
    'Pali': 'पाली',
    'Kutch': 'कच्छ',
    'Banaskantha': 'बनासकांठा',
    'Patan': 'पाटन',
    'Surendranagar': 'सुरेंद्रनगर',
    'Ahmednagar': 'अहमदनगर',
    'Sangli': 'सांगली',
    'Satara': 'सतारा',
    'Leh': 'लेह',
    'Kargil': 'कारगिल',
    'Srinagar': 'श्रीनगर',
    'Anantnag': 'अनंतनाग',
    'Kinnaur': 'किन्नौर',
    'Lahaul & Spiti': 'लाहौल और स्पीति',
    'Kullu': 'कुल्लू',
    'Shimla': 'शिमला',
    'Chamoli': 'चमोली',
    'Pithoragarh': 'पिथौरागढ़',
    'Uttarkashi': 'उत्तरकाशी',
    'Bellary': 'बेल्लारी',
    'Bijapur': 'बीजापुर',
    'Gadag': 'गदग',
    'Mahbubnagar': 'महबूबनगर',
    'Nalgonda': 'नालगोंडा',
    'Warangal': 'वारंगल'
  },
  mr: {
    'Bikaner': 'बीकानेर',
    'Jaisalmer': 'जैसलमेर',
    'Jodhpur': 'जोधपुर',
    'Nagaur': 'नागौर',
    'Pali': 'पाली',
    'Kutch': 'कच्छ',
    'Banaskantha': 'बनासकांठा',
    'Patan': 'पाटण',
    'Surendranagar': 'सुरेंद्रनगर',
    'Ahmednagar': 'अहमदनगर',
    'Sangli': 'सांगली',
    'Satara': 'सातारा',
    'Leh': 'लेह',
    'Kargil': 'कारगिल',
    'Srinagar': 'श्रीनगर',
    'Anantnag': 'अनंतनाग',
    'Kinnaur': 'किन्नौर',
    'Lahaul & Spiti': 'लाहौल आणि स्पिती',
    'Kullu': 'कुल्लू',
    'Shimla': 'शिमला',
    'Chamoli': 'चमोली',
    'Pithoragarh': 'पिथोरागढ',
    'Uttarkashi': 'उत्तरकाशी',
    'Bellary': 'बेल्लारी',
    'Bijapur': 'विजापूर',
    'Gadag': 'गदग',
    'Mahbubnagar': 'महबूबनगर',
    'Nalgonda': 'नलगोंडा',
    'Warangal': 'वारंगल'
  }
};

const SKILL_TRANSLATIONS = {
  hi: {
    'Honey Grading': 'शहद ग्रेडिंग',
    'Centrifugal Extraction': 'मशीन निष्कर्षण',
    'Moisture Testing': 'नमी परीक्षण',
    'Bee Care': 'मधुमक्खी देखभाल',
    'Honey Harvesting': 'शहद संकलन',
    'Wax Crafts': 'मोम शिल्प',
    'Infusions': 'औषधी मिश्रण',
    'Raw Filtration': 'प्राकृतिक छनन',
    'Bottling': 'बोतलबंदी',
    'Propolis Extraction': 'प्रोपोलिस संकलन',
    'Comb Cut': 'मधुकोश कट',
    'Stingless Bee Extraction': 'डंकहीन मधुमक्खी निष्कर्षण',
    'Storage': 'भंडारण',
    'Dyeing': 'रंगाई',
    'Processing': 'प्रसंस्करण',
    'Product Design': 'उत्पाद डिज़ाइन',
    'Sheep Care': 'मधुमक्खी देखभाल',
    'Shearing': 'शहद निष्कर्षण',
    'Digital Selling': 'डिजिटल बिक्री',
    'QR Traceability': 'क्यूआर ट्रेसिबिलिटी',
    'Pricing': 'मूल्य निर्धारण',
    'Wool Processing': 'शहद प्रसंस्करण',
    'Carding': 'छनन',
    'Weaving': 'पैकेजिंग'
  },
  mr: {
    'Honey Grading': 'मध प्रतवारी',
    'Centrifugal Extraction': 'यंत्र निष्कर्षण',
    'Moisture Testing': 'आर्द्रता चाचणी',
    'Bee Care': 'मधमाशी काळजी',
    'Honey Harvesting': 'मध संकलन',
    'Wax Crafts': 'मेण हस्तकला',
    'Infusions': 'औषधी मिश्रण',
    'Raw Filtration': 'गाळणी',
    'Bottling': 'बाटलीबंद',
    'Propolis Extraction': 'प्रोपोलिस संकलन',
    'Comb Cut': 'पोळे कापणे',
    'Stingless Bee Extraction': 'डंख नसलेली मधमाशी मध',
    'Storage': 'साठवण',
    'Dyeing': 'रंगकाम',
    'Processing': 'प्रक्रिया',
    'Product Design': 'उत्पादन डिझाईन',
    'Sheep Care': 'मधमाशी काळजी',
    'Shearing': 'मध निष्कर्षण',
    'Digital Selling': 'डिजिटल विक्री',
    'QR Traceability': 'क्यूआर ट्रेसिबिलिटी',
    'Pricing': 'दर निश्चिती',
    'Wool Processing': 'मध प्रक्रिया',
    'Carding': 'गाळणी',
    'Weaving': 'पॅकेजिंग'
  }
};

const SPEC_TRANSLATIONS = {
  hi: {
    'Honey Purity & Extraction': 'शहद की शुद्धता और निष्कर्षण',
    'Desert Blossom & Wax Crafts': 'रेगिस्तानी फूल और मोम शिल्प',
    'Apiary Care & Box Management': 'मधुमक्खी पालन और बॉक्स प्रबंधन',
    'Digital Marketplace & Traceability': 'डिजिटल मार्केटप्लेस और ट्रेसिबिलिटी',
    'Herbal Infused Honey & Value Addition': 'हर्बल शहद और मूल्य संवर्धन',
    'Wild Mangrove Honey Harvesting': 'कच्छ मैंग्रोव शहद संकलन',
    'Beeswax Cosmetics & Pollen Products': 'मोम प्रसाधन और पराग उत्पाद',
    'Honey Grading & Cold Filtration': 'शहद ग्रेडिंग और कोल्ड फिल्ट्रेशन',
    'Custom Honey Bottling & Direct Retail': 'कस्टम बोतलबंदी और सीधी खुदरा बिक्री',
    'Sunflower & Jamun Honey Apiaries': 'सूरजमुखी और जामुन शहद वाटिका',
    'Raw Honey Processing & Lab Testing': 'कच्चा शहद प्रसंस्करण और प्रयोगशाला परीक्षण',
    'Mahabaleshwar Forest Honey & Storage': 'महाबलेश्वर वन शहद और भंडारण',
    'High Altitude Flora Honey': 'उच्च हिमालयी वनस्पति शहद',
    'Wild Mountain Honey Crafts': 'जंगली पहाड़ी शहद शिल्प',
    'Kashmir White Honey & Sidr': 'कश्मीर सफेद शहद और सिद्र',
    'Acacia Blossom Honey Bottling': 'बबूल फूल शहद बोतलबंदी',
    'Apple Orchard Pollination & Honey': 'सेब परागण सेवाएं और शहद',
    'Alpine Honey Gift Packaging': 'अल्पाइन शहद उपहार पैकेजिंग',
    'Forest Wild Honey & Propolis Tinctures': 'जंगली शहद और प्रोपोलिस अर्क',
    'Honey Quality & Purity Testing': 'शहद गुणवत्ता और शुद्धता परीक्षण',
    'Apis Cerana Native Bee Care': 'देशी भारतीय मधुमक्खी देखभाल',
    'Raw Unheated Honey & Honeycomb Cut': 'कच्चा गर्म न किया हुआ शहद और मधुकोश',
    'Cold Storage & Bulk Honey Supply': 'शीत भंडारण और थोक शहद आपूर्ति',
    'Stingless Dammer Bee Honey': 'डंकहीन डामर मधुमक्खी शहद',
    'Ayurvedic Honey & Royal Jelly': 'आयुर्वेदिक शहद और रॉयल जेली',
    'Honey Moisture Control & Storage': 'शहद नमी नियंत्रण और भंडारण',
    'Commercial Apiary & Direct Selling': 'व्यावसायिक मधुमक्खी पालन और सीधी बिक्री',
    'Cooperative Honey Bottling & Branding': 'सहकारी शहद बोतलबंदी और ब्रांडिंग',
    'Storage & Stainless Steel Handling': 'भंडारण और स्टेनलेस स्टील हैंडलिंग'
  },
  mr: {
    'Honey Purity & Extraction': 'मधाची शुद्धता आणि निष्कर्षण',
    'Desert Blossom & Wax Crafts': 'वाळवंटी फुले आणि मेण हस्तकला',
    'Apiary Care & Box Management': 'मधमाशी पेटी व्यवस्थापन',
    'Digital Marketplace & Traceability': 'डिजिटल मार्केटप्लेस आणि ट्रेसिबिलिटी',
    'Herbal Infused Honey & Value Addition': 'औषधी मध आणि मूल्यवर्धन',
    'Wild Mangrove Honey Harvesting': 'कांदळवन मध संकलन',
    'Beeswax Cosmetics & Pollen Products': 'मेण सौंदर्यप्रसाधने आणि पराग उत्पादने',
    'Honey Grading & Cold Filtration': 'मध प्रतवारी आणि कोल्ड फिल्टरेशन',
    'Custom Honey Bottling & Direct Retail': 'बाटलीबंद मध आणि थेट विक्री',
    'Sunflower & Jamun Honey Apiaries': 'सूर्यफूल आणि जांभूळ मध पेट्या',
    'Raw Honey Processing & Lab Testing': 'कच्चा मध प्रक्रिया आणि प्रयोगशाळा चाचणी',
    'Mahabaleshwar Forest Honey & Storage': 'महाबळेश्वर वन मध आणि साठवण',
    'High Altitude Flora Honey': 'हिमालयीन वनस्पती मध',
    'Wild Mountain Honey Crafts': 'रानटी डोंगरी मध उत्पादने',
    'Kashmir White Honey & Sidr': 'काश्मीर पांढरा मध आणि सिद्र',
    'Acacia Blossom Honey Bottling': 'बाभूळ मध बाटलीबंद',
    'Apple Orchard Pollination & Honey': 'सफरचंद परागीभवन सेवा आणि मध',
    'Alpine Honey Gift Packaging': 'अल्पाइन मध गिफ्ट पॅकेजिंग',
    'Forest Wild Honey & Propolis Tinctures': 'जंगली मध आणि प्रोपोलिस अर्क',
    'Honey Quality & Purity Testing': 'मध गुणवत्ता आणि शुद्धता चाचणी',
    'Apis Cerana Native Bee Care': 'स्थानिक भारतीय मधमाशी काळजी',
    'Raw Unheated Honey & Honeycomb Cut': 'कच्चा मध आणि पोळे तुकडे',
    'Cold Storage & Bulk Honey Supply': 'शीत साठवण आणि घाऊक मध पुरवठा',
    'Stingless Dammer Bee Honey': 'डंख नसलेली मधमाशी मध',
    'Ayurvedic Honey & Royal Jelly': 'आयुर्वेदिक मध आणि रॉयल जेली',
    'Honey Moisture Control & Storage': 'मध आर्द्रता नियंत्रण आणि साठवण',
    'Commercial Apiary & Direct Selling': 'व्यावसायिक मधमाशी पालन आणि थेट विक्री',
    'Cooperative Honey Bottling & Branding': 'सहकारी मध बाटलीबंद आणि ब्रँडिंग',
    'Storage & Stainless Steel Handling': 'साठवणूक आणि स्टेनलेस स्टील हाताळणी'
  }
};

const translateName = (name, lang) => {
  if (lang === 'en') return name;
  let translated = name;
  if (lang === 'hi') {
    translated = translated.replace('Demo Honey Beekeeper', 'डेमो मधुमक्खी पालक');
    translated = translated.replace('Demo Honey Cooperative', 'डेमो शहद सहकारी समिति');
    translated = translated.replace('Demo Honey Artisan', 'डेमो शहद कारीगर');
    translated = translated.replace('Demo Wool Producer', 'डेमो मधुमक्खी पालक');
    translated = translated.replace('Demo Wool Artisan', 'डेमो शहद कारीगर');
    translated = translated.replace('Demo Artisan', 'डेमो कारीगर');
    translated = translated.replace('Demo Wool Seller', 'डेमो शहद विक्रेता');
  } else if (lang === 'mr') {
    translated = translated.replace('Demo Honey Beekeeper', 'डेमो मधमाशी पालक');
    translated = translated.replace('Demo Honey Cooperative', 'डेमो मध सहकारी संस्था');
    translated = translated.replace('Demo Honey Artisan', 'डेमो मध कारागीर');
    translated = translated.replace('Demo Wool Producer', 'डेमो मधमाशी पालक');
    translated = translated.replace('Demo Wool Artisan', 'डेमो मध कारागीर');
    translated = translated.replace('Demo Artisan', 'डेमो कारागीर');
    translated = translated.replace('Demo Wool Seller', 'डेमो मध विक्रेता');
  }
  
  // Replace region dash character variations
  const regionsList = Object.values(STATE_REGIONS).flat();
  regionsList.forEach(r => {
    const translit = REGION_TRANSLATIONS[lang]?.[r] || r;
    translated = translated.replace(`– ${r}`, `– ${translit}`);
    translated = translated.replace(`— ${r}`, `— ${translit}`);
    translated = translated.replace(`- ${r}`, `- ${translit}`);
  });
  return translated;
};

const translateDescription = (desc, lang) => {
  if (lang === 'en') return desc;
  if (lang === 'hi') {
    if (desc.includes('Focuses on fine Chokla and Magra')) {
      return 'वूलकनेक्ट प्रोटोटाइप के लिए डेमो प्रोफाइल। बढ़िया चोकला और मगरा ऊन ग्रेडिंग और सुरक्षित मानसून भंडारण पर ध्यान केंद्रित करता है।';
    }
    if (desc.includes('desert botanical dyes')) {
      return 'डेमो कारीगर प्रोफाइल। पारंपरिक मरुस्थलीय जैविक रंगों का उपयोग करके हाथ से रंगे हुए ऊनी कालीनों का निर्माण करता है।';
    }
    if (desc.includes('humane shearing and pre-shearing')) {
      return 'डेमो प्रोफाइल। दयालु कतरन और कतरन से पहले भेड़ स्वास्थ्य प्रबंधन पर ध्यान केंद्रित करता है।';
    }
    if (desc.includes('Sells raw Nali wool directly')) {
      return 'डेमो प्रोफाइल। डिजिटल प्लेटफॉर्म के माध्यम से मिलों को सीधे कच्ची नाली ऊन बेचता है।';
    }
    if (desc.includes('hand-woven Pali wool blankets')) {
      return 'डेमो कारीगर प्रोफाइल। हाथ से बुने हुए पाली ऊनी कंबलों और स्कौरिंग तकनीकों में विशेषज्ञता रखता है।';
    }
    if (desc.includes('Raises Patanwadi sheep')) {
      return 'डेमो प्रोफाइल। कच्छ में पाटनवाड़ी भेड़ पालता है और स्वच्छ कतरन तकनीकों का अभ्यास करता है।';
    }
    if (desc.includes('embroidered woollen products')) {
      return 'पाटनवाड़ी ऊन का उपयोग करके कढ़ाईदार ऊनी उत्पाद बनाने वाला डेमो कारीगर।';
    }
    if (desc.includes('Maintains grade-A certified fleece')) {
      return 'डेमो प्रोफाइल। उचित नमी भंडारण नियमों के साथ ग्रेड-ए प्रमाणित ऊन का रखरखाव करता है।';
    }
    if (desc.includes('producing natural-dyed yarn')) {
      return 'डेमो कारीगर। प्राकृतिक रूप से रंगे धागे का उत्पादन और ऑनलाइन खरीदारों को सीधे विपणन करता है।';
    }
    if (desc.includes('Deccani sheep farmer')) {
      return 'डेमो प्रोफाइल। दक्कनी भेड़ किसान जो पशु चिकित्सा देखभाल और कुशल कतरन पर ध्यान केंद्रित करता है।';
    }
    if (desc.includes('Processes raw Deccani fleece')) {
      return 'डेमो कारीगर प्रोफाइल। ऑनलाइन बेचे जाने वाले हथकरघा वस्त्रों में कच्ची दक्कनी ऊन का प्रसंस्करण करता है।';
    }
    if (desc.includes('Satara')) {
      return 'डेमो प्रोफाइल। मानसून के बाद ऊन भंडारण और ग्रेड प्रमाणीकरण को प्राथमिकता देता है।';
    }
    if (desc.includes('Changthangi goats')) {
      return 'डेमो प्रोफाइल। पश्मीना के लिए चांगथांगी बकरियों का पालन करता है; चांगरा ऊन भी संभालता है।';
    }
    if (desc.includes('traditional Ladakhi')) {
      return 'डेमो कारीगर प्रोफाइल। स्थानीय ऊन का उपयोग करके पारंपरिक लद्दाख के ऊनी उत्पाद बनाता है।';
    }
    if (desc.includes('Kashmir wool directly')) {
      return 'डेमो प्रोफाइल। क्यूआर-आधारित पता लगाने की क्षमता का उपयोग करके सीधे खरीदारों को कश्मीर ऊन बेचता है।';
    }
    if (desc.includes('Kani shawls')) {
      return 'प्राकृतिक रूप से रंगे कश्मीरी ऊन से कनी शॉल बनाने वाला डेमो कारीगर।';
    }
    if (desc.includes('Rampur Bushair')) {
      return 'डेमो प्रोफाइल। मौसमी कतरन के साथ उच्च ऊंचाई पर रामपुर बुशहर भेड़ों का प्रबंधन करता है।';
    }
    if (desc.includes('traditional Lahauli')) {
      return 'पारंपरिक लाहौली ऊनी कपड़े बनाने वाला डेमो कारीगर।';
    }
    if (desc.includes('Hand-spins and naturally dyes')) {
      return 'डेमो कारीगर प्रोफाइल। जैविक हिमाचली ऊन से कुल्लू शॉल को हाथ से कातता है और प्राकृतिक रूप से रंगता है।';
    }
    if (desc.includes('Shimla')) {
      return 'डेमो प्रोफाइल। शिमला जिलों के पास अंगोरा और गद्दी ऊन का स्रोत और ग्रेडिंग करता है।';
    }
    if (desc.includes('Nanda Devi')) {
      return 'डेमो प्रोफाइल। मौसमी घास के मैदानों में चराई के साथ नंदा देवी क्षेत्र में झुंडों का प्रबंधन करता है।';
    }
    if (desc.includes('Kumaoni woollen shawls')) {
      return 'स्थानीय स्तर पर प्राप्त ऊन से कुमाऊंनी ऊनी शॉल और कालीन बनाने वाला डेमो कारीगर।';
    }
    if (desc.includes('alpine wool before')) {
      return 'डेमो प्रोफाइल। डिजिटल बाजार में सूचीबद्ध करने से पहले अल्पाइन ऊन का भंडारण और ग्रेडिंग करता है।';
    }
    if (desc.includes('Bellary and Deccani')) {
      return 'डेमो प्रोफाइल। बेल्लारी और दक्कनी संकर भेड़ों का पालन करता है; स्वच्छ कतरन पर ध्यान केंद्रित करता है।';
    }
    if (desc.includes('Kasuti-style embroidery')) {
      return 'प्रीमियम बाजारों के लिए ऊनी कपड़ों में कसूती शैली की कढ़ाई बुनने वाला डेमो कारीगर।';
    }
    if (desc.includes('Deccani wool batches')) {
      return 'डेमो प्रोफाइल। उचित नमी नियंत्रण के साथ ग्रेड-ए दक्कनी ऊन के जत्थों का रखरखाव करता है।';
    }
    if (desc.includes('Nellore sheep farmer')) {
      return 'डेमो प्रोफाइल। नेल्लोर भेड़ किसान जो डिजिटल ऊन बिक्री प्लेटफार्मों की खोज कर रहा है।';
    }
    if (desc.includes('Pochampally-inspired ikat')) {
      return 'प्राकृतिक रूप से रंगे ऊनी धागे का उपयोग करके पोचमपल्ली से प्रेरित इकत पैटर्न बुनने वाला डेमो कारीगर।';
    }
    if (desc.includes('Telangana wool in a small')) {
      return 'डेमो प्रोफाइल। एक छोटे पारिवारिक सहकारी समिति में तेलंगाना ऊन का भंडारण और प्रसंस्करण करता है।';
    }
  } else if (lang === 'mr') {
    if (desc.includes('Focuses on fine Chokla and Magra')) {
      return 'वूलकनेक्ट प्रोटोटाइपसाठी डेमो प्रोफाइल. उत्तम चोकला आणि मगरा लोकर प्रतवारी आणि सुरक्षित मान्सून साठवणुकीवर लक्ष केंद्रित करते.';
    }
    if (desc.includes('desert botanical dyes')) {
      return 'डेमो कारागीर प्रोफाइल. पारंपारिक वाळवंटी वनस्पती रंगांचा वापर करून हाताने रंगवलेले लोकरीचे चटई तयार करतो.';
    }
    if (desc.includes('humane shearing and pre-shearing')) {
      return 'डेमो प्रोफाइल. मानवी कातरणी आणि कातरणीपूर्वी मेंढीच्या आरोग्य व्यवस्थापनावर लक्ष केंद्रित करते.';
    }
    if (desc.includes('Sells raw Nali wool directly')) {
      return 'डेमो प्रोफाइल. डिजिटल प्लॅटफॉर्मद्वारे थेट गिरण्यांना कच्ची नाली लोकर विकतो.';
    }
    if (desc.includes('hand-woven Pali wool blankets')) {
      return 'डेमो कारागीर प्रोफाइल. हाताने विणलेल्या पाली लोकरीच्या घोंगड्या आणि प्रक्रिया तंत्रात विशेष प्राविण्य आहे.';
    }
    if (desc.includes('Raises Patanwadi sheep')) {
      return 'डेमो प्रोफाइल. कच्छमध्ये पाटणवाडी मेंढ्या पाळतात आणि स्वच्छ कातरणी तंत्राचा सराव करतात.';
    }
    if (desc.includes('embroidered woollen products')) {
      return 'पाटणवाडी लोकरीचा वापर करून भरतकाम केलेली लोकरी उत्पादने तयार करणारा डेमो कारागीर.';
    }
    if (desc.includes('Maintains grade-A certified fleece')) {
      return 'डेमो प्रोफाइल. योग्य आर्द्रता साठवण प्रोटोकॉलसह ग्रेड-ए प्रमाणित लोकर राखते.';
    }
    if (desc.includes('producing natural-dyed yarn')) {
      return 'डेमो कारागीर. नैसर्गिकरित्या रंगवलेले सूत तयार करतो आणि थेट ग्राहकांना ऑनलाइन विकतो.';
    }
    if (desc.includes('Deccani sheep farmer')) {
      return 'डेमो प्रोफाइल. दख्खनी मेंढी शेतकरी जो पशुवैद्यकीय काळजी आणि कार्यक्षम कातरणीवर लक्ष केंद्रित करतो.';
    }
    if (desc.includes('Processes raw Deccani fleece')) {
      return 'डेमो कारागीर प्रोफाइल. ऑनलाइन विकल्या जाणाऱ्या हातमाग कापडात कच्च्या दख्खनी लोकरीवर प्रक्रिया करतो.';
    }
    if (desc.includes('Satara')) {
      return 'डेमो प्रोफाइल. मान्सूननंतरच्या लोकर साठवणुकीला आणि ग्रेड प्रमाणपत्राला प्राधान्य देते.';
    }
    if (desc.includes('Changthangi goats')) {
      return 'डेमो प्रोफाइल. पश्मिनासाठी चांगथांगी शेळ्या पाळतात; चांगरा लोकर देखील हाताळतात.';
    }
    if (desc.includes('traditional Ladakhi')) {
      return 'डेमो कारागीर प्रोफाइल. स्थानिक लोकर वापरून पारंपारिक लडाखी लोकरीच्या वस्तू तयार करतो.';
    }
    if (desc.includes('Kashmir wool directly')) {
      return 'डेमो प्रोफाइल. क्यूआर-आधारित ट्रेसिबिलिटी वापरून थेट खरेदीदारांना काश्मीर लोकर विकतो.';
    }
    if (desc.includes('Kani shawls')) {
      return 'नैसर्गिकरित्या रंगवलेल्या काश्मिरी लोकरीपासून कानी शाल तयार करणारा डेमो कारागीर.';
    }
    if (desc.includes('Rampur Bushair')) {
      return 'डेमो प्रोफाइल. हंगामी कातरणीसह उंच भागातील रामपूर बुशायर मेंढ्यांचे व्यवस्थापन करतो.';
    }
    if (desc.includes('traditional Lahauli')) {
      return 'पारंपारिक लाहौली लोकरीचे कपडे तयार करणारा डेमो कारागीर.';
    }
    if (desc.includes('Hand-spins and naturally dyes')) {
      return 'डेमो कारागीर प्रोफाइल. सेंद्रिय हिमाचली लोकरीपासून कुल्लू शाल हाताने विणतो आणि नैसर्गिकरित्या रंगवतो.';
    }
    if (desc.includes('Shimla')) {
      return 'डेमो प्रोफाइल. शिमला जिल्ह्यांजवळ अंगोरा आणि गद्दी लोकरीचे संकलन आणि प्रतवारी करतो.';
    }
    if (desc.includes('Nanda Devi')) {
      return 'डेमो प्रोफाइल. नंदा देवी प्रदेशातील कळपांचे हंगामी चरण्याच्या व्यवस्थापनासह नियंत्रण करतो.';
    }
    if (desc.includes('Kumaoni woollen shawls')) {
      return 'स्थानिक पातळीवर मिळणाऱ्या लोकरीपासून कुमाउनी लोकरीच्या शाली आणि चटया तयार करणारा डेमो कारागीर.';
    }
    if (desc.includes('alpine wool before')) {
      return 'डेमो प्रोफाइल. डिजिटल बाजारात सूचीबद्ध करण्यापूर्वी अल्पाइन लोकरीची साठवणूक आणि प्रतवारी करतो.';
    }
    if (desc.includes('Bellary and Deccani')) {
      return 'डेमो प्रोफाइल. बेल्लारी आणि दख्खनी संकरित मेंढ्या पाळतात; स्वच्छ कातरणीवर लक्ष केंद्रित करते.';
    }
    if (desc.includes('Kasuti-style embroidery')) {
      return 'प्रीमियम बाजारपेठेसाठी लोकरीच्या कपड्यांमध्ये कसुती पद्धतीचे भरतकाम करणारा डेमो कारागीर.';
    }
    if (desc.includes('Deccani wool batches')) {
      return 'डेमो प्रोफाइल. योग्य आर्द्रता नियंत्रणासह ग्रेड-ए दख्खनी लोकरीचे जत्थे राखते.';
    }
    if (desc.includes('Nellore sheep farmer')) {
      return 'डेमो प्रोफाइल. नेल्लोर मेंढी शेतकरी जो डिजिटल लोकर विक्री प्लॅटफॉर्म शोधत आहे.';
    }
    if (desc.includes('Pochampally-inspired ikat')) {
      return 'नैसर्गिकरित्या रंगवलेल्या लोकरीच्या सुताचा वापर करून पोचमपल्ली-प्रेरित इकत नमुने विणणारा डेमो कारागीर.';
    }
    if (desc.includes('Telangana wool in a small')) {
      return 'डेमो प्रोफाइल. लहान कौटुंबिक सहकारी संस्थेत तेलंगणा लोकरीची साठवणूक आणि प्रक्रिया करतो.';
    }
  }
  return desc;
};

// ─── Training category display info generator ──────────────────────────────
const CATEGORY_INFO = (t) => ({
  'sheep-care':   { label: t('catSheepCare'),   color: 'bg-rose-50 text-rose-700 border-rose-200' },
  'bee-care':     { label: t('catSheepCare'),   color: 'bg-rose-50 text-rose-700 border-rose-200' },
  'shearing':     { label: t('catShearing'),     color: 'bg-amber-50 text-amber-800 border-amber-200' },
  'harvesting':   { label: t('catShearing'),     color: 'bg-amber-50 text-amber-800 border-amber-200' },
  'wool-quality': { label: t('catWoolQuality'), color: 'bg-sky-50 text-sky-700 border-sky-200' },
  'honey-quality':{ label: t('catWoolQuality'), color: 'bg-sky-50 text-sky-700 border-sky-200' },
  'storage':      { label: t('catStorage'),      color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  'processing':   { label: t('catProcessing'),   color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'selling':      { label: t('catSelling'),      color: 'bg-purple-50 text-purple-700 border-purple-200' },
});

// ─── Profile Detail Panel ──────────────────────────────────────────────────
function ProfilePanel({ producer, onClose, navigate }) {
  const { t, language } = useLanguage();
  if (!producer) return null;

  const translatedName = translateName(producer.name, language);
  const translatedSpecialization = SPEC_TRANSLATIONS[language]?.[producer.specialization] || producer.specialization;
  const translatedDescription = translateDescription(producer.description, language);
  const translatedState = STATE_TRANSLATIONS[language]?.[producer.state] || producer.state;
  const translatedRegion = REGION_TRANSLATIONS[language]?.[producer.region] || producer.region;
  const translatedSkills = producer.skills.map(skill => SKILL_TRANSLATIONS[language]?.[skill] || skill);
  const categoryInfo = CATEGORY_INFO(t);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full sm:max-w-xl bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] sm:max-h-[85vh]">
        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="p-6 sm:p-8">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full bg-background hover:bg-border/40 transition-colors"
            aria-label="Close"
          >
            <X size={16} className="text-textMuted" />
          </button>

          {/* Type badge */}
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 ${
            producer.type === 'Artisan'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-emerald-100 text-emerald-700'
          }`}>
            {producer.type === 'Artisan' ? t('artisanType') : t('producerType')}
          </span>

          <h2 className="text-xl sm:text-2xl font-extrabold text-textPrimary leading-tight mb-1">
            {translatedName}
          </h2>

          <p className="flex items-center gap-1.5 text-sm text-textMuted font-medium mb-4">
            <MapPin size={14} />
            {translatedRegion}, {translatedState}
          </p>

          <div className="p-4 rounded-xl bg-background border border-border/60 mb-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-textMuted mb-1">{t('specialization')}</p>
            <p className="text-sm font-semibold text-textPrimary">{translatedSpecialization}</p>
          </div>

          <div className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-textMuted mb-2">{t('skills')}</p>
            <div className="flex flex-wrap gap-2">
              {translatedSkills.map(skill => (
                <span key={skill} className="px-2.5 py-1 rounded-lg bg-background border border-border text-xs text-textSecondary font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <p className="text-sm text-textSecondary leading-relaxed mb-6">
            {translatedDescription}
          </p>

          {/* Recommended Training */}
          <div className="border-t border-border/60 pt-5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={16} className="text-primary" />
              <p className="text-sm font-bold text-textPrimary">{t('recommendedTraining')}</p>
            </div>
            <p className="text-xs text-textMuted mb-3">
              {language === 'hi' ? 'इस प्रोफाइल की विशेषज्ञता और कौशल के आधार पर:' :
               language === 'mr' ? 'या प्रोफाइलच्या विशेषज्ञता आणि कौशल्यांवर आधारित:' :
               "Based on this profile's specialization and skills:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {producer.trainingCategories.map(catKey => {
                const info = categoryInfo[catKey];
                if (!info) return null;
                return (
                  <button
                    key={catKey}
                    onClick={() => { onClose(); navigate(`/learn/category/${catKey}`); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${info.color} transition-all hover:-translate-y-0.5 hover:shadow-sm`}
                  >
                    <span>{info.label}</span>
                    <ArrowRight size={12} />
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-[10px] text-textMuted/60 mt-5 italic">
            {language === 'hi' ? '* यह हनीचेन प्रोटोटाइप के लिए बनाई गई एक डेमो प्रोफाइल है। कोई वास्तविक व्यक्ति नहीं।' :
             language === 'mr' ? '* हनीचेन प्रोटोटाइपसाठी तयार केलेले हे एक नमुना प्रोफाईल आहे. वास्तविक व्यक्ती नाही.' :
             '* This is a sample/demo profile created for the HoneyChain prototype — KVIC Honey Mission. Not a real person.'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Producer Card ─────────────────────────────────────────────────────────
function ProducerCard({ producer, onViewDetails }) {
  const { t, language } = useLanguage();
  const translatedName = translateName(producer.name, language);
  const translatedSpecialization = SPEC_TRANSLATIONS[language]?.[producer.specialization] || producer.specialization;
  const translatedState = STATE_TRANSLATIONS[language]?.[producer.state] || producer.state;
  const translatedRegion = REGION_TRANSLATIONS[language]?.[producer.region] || producer.region;
  const translatedSkills = producer.skills.map(skill => SKILL_TRANSLATIONS[language]?.[skill] || skill);

  return (
    <Card
      interactive={false}
      className="flex flex-col justify-between p-5 group"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            producer.type === 'Artisan'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-emerald-100 text-emerald-700'
          }`}>
            {producer.type === 'Artisan' ? t('artisanType') : t('producerType')}
          </span>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-background border border-border text-textMuted text-sm font-bold">
            {translatedName.charAt(0)}
          </span>
        </div>

        <h3 className="text-base font-bold text-textPrimary leading-snug mb-1">
          {translatedName}
        </h3>

        <p className="flex items-center gap-1 text-xs text-textMuted font-medium mb-3">
          <MapPin size={12} />
          {translatedRegion}, {translatedState}
        </p>

        <div className="mb-3">
          <p className="text-[10px] text-textMuted uppercase tracking-wider font-semibold mb-1">{t('specialization')}</p>
          <p className="text-xs text-textSecondary font-medium">{translatedSpecialization}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {translatedSkills.slice(0, 3).map(skill => (
            <span key={skill} className="px-2 py-0.5 rounded-md bg-background border border-border/80 text-[11px] text-textMuted font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => onViewDetails(producer)}
        className="mt-5 w-full py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primaryDark transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
      >
        <span>{t('viewDetails')}</span>
        <ArrowRight size={14} />
      </button>
    </Card>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function ProducerDirectory() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [selectedState, setSelectedState] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducer, setSelectedProducer] = useState(null);

  const states = Object.keys(STATE_REGIONS);
  const regions = selectedState ? STATE_REGIONS[selectedState] : [];

  // Reset region when state changes
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedRegion('');
  };

  const filtered = useMemo(() => {
    return PRODUCERS.filter(p => {
      if (selectedState && p.state !== selectedState) return false;
      if (selectedRegion && p.region !== selectedRegion) return false;
      
      let dbType = selectedType;
      if (selectedType === t('producerType') || selectedType === 'Wool Producer') dbType = 'Beekeeper';
      if (selectedType === t('artisanType')) dbType = 'Artisan';
      if (selectedType && p.type !== dbType && !(dbType === 'Beekeeper' && (p.type === 'Beekeeper' || p.type === 'Wool Producer'))) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const translatedName = translateName(p.name, language).toLowerCase();
        const translatedSpecialization = (SPEC_TRANSLATIONS[language]?.[p.specialization] || p.specialization).toLowerCase();
        const translatedSkills = p.skills.map(skill => SKILL_TRANSLATIONS[language]?.[skill] || skill).map(s => s.toLowerCase());

        return (
          p.name.toLowerCase().includes(q) ||
          translatedName.includes(q) ||
          p.specialization.toLowerCase().includes(q) ||
          translatedSpecialization.includes(q) ||
          p.skills.some(s => s.toLowerCase().includes(q)) ||
          translatedSkills.some(s => s.includes(q)) ||
          p.region.toLowerCase().includes(q) ||
          (REGION_TRANSLATIONS[language]?.[p.region] || '').toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          (STATE_TRANSLATIONS[language]?.[p.state] || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedState, selectedRegion, selectedType, searchQuery, language, t]);

  const hasFilters = selectedState || selectedRegion || selectedType || searchQuery.trim();

  return (
    <>
      <main className="page-shell animate-enter">
        {/* Back */}
        <button
          onClick={() => navigate('/learn')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-textSecondary hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>{t('backToLearn')}</span>
        </button>

        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2d3a6b] via-[#3b4d8a] to-[#4a5faa] text-white p-7 sm:p-10 shadow-xl mb-8">
          <div className="hero-orb orb-one opacity-15" />
          <div className="hero-orb orb-two opacity-10" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 border border-white/15 text-xs font-semibold backdrop-blur-md mb-4">
              <Users size={13} />
              <span>{t('producersAndArtisans')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              {t('producersAndArtisans')}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-white/80 max-w-xl leading-relaxed">
              {t('exploreProducersDesc')}
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] bg-white/10 px-3 py-1.5 rounded-full text-blue-200 border border-white/10">
              {language === 'hi' ? '⚠️ हनीचेन प्रोटोटाइप के लिए नमूना प्रोफाइल - वास्तविक व्यक्ति नहीं' :
               language === 'mr' ? '⚠️ हनीचेन प्रोटोटाइपसाठी नमुना प्रोफाइल - वास्तविक व्यक्ती नाही' :
               '⚠️ Sample profiles for HoneyChain prototype — KVIC Honey Mission'}
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-surface rounded-2xl border border-border/80 shadow-sm p-5 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-1">
              <input
                type="text"
                placeholder={t('searchNameSkill')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-background text-textPrimary placeholder:text-textMuted text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary border border-border/60 transition-all"
              />
              <Search className="absolute left-3.5 top-3.5 text-textMuted" size={15} />
            </div>

            {/* State */}
            <div className="relative">
              <select
                value={selectedState}
                onChange={handleStateChange}
                className="w-full appearance-none px-4 py-3 rounded-xl bg-background text-textPrimary text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary border border-border/60 transition-all cursor-pointer pr-8"
              >
                <option value="">{t('selectState')}</option>
                {states.map(s => (
                  <option key={s} value={s}>
                    {STATE_TRANSLATIONS[language]?.[s] || s}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-3.5 text-textMuted pointer-events-none" />
            </div>

            {/* Region */}
            <div className="relative">
              <select
                value={selectedRegion}
                onChange={e => setSelectedRegion(e.target.value)}
                disabled={!selectedState}
                className="w-full appearance-none px-4 py-3 rounded-xl bg-background text-textPrimary text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary border border-border/60 transition-all cursor-pointer pr-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">{t('selectRegion')}</option>
                {regions.map(r => (
                  <option key={r} value={r}>
                    {REGION_TRANSLATIONS[language]?.[r] || r}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-3.5 text-textMuted pointer-events-none" />
            </div>

            {/* Type */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="w-full appearance-none px-4 py-3 rounded-xl bg-background text-textPrimary text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary border border-border/60 transition-all cursor-pointer pr-8"
              >
                <option value="">{t('allTypes')}</option>
                <option value="Beekeeper">{t('producerType')}</option>
                <option value="Artisan">{t('artisanType')}</option>
              </select>
              <ChevronDown size={15} className="absolute right-3 top-3.5 text-textMuted pointer-events-none" />
            </div>
          </div>

          {/* Active filter chips + clear */}
          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/60">
              <span className="text-xs text-textMuted font-medium">{t('activeFilters')}</span>
              {selectedState && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {STATE_TRANSLATIONS[language]?.[selectedState] || selectedState}
                  <button onClick={() => { setSelectedState(''); setSelectedRegion(''); }} aria-label="Remove state filter"><X size={11} /></button>
                </span>
              )}
              {selectedRegion && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {REGION_TRANSLATIONS[language]?.[selectedRegion] || selectedRegion}
                  <button onClick={() => setSelectedRegion('')} aria-label="Remove region filter"><X size={11} /></button>
                </span>
              )}
              {selectedType && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {selectedType === 'Beekeeper' || selectedType === 'Wool Producer' ? t('producerType') : selectedType === 'Artisan' ? t('artisanType') : selectedType}
                  <button onClick={() => setSelectedType('')} aria-label="Remove type filter"><X size={11} /></button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} aria-label="Clear search"><X size={11} /></button>
                </span>
              )}
              <button
                onClick={() => { setSelectedState(''); setSelectedRegion(''); setSelectedType(''); setSearchQuery(''); }}
                className="text-xs text-red-600 font-semibold hover:underline ml-1"
              >
                {t('clearAll')}
              </button>
            </div>
          )}
        </section>

        {/* Results */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold text-textSecondary">
              {filtered.length === 0 ? t('noProducersFound') : `${filtered.length} ${t('producersFound')}`}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-surface border border-border flex flex-col items-center">
              <span className="grid h-14 w-14 place-items-center rounded-3xl bg-blue-50 text-blue-600 mb-3">
                <Users size={28} />
              </span>
              <h3 className="font-bold text-base text-textPrimary">{t('noProducersFound')}</h3>
              <p className="text-xs sm:text-sm text-textSecondary max-w-sm mt-1 mb-4">
                {t('noProducersHelp')}
              </p>
              {hasFilters && (
                <button
                  onClick={() => { setSelectedState(''); setSelectedRegion(''); setSelectedType(''); setSearchQuery(''); }}
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl transition-colors shadow-sm hover:bg-primaryDark"
                >
                  {t('clearFilters')}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(producer => (
                <ProducerCard
                  key={producer.id}
                  producer={producer}
                  onViewDetails={setSelectedProducer}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Profile Detail Panel */}
      {selectedProducer && (
        <ProfilePanel
          producer={selectedProducer}
          onClose={() => setSelectedProducer(null)}
          navigate={navigate}
        />
      )}
    </>
  );
}

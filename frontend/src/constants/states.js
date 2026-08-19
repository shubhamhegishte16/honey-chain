export const INDIAN_STATES=[{code:'RJ',name:'Rajasthan'},{code:'GJ',name:'Gujarat'},{code:'MH',name:'Maharashtra'},{code:'JK',name:'Jammu & Kashmir'},{code:'HP',name:'Himachal Pradesh'},{code:'UK',name:'Uttarakhand'},{code:'KA',name:'Karnataka'},{code:'TG',name:'Telangana'}];
export const DISTRICTS_BY_STATE={RJ:['Bikaner','Jaisalmer','Jodhpur','Nagaur','Pali'],GJ:['Kutch','Banaskantha','Patan','Surendranagar'],MH:['Solapur','Ahmednagar','Sangli','Satara'],JK:['Leh','Kargil','Srinagar','Anantnag'],HP:['Kinnaur','Lahaul and Spiti','Kullu','Shimla'],UK:['Chamoli','Pithoragarh','Uttarkashi'],KA:['Bellary','Bijapur','Gadag'],TG:['Mahbubnagar','Nalgonda','Warangal']};
export const WOOL_TYPES=['Merino','Deccani','Marwari','Patanwadi','Chokla','Magra','Nali','Bikaneri'];
export function getStateCode(stateName){const match=INDIAN_STATES.find(s=>s.name===stateName);return match?match.code:'XX';}
export function getDistrictsForState(stateName){const match=INDIAN_STATES.find(s=>s.name===stateName);return match?DISTRICTS_BY_STATE[match.code]||[]:[];}
export const ROLES=[{value:'farmer',label:'Farmer / Producer'},{value:'buyer',label:'Buyer'},{value:'processor',label:'Processor'},{value:'artisan',label:'Artisan'}];
export const ROLE_LABELS={farmer:'Farmer / Producer',buyer:'Buyer',processor:'Processor',artisan:'Artisan',admin:'Administrator'};

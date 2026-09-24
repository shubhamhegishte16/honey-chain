import { apiRequest } from './api';
import { getStoredBatches, saveStoredBatches, addStoredTrackingEvent } from './mockData';

const normalizeBatch = (batch = {}) => ({
  ...batch,
  id: batch.id || batch._id || batch.batchId || batch.batch_id,
  batch_id: batch.batchId || batch.batch_id || batch.id,
  batchId: batch.batchId || batch.batch_id || batch.id,
  wool_type: batch.floralSource || batch.woolType || batch.wool_type || 'Mustard Blossom',
  woolType: batch.floralSource || batch.woolType || batch.wool_type || 'Mustard Blossom',
  floralSource: batch.floralSource || batch.woolType || batch.wool_type || 'Mustard Blossom',
  beeSpecies: batch.beeSpecies || 'Apis mellifera (European Honeybee)',
  quantity_kg: Number(batch.quantityKg ?? batch.quantity_kg ?? 50),
  quantityKg: Number(batch.quantityKg ?? batch.quantity_kg ?? 50),
  state: batch.origin?.state || batch.state || 'Rajasthan',
  district: batch.origin?.district || batch.district || 'Bharatpur',
  farm_location: batch.origin?.farmLocation || batch.farm_location || 'Apiary Box #1 to #25',
  shearing_date: batch.extractionDate || batch.shearingDate || batch.shearing_date || new Date().toISOString(),
  shearingDate: batch.extractionDate || batch.shearingDate || batch.shearing_date || new Date().toISOString(),
  extractionDate: batch.extractionDate || batch.shearingDate || batch.shearing_date || new Date().toISOString(),
  farmer_id: batch.farmer?._id || batch.farmer?.id || batch.farmer || batch.farmer_id || 'user-beekeeper-1',
  users: batch.farmer || batch.users || { name: 'Ramesh Singh', role: 'farmer', district: 'Bharatpur', state: 'Rajasthan' },
  status: batch.status || 'produced',
  qualityGrade: batch.qualityGrade || batch.quality_grade || 'Grade A+ (NMR Certified 100% Pure)',
  blockHash: batch.blockHash || `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
  wool_batch_images: (batch.images || batch.wool_batch_images || []).map(image =>
    typeof image === 'string' ? { image_url: image } : image
  ),
});

export async function getBatchesByFarmer(farmerId) {
  try {
    const result = await apiRequest('/batches', { method: 'GET' });
    if (result.data && result.data.length > 0) {
      return { ...result, data: (result.data || []).map(normalizeBatch) };
    }
  } catch {
    // Backend offline fallback
  }

  const stored = getStoredBatches().map(normalizeBatch);
  return { data: stored };
}

export async function getTotalInventory(farmerId) {
  try {
    const { data } = await apiRequest('/batches', { method: 'GET' });
    if (data && data.length > 0) {
      const total = data.filter(b => !['sold'].includes(b.status)).reduce((s, b) => s + Number(b.quantityKg || b.quantity_kg || 0), 0);
      return { data: total };
    }
  } catch {
    // Backend offline fallback
  }

  const stored = getStoredBatches();
  const total = stored.reduce((sum, b) => sum + Number(b.quantityKg || b.quantity_kg || 0), 0);
  return { data: total };
}

export async function getBatchById(id) {
  try {
    const result = await apiRequest(`/batches/${id}`, { method: 'GET' });
    if (result.data) {
      return { ...result, data: normalizeBatch(result.data) };
    }
  } catch {
    // Backend offline fallback
  }

  const stored = getStoredBatches().map(normalizeBatch);
  const found = stored.find(b => b.id === id || b.batch_id === id || b.batchId === id) || stored[0];
  return { data: found };
}

export async function createWoolBatch(batchData) {
  const currentCount = getStoredBatches().length + 109;
  const stateCode = batchData.state ? batchData.state.slice(0, 2).toUpperCase() : 'RJ';
  const newBatchId = `HC-${stateCode}-2026-${String(currentCount).padStart(6, '0')}`;
  const blockHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;

  const normalizedNew = normalizeBatch({
    ...batchData,
    id: newBatchId,
    batchId: newBatchId,
    batch_id: newBatchId,
    status: 'produced',
    blockHash,
    qualityGrade: 'Pending Inspection',
    shearingDate: batchData.extractionDate || batchData.shearingDate || new Date().toISOString(),
  });

  try {
    const result = await apiRequest('/batches', {
      method: 'POST',
      body: JSON.stringify(batchData),
    });
    if (result.data) return { ...result, data: normalizeBatch(result.data) };
  } catch {
    // Backend offline fallback
  }

  const stored = getStoredBatches();
  stored.unshift(normalizedNew);
  saveStoredBatches(stored);

  // Add initial Genesis Block event
  addStoredTrackingEvent(newBatchId, {
    id: `ev-${Date.now()}`,
    event_type: 'produced',
    eventType: 'produced',
    actorName: 'Ramesh Singh (KVIC Beekeeper)',
    location: `${normalizedNew.district}, ${normalizedNew.state}`,
    description: `Harvested ${normalizedNew.quantityKg} kg of ${normalizedNew.floralSource} honey. Genesis Block #0 sealed into Honey Chain.`,
    event_timestamp: new Date().toISOString(),
    timestamp: new Date().toISOString(),
    blockHash,
    blockNumber: 0,
    merkleVerified: true,
  });

  return { data: normalizedNew };
}

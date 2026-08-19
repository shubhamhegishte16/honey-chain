import { apiRequest } from './api';

const normalizeBatch = (batch = {}) => ({
  ...batch,
  id: batch.id || batch._id,
  batch_id: batch.batchId || batch.batch_id,
  wool_type: batch.woolType || batch.wool_type,
  quantity_kg: batch.quantityKg ?? batch.quantity_kg,
  state: batch.origin?.state || batch.state,
  district: batch.origin?.district || batch.district,
  farm_location: batch.origin?.farmLocation || batch.farm_location,
  shearing_date: batch.shearingDate || batch.shearing_date,
  farmer_id: batch.farmer?._id || batch.farmer?.id || batch.farmer || batch.farmer_id,
  users: batch.farmer || batch.users,
  wool_batch_images: (batch.images || batch.wool_batch_images || []).map(image =>
    typeof image === 'string' ? { image_url: image } : image
  ),
});

export async function getBatchesByFarmer(farmerId) {
  // We can pass farmerId if backend requires it, or backend uses req.user._id
  const result = await apiRequest('/batches', { method: 'GET' });
  return result.error ? result : { ...result, data: (result.data || []).map(normalizeBatch) };
}

export async function getTotalInventory(farmerId) {
  const { data, error } = await apiRequest('/batches', { method: 'GET' });
  if (error) return { error };
  const total = data.filter(b => !['sold'].includes(b.status)).reduce((s, b) => s + Number(b.quantityKg || b.quantity_kg || 0), 0);
  return { data: total };
}

export async function getBatchById(id) {
  const result = await apiRequest(`/batches/${id}`, { method: 'GET' });
  return result.error ? result : { ...result, data: normalizeBatch(result.data) };
}

export async function createWoolBatch(batchData) {
  const result = await apiRequest('/batches', {
    method: 'POST',
    body: JSON.stringify(batchData),
  });
  return result.error ? result : { ...result, data: normalizeBatch(result.data) };
}

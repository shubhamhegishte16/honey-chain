import Producer from '../models/Producer.js';

export async function getProducers(req, res, next) {
  try {
    const { state, district, woolType, search } = req.query;
    const query = {};

    if (state) query.state = state;
    if (district) query.district = district;
    if (woolType) query.woolTypes = woolType;

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { specialty: searchRegex },
        { state: searchRegex },
        { district: searchRegex },
      ];
    }

    const producers = await Producer.find(query)
      .populate('user', 'name email mobile')
      .sort({ rating: -1 });

    res.json({ success: true, count: producers.length, data: producers });
  } catch (error) {
    next(error);
  }
}

export async function getProducerById(req, res, next) {
  try {
    const { id } = req.params;
    const producer = await Producer.findById(id).populate('user', 'name email mobile');
    if (!producer) {
      return res.status(404).json({ success: false, message: 'Producer not found.' });
    }
    res.json({ success: true, data: producer });
  } catch (error) {
    next(error);
  }
}

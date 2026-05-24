import Dataset from '../models/Dataset.js';

class DatasetRepository {
  async create(datasetData) {
    const dataset = new Dataset(datasetData);
    const savedDataset = await dataset.save();
    return savedDataset.toObject();
  }

  async findAllByUserId(userId) {
    const datasets = await Dataset.find({ userId }).sort({ createdAt: -1 });
    return datasets.map(d => d.toObject());
  }

  async findByIdAndUserId(id, userId) {
    const dataset = await Dataset.findOne({ _id: id, userId });
    return dataset ? dataset.toObject() : null;
  }

  async findById(id) {
    const dataset = await Dataset.findById(id);
    return dataset ? dataset.toObject() : null;
  }

  async deleteByIdAndUserId(id, userId) {
    const result = await Dataset.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  }
}

export default new DatasetRepository();

import DatasetService from '../services/DatasetService.js';

class DatasetController {
  async createDataset(req, res) {
    try {
      const { name, columns, rows } = req.body;
      const userId = req.userId;
      
      const result = await DatasetService.createDataset({ name, columns, rows, userId });
      return res.status(201).json(result);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  async listDatasets(req, res) {
    try {
      const userId = req.userId;
      const result = await DatasetService.listDatasets(userId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  async getDataset(req, res) {
    try {
      const { id } = req.params;
      const userId = req.userId;
      
      const result = await DatasetService.getDataset(id, userId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  async deleteDataset(req, res) {
    try {
      const { id } = req.params;
      const userId = req.userId;
      
      const result = await DatasetService.deleteDataset(id, userId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }
}

export default new DatasetController();

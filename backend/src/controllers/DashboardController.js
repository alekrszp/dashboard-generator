import DashboardService from '../services/DashboardService.js';

class DashboardController {
  async createDashboard(req, res) {
    try {
      const { name, datasetId, widgets } = req.body;
      const userId = req.userId;

      const result = await DashboardService.createDashboard({ name, datasetId, widgets, userId });
      return res.status(201).json(result);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  async listDashboards(req, res) {
    try {
      const userId = req.userId;
      const result = await DashboardService.listDashboards(userId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  async getDashboard(req, res) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const result = await DashboardService.getDashboard(id, userId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  async updateWidgets(req, res) {
    try {
      const { id } = req.params;
      const { widgets } = req.body;
      const userId = req.userId;

      const result = await DashboardService.updateWidgets(id, userId, widgets);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  async deleteDashboard(req, res) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const result = await DashboardService.deleteDashboard(id, userId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }
}

export default new DashboardController();

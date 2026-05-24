import Dashboard from '../models/Dashboard.js';
import Dataset from '../models/Dataset.js';

class DashboardRepository {
  async create(dashboardData) {
    const dashboard = new Dashboard(dashboardData);
    const savedDashboard = await dashboard.save();
    return savedDashboard.toObject();
  }

  async findAllByUserId(userId) {
    const dashboards = await Dashboard.find({ userId }).sort({ createdAt: -1 });
    return dashboards.map(d => d.toObject());
  }

  async findByIdAndUserId(id, userId) {
    const dashboard = await Dashboard.findOne({ _id: id, userId });
    return dashboard ? dashboard.toObject() : null;
  }

  async findByIdAndUserIdPopulated(id, userId) {
    const dashboard = await Dashboard.findOne({ _id: id, userId }).populate('datasetId');
    if (!dashboard) return null;

    const obj = dashboard.toObject();

    if (obj.datasetId && typeof obj.datasetId === 'object') {
      const datasetObj = obj.datasetId;
      obj.dataset = datasetObj;
      obj.datasetId = datasetObj.id;
    }

    return obj;
  }

  async updateWidgets(id, userId, widgets) {
    const dashboard = await Dashboard.findOneAndUpdate(
      { _id: id, userId },
      { $set: { widgets } },
      { new: true }
    );
    return dashboard ? dashboard.toObject() : null;
  }

  async deleteByIdAndUserId(id, userId) {
    const result = await Dashboard.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  }
}

export default new DashboardRepository();

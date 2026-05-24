import DashboardRepository from '../repositories/DashboardRepository.js';
import DatasetRepository from '../repositories/DatasetRepository.js';

class DashboardService {
  async createDashboard({ name, datasetId, widgets, userId }) {
    if (!name) {
      const err = new Error('O nome do dashboard é obrigatório.');
      err.status = 400;
      throw err;
    }

    if (!datasetId) {
      const err = new Error('O ID do dataset é obrigatório.');
      err.status = 400;
      throw err;
    }

    // Verify dataset exists and belongs to the user
    const dataset = await DatasetRepository.findByIdAndUserId(datasetId, userId);
    if (!dataset) {
      const err = new Error('O dataset especificado não existe ou não pertence a este usuário.');
      err.status = 400;
      throw err;
    }

    if (!widgets || !Array.isArray(widgets)) {
      const err = new Error('Widgets são obrigatórios e devem ser um array.');
      err.status = 400;
      throw err;
    }

    // Validate widget items
    this._validateWidgets(widgets);

    const newDashboard = await DashboardRepository.create({
      name,
      datasetId,
      widgets,
      userId
    });

    return newDashboard;
  }

  async listDashboards(userId) {
    return await DashboardRepository.findAllByUserId(userId);
  }

  async getDashboard(id, userId) {
    const dashboard = await DashboardRepository.findByIdAndUserIdPopulated(id, userId);
    if (!dashboard) {
      const err = new Error('Dashboard não encontrado.');
      err.status = 404;
      throw err;
    }
    return dashboard;
  }

  async updateWidgets(id, userId, widgets) {
    if (!widgets || !Array.isArray(widgets)) {
      const err = new Error('Widgets são obrigatórios e devem ser um array.');
      err.status = 400;
      throw err;
    }

    this._validateWidgets(widgets);

    const updatedDashboard = await DashboardRepository.updateWidgets(id, userId, widgets);
    if (!updatedDashboard) {
      const err = new Error('Dashboard não encontrado ou você não tem permissão para alterá-lo.');
      err.status = 404;
      throw err;
    }

    return updatedDashboard;
  }

  async deleteDashboard(id, userId) {
    const deleted = await DashboardRepository.deleteByIdAndUserId(id, userId);
    if (!deleted) {
      const err = new Error('Dashboard não encontrado ou você não tem permissão para deletá-lo.');
      err.status = 404;
      throw err;
    }
    return { message: 'Deletado com sucesso' };
  }

  _validateWidgets(widgets) {
    const validTypes = ["bar", "line", "pie", "table", "area", "radar"];
    
    for (const widget of widgets) {
      if (!widget.id || !widget.type || !widget.title || !widget.xKey || !widget.yKey || !widget.color) {
        const err = new Error('Todos os campos do widget são obrigatórios: id, type, title, xKey, yKey, color.');
        err.status = 400;
        throw err;
      }
      
      if (!validTypes.includes(widget.type)) {
        const err = new Error(`Tipo de gráfico inválido: "${widget.type}". Tipos aceitos: ${validTypes.join(', ')}.`);
        err.status = 400;
        throw err;
      }
    }
  }
}

export default new DashboardService();

import DatasetRepository from '../repositories/DatasetRepository.js';

class DatasetService {
  async createDataset({ name, columns, rows, userId }) {
    if (!name) {
      const err = new Error('O nome do dataset é obrigatório.');
      err.status = 400;
      throw err;
    }

    if (!columns || !Array.isArray(columns)) {
      const err = new Error('Colunas são obrigatórias e devem ser um array.');
      err.status = 400;
      throw err;
    }

    if (!rows || !Array.isArray(rows)) {
      const err = new Error('Linhas são obrigatórias e devem ser um array.');
      err.status = 400;
      throw err;
    }

    const newDataset = await DatasetRepository.create({
      name,
      columns,
      rows,
      userId
    });

    return newDataset;
  }

  async listDatasets(userId) {
    return await DatasetRepository.findAllByUserId(userId);
  }

  async getDataset(id, userId) {
    const dataset = await DatasetRepository.findByIdAndUserId(id, userId);
    if (!dataset) {
      const err = new Error('Dataset não encontrado.');
      err.status = 404;
      throw err;
    }
    return dataset;
  }

  async deleteDataset(id, userId) {
    const deleted = await DatasetRepository.deleteByIdAndUserId(id, userId);
    if (!deleted) {
      const err = new Error('Dataset não encontrado ou você não tem permissão para deletá-lo.');
      err.status = 404;
      throw err;
    }
    return { message: 'Deletado com sucesso' };
  }
}

export default new DatasetService();

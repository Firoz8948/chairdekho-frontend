import apiClient from '../api';

export const catalogueService = {
  async getCatalogue() {
    return apiClient.get('/catalogue');
  },

  async getAdminCatalogue({ page = 1, page_size = 10, category_id = null } = {}) {
    const params = { page, page_size };
    if (category_id) params.category_id = category_id;
    return apiClient.get('/catalogue/admin', { params });
  },

  async saveAdminCatalogue(items) {
    return apiClient.patch('/catalogue/admin/bulk', { items });
  },
};

export default catalogueService;

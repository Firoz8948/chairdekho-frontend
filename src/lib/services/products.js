import apiClient from '../api';
import { productSlugApiPath } from '../productSlug';

export const productService = {
  async getProducts(params = {}) {
    return apiClient.get('/products', { params });
  },

  async getProduct(slugOrId) {
    return apiClient.get(productSlugApiPath(slugOrId));
  },

  async getFeaturedProducts() {
    return apiClient.get('/products/featured');
  },

  async getMetafieldDefinitions() {
    return apiClient.get('/metafields/');
  },

  async getCategories() {
    return apiClient.get('/categories/');
  },

  async getVideoProducts() {
    return apiClient.get('/video-products');
  },
};

export default productService;

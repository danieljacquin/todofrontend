import axios from 'axios';
class CategoriesService {

    async getCategories(url){
        try {
           const response = await axios.get(`${url}categories/all`);
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async createCategory(url, category) {
        try {
            const response = await axios.post(`${url}categories/create`, category);
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async updateCategory(url, category, id) {
        try {
            const response = await axios.put(`${url}categories/${id}`, category);
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async deleteCategory(url, id) {
        try {
            const response = await axios.delete(`${url}categories/${id}`);
            return response.data;
        } catch (error) {
            return error;
        }
    }
}

export default new CategoriesService();
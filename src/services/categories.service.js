import axios from 'axios';
class CategoriesService {

    async getCategories(url, token){
        try {
           const response = await axios.get(`${url}categories/all`,
           {headers: {
                'Authorization': 'Bearer ' + token
           }});
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async createCategory(url, category, token) {
        try {
            const response = await axios.post(`${url}categories/create`, category,
            {headers: {
                 'Authorization': 'Bearer ' + token
            }});
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async updateCategory(url, category, id, token) {
        try {
            const response = await axios.put(`${url}categories/${id}`, category,
            {headers: {
                 'Authorization': 'Bearer ' + token
            }});
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async deleteCategory(url, id, token) {
        try {
            const response = await axios.delete(`${url}categories/${id}`,
            {headers: {
                 'Authorization': 'Bearer ' + token
            }});
            return response.data;
        } catch (error) {
            return error;
        }
    }
}

export default new CategoriesService();
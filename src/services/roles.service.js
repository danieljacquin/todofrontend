import axios from 'axios';
class RolesService {

    async getRoles(url){
        try {
           const response = await axios.get(`${url}roles/all`);
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async createRole(url, role) {
        try {
            const response = await axios.post(`${url}roles/create`, role);
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async updateRole(url, role, id) {
        try {
            const response = await axios.put(`${url}roles/${id}`, role);
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async deleteRole(url, id) {
        try {
            const response = await axios.delete(`${url}roles/${id}`);
            return response.data;
        } catch (error) {
            return error;
        }
    }
}

export default new RolesService();
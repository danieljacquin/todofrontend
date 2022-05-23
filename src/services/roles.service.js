import axios from 'axios';
class RolesService {

    async getRoles(url, token){
        try {
           const response = await axios.get(`${url}roles/all`,
           {headers: {
                'Authorization': 'Bearer ' + token
           }});
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async createRole(url, role, token) {
        try {
            const response = await axios.post(`${url}roles/create`, role,
            {headers: {
                 'Authorization': 'Bearer ' + token
            }});
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async updateRole(url, role, id, token) {
        try {
            const response = await axios.put(`${url}roles/${id}`, role,
            {headers: {
                 'Authorization': 'Bearer ' + token
            }});
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async deleteRole(url, id, token) {
        try {
            const response = await axios.delete(`${url}roles/${id}`,
            {headers: {
                 'Authorization': 'Bearer ' + token
            }});
            return response.data;
        } catch (error) {
            return error;
        }
    }
}

export default new RolesService();
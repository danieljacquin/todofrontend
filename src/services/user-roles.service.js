import axios from "axios";

class UserRolesService {

    async getUserRoles(url, token){
        try {
           const response = await axios.get(`${url}user-roles/all`,
           {headers: {
                'Authorization': 'Bearer ' + token
           }});
            return response.data;
        } catch (error) {
            return error;
        }
    }
    async createUserRoles(url, userRoles, token) {
        try {
            const response = await axios.post(`${url}user-roles/create`, userRoles,
            {headers: {
                 'Authorization': 'Bearer ' + token
            }} );
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async updateUserRoles(url, userRoles, id, token) {
        try {
            const response = await axios.put(`${url}user-roles/${id}`, userRoles,
            {headers: {
                 'Authorization': 'Bearer ' + token
            }});
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async deleteUserRoles(url, id, token) {
        try {
            const response = await axios.delete(`${url}user-roles/${id}`,
            {headers: {
                 'Authorization': 'Bearer ' + token
            }});
            return response.data;
        } catch (error) {
            return error;
        }
    }
}

export default new UserRolesService();
import axios from 'axios';
class UsersService {

    async getUsers(url){
        try {
           const response = await axios.get(`${url}users/all`);
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async createUser(url, user) {
        try {
            const response = await axios.post(`${url}users/create`, user);
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async updateUser(url, user, id) {
        try {
            const response = await axios.put(`${url}/users/${id}`, user);
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async deleteUser(url, id) {
        try {
            const response = await axios.delete(`${url}/users/${id}`);
            return response.data;
        } catch (error) {
            return error;
        }
    }
}

export default new UsersService();
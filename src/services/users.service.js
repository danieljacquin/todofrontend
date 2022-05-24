import axios from 'axios';
class UsersService {

    async getUsers(url, token){
        try {
           const response = await axios.get(`${url}users/all`,
            {headers: {
                 'Authorization': 'Bearer ' + token
            }}
           );
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async createUser(url, user, token) {
        try {
            const response = await axios.post(`${url}users/create`, user,
            {headers: {
                 'Authorization': 'Bearer ' + token
            }} );
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async createUserWitoutToken(url, user) {
        try {
            const response = await axios.post(`${url}users/create`,user);
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async updateUser(url, user, id, token) {
        try {
            const response = await axios.put(`${url}users/${id}`, user,
            {headers: {
                 'Authorization': 'Bearer ' + token
            }});
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async deleteUser(url, id, token) {
        try {
            const response = await axios.delete(`${url}users/${id}`,
            {headers: {
                 'Authorization': 'Bearer ' + token
            }});
            return response.data;
        } catch (error) {
            return error;
        }
    }
}

export default new UsersService();
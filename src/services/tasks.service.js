import axios from 'axios';
class TasksService {

    async getTask(url, token){
        try {
           const response = await axios.get(`${url}tasks/all`,
           {headers: {
                'Authorization': 'Bearer ' + token
           }});
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async createTask(url, task, token) {
        try {
            const response = await axios.post(`${url}tasks/create`, task,
            {headers: {
                 'Authorization': 'Bearer ' + token
            }});
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async updateTask(url, task, id, token) {
        try {
            const response = await axios.put(`${url}tasks/${id}`, task,
            {headers: {
                 'Authorization': 'Bearer ' + token
            }});
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async deleteTask(url, id, token) {
        try {
            const response = await axios.delete(`${url}tasks/${id}`,
            {headers: {
                 'Authorization': 'Bearer ' + token
            }});
            return response.data;
        } catch (error) {
            return error;
        }
    }
}

export default new TasksService();
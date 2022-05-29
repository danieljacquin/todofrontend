import axios from "axios";

class TodoCategoriesService {

    async getTodoCategories(url, token){
        try {
           const response = await axios.get(`${url}todo-categories/all`,
           {headers: {
                'Authorization': 'Bearer ' + token
           }});
            return response.data;
        } catch (error) {
            return error;
        }
    }
    async createTodoCategories(url, todoCategories, token) {
        try {
            const response = await axios.post(`${url}todo-categories/create`, todoCategories,
            {headers: {
                 'Authorization': 'Bearer ' + token
            }} );
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async updateTodoCategories(url, todoCategories, id, token) {
        try {
            const response = await axios.put(`${url}todo-categories/${id}`, todoCategories,
            {headers: {
                 'Authorization': 'Bearer ' + token
            }});
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async deleteTodoCategories(url, id, token) {
        try {
            const response = await axios.delete(`${url}todo-categories/${id}`,
            {headers: {
                 'Authorization': 'Bearer ' + token
            }});
            return response.data;
        } catch (error) {
            return error;
        }
    }
}

export default new TodoCategoriesService();
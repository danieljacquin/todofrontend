import axios from 'axios';
class WorkspacesService {

    async getWorkspaces(url, token){
        try {
           const response = await axios.get(`${url}workspaces/all`,
            {headers: {
                 'Authorization': 'Bearer ' + token
            }}
           );
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async createWorkspace(url, workspace, token) {
        try {
            const response = await axios.post(`${url}workspaces/create`, workspace,
            {headers: {
                 'Authorization': 'Bearer ' + token
            }} );
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async createWorkspaceWitoutToken(url, workspace) {
        try {
            const response = await axios.post(`${url}workspaces/create`,workspace);
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async updateWorkspace(url, workspace, id, token) {
        try {
            const response = await axios.put(`${url}workspaces/${id}`, workspace,
            {headers: {
                 'Authorization': 'Bearer ' + token
            }});
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async deleteWorkspace(url, id, token) {
        try {
            const response = await axios.delete(`${url}workspaces/${id}`,
            {headers: {
                 'Authorization': 'Bearer ' + token
            }});
            return response.data;
        } catch (error) {
            return error;
        }
    }
}

export default new WorkspacesService();
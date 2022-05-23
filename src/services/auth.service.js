import axios from "axios";

class AuthService {

    async login(url, user) {
        try {
            const response = await axios.post(`${url}auth/login`, user);
            return response;
        } catch (error) {
            return error;
        }
    }

}

export default new AuthService();
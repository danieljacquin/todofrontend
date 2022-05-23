import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth/AuthContext";

const PrivateRoute = ({children}) => {

    const { user } = useContext(AuthContext);
    console.log(user);


    return user.logged 
        ? children
        : <Navigate to="/login"/>

}

export default PrivateRoute;
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth/AuthContext";

const PublicRoute = ({children}) => {

    const { user } = useContext(AuthContext);
    console.log(user);


    return user.logged 
        ? <Navigate to="/"/>
        : children

}

export default PublicRoute;
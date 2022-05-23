
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/login/Login";
import DashBoardRoutes from "./DashBoardRoutes";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

const AppRouter = () => {

    return (
        <Router>
            <Routes>
                <Route path="/login" element={
                    <PublicRoute>
                        <Login/>
                    </PublicRoute>
                }/>
                <Route path="/*" element={
                    <PrivateRoute>
                        <DashBoardRoutes/>
                    </PrivateRoute>
                }/>
            </Routes>
        </Router>
    )
}

export default AppRouter;
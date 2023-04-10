import { useLocation, Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { useContext } from "react";

const RequireAuth = ({ allowedRoles }) => {
    const {isAdmin} = useContext(AuthContext);
    const location = useLocation();

    return(
        allowedRoles === isAdmin
        ? <Outlet /> 
        : <Navigate to="unauthorized" state={{from: location}} replace />
    );
}

export default RequireAuth;
import { Outlet, Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

export const PrivateRoute = () => {
    const [state] = useContext(UserContext)
    
    if (state.user.role === "user") {
        return <Outlet />
    }
    return <Navigate to="/" />
}

export function PrivateRouteAdmin() {
    const [state] = useContext(UserContext);

    if (state.user.role === "admin") {
        return <Outlet />
    }
    return <Navigate to="/" />
}
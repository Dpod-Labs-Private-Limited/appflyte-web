import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { handleCheckLoginToken } from "../Api/Services/AppflyteAuth/refreshToken";

const useAuthCheck = (isAuthenticated) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) return;

        if (location.pathname !== "/authorized") {
            handleCheckLoginToken(navigate, location);
        }
    }, [location.pathname, isAuthenticated, navigate, location]);

    useEffect(() => {
        if (!isAuthenticated) return;

        const interval = setInterval(() => {
            handleCheckLoginToken(navigate, location);
        }, 120000);

        return () => clearInterval(interval);
    }, [isAuthenticated, navigate, location]);

};

export default useAuthCheck;

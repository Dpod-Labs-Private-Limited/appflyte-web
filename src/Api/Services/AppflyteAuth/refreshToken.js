import { jwtDecode } from "jwt-decode";
import RefreshTokenApi from "./RefreshTokenApi";

const isTokenExpiredOrAboutToExpire = (jwtToken) => {
    try {
        const token = jwtDecode(jwtToken);
        const tokenExpireTime = token.exp;
        const currentTime = Math.floor(Date.now() / 1000);

        if (currentTime >= tokenExpireTime) {
            return "expired";
        }

        if ((tokenExpireTime - currentTime) <= 600) {
            return "about-to-expire";
        }

        return "valid";
    } catch (error) {
        console.error("Invalid token:", error);
        return "expired";
    }
};

const refreshAccessToken = async (refreshtoken, navigate, location) => {
    try {
        const response = await RefreshTokenApi.getRefreshToken(refreshtoken)
        const jwtToken = await response.json();
        if (jwtToken) {
            localStorage.setItem('dpod-token', JSON.stringify(jwtToken.token));
            localStorage.setItem('refresh-token', JSON.stringify(jwtToken.refresh_token));
            return;
        } else {
            if (location.pathname !== '/invite-login' && location.pathname !== '/root-user') {
                navigate('/login');
            }
            localStorage.clear();
        }
    }
    catch (error) {
        if (location.pathname !== '/invite-login' && location.pathname !== '/root-user') {
            navigate('/login');
        }
        localStorage.clear();
        console.log(error)
    }
}

export const handleCheckLoginToken = async (navigate, location) => {
    try {
        const jwtTokenString = localStorage.getItem("dpod-token");
        const refreshTokenString = localStorage.getItem("refresh-token");

        if (!jwtTokenString || !refreshTokenString) {
            localStorage.clear();
            if (location.pathname !== '/invite-login' && location.pathname !== '/root-user') {
                navigate('/login');
            }
            return;
        }

        let jwtToken, refreshToken;
        try {
            jwtToken = JSON.parse(jwtTokenString);
            refreshToken = JSON.parse(refreshTokenString);
        } catch (parseError) {
            console.error("Error parsing token(s):", parseError);
            localStorage.clear();
            if (location.pathname !== '/invite-login' && location.pathname !== '/root-user') {
                navigate('/login');
            }
            return;
        }

        const tokenStatus = isTokenExpiredOrAboutToExpire(jwtToken);

        if (tokenStatus === "expired" || tokenStatus === "about-to-expire") {
            console.log(`Token is ${tokenStatus}, refreshing...`);
            await refreshAccessToken(refreshToken, navigate, location);
        }

    } catch (error) {
        console.error("Error checking token:", error);
    }
};

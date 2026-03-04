import axios from "axios";

class AmeyaAuthService {

    setup_appflyte_user = async (reqObj) => {
        const JwtToken = JSON.parse(localStorage.getItem("dpod-token"))
        const response = await axios.post(`${process.env.REACT_APP_OAUTH_SERVER_URL}/setup-appflyte-user`, reqObj, {
            headers: { Authorization: `Bearer ${JwtToken}` }
        });
        return response;
    };

    user_setup_status = async (session_id) => {
        const sessionId = encodeURIComponent(session_id)
        const JwtToken = JSON.parse(localStorage.getItem("dpod-token"))
        const response = await axios.get(`${process.env.REACT_APP_OAUTH_SERVER_URL}/firebase/progress/${sessionId}`, {
            headers: { Authorization: `Bearer ${JwtToken}` }
        })
        return response
    }

    user_session_delete = async (session_id) => {
        const sessionId = encodeURIComponent(session_id)
        const JwtToken = JSON.parse(localStorage.getItem("dpod-token"))
        const response = await axios.delete(`${process.env.REACT_APP_OAUTH_SERVER_URL}/firebase/session/delete/${sessionId}`, {
            headers: { Authorization: `Bearer ${JwtToken}` }
        })
        return response
    }

}
const AmeyaAuthApi = new AmeyaAuthService()
export default AmeyaAuthApi;
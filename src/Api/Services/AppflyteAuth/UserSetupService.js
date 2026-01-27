import axios from "axios";

class AmeyaAuthService {

    user_setup = async (user_id, user_name, document_type, organization_id, jwtToken) => {
        const schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID;
        const JwtToken = JSON.parse(localStorage.getItem("dpod-token"))
        const response = await axios.get(`${process.env.REACT_APP_OAUTH_SERVER_URL}/setup_user/${schema_id}/${user_id}/${encodeURIComponent(user_name)}/${encodeURIComponent(document_type)}/${organization_id}`, {
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
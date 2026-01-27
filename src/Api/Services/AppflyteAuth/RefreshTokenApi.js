import { jwtDecode } from "jwt-decode";
import { fetchSubscriptionId } from "../../../utils/GetAccountDetails";


class AuthService {

    constructor() {
        this.subscriptionId = null
    }

    async initialize() {
        this.subscriptionId = await fetchSubscriptionId();
    }

    getRefreshToken = async (refreshtoken) => {
        await this.initialize();
        const jwtIdToken = JSON.parse(localStorage.getItem('dpod-token'))
        const decoded_token = jwtDecode(jwtIdToken)
        const auth_server_url = process.env.REACT_APP_OAUTH_SERVER_URL.replace(/\/$/, '');
        const user_id = decoded_token?.user_id ?? null;
        const response = await fetch(`${auth_server_url}/refresh/${this.subscriptionId}/${decoded_token.provider}/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/${user_id}?refresh_token=${refreshtoken}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        return response
    }


}
const RefreshTokenApi = new AuthService()
export default RefreshTokenApi;
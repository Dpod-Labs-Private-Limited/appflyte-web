import { fetchSubscriptionId } from "../../../utils/GetAccountDetails";
import axios from "axios";


class AmeyaAuthService {

    constructor() {
        this.subscriptionId = null
    }

    async initialize() {
        this.subscriptionId = await fetchSubscriptionId();
    }

    getTokens = async (refresh_token, provider) => {
        await this.initialize();
        const response = await axios.get(`${process.env.REACT_APP_OAUTH_SERVER_URL}/ameya_service/refresh/token/${this.subscriptionId}/${provider}?refresh_token=${refresh_token}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        return response
    }

    getFoldersDetails = async (reqObj, drive_type) => {
        await this.initialize();
        const response = await axios.post(`${process.env.REACT_APP_OAUTH_SERVER_URL}/ameya_service/${drive_type}/folders`, reqObj, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response;
    }

    getOnedriveFolderPath = async (reqObj) => {
        await this.initialize();
        const response = await axios.post(`${process.env.REACT_APP_OAUTH_SERVER_URL}/ameya_service/onedrive/folder-path`, reqObj, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response;
    }

    getGoogleDriveFolderPath = async (reqObj) => {
        await this.initialize();
        const response = await axios.post(`${process.env.REACT_APP_OAUTH_SERVER_URL}/ameya_service/gdrive/folder-path`, reqObj, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response;
    }

}
const AmeyaAuthApi = new AmeyaAuthService()
export default AmeyaAuthApi;
import axios from "axios";
import CryptoJS from 'crypto-js';

const fetchOrganizationId = () => {
    try {
        const SECRET_KEY = 'dpod-ameya-web-app-v.1.0';
        const stored = sessionStorage.getItem('selected_organization');
        const { encryptedData, hash } = JSON.parse(stored);
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decrypted;
    } catch (error) {
        console.log(error)
        return null
    }
}

const AxiosObj = axios.create({
    baseURL: `${process.env.REACT_APP_APPFLYTE_BACKEND_URL}/appflyte`,
    responseType: "json"
})

const AxiosObjCollection = axios.create({
    // baseURL: process.env.REACT_APP_COLLECTION_API_BASE_URL,
    // baseURL: "https://api-dev.appflyte.net",
    baseURL: "http://localhost:8003/appflyte",
    responseType: "json"
})

const AxiosObjBaseCollection = axios.create({
    // baseURL: process.env.REACT_APP_COLLECTION_API_BASE_URL,
    // baseURL: "https://api-dev.appflyte.net",
    baseURL: "http://localhost:8003",
    responseType: "json"
})

const requestHandler = async (request) => {
    const organization_data = fetchOrganizationId()
    const organization_id = organization_data?.payload?.__auto_id__ ?? null;
    const JwtToken = JSON.parse(localStorage.getItem("dpod-token"))
    request.headers['Authorization'] = `Bearer appflyte_${organization_id}_${JwtToken}`;
    request.headers['Content-Type'] = 'application/json';
    return request
}

AxiosObj.interceptors.request.use(request => requestHandler(request));
AxiosObjCollection.interceptors.request.use(request => requestHandler(request));
AxiosObjBaseCollection.interceptors.request.use(request => requestHandler(request));
export { AxiosObj, AxiosObjCollection, AxiosObjBaseCollection };


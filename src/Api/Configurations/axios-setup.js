import axios from "axios";

const AxiosObj = axios.create({
    baseURL: process.env.REACT_APP_APPFLYTE_BACKEND_URL,
    responseType: "json"
})

const AxiosObjCollection = axios.create({
    // baseURL: process.env.REACT_APP_COLLECTION_API_BASE_URL,
    // baseURL: "https://api-dev.appflyte.net",
    baseURL: "http://localhost:8003",
    responseType: "json"
})

const requestHandler = async (request) => {
    const JwtToken = JSON.parse(localStorage.getItem("dpod-token"))
    request.headers['Authorization'] = `Bearer ${JwtToken}`;
    request.headers['Content-Type'] = 'application/json';
    return request
}

AxiosObj.interceptors.request.use(request => requestHandler(request));
AxiosObjCollection.interceptors.request.use(request => requestHandler(request));
export { AxiosObj, AxiosObjCollection };


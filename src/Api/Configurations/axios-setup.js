import axios from "axios";

const AxiosObj = axios.create(
    {
        baseURL: process.env.REACT_APP_APPFLYTE_BACKEND_URL,
        responseType: "json"
    }
)

const requestHandler = async (request) => {
    const JwtToken = JSON.parse(localStorage.getItem("dpod-token"))
    request.headers['Authorization'] = `Bearer ${JwtToken}`;
    request.headers['Content-Type'] = 'application/json';
    return request
}

AxiosObj.interceptors.request.use(request => requestHandler(request));
export { AxiosObj };


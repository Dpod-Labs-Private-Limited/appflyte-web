import { jwtDecode } from "jwt-decode";
import HmacSHA256 from "crypto-js/hmac-sha256";
import Hex from "crypto-js/enc-hex";

const SECRET_KEY = "DPOD_AMEYA_2.0_AUTH_KEY";

export const formatLabel = (label) => {
    if (typeof label !== 'string') return '';
    return label.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export const checkProject = async (project_id) => {
    try {
        const service_token = JSON.parse(localStorage.getItem('service-agent-user-token')) ?? null;
        if (service_token) {
            const token = jwtDecode(service_token);
            const token_project_id = token?.project_id ?? null;
            if (token_project_id === project_id) {
                return;
            } else {
                localStorage.removeItem("service-agent-user-token")
                localStorage.removeItem("agent-user-token")
                localStorage.removeItem("analytics_base_url")
            }
            return
        }
        return
    } catch (error) {
        console.log(error)
    }
}

export function decodeParamToken(fileId, documentType) {
    const data = `${fileId}${documentType}`;
    const token = HmacSHA256(data, SECRET_KEY).toString(Hex);
    return token;
}

export async function lowercaseStrings(jsonInput) {
    const processValue = (value) => {
        if (typeof value === 'string') {
            return value.toLowerCase();
        }
        if (Array.isArray(value)) {
            return value.map(item => processValue(item));
        }
        if (typeof value === 'object' && value !== null) {
            return processObject(value);
        }
        return value;
    };

    const processObject = (obj) => {
        const result = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                result[key] = processValue(obj[key]);
            }
        }
        return result;
    };

    return processObject(jsonInput);
}

export const UTIL_CONFIG = {
    EXT_USER_TYPE: "external_appflyte_user",
    STRIPE_REQUEST: "external_stripe",
    USER_REQUEST: "external_user",
    SUPPORTED_SERVICES: ["ddl", "dml"],
    SUPPORTED_BILLING_PERIODS: ["monthly", "yearly"],
    DDL_SERVICE: "ddl",
    DML_SERVICE: "dml",

    AUTH_TYPE: "external_auth",
    EXT_USER_SIGNIN: "ext_user_signin",
    EXT_USER_SIGNUP: "ext_user_signup",
    EXTERNAL_APPFLYTE_AUTH: "external_appflyte_auth",
    EXTERNAL_APPFLYTE_USER: "external_appflyte_user",
    EXTERNAL_APPFLYTE_STRIPE: "external_appflyte_stripe",
    EXT_USER: "external_user",
    DIRECT_USER: "direct_user",
    APPFLYTE_AGENT: "appflyte_agent",
    SERVICE_DDL: "ddl",
};
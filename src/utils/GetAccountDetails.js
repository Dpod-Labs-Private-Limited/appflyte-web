import { jwtDecode } from "jwt-decode";
import { getSessionData } from "./sessionDataHandle";
import agentApiTokenManager from "./AgentApiToken/getAgentAdminToken";

export const fetchOrganizationId = () => {
    try {
        const dpod_token = JSON.parse(localStorage.getItem('dpod-token'));
        if (dpod_token) {
            const decoded_dpod_token = jwtDecode(dpod_token);
            return decoded_dpod_token?.organizations ? decoded_dpod_token?.organizations : [];
        } else {
            console.warn('Organization ID not found.');
            return [];
        }
    } catch (error) {
        console.warn(error)
        return []
    }
};

export const fetchAccountId = async () => {
    try {
        const dpod_token = JSON.parse(localStorage.getItem('dpod-token'));
        if (dpod_token) {
            const decoded_dpod_token = jwtDecode(dpod_token);
            return decoded_dpod_token?.root_account_id ? decoded_dpod_token?.root_account_id : null
        } else {
            console.warn('Account ID not found.');
            return null;
        }
    } catch (error) {
        console.warn(error)
        return null
    }
};

export const fetchSubscriberId = async () => {
    try {
        const dpod_token = JSON.parse(localStorage.getItem('dpod-token'));
        if (dpod_token) {
            const decoded_dpod_token = jwtDecode(dpod_token);
            return decoded_dpod_token?.subscriber_id ? decoded_dpod_token?.subscriber_id : null
        } else {
            console.warn('subscriber_id ID not found.');
            return null;
        }
    } catch (error) {
        console.warn(error)
        return null
    }
};

export const fetchSubscriptionId = async () => {
    try {
        const dpod_token = JSON.parse(localStorage.getItem('dpod-token'));
        if (dpod_token) {
            const decoded_dpod_token = jwtDecode(dpod_token);
            return decoded_dpod_token?.subscription_id ? decoded_dpod_token?.subscription_id : null
        } else {
            console.warn('subscription_id not found.');
            return null;
        }
    } catch (error) {
        console.warn(error)
        return null
    }
};

export const fetchOwnerByOrganization = async (organization_id) => {
    try {

        const dpod_token = JSON.parse(localStorage.getItem('dpod-token'));
        if (!dpod_token) {
            console.warn('Data not found.');
            return false;
        }

        const decoded_dpod_token = jwtDecode(dpod_token);
        const organization_owners = decoded_dpod_token?.organization_owners ? decoded_dpod_token?.organization_owners : {}
        return !!organization_owners[organization_id];

    } catch (error) {
        console.warn(error);
        return false;
    }
};

export const fetchUserId = async () => {
    try {
        const dpod_token = JSON.parse(localStorage.getItem('dpod-token'));
        if (dpod_token) {
            const decoded_dpod_token = jwtDecode(dpod_token);
            return decoded_dpod_token?.sub ? decoded_dpod_token?.sub : null
        } else {
            console.warn('user_Id not found.');
            return null;
        }
    } catch (error) {
        console.warn(error)
        return null
    }
};

export const getUserInitials = () => {
    try {
        const name = JSON.parse(localStorage.getItem('UserName'));
        if (!name) return "";
        const words = name.trim().split(" ");
        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
        }
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    } catch (error) {
        console.log(error)
    }
};

export const getUserName = () => {
    try {
        const name = JSON.parse(localStorage.getItem('UserName'));
        if (!name) return "";
        return name
    } catch (error) {
        console.log(error)
    }
};

export const getUserItemId = async () => {
    try {
        const dpod_token = JSON.parse(localStorage.getItem('dpod-token'));
        if (dpod_token) {
            const decoded_dpod_token = jwtDecode(dpod_token);
            return decoded_dpod_token?.user_id ? decoded_dpod_token?.user_id : null
        } else {
            console.warn('user_Id not found.');
            return null;
        }
    } catch (error) {
        console.warn(error)
        return null
    }
};

export const fetchThirdPartyToken = async () => {
    try {
        const dpod_token = JSON.parse(localStorage.getItem('dpod-token'));
        if (dpod_token) {
            const decoded_dpod_token = jwtDecode(dpod_token);
            return decoded_dpod_token?.third_party_token ? decoded_dpod_token?.third_party_token : null
        } else {
            console.warn('third_party_token not found.');
            return null;
        }
    } catch (error) {
        console.warn(error)
        return null
    }
};

export const fetchThirdPartyTokenProvider = async () => {
    try {
        const dpod_token = JSON.parse(localStorage.getItem('dpod-token'));
        if (dpod_token) {
            const decoded_dpod_token = jwtDecode(dpod_token);
            return decoded_dpod_token?.provider ?? null;
        } else {
            console.warn('third_party_token provider not found.');
            return null;
        }
    } catch (error) {
        console.warn(error)
        return null
    }
};

export const fetchAppflyteSchemaId = async () => {
    try {
        const schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
        return schema_id
    } catch (error) {
        console.log(error)
        return error
    }
}

export const getAgentApiToken = async () => {
    try {
        const currentProject = getSessionData("selected_project")
        if (currentProject) {
            const token = await agentApiTokenManager.getAgentAdminToken();
            return token ?? null
        }
        return null
    } catch (error) {
        console.log(error)
    }
}

export const fetchUserEmail = async () => {
    try {
        const dpod_token = JSON.parse(localStorage.getItem('dpod-token'));
        if (dpod_token) {
            const decoded_dpod_token = jwtDecode(dpod_token);
            const provider = decoded_dpod_token?.provider ?? null;
            const third_party_token = decoded_dpod_token?.third_party_token ? decoded_dpod_token?.third_party_token : null;
            const decoded_third_party_token = jwtDecode(third_party_token);
            const email = provider === "google"
                ? decoded_third_party_token?.email
                : provider === "azure"
                    ? decoded_third_party_token?.unique_name
                    : null;
            return email;
        } else {
            console.warn('third_party_token not found.');
            return null;
        }
    } catch (error) {
        console.warn(error)
        return null
    }
};
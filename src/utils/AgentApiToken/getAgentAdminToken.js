import store from '../../Redux/store/store';
import moment from 'moment';
import { jwtDecode } from 'jwt-decode';

import {
    mergeFunctionEventTypeData, restructureEngineFunctions,
    mergeEngineFunctionData, transformEngineData,
    getUserRoleId
} from "./TokenUtilityService";

import { setAgentApiTokenState } from "../../Redux/slice/dataSlice";
import { setAgentApiTokenAdded } from "../../Redux/slice/newDataSlice";

import AgentApiToken from "../../Api/Services/AppflyteBackend/AgentApiToken";
import { fetchUserId, getUserName } from "../GetAccountDetails";
import getAgentApiTokenData from "../ApiFunctions/AgentAPiTokenData";
import TokenContextsDetails from './getTokenContext';
import { getSessionData } from '../sessionDataHandle';

class AgentApiTokenManager {

    constructor() {
        this.dispatch = store.dispatch;
        this.getState = store.getState;
        this.tokenContextManager = new TokenContextsDetails();
    }

    isTokenExpiring(token) {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);
            return decodedToken.exp - currentTime <= 600;
        } catch (error) {
            console.error("Invalid token:", error);
            return false;
        }
    }

    async fetchAgentTokens() {
        const state = this.getState();
        const allAgentApiTokens = state.all_data.agent_api_tokens;
        const agentApiTokenAdded = state.data_added.agent_api_token_added;

        if (allAgentApiTokens?.length && !agentApiTokenAdded) {
            return allAgentApiTokens;
        }

        const response = await getAgentApiTokenData();
        this.dispatch(setAgentApiTokenState(response));
        this.dispatch(setAgentApiTokenAdded(false));
        return response;
    }

    async fetchExistingToken() {
        try {
            const agentTokens = await this.fetchAgentTokens();
            const selectedProject = getSessionData("selected_project");
            const projectId = selectedProject?.payload?.__auto_id__;
            return agentTokens?.find(token => token?.payload?.project_id === projectId) || null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getCurrentProjectTokenDetails(current_project_id) {
        try {
            const selectedProject = getSessionData("selected_project");
            const projectId = selectedProject?.payload?.__auto_id__;
            if (projectId === current_project_id) {
                return projectId
            }
            return null
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async isTokenValidForProject(current_project_id) {
        try {
            const selectedProject = getSessionData("selected_project");
            if (selectedProject === current_project_id) {
                return current_project_id
            }
            return null
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getPermittedData(engineDetails) {
        return engineDetails?.map(item => ({
            id: item?.id,
            name: item?.name,
            event_types: item?.functionEvents?.map(subitem => ({
                id: subitem?.id,
                name: subitem?.name
            })) || [],
            sub_functions: item?.subFunctions?.map(subitem => ({
                id: subitem?.id,
                name: subitem?.name,
                event_types: subitem?.subFunctionEvents?.map(subsubitem => ({
                    id: subsubitem?.id,
                    name: subsubitem?.name
                })) || []
            })) || []
        })) || [];
    }

    async getAllTokenContextData() {
        return this.tokenContextManager.getAllTokenContextData();
    }

    async fetchUserData() {
        try {
            const { roles, engines, functions, eventTypes } = await agentApiTokenManager.getAllTokenContextData();
            const selectedProject = getSessionData("selected_project");
            const currentEngineId = selectedProject?.payload?.lookup_id?.[0];
            const filteredEngines = engines?.filter(engine => engine?.payload?.__auto_id__ === currentEngineId);
            const mergedFunctionData = await mergeFunctionEventTypeData(functions, eventTypes);
            const restructuredFunctions = await restructureEngineFunctions(mergedFunctionData);
            const mergedEngineData = await mergeEngineFunctionData(filteredEngines, restructuredFunctions);
            const transformedData = await transformEngineData(mergedEngineData?.[0] || []);
            const userRoleId = await getUserRoleId(roles, 'Admin')
            return { user_role_id: userRoleId, user_permissions: this.getPermittedData(transformedData) }
        } catch (error) {
            console.error(error);
            return { user_role_id: null, user_permissions: [] }
        }
    }

    async createToken() {
        try {
            const userData = await this.fetchUserData();
            const selectedOrganization = getSessionData("selected_organization");
            const selectedService = getSessionData("selected_service");
            const selectedSpace = getSessionData("selected_space");
            const selectedProject = getSessionData("selected_project");
            const userName = getUserName();
            const userId = await fetchUserId();
            const requestPayload = {
                organization_id: selectedOrganization?.payload?.__auto_id__,
                service_id: selectedService?.payload?.__auto_id__,
                workspace_id: selectedSpace?.payload?.__auto_id__,
                project_id: selectedProject?.payload?.__auto_id__,
                user_id: userId,
                user_role: userData.user_role_id,
                engine_type: selectedProject?.payload?.configuration?.engine_name,
                name: selectedProject?.payload?.configuration?.engine_name,
                owned_by: userName,
                permissions: "all",
                resource_type_data: userData.user_permissions,
                token_type: "admin_auto_token",
                exp: moment().add(1, "years").unix()
            };
            const response = await AgentApiToken.createAgentApiToken(JSON.stringify(requestPayload));
            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async deleteToken(tokenId) {
        try {
            return await AgentApiToken.deleteToken(tokenId);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getAgentAdminToken() {
        const storedToken = JSON.parse(localStorage.getItem("agent-api-token"));

        if (storedToken?.tokenId && storedToken?.token) {
            const decoded_token = jwtDecode(storedToken?.token)
            if (this.isTokenExpiring(storedToken.token)) {
                const currentToken = await this.getCurrentProjectTokenDetails(decoded_token?.project_id);
                if (currentToken) {
                    await this.deleteToken(storedToken?.tokenId);
                }
                const newTokenResponse = await this.createToken();
                if (newTokenResponse?.status === 200) {
                    const newTokenData = newTokenResponse.data;
                    const newToken = {
                        tokenId: newTokenData.__auto_id__,
                        token: newTokenData.agent_api_token
                    };
                    localStorage.setItem("agent-api-token", JSON.stringify(newToken));
                    this.dispatch(setAgentApiTokenAdded(true));
                    return newTokenData.__auto_id__;
                }
                return null;
            }

            const isValidForProject = await this.isTokenValidForProject(decoded_token?.project_id);
            if (isValidForProject) return storedToken.tokenId;
        }

        const currentToken = await this.fetchExistingToken();
        if (currentToken?.payload?.token && this.isTokenExpiring(currentToken.payload.token)) {
            await this.deleteToken(currentToken?.payload?.__auto_id__);
            const newTokenResponse = await this.createToken();
            if (newTokenResponse?.status === 200) {
                const newTokenData = newTokenResponse.data;
                const newToken = {
                    tokenId: newTokenData.__auto_id__,
                    token: newTokenData.agent_api_token
                };
                localStorage.setItem("agent-api-token", JSON.stringify(newToken));
                this.dispatch(setAgentApiTokenAdded(true));
                return newTokenData.__auto_id__;
            }
            return null;
        }

        if (currentToken) {
            const newToken = {
                tokenId: currentToken?.payload?.__auto_id__,
                token: currentToken?.payload?.token
            };
            localStorage.setItem("agent-api-token", JSON.stringify(newToken));
            return currentToken?.payload?.__auto_id__;
        }

        const newTokenResponse = await this.createToken();
        if (newTokenResponse?.status === 200) {
            const newTokenData = newTokenResponse.data;
            const newToken = {
                tokenId: newTokenData.__auto_id__,
                token: newTokenData.agent_api_token
            };
            localStorage.setItem("agent-api-token", JSON.stringify(newToken));
            this.dispatch(setAgentApiTokenAdded(true));
            return newTokenData.__auto_id__;
        }

        return null;
    }

}
const agentApiTokenManager = new AgentApiTokenManager();

export default agentApiTokenManager;

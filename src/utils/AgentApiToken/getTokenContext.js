import store from '../../Redux/store/store';
import { setAppflyteEngineState, setAppflyteFunctionState, setAppflyteEventTypesState, setUserRoleState } from "../../Redux/slice/dataSlice";

import getAppflyteEnginesData from '../ApiFunctions/AppflyteEngines';
import getAppflyteFunctionsData from '../ApiFunctions/AppflyteFunctions';
import getAppflyteEventTypesData from '../ApiFunctions/AppflyteEventTypes';
import getUserRoles from '../ApiFunctions/UserRoles';

class TokenContextsDetails {
    constructor() {
        this.dispatch = store.dispatch;
        this.getState = store.getState;
    }

    get userRoles() {
        return this.getState().all_data.user_roles;
    }

    get appflyteEngines() {
        return this.getState().all_data.appflyte_engines;
    }

    get appflyteFunctions() {
        return this.getState().all_data.appflyte_functions;
    }

    get appflyteEventTypes() {
        return this.getState().all_data.appflyte_event_types;
    }

    async getAllUserRoles() {
        if (this.userRoles?.length > 0) {
            return this.userRoles;
        }
        const response = await getUserRoles();
        this.dispatch(setUserRoleState(response));
        return response;
    }

    async getAllEngines() {
        if (this.appflyteEngines?.length > 0) {
            return this.appflyteEngines;
        }
        const response = await getAppflyteEnginesData();
        this.dispatch(setAppflyteEngineState(response));
        return response;
    }

    async getAllFunctions() {
        if (this.appflyteFunctions?.length > 0) {
            return this.appflyteFunctions;
        }
        const response = await getAppflyteFunctionsData();
        this.dispatch(setAppflyteFunctionState(response));
        return response;
    }

    async getAllEventTypes() {
        if (this.appflyteEventTypes?.length > 0) {
            return this.appflyteEventTypes;
        }
        const response = await getAppflyteEventTypesData();
        this.dispatch(setAppflyteEventTypesState(response));
        return response;
    }

    async getAllTokenContextData() {
        try {
            const [rolesReponse, engineResponse, functionsResponse, eventTypesResponse] = await Promise.all([
                this.getAllUserRoles(),
                this.getAllEngines(),
                this.getAllFunctions(),
                this.getAllEventTypes(),
            ]);

            if (rolesReponse && eventTypesResponse && functionsResponse && engineResponse) {
                return {
                    roles: rolesReponse?.length > 0 ? rolesReponse : [],
                    engines: engineResponse?.length > 0 ? engineResponse : [],
                    functions: functionsResponse?.length > 0 ? functionsResponse : [],
                    eventTypes: eventTypesResponse?.length > 0 ? eventTypesResponse : [],
                };
            }
            return { roles: [], engines: [], functions: [], eventTypes: [] };
        } catch (error) {
            console.error(error);
            return { roles: [], engines: [], functions: [], eventTypes: [] };
        }
    }
}

export default TokenContextsDetails;

import allDataReducer from "../slice/dataSlice";
import newDataReducer from "../slice/newDataSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

const appReducer = combineReducers({
    all_data: allDataReducer,
    data_added: newDataReducer,
});

const rootReducer = (state, action) => {
    if (action.type === 'RESET_ALL') {
        state = undefined;
    }
    return appReducer(state, action);
};

const store = configureStore({
    reducer: rootReducer,
});

export default store;

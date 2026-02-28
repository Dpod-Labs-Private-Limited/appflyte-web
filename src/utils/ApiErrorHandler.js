import { tostAlert } from "./AlertToast"

const handleErrorCode = (code) => {
    switch (code) {
        case "INSUFFICIENT_PROJECT_BALANCE":
            return "You don’t have enough project balance to create a new project. Please upgrade your plan.";

        case "API_LIMIT_EXCEEDED":
            return "Your API call limit has been reached. Please upgrade your plan.";

        case "PLAN_NOT_INITIALIZED":
            return "Your subscription is not properly configured. Please contact support.";

        default:
            return code || "Something went wrong. Please try again.";
    }
};

export const apiErrorHandler = (err) => {
    if (err?.response?.data) {

        const data = err.response.data;

        if (data === null) {
            tostAlert('Something went wrong while fetching files', 'error');
            return;
        }

        if ("schema_errors" in data) {
            tostAlert('Please check all fields and retry', 'error');
            return;
        }

        if ("message" in data) {
            const message = data.message;
            tostAlert(handleErrorCode(message), 'error');
            return;
        }

        tostAlert('Something went wrong while fetching data', 'error');
    }
    else if (err.message === "Network Error") {
        tostAlert('Network error. Please check your connection.', 'error');
    }
};
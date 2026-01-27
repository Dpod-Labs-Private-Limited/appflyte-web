import { tostAlert } from "./AlertToast"


const handleErrorCode = (err) => {
    switch (err.code) {
        default:
            return err.message
    }
}

export const apiErrorHandler = (err) => {
    if (err.response !== undefined && err.response !== null) {

        if (err.response.data === null)
            tostAlert('Something went wrong while fetching files', 'error')

        else if ("schema_errors" in err.response.data)
            tostAlert('Please check all fields and retry', 'error')

        else if ("message" in err.response.data) {
            if (typeof err.response.data.message === 'object' && "code" in err.response.data.message)
                tostAlert(handleErrorCode(err.response.data.message), 'error')
            else
                tostAlert(err.response.data.message, 'error')
        }

        else
            tostAlert('Something went wrong while Fetching Data', 'error')
    }
    else {
        if (err.message === "Network Error")
            tostAlert('Something went wrong while Fetching Data', 'error')
    }
}
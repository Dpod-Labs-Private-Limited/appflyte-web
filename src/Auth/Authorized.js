import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';

function Authorized() {
    const location = useLocation()

    useEffect(() => {
        try {
            const queryParams = new URLSearchParams(location.search);
            const paramsObject = {};
            for (const [key, value] of queryParams.entries()) {
                paramsObject[key] = value;
            }
            if (window.opener) {
                window.opener.postMessage(
                    {
                        type: "login-success",
                        queryParams: paramsObject,
                    },
                    "*"
                );
            }
            window.close();
        }
        catch (err) {
            console.log(err)
        }
    }, [location]);

    return null;
}

export default Authorized;



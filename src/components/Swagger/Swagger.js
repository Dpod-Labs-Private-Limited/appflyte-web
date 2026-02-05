import React from 'react';
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import jsonSpec from "./Swagger.json"; // Import the local JSON file

function Swagger() {
    return (
        <div>
            <SwaggerUI
                url='http://localhost:4444/openapi.json'
                // spec={jsonSpec}
                deepLinking={true}
                docExpansion="none"
                defaultModelsExpandDepth={-1}
                defaultModelExpandDepth={1}
                layout="BaseLayout"
                showExtensions={true}
                showCommonExtensions={true}
            />
        </div>
    );
}

export default Swagger;

// deepLinking={true}
// layout="BaseLayout"
// showExtensions={true}
// showCommonExtensions={true}
// oauth2RedirectUrl={`${window.location.origin}/docs/oauth2-redirect`} // Adjust if necessary

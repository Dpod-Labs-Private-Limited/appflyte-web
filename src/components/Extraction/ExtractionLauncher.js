import { Button } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ExtractionLauncher = () => {
    const iframeRef = useRef(null);
    const navigate = useNavigate();

    const theme = {
        palette: {
            mode: "light",
            primary: {
                main: "#FFFFFF",

            },
            secondary: {
                main: '#F3F5F7'
            },
            action: {
                main: "#0B51C5",

            },
            actionSecondary: {
                main: "#DEDEDE",
            },
        },
        typography: {
            fontFamily: 'Inter',
            h1: {
                fontSize: "16px",
                fontWeight: 600
            },
            h2: {
                fontSize: '15px',
                fontWeight: 600
            },
            h3: {
                fontSize: '14px',
                fontWeight: 600,
            },
            h4: {
                fontSize: '14px',
                fontWeight: 500,
            },
            h5: {
                fontSize: '14px',
                fontWeight: 400,
            },
            h6: {
                fontSize: '12px',
                fontWeight: 400,
            },
        },
    }

    // const config = {
    //     appflyte_backend_url: "https://appflyte-backend.smartfoodsafe.net",
    //     appflyte_agent_token_id: "c4d21960-3306-4728-8b08-78fe7d342c68",
    //     appflyte_workspace_id: "d34c6f1e-9f38-4d94-90d9-b9ba8687195b",
    //     appflyte_project_id: "a136e782-1ed6-40ae-9283-87d0199d0b0d",
    // };

    const config = {
        appflyte_backend_url: "https://appflyte-backend.smartfoodsafe.net",
        appflyte_agent_token_id: "3f27506e-7616-44be-b494-4bf6bd303882",
        appflyte_workspace_id: "b346da74-7163-4122-bb40-9faa4a126cdb",
        appflyte_project_id: "4decf50f-605e-46d8-8d2c-f11dd82f6fd4",
        origin_web_url: 'http://localhost:3000'
    };

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) return;

        iframeDoc.open();
        iframeDoc.write("<html><head></head><body></body></html>");
        iframeDoc.close();

        const link = iframeDoc.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";
        iframeDoc.head.appendChild(link);

        const script = iframeDoc.createElement("script");
        script.src = "https://ameya-extraction-plugin.ameya.ai";


        script.onload = () => {
            iframe.contentWindow.AmeyaExtraction.DOCTYPES(theme, config);
            iframe.contentWindow.AmeyaExtraction.CONNECTORS(theme, config);
            iframe.contentWindow.AmeyaExtraction.TASKS(theme, config);
        };

        script.onerror = () => {
            alert("Failed to load AmeyaExtraction, please try again");
        };

        iframeDoc.head.appendChild(script);
    }, [navigate]);



    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <iframe
                ref={iframeRef}
                title="Ameya Extraction"
                style={{ width: "100%", height: "100vh" }}
            />
        </div>
    );
};

export default ExtractionLauncher
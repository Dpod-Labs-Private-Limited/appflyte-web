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

    const config = {
        appflyte_backend_url: "https://appflyte-backend.smartfoodsafe.net",
        appflyte_agent_token_id: "",
        appflyte_workspace_id: "",
        appflyte_project_id: "",
        origin_web_url: ''
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
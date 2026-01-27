import { Button } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ExtractionLauncher = () => {
    const iframeRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        handleClick()
    }, [])

    const handleClick = () => {

        const config = {
            appflyte_backend_url: "https://appflyte-backend.smartfoodsafe.net",
            appflyte_agent_api_token: "c4d21960-3306-4728-8b08-78fe7d342c68",
            appflyte_project_id: "a136e782-1ed6-40ae-9283-87d0199d0b0d",
            extraction_task_id: "b64924d1-bc91-494c-b317-21d6bc09fa9e"
        };


        const theme = {
            palette: {
                primary: { main: '#F3F5F7' },
                secondary: { main: '#ffffff' },
                background: { default: '#F3F5F7', paper: '#ffffff' },
                text: { primary: '#000000' },
            },
            customColors: {
                button: {
                    primary: '#0B51C5',
                    secondary: '#DEDEDE',
                    ternary: '#000000',
                },
                ternary: { main: '#DEDEDE', contrastText: '#000' },
            },
            typography: { fontFamily: 'Inter' },
        };

        const iframeDoc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
        if (!iframeDoc) return;

        iframeDoc.open();
        iframeDoc.write("<html><head></head><body></body></html>");
        iframeDoc.close();

        const script = iframeDoc.createElement("script");
        script.src = "https://ameya-extraction.ameya.ai";

        script.onload = () => {
            config.onCancel = () => {
                iframeDoc.body.innerHTML = "";
                navigate("/")
            };
            iframeRef.current.contentWindow.AmeyaExtraction(theme, config);
        };

        script.onerror = () => {
            alert("Failed to load AmeyaExtraction, please try again");
        };

        iframeDoc.head.appendChild(script);
    };


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

export default ExtractionLauncher;

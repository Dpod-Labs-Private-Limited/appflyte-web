import React, { useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom";

function SFSExtractionPanel() {
    const iframeRef = useRef(null);
    const navigate = useNavigate();

    const onCancel = () => {
        navigate("/organizations")
    }

    // useEffect(() => {

    //     // local-dev
    //     const appflyte_backend_url = "https://api-dev.appflyte.net"
    //     const organization_id = "47c2f395-db41-42a7-8b8b-2857845118f1";
    //     const workspace_id = "23347704-bf90-4e47-9ebe-5622757a729e";
    //     const project_id = "4f58b8e9-da09-48b6-9af4-fe3ce657373c";
    //     const agent_token_id = "4ec5248b-f0c5-4372-83e8-770f17917edd"

    //     const iframeconfig = {
    //         appflyte_backend_url: appflyte_backend_url,
    //         appflyte_organization_id: organization_id,
    //         appflyte_workspace_id: workspace_id,
    //         appflyte_project_id: project_id,
    //         appflyte_agent_token_id: agent_token_id,
    //         origin_web_url: 'http://localhost:5173'
    //     };

    //     const theme = {
    //         palette: {
    //             primary: { main: '#F3F5F7' },
    //             secondary: { main: '#ffffff' },
    //             background: { default: '#F3F5F7', paper: '#ffffff' },
    //             text: { primary: '#000000' },
    //         },
    //         customColors: {
    //             button: {
    //                 primary: '#0B51C5',
    //                 secondary: '#DEDEDE',
    //                 ternary: '#000000',
    //             },
    //             ternary: { main: '#DEDEDE', contrastText: '#000' },
    //         },
    //         typography: { fontFamily: 'Inter' },
    //     };

    //     const iframeDoc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
    //     if (!iframeDoc) return;

    //     iframeDoc.open();
    //     iframeDoc.write("<html><head></head><body></body></html>");
    //     iframeDoc.close();

    //     const link = iframeDoc.createElement("link");
    //     link.rel = "stylesheet";
    //     link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";
    //     iframeDoc.head.appendChild(link);

    //     const script = iframeDoc.createElement("script");
    //     // script.src = 'https://ameya-extraction.ameya.ai';
    //     script.src = 'https://ameyachatbotsettingsconfig.s3.us-east-1.amazonaws.com/extractionplugin/local-qat/ameya-extraction.js'

    //     script.onload = () => {
    //         iframeconfig.onCancel = () => {
    //             iframeDoc.body.innerHTML = "";
    //             onCancel(false);
    //         };
    //         iframeRef.current.contentWindow.AmeyaExtraction(theme, iframeconfig);
    //     };

    //     script.onerror = () => {
    //         alert("Failed to load AmeyaExtraction, please try again");
    //     };

    //     iframeDoc.head.appendChild(script);
    // }, [])

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
        appflyte_backend_url: "https://api-dev.appflyte.net",
        appflyte_agent_token_id: "4ec5248b-f0c5-4372-83e8-770f17917edd",
        appflyte_organization_id: "47c2f395-db41-42a7-8b8b-2857845118f1",
        appflyte_workspace_id: "23347704-bf90-4e47-9ebe-5622757a729e",
        appflyte_project_id: "4f58b8e9-da09-48b6-9af4-fe3ce657373c",
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
        // script.src = "https://ameya-extraction-plugin.ameya.ai";
        script.src = 'https://ameyachatbotsettingsconfig.s3.us-east-1.amazonaws.com/extractionplugin/local-qat/ameya-extraction.js'


        script.onload = () => {
            // iframe.contentWindow.AmeyaExtraction.DOCTYPES(theme, config);
            iframe.contentWindow.AmeyaExtraction.CONNECTORS(theme, config);
            // iframe.contentWindow.AmeyaExtraction.TASKS(theme, config);
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
    )
}
export default SFSExtractionPanel;
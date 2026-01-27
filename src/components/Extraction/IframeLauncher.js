import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ExtractionLauncher = () => {
    const iframeRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // const config = {
        //     appflyte_backend_url: "https://api-dev.appflyte.net",
        //     appflyte_agent_api_token: "80236a44-2f80-44be-b3c6-3e2a8a1107c9",
        //     appflyte_project_id: "4f58b8e9-da09-48b6-9af4-fe3ce657373c",
        //     extraction_task_id: "0e237e8d-118e-40ba-b27f-2a4c3bd6e325",
        //     onCancel: () => navigate("/"),
        //     onSave: () => navigate("/")
        // };

        // sfs-qa
        // const config = {
        //     appflyte_backend_url: "https://appflyte-backend.smartfoodsafe.net",
        //     appflyte_agent_api_token: "c4d21960-3306-4728-8b08-78fe7d342c68",
        //     appflyte_project_id: "a136e782-1ed6-40ae-9283-87d0199d0b0d",
        //     extraction_task_id: "24838547-8de7-41a5-b003-5c784ef01824",
        //     onCancel: () => navigate("/"),
        //     onSave: () => navigate("/")
        // };

        const config = {
            appflyte_backend_url: "https://appflyte-backend.smartfoodsafe.net",
            appflyte_agent_api_token: "c4d21960-3306-4728-8b08-78fe7d342c68",
            appflyte_project_id: "a136e782-1ed6-40ae-9283-87d0199d0b0d",
            extraction_task_id: "892856c9-ec50-453f-9e26-8a19bd5c9cf9",
            onCancel: () => navigate("/"),
            onSave: () => navigate("/")
        };

        // local-qa
        // const config = {
        //     appflyte_backend_url: "https://appflyte-backend.ameya.ai",
        //     appflyte_agent_api_token: "80236a44-2f80-44be-b3c6-3e2a8a1107c9",
        //     appflyte_project_id: "050c445f-e789-4433-8d92-5c280536dbfe",
        //     extraction_task_id: "1bdd9c37-cc85-491e-b998-527d1fd283a1",
        //     onCancel: () => navigate("/"),
        //     onSave: () => navigate("/")
        // };

        const theme = {
            palette: {
                primary: { main: "#F3F5F7" },
                secondary: { main: "#ffffff" },
                background: { default: "#F3F5F7", paper: "#ffffff" },
                text: { primary: "#000000" },
            },
            customColors: {
                button: { primary: "#0B51C5", secondary: "#DEDEDE", ternary: "#000000" },
                ternary: { main: "#DEDEDE", contrastText: "#000" },
            },
            typography: { fontFamily: "Inter" },
        };

        const iframeDoc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
        if (!iframeDoc) return;

        iframeDoc.open();
        iframeDoc.write("<html><head></head><body></body></html>");
        iframeDoc.close();

        // const link = iframeDoc.createElement("link");
        // link.rel = "stylesheet";
        // link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";
        // iframeDoc.head.appendChild(link);

        const script = iframeDoc.createElement("script");
        script.src = "https://ameya-extraction.ameya.ai"
        // script.src = "https://ameyachatbotsettingsconfig.s3.us-east-1.amazonaws.com/extraction/local-qat/ameya-extraction.js";
        script.async = true;

        script.onload = () => {
            try {
                iframeRef.current.contentWindow.AmeyaExtraction(theme, config);
            } catch (error) {
                console.error("Error calling AmeyaExtraction:", error);
                alert("Failed to initialize AmeyaExtraction, please try again");
            }
        };

        script.onerror = () => {
            alert("Failed to load AmeyaExtraction script, please try again");
        };

        iframeDoc.head.appendChild(script);

        return () => {
            if (iframeDoc.body) {
                iframeDoc.body.innerHTML = "";
            }
        };
    }, [navigate]);

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <iframe
                ref={iframeRef}
                title="Ameya Extraction"
                style={{ width: "100%", height: "100vh" }}
                sandbox="allow-scripts allow-same-origin"
            />
        </div>
    );
};

export default ExtractionLauncher;
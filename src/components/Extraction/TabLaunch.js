import { Button } from "@mui/material";
import React from "react";

const ExtractionLauncher = () => {
    const handleClick = () => {

        const config = {
            appflyte_backend_url: "https://appflyte-backend.ameya.ai",
            appflyte_agent_api_token: "80236a44-2f80-44be-b3c6-3e2a8a1107c9",
            appflyte_project_id: "ae7e5874-edd1-4cbd-8ee6-b85119a29abf",
            extraction_document_type_id: "ae5a87c5-a790-405b-a636-a75f25390125",
            presigned_file_url: "https://uat-216220991922-dpod-asset-icons.s3.amazonaws.com/subscriber/6551f605-39cb-4351-8ea1-b2a7af317985/subscription/a6a49ce0-1121-455c-91cd-7956eb0891dd/account/0aee6bd7-ed42-4184-9bac-ce0466737ada/Pharmascience%20Cannabinoid%20and%20Terpenes%20COA.pdf",
        };

        const theme = {
            palette: {
                primary: {
                    main: '#F3F5F7',
                },
                secondary: {
                    main: '#ffffff',
                },
                background: {
                    default: '#F3F5F7',
                    paper: '#ffffff',
                },
                text: {
                    primary: '#000000',
                },
            },
            customColors: {
                button: {
                    primary: '#0B51C5',
                    secondary: '#DEDEDE',
                    ternary: '#000000',
                },
                ternary: {
                    main: '#DEDEDE',
                    contrastText: '#000',
                },
            },
            typography: {
                fontFamily: 'Inter',
            },
        }

        const newTab = window.open("", "_blank");
        if (!newTab) {
            alert("Pop-up blocked! Please enable pop-ups for this site.");
            return;
        }

        const script = newTab.document.createElement("script");


        // for same page
        // const scriptId = "ameya-extraction";

        // let existingScript = document.getElementById(scriptId);
        // if (existingScript) {
        //     console.log("Removing existing ameya-extraction script from new tab...");
        //     existingScript.remove();
        // }

        script.src = "https://ameya-extraction.ameya.ai";
        // script.id = scriptId;

        script.onload = () => {
            config.onCancel = () => {
                newTab.close();
            };
            newTab.window.AmeyaExtraction(theme, config);
        };

        script.onerror = () => {
            alert("Failed to load AmeyaExtraction, please try again");
            newTab.close();
        };

        newTab.document.head.appendChild(script);

    };

    return <Button sx={{ backgroundColor: '#dedede', color: '#000000', borderRadius: '5px' }} onClick={handleClick}>Ameya Train</Button>;
};

export default ExtractionLauncher;

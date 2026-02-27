import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { fetchSubscriberId, fetchSubscriptionId, fetchThirdPartyToken, fetchThirdPartyTokenProvider } from '../../utils/GetAccountDetails'
import { useAppContext } from '../../context/AppContext';
import FilesApi from '../../Api/Services/AppflyteBackend/FileServiceApi';
import { getStyles } from './styles';
import { useLocation } from 'react-router-dom';
import { Box, Button } from '@mui/material';

let s3_folder_name = process.env.REACT_APP_ANALYTICS_S3_BUCKET_FOLDER
let s3_file_name = process.env.REACT_APP_ANALYTICS_S3_BUCKET_SCRIPT_FILE
let bucket_name = process.env.REACT_APP_ANALYTICS_S3_BUCKET_NAME;

function Chatbot({ chatbot_type }) {

    const theme = useTheme();
    const styles = getStyles(theme);
    const location = useLocation();

    const { selectedProject, selectedOrganization } = useAppContext();
    const [chatbotData, setChatbotData] = useState({ chatbotStatus: false, chatbotUrl: null, chatBotType: null });

    useEffect(() => {
        const getChatBot = async () => {
            try {
                const subscriber_id = await fetchSubscriberId();
                const subscription_id = await fetchSubscriptionId();
                const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;
                const project_id = selectedProject?.payload?.__auto_id__ ?? null;
                const app_id = chatbot_type === "appflyte_ddl" ? organization_id : project_id;
                const check_url = `${s3_folder_name}/${s3_file_name}/${subscriber_id}/${subscription_id}/${project_id}/${app_id}.js`;
                await checkAnalyticsChatbot(check_url);
            } catch (error) {
                console.error("Chatbot init error:", error);
            }
        };
        getChatBot();
        //eslint-disable-next-line
    }, []);

    const checkAnalyticsChatbot = async (check_url) => {
        try {
            const response = await FilesApi.getAmeyaDownloadUrl(bucket_name, check_url);

            if (!response || response.status !== 200) {
                console.warn("Failed to get chatbot S3 URL");
                return;
            }

            const logo_res_data = response?.data?.at(-1) ?? null;
            const download_url = Object.values(logo_res_data ?? {})?.at(-1) ?? null;

            if (!download_url) {
                console.warn("No chatbot download URL found");
                return;
            }

            const scriptResponse = await fetch(download_url, { method: "GET" });

            if (!scriptResponse.ok) {
                console.warn("Failed to fetch chatbot script");
                return;
            }

            const scriptText = await scriptResponse.text();

            const configMatch = scriptText.match(/const\s+chatbotConfig\s*=\s*(\{[\s\S]*?\})\s*;?\s*\/\/\s*END\s+chatbotConfig/);
            if (!configMatch || !configMatch[1]) {
                console.warn("chatbotConfig not found in script");
                return;
            }

            let chatbotConfig = {};
            try {
                chatbotConfig = JSON.parse(configMatch[1]);
            } catch (jsonErr) {
                console.error("Invalid chatbot config JSON:", jsonErr);
                return;
            }

            const app_bot_type = chatbotConfig?.APP_DETAILS?.app_bot_type ?? "";

            setChatbotData({
                chatbotStatus: true,
                chatbotUrl: download_url,
                chatBotType: app_bot_type
            });

        } catch (error) {
            console.error("checkAnalyticsChatbot error:", error);
        }
    };

    useEffect(() => {
        if (!chatbotData?.chatbotStatus || !chatbotData?.chatbotUrl) return;

        const scriptId = "extraction-chatbot-script";
        const existing = document.getElementById(scriptId);
        if (existing) existing.remove();

        const script = document.createElement("script");
        script.id = scriptId;
        script.src = chatbotData.chatbotUrl;
        script.async = true;
        document.body.appendChild(script);

        return () => {
            console.log("Cleanup — removing chatbot iframe + globals");

            try {
                window.AmeayaChatBot?.("destroy");
                if (window.AmeayaChatBot) delete window.AmeayaChatBot;
            } catch { }

            ["ameya-simple-chatbot-iframe", "ameya-chatbot-iframe"].forEach(id => {
                const iframe = document.getElementById(id);
                if (iframe) iframe.remove();
            });

            if (window.toggleChatbot) delete window.toggleChatbot;

            const oldScript = document.getElementById(scriptId);
            if (oldScript) oldScript.remove();
        };
    }, [chatbotData, location.pathname]);


    const handleLaunch = async () => {
        try {
            const third_party_token = await fetchThirdPartyToken();
            const token_provider = await fetchThirdPartyTokenProvider();

            if (!third_party_token || !token_provider) {
                console.warn("Missing chatbot auth credentials");
                return;
            }

            const params = {
                token_provider,
                third_party_token
            };

            if (window.toggleChatbot) {
                window.toggleChatbot(params);
            } else {
                console.warn("Chatbot script not loaded yet");
            }

        } catch (error) {
            console.error("Chatbot launch error:", error);
        }
    };

    return (
        <div>
            {(chatbotData.chatbotStatus && chatbotData.chatBotType === "advanced_bot" && chatbotData.chatbotUrl) &&
                <Box sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000 }}>
                    <Button
                        id="chatBotButton"
                        variant="contained"
                        sx={styles.chatbotBtn}
                        onClick={handleLaunch}
                    >
                        💬
                    </Button>
                </Box>
            }
        </div>
    )
}

export default Chatbot;
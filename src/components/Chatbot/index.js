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

function Chatbot() {

    const theme = useTheme();
    const styles = getStyles(theme);
    const location = useLocation();

    const { selectedProject } = useAppContext();
    const [chatbotData, setChatbotData] = useState({ chatbotStatus: false, chatbotUrl: null, chatBotType: null });

    // Load Chatbot and launch chatbot
    useEffect(() => {
        const getChatBot = async () => {
            const subscriber_id = await fetchSubscriberId()
            const subscription_id = await fetchSubscriptionId()
            const project_id = selectedProject?.payload?.__auto_id__ ?? null;
            const check_url = `${s3_folder_name}/${s3_file_name}/${subscriber_id}/${subscription_id}/${project_id}/${project_id}.js`;
            checkAnalyticsChatbot(check_url)
        }
        getChatBot()
        //eslint-disable-next-line
    }, [])

    const checkAnalyticsChatbot = async (check_url) => {
        const response = await FilesApi.getAmeyaDownloadUrl(bucket_name, check_url);
        if (response?.status !== 200) {
            return
        }

        const logo_res_data = response?.data?.at(-1) ?? null;
        const download_url = Object.values(logo_res_data ?? {})?.at(-1) ?? null;

        if (!download_url) {
            return
        }

        try {
            const response = await fetch(download_url, { method: 'GET' });
            const scriptText = await response.text();
            const configMatch = scriptText.match(/const\s+chatbotConfig\s*=\s*(\{[\s\S]*?\})\s*;?\s*\/\/\s*END\s+chatbotConfig/);
            if (configMatch && configMatch[1]) {
                const chatbotConfig = JSON.parse(configMatch[1]) ?? {};
                const app_bot_type = chatbotConfig?.APP_DETAILS?.app_bot_type ?? '';
                setChatbotData(prev => ({
                    ...prev,
                    chatbotStatus: true,
                    chatbotUrl: download_url,
                    chatBotType: app_bot_type
                }))

            }
            return
        } catch {
            return
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
        const third_party_token = await fetchThirdPartyToken();
        const token_provider = await fetchThirdPartyTokenProvider()
        const params = {
            token_provider: token_provider,
            third_party_token: third_party_token
        };

        if (window.toggleChatbot) {
            window.toggleChatbot(params);
        } else {
            console.warn("Chatbot script not loaded yet");
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
                </Box>}
        </div>
    )
}

export default Chatbot;
import { useEffect } from "react";
import { fetchThirdPartyToken, fetchThirdPartyTokenProvider } from "../../utils/GetAccountDetails";

export default function MainChatbot() {

    useEffect(() => {
        const script = document.createElement("script");
        script.src = `${process.env.REACT_APP_ANALYTICS_CHATBOT_URL}.js?v=`
        new Date().getTime();
        script.defer = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleLaunch = async () => {
        if (window.toggleChatbot) {

            const token_provider = await fetchThirdPartyTokenProvider();
            const third_party_token = await fetchThirdPartyToken();

            const params = {
                token_provider: token_provider,
                third_party_token: third_party_token
            };

            window.toggleChatbot(params);
        } else {
            console.warn("Chatbot script not loaded yet");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <button
                id="chatBotButton"
                onClick={handleLaunch}
                className="px-6 py-3 rounded-2xl bg-black text-white text-lg shadow-lg hover:opacity-90 transition"
            >
                Launch
            </button>
        </div>
    );
}

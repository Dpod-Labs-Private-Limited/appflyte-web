import { useEffect } from "react";

export default function ChatbotEmbedPage() {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://ameyachatbotsettingsconfig.s3.amazonaws.com/ameya_analytics/analyticsConfig/6551f605-39cb-4351-8ea1-b2a7af317985/a6a49ce0-1121-455c-91cd-7956eb0891dd/cb644fe8-b379-4491-bc0d-a38c90649236/3f38f506-4cec-41df-b268-1d669734be4d.js?v="
        new Date().getTime();
        script.defer = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const params = {
        token_provider: "google",
        third_party_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEzMGZkY2VmY2M4ZWQ3YmU2YmVkZmE2ZmM4Nzk3MjIwNDBjOTJiMzgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiOTgzMDk0NjU2NjEwLTltNXFrZm1kMGY1Ymc0bXE1M2VlOXUxMjQyMnQ0MWxnLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiOTgzMDk0NjU2NjEwLTltNXFrZm1kMGY1Ymc0bXE1M2VlOXUxMjQyMnQ0MWxnLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTEyMDgwMzM4NDE5MzQ2ODM3Nzg1IiwiZW1haWwiOiJkZWVrc2hpdGg3ODIwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoicGJfTHZCS1JINmNCNzhoeWY0SzlXZyIsImlhdCI6MTc2NTc4MTgwMywiZXhwIjoxNzY1Nzg1NDAzfQ.F8dEIOlRHelj7ckAiSS-XvROLXbYurQauMd-vm4lwtvhwmj41ytVEYq7aQfpNjMKFBdUReAyE4tm7usW3e3mUUfWJAlPyvIgZAFcvqy8G9rsNPo84OhWryKIppTjf1MAmENnG1N2TCIPvPVjPm_ovsFOJOu0kVRFcio1CUQrct6mUk47sTqKcBd4W5H4zswdeGQg8MiYbLvKZQI5KtRtO4VfL8qsBjjhqXGuLIj-gwFQhoJoZxAgzJ8Jfpu1TwsH1mnKFiiPns1TsKUaEp3kcXQXuj0YC1eLQCfXGaDwtAeG76-OJeG775Ke8vA8wx57R0-DG-fqhcD6bAqsspYLng",
    };

    const handleLaunch = () => {
        if (window.toggleChatbot) {
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

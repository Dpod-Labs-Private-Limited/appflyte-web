import firebaseApp from "../../../Api/Configurations/firebase-setup";
import { collection, query, getDocs, doc, getFirestore } from "firebase/firestore";
import { fetchUserId, getUserName, fetchTenentId } from "../../../utils/GetAccountDetails";

export const handleGetQmsChatStore = async () => {
    const firestore = getFirestore(firebaseApp);

    try {

        const fetchSubcollection = async (userId) => {
            const parentDocRef = doc(firestore, "ameya_users_dashboard", userId);
            const subcollectionRef = collection(parentDocRef, "chat_list");
            const subcollectionSnapshot = await getDocs(subcollectionRef);
            const subcollectionData = subcollectionSnapshot.docs.map(doc => doc.id);
            return subcollectionData
        };

        const getChatSessionInfo = async (user_details) => {
            let sessionData = []
            for (const item of user_details) {
                const session_response = await fetchSubcollection(item);
                sessionData.push(session_response)
            }
            const flattened = sessionData.flat();
            const unique_sessions = [...new Set(flattened)];
            return unique_sessions
        }

        const fetchMessageData = async (sessionId) => {
            const messagesCollectionRef = collection(firestore, "ameya_message", sessionId, "messages");
            const messagesQuery = query(messagesCollectionRef);
            const messageSnapshots = await getDocs(messagesQuery);

            let messages = [];
            messageSnapshots.forEach((doc) => {
                messages.push({ id: doc.id, ...doc.data() });
            });
            return messages;
        };

        const userId = await fetchUserId()
        const systemId = await fetchTenentId()

        const user_details = [userId, systemId]
        const session_response = await getChatSessionInfo(user_details);
        let chats = []
        for (const item of session_response) {
            const messageData = await fetchMessageData(item);
            chats.push(messageData)
        }
        const flattenedChat = chats.flat();
        const user_name = await getUserName()
        let chatObj = {}
        let firebseChat = []
        const currentSessionId = session_response[session_response?.length - 1]

        for (const item of flattenedChat) {

            if (item.from_id === systemId) {
                chatObj = {
                    chat: item.content,
                    sessionId: currentSessionId,
                    userName: 'system',
                    userId: userId,
                    sender: 'system',
                    testId: item?.testId,
                    blockUserTextInput: item?.blockUserTextInput,
                    feedBackOptions: item?.feedBackOptions,
                    nextUserActionType: item?.nextUserActionType
                }
            }
            if (item.from_id === userId) {
                chatObj = {
                    chat: item.content,
                    sessionId: currentSessionId,
                    userName: user_name,
                    userId: userId,
                    sender: 'user',
                    testId: item?.testId,
                    blockUserTextInput: item?.blockUserTextInput,
                    feedBackOptions: item?.feedBackOptions,
                    nextUserActionType: item?.nextUserActionType
                }
            }
            firebseChat.push(chatObj)
        }

        return firebseChat

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
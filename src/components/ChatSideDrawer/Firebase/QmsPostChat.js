import firebaseApp from "../../../Api/Configurations/firebase-setup";
import { getFirestore, doc, setDoc, Timestamp } from "firebase/firestore";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const handleFirebaseDashboardPost = async (dashboardData, sessionId, userId) => {
    try {
        const firestore = getFirestore(firebaseApp);
        const listDocRef = doc(firestore, "ameya_users_dashboard", userId, "chat_list", sessionId);
        await setDoc(listDocRef, dashboardData);
    } catch (error) {
        console.log(error)
    }
}

const handleFirebaseMessagePost = async (messageData, sessionId, timeStamp) => {
    try {
        const firestore = getFirestore(firebaseApp);
        const messageDocRef = doc(firestore, "ameya_message", sessionId, "messages", timeStamp.toString());
        await setDoc(messageDocRef, messageData);
    } catch (error) {
        console.log(error)
    }
}

const handleFirebaseParticipantsPost = async (participantsData, sessionId, userId) => {
    try {
        const firestore = getFirestore(firebaseApp);
        const participantsDocRef = doc(firestore, "ameya_message", sessionId, "participants", userId);
        await setDoc(participantsDocRef, participantsData);
    } catch (error) {
        console.log(error)
    }
}

const fixSessionId = (testData, defaultSessionId) => {
    return testData?.length > 0 ? testData?.map((item) => {
        if (item?.sessionId === null && defaultSessionId) {
            return { ...item, sessionId: defaultSessionId };
        }
        return item;
    }) : [];
};


const handleFirebasePost = async (qmsChats, isInitChat) => {

    for (const [index, item] of qmsChats.entries()) {

        const current_time = Timestamp.now();
        const timeStamp = current_time.seconds;

        const dashboardreqObj = {
            name: item?.userName,
            status: "Active",
            last_mesage_time_stamp: timeStamp
        };

        const messageReqObj = {
            content: item?.chat,
            from_id: item?.userId,
            type: 0,
            testId: item?.testId,
            blockUserTextInput: item?.blockUserTextInput ?? false,
            feedBackOptions: item?.feedBackOptions ?? [],
            nextUserActionType: item?.nextUserActionType ?? 'text',
        };

        const participantsReqObj = {
            name: item?.userName,
            status: 'Active',
        };

        try {
            if (isInitChat) {
                await handleFirebaseDashboardPost(dashboardreqObj, item.sessionId, item.userId);
                await handleFirebaseMessagePost(messageReqObj, item.sessionId, timeStamp);
                await handleFirebaseParticipantsPost(participantsReqObj, item.sessionId, item.userId);
            } else {
                await handleFirebaseMessagePost(messageReqObj, item.sessionId, timeStamp);
            }
        } catch (error) {
            console.error(`Failed to process sessionId: ${item.sessionId}`, error);
        }
        await delay(1000);
    }
}


export const handleQmsChatStore = async (isInitChat, chatSessionId, newChat, qmsChatData, userMessage) => {

    let qmsChatDetails = [];

    if (isInitChat) {
        const combinedChat = [userMessage, newChat];
        const initChat = qmsChatData.concat(combinedChat)
        const qmsChats = await fixSessionId(initChat, chatSessionId);
        qmsChatDetails.push(qmsChats);
    } else {
        qmsChatDetails.push(newChat);
    }
    const flattenedChat = qmsChatDetails?.flat();
    await handleFirebasePost(flattenedChat, isInitChat)

};
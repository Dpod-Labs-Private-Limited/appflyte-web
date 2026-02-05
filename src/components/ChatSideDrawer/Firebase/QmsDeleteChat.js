import firebaseApp from "../../../Api/Configurations/firebase-setup";
import { doc, getFirestore, deleteDoc, collection, getDocs } from "firebase/firestore";


const deleteSubcollectionDocuments = async (firestore, parentDocRef, subcollectionName) => {
    try {
        const subcollectionRef = collection(parentDocRef, subcollectionName);
        const querySnapshot = await getDocs(subcollectionRef);

        const deletePromises = querySnapshot.docs.map((docSnapshot) => {
            const docRef = doc(firestore, subcollectionRef.path, docSnapshot.id);
            return deleteDoc(docRef);
        });

        await Promise.all(deletePromises);
        console.log(`All documents in subcollection "${subcollectionName}" deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting documents from subcollection "${subcollectionName}":`, error);
        throw error;
    }
};

const deleteUserMessageItem = async (sessionId) => {
    try {
        const firestore = getFirestore(firebaseApp);
        const subcollections = ['participants', 'messages'];
        const parentDocRef = doc(firestore, "ameya_message", sessionId);

        for (const subcollectionName of subcollections) {
            await deleteSubcollectionDocuments(firestore, parentDocRef, subcollectionName);
        }

        await deleteDoc(parentDocRef);
        console.log(`Main document with ID "${sessionId}" deleted successfully.`);

    } catch (error) {
        console.error("Error deleting subcollections for userIds:", error);
        throw error;
    }
};

const deleteUserDashboardItem = async (userIds) => {
    try {
        const firestore = getFirestore(firebaseApp);
        for (const userId of userIds) {
            const parentDocRef = doc(firestore, "ameya_users_dashboard", userId);
            await deleteSubcollectionDocuments(firestore, parentDocRef, 'chat_list');
            await deleteDoc(parentDocRef);
        }
    } catch (error) {
        console.error("Error deleting subcollections for userIds:", error);
        throw error;
    }
};

export const deleteChatSession = async (userIds, sessionId) => {

    const [dashboardResponse, messageResponse] = await Promise.all([
        deleteUserDashboardItem(userIds),
        deleteUserMessageItem(sessionId)
    ])

    if (dashboardResponse && messageResponse) {
        return [dashboardResponse, messageResponse]
    }
}

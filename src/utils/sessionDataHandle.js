import CryptoJS from "crypto-js";

const SECRET_KEY = "dpod-ameya-web-app-v.1.0";

export const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (ciphertext) => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.error("Decryption failed", error);
        return null;
    }
};

export const generateHash = (data) => {
    return CryptoJS.SHA256(data + SECRET_KEY).toString();
};

export const getSessionData = (key) => {
    const storedData = sessionStorage.getItem(key);
    if (!storedData) return null;
    try {
        const { encryptedData, hash } = JSON.parse(storedData);
        if (hash !== generateHash(encryptedData)) {
            console.warn("Data tampering detected!");
            return null;
        }
        return decryptData(encryptedData);
    } catch (error) {
        console.error("Error parsing data", error);
        return null;
    }
};

export const InvalidAccess = (navigate) => {
    sessionStorage.removeItem("selected_space")
    sessionStorage.removeItem("selected_project")
    navigate('/')
};

export const InvalidProject = (navigate) => {
    sessionStorage.removeItem("selected_space")
    sessionStorage.removeItem("selected_project")
    navigate('/')
};

export const InvalidSpace = (navigate) => {
    sessionStorage.removeItem("selected_space")
    sessionStorage.removeItem("selected_project")
    navigate('/')
};


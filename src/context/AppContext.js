import { createContext, useContext, useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';

const AppContext = createContext();
const SECRET_KEY = 'dpod-ameya-web-app-v.1.0';

export function AppProvider({ children }) {

    const [dataLoading, setDataLoading] = useState(false)
    const [permissionStatus, setPermissionStatus] = useState(false)
    const [billingStatus, setBillingStatus] = useState(false)
    const [apiKeyStatus, setApiKeyStatus] = useState(false)
    const [isOrganizationOwner, setIsOrganizationOwner] = useState(false);

    const [selectedOrganization, setSelectedOrganization] = useState(() => {
        const stored = sessionStorage.getItem('selected_organization');
        if (!stored) return null;

        try {
            const { encryptedData, hash } = JSON.parse(stored);
            const computedHash = CryptoJS.SHA256(encryptedData + SECRET_KEY).toString();

            if (computedHash !== hash) {
                console.warn('Hash mismatch: possible tampering');
                return null;
            }

            const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
            const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return decrypted;
        } catch (err) {
            console.error('Failed to decrypt stored organization:', err);
            return null;
        }
    });

    const [selectedService, setSelectedService] = useState(() => {
        const stored = sessionStorage.getItem('selected_service');
        if (!stored) return null;

        try {
            const { encryptedData, hash } = JSON.parse(stored);
            const computedHash = CryptoJS.SHA256(encryptedData + SECRET_KEY).toString();

            if (computedHash !== hash) {
                console.warn('Hash mismatch: possible tampering');
                return null;
            }

            const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
            const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return decrypted;
        } catch (err) {
            console.error('Failed to decrypt stored organization:', err);
            return null;
        }
    });

    const [selectedWorkspace, setSelectedWorkspace] = useState(() => {
        const stored = sessionStorage.getItem('selected_space');
        if (!stored) return null;

        try {
            const { encryptedData, hash } = JSON.parse(stored);
            const computedHash = CryptoJS.SHA256(encryptedData + SECRET_KEY).toString();

            if (computedHash !== hash) {
                console.warn('Hash mismatch: possible tampering');
                return null;
            }

            const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
            const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return decrypted;
        } catch (err) {
            console.error('Failed to decrypt stored organization:', err);
            return null;
        }
    });

    const [selectedProject, setSelectedProject] = useState(() => {
        const stored = sessionStorage.getItem('selected_project');
        if (!stored) return null;

        try {
            const { encryptedData, hash } = JSON.parse(stored);
            const computedHash = CryptoJS.SHA256(encryptedData + SECRET_KEY).toString();

            if (computedHash !== hash) {
                console.warn('Hash mismatch: possible tampering');
                return null;
            }

            const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
            const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return decrypted;
        } catch (err) {
            console.error('Failed to decrypt stored organization:', err);
            return null;
        }
    });

    const initialAuthData = {
        document_type: null,
        request_type: null,
        file_id: null,
        file_name: null,
        organization_id: null,
        service_id: null,
        workspace_id: null,
        project_id: null,
        document_type_id: null,
        task_id: null,
        user_auth_type: null,
        credit_bundle_id: null
    };

    const [authData, setAuthData] = useState(() => {
        const stored = sessionStorage.getItem("authData");
        if (!stored) return initialAuthData;
        try {
            const { encryptedData, hash } = JSON.parse(stored);
            const computedHash = CryptoJS.SHA256(encryptedData + SECRET_KEY).toString();
            if (computedHash !== hash) {
                console.warn("Hash mismatch: possible tampering");
                return initialAuthData;
            }
            const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
            const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return { ...initialAuthData, ...decrypted };
        } catch (err) {
            console.error("Failed to decrypt stored authData:", err);
            return initialAuthData;
        }
    });
    const updateAuthData = updates => setAuthData(prev => ({ ...prev, ...updates }));

    useEffect(() => {
        if (selectedOrganization) {
            const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(selectedOrganization), SECRET_KEY).toString();
            const hash = CryptoJS.SHA256(encryptedData + SECRET_KEY).toString();
            sessionStorage.setItem('selected_organization', JSON.stringify({ encryptedData, hash }));
        } else {
            sessionStorage.removeItem('selected_organization');
        }
    }, [selectedOrganization]);

    useEffect(() => {
        if (selectedService) {
            const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(selectedService), SECRET_KEY).toString();
            const hash = CryptoJS.SHA256(encryptedData + SECRET_KEY).toString();
            sessionStorage.setItem('selected_service', JSON.stringify({ encryptedData, hash }));
        } else {
            sessionStorage.removeItem('selected_service');
        }
    }, [selectedService]);

    useEffect(() => {
        if (selectedWorkspace) {
            const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(selectedWorkspace), SECRET_KEY).toString();
            const hash = CryptoJS.SHA256(encryptedData + SECRET_KEY).toString();
            sessionStorage.setItem('selected_space', JSON.stringify({ encryptedData, hash }));
        } else {
            sessionStorage.removeItem('selected_space');
        }
    }, [selectedWorkspace]);

    useEffect(() => {
        if (selectedProject) {
            const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(selectedProject), SECRET_KEY).toString();
            const hash = CryptoJS.SHA256(encryptedData + SECRET_KEY).toString();
            sessionStorage.setItem('selected_project', JSON.stringify({ encryptedData, hash }));
        } else {
            sessionStorage.removeItem('selected_project');
        }
    }, [selectedProject]);

    useEffect(() => {
        if (authData) {
            const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(authData), SECRET_KEY).toString();
            const hash = CryptoJS.SHA256(encryptedData + SECRET_KEY).toString();
            sessionStorage.setItem("authData", JSON.stringify({ encryptedData, hash }));
        } else {
            sessionStorage.removeItem("authData");
        }
    }, [authData]);

    return (
        <AppContext.Provider
            value={{
                selectedOrganization, setSelectedOrganization,
                selectedService, setSelectedService,
                selectedWorkspace, setSelectedWorkspace,
                selectedProject, setSelectedProject,
                permissionStatus, setPermissionStatus,
                dataLoading, setDataLoading,
                billingStatus, setBillingStatus,
                isOrganizationOwner, setIsOrganizationOwner,
                apiKeyStatus, setApiKeyStatus,
                authData, setAuthData,
                initialAuthData, updateAuthData
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}

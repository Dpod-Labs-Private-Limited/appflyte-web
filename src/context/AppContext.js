import { createContext, useContext, useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import getAmeyaServiceGuideById from '../utils/ApiFunctions/AmeyaServiceGuideData';
import AmeyaServiceGuideApi from '../Api/Services/AppflyteBackend/AmeyaServiceGuide';

const AppContext = createContext();
const SECRET_KEY = 'dpod-ameya-web-app-v.1.0';

export function AppProvider({ children }) {

    const [dataLoading, setDataLoading] = useState(false)
    const [permissionStatus, setPermissionStatus] = useState(false)
    const [billingStatus, setBillingStatus] = useState(false)
    const [apiKeyStatus, setApiKeyStatus] = useState(false)
    const [isOrganizationOwner, setIsOrganizationOwner] = useState(false);
    const [reviewStatus, setReviewStatus] = useState(false)

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

    // Ameya user guide
    const extractionGuideDetails = {
        "is_first_doc_uploaded": false,
        "review_extracted_fields_completed": false,
        "upload_5_docs_status": false,
        "is_review_extracted_data_done": false,
        "upload_data_via_api_completed": false,
        "get_data_via_api_completed": false
    }

    const analyticsGuideDetails = {
        "analytics_dataset_creation_status": false,
        "analytics_file_dataset_and_upload_status": false,
        "analytics_app_link_dataset_status": false,
        "analytics_app_test_status": false,
        "analytics_app_customize_status": false,
        "analytics_connector_datasource_status": false,
        "analytics_datsets_to_app_status": false
    }

    const [guideDataloading, setGuideDataloading] = useState(true)
    const [ameyaGuideData, setAmeyaGuideData] = useState(null);
    const [extractionGuideData, setExtractionGuideData] = useState(extractionGuideDetails)
    const [analyticsGuideData, setAnalyticsGuideData] = useState(analyticsGuideDetails)

    useEffect(() => {
        fetchAmeyaServiceGuide()
        //eslint-disable-next-line
    }, [selectedProject])

    const fetchAmeyaServiceGuide = async () => {
        try {

            if (!selectedOrganization || !setSelectedService || !selectedWorkspace || !selectedProject) {
                return
            }

            let guide_payload = {};
            const project_id = selectedProject?.payload?.__auto_id__ ?? null
            const response = await getAmeyaServiceGuideById(project_id)
            if (response) {
                setAmeyaGuideData(response)
                guide_payload = response?.payload ?? {};
            }

            const is_first_doc_uploaded = guide_payload?.is_first_doc_uploaded ?? false;
            const review_extracted_fields_completed = guide_payload?.review_extracted_fields_completed ?? false;
            const upload_5_docs_status = guide_payload?.upload_5_docs_status ?? false;
            const is_review_extracted_data_done = guide_payload?.is_review_extracted_data_done ?? false;
            const upload_data_via_api_completed = guide_payload?.upload_data_via_api_completed ?? false;
            const get_data_via_api_completed = guide_payload?.get_data_via_api_completed ?? false;

            const analytics_dataset_creation_status = guide_payload?.analytics_dataset_creation_status ?? false;
            const analytics_file_dataset_and_upload_status = guide_payload?.analytics_file_dataset_and_upload_status ?? false;
            const analytics_app_link_dataset_status = guide_payload?.analytics_app_link_dataset_status ?? false;
            const analytics_app_test_status = guide_payload?.analytics_app_test_status ?? false;
            const analytics_app_customize_status = guide_payload?.analytics_app_customize_status ?? false;
            const analytics_connector_datasource_status = guide_payload?.analytics_connector_datasource_status ?? false;
            const analytics_datsets_to_app_status = guide_payload?.analytics_datsets_to_app_status ?? false;

            setExtractionGuideData({
                ...extractionGuideData,
                is_first_doc_uploaded: is_first_doc_uploaded,
                review_extracted_fields_completed: review_extracted_fields_completed,
                upload_5_docs_status: upload_5_docs_status,
                is_review_extracted_data_done: is_review_extracted_data_done,
                upload_data_via_api_completed: upload_data_via_api_completed,
                get_data_via_api_completed: get_data_via_api_completed
            })

            setAnalyticsGuideData({
                ...analyticsGuideData,
                analytics_dataset_creation_status: analytics_dataset_creation_status,
                analytics_file_dataset_and_upload_status: analytics_file_dataset_and_upload_status,
                analytics_app_link_dataset_status: analytics_app_link_dataset_status,
                analytics_app_test_status: analytics_app_test_status,
                analytics_app_customize_status: analytics_app_customize_status,
                analytics_connector_datasource_status: analytics_connector_datasource_status,
                analytics_datsets_to_app_status: analytics_datsets_to_app_status
            })

        } catch (error) {
            console.log(error)
        } finally {
            setGuideDataloading(false)
        }
    }

    const handleExtractionSteps = async (type) => {
        try {

            if (extractionGuideData[type] === true) {
                return
            }

            const project_id = selectedProject?.payload?.__auto_id__ ?? null;
            const response = await getAmeyaServiceGuideById(project_id);
            const responseData = response?.payload ?? null;

            const fieldMapping = {
                is_first_doc_uploaded: "is_first_doc_uploaded",
                review_extracted_fields_completed: "review_extracted_fields_completed",
                upload_5_docs_status: "upload_5_docs_status",
                is_review_extracted_data_done: "is_review_extracted_data_done",
                upload_data_via_api_completed: "upload_data_via_api_completed",
                get_data_via_api_completed: "get_data_via_api_completed",
            };

            if (responseData) {
                const item_id = responseData.__auto_id__;
                const update_key = response?.update_key;
                const reqObj = { id: item_id, fields: [] };

                if (!extractionGuideData[type]) {
                    reqObj.fields.push({ path: `$.${fieldMapping[type]}`, value: true });
                }

                if (reqObj.fields.length > 0) {
                    const guide_response = await AmeyaServiceGuideApi.update(JSON.stringify(reqObj), item_id, update_key)
                    if (guide_response.status === 200) {
                        setExtractionGuideData({ ...extractionGuideData, [type]: true })
                    }
                }
            } else {
                const reqObj = {
                    collection_item: {
                        service_type: "ameya_extraction",
                        project_id: project_id,
                        __auto_id__: project_id
                    }
                };

                if (!extractionGuideData[type]) {
                    reqObj.collection_item = {
                        ...reqObj.collection_item, [fieldMapping[type]]: true
                    };
                }

                const guide_response = await AmeyaServiceGuideApi.add(JSON.stringify(reqObj))
                if (guide_response.status === 200) {
                    setExtractionGuideData({ ...extractionGuideData, [type]: true })
                }
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleAnalyticsSteps = async (type) => {
        try {

            if (analyticsGuideData[type] === true) {
                return
            }

            const project_id = selectedProject?.payload?.__auto_id__ ?? null;
            const response = await getAmeyaServiceGuideById(project_id);
            const responseData = response?.payload ?? null;

            const fieldMapping = {
                analytics_dataset_creation_status: "analytics_dataset_creation_status",
                analytics_file_dataset_and_upload_status: "analytics_file_dataset_and_upload_status",
                analytics_app_link_dataset_status: "analytics_app_link_dataset_status",
                analytics_app_test_status: "analytics_app_test_status",
                analytics_app_customize_status: "analytics_app_customize_status",
                analytics_connector_datasource_status: "analytics_connector_datasource_status",
                analytics_datsets_to_app_status: "analytics_datsets_to_app_status"
            };

            if (responseData) {
                const item_id = responseData.__auto_id__;
                const update_key = response?.update_key;
                const reqObj = { id: item_id, fields: [] };

                if (!analyticsGuideData[type]) {
                    reqObj.fields.push({ path: `$.${fieldMapping[type]}`, value: true });
                }

                if (reqObj.fields.length > 0) {
                    const guide_response = await AmeyaServiceGuideApi.update(JSON.stringify(reqObj), item_id, update_key)
                    if (guide_response.status === 200) {
                        setAnalyticsGuideData({ ...analyticsGuideData, [type]: true })
                    }
                }
            } else {
                const reqObj = {
                    collection_item: {
                        service_type: "ameya_analytics",
                        project_id: project_id,
                        __auto_id__: project_id
                    }
                };

                if (!analyticsGuideData[type]) {
                    reqObj.collection_item = {
                        ...reqObj.collection_item, [fieldMapping[type]]: true
                    };
                }

                const guide_response = await AmeyaServiceGuideApi.add(JSON.stringify(reqObj))
                if (guide_response.status === 200) {
                    setAnalyticsGuideData({ ...analyticsGuideData, [type]: true })
                }
            }

        } catch (error) {
            console.log(error)
        }
    }

    // Ameya Ai App
    const chatStyleDetails = {
        font_family: "Inter",
        font_color: "#000000",
        background_color: "#EEEEEE",
        surface_color: "#ffffff",
        surface_border: "#ffffff",
        button_fill: "#000000",
        button_text: "#ffffff",
        question_bubble_color: '#000000',
        question_bubble_font_color: '#ffffff',
        poweredby_logo_status: true
    }

    const AuthConfigDetails = {
        auth_type: "auth",
        service_agent_token: null
    }

    const appLogoDetails = {
        previewUrl: null,
        selectedLogo: null,
        s3_url: null,
        logo_type: 'default'
    }

    const ameyaChatBotAppDetails = {
        app_id: '',
        app_name: '',
        app_description: '',
        app_launch_icon: 'chatlaunch1',
        welcome_message: "",
        appLogoData: appLogoDetails,
        app_bot_type: 'simple_bot',
        chatStylesData: chatStyleDetails,
        authConfigData: AuthConfigDetails,
        dataset: [],
        default_dataset: null,
        excel_dataset: false
    }
    const [appDetails, setAppDetails] = useState(ameyaChatBotAppDetails);

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
                selectedOrganization, selectedService, selectedWorkspace, selectedProject, permissionStatus, dataLoading, ameyaChatBotAppDetails,
                appLogoDetails,
                setSelectedOrganization, setSelectedService, setSelectedWorkspace, setSelectedProject, setPermissionStatus, setDataLoading,
                setAppDetails, appDetails, billingStatus, setBillingStatus,
                isOrganizationOwner, setIsOrganizationOwner,
                guideDataloading, ameyaGuideData, setAmeyaGuideData, extractionGuideData,
                setExtractionGuideData, analyticsGuideData, setAnalyticsGuideData,
                handleExtractionSteps, handleAnalyticsSteps,
                apiKeyStatus, setApiKeyStatus,
                reviewStatus, setReviewStatus,
                authData, setAuthData, initialAuthData, updateAuthData
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}

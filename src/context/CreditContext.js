import { createContext, useContext, useEffect, useRef, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAppContext } from "./AppContext";
import { toNumber } from "lodash";

const CreditContext = createContext();

export const CreditProvider = ({ children }) => {
    const { selectedOrganization } = useAppContext();

    const [credit, setCredit] = useState(null);
    const [apiBalance, setApiBalance] = useState(null);
    const [projectBalance, setProjectBalance] = useState(null);
    const [creditLoading, setCreditLoading] = useState(true);
    const [warningStatus, setWarningStatus] = useState('')
    const [warningMessage, setWarningMessage] = useState('')
    const unsubscribeRef = useRef(null);

    const formatCompact = (value) => {
        return new Intl.NumberFormat('en', {
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(value);
    };

    const handleWarningMessage = (balance, remaining) => {
        if (balance >= 100) {
            setWarningMessage("You've used all your API calls for this month. Upgrade your plan to continue.");
            setWarningStatus(true);
        }
        else if (balance >= 90) {
            setWarningMessage(`${formatCompact(Number(remaining || 0))} API calls remaining. Consider upgrading to avoid interruptions.`);
            setWarningStatus(true);
        }
        else if (balance >= 70) {
            setWarningMessage(`${formatCompact(Number(remaining || 0))} API calls remaining this month.`);
            setWarningStatus(true);
        }
        else {
            setWarningStatus(false);
            setWarningMessage("");
        }
    };

    useEffect(() => {

        if (process.env.REACT_APP_IS_SFS_INSTANCE === "true") {
            setCredit(100);
            setCreditLoading(false);
            return
        }

        const orgId = selectedOrganization?.payload?.__auto_id__;

        if (unsubscribeRef.current) {
            unsubscribeRef.current();
            unsubscribeRef.current = null;
        }

        if (!orgId) {
            setCredit(null);
            setCreditLoading(false);
            return;
        }

        setCreditLoading(true);

        const docRef = doc(db, "organizations", orgId);

        unsubscribeRef.current = onSnapshot(
            docRef,
            (snapshot) => {
                if (!snapshot.exists()) {
                    setCredit(0);
                } else {
                    const data = snapshot.data();
                    console.log('data', data)

                    const project_used = toNumber(data?.project_used ?? 0);
                    const project_limlt = toNumber(data?.project_limlt ?? 0);
                    const project_balance = project_limlt - project_used
                    setProjectBalance(project_balance)

                    const api_calls_used = toNumber(data?.api_calls_used ?? 0);
                    const api_limit = toNumber(data?.api_limit ?? 0);
                    const api_balance = api_limit - api_calls_used
                    setApiBalance(api_balance)

                    const api_percentage = (api_calls_used / api_limit) * 100;
                    // const projects_percentage = (project_used / project_limlt) * 100;

                    handleWarningMessage(api_percentage, api_balance)
                    setCredit(100);
                }
                setCreditLoading(false);
            },
            (error) => {
                console.error("Firebase credit listener error:", error);
                setCreditLoading(false);
            }
        );

        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
                unsubscribeRef.current = null;
            }
        };
    }, [selectedOrganization]);

    const shouldShowCreditWarning = ({ pathname }) => {
        if (!selectedOrganization || creditLoading || !warningStatus) return false;
        return warningStatus && pathname !== "/user/billing";
    };

    return (
        <CreditContext.Provider value={{ credit, shouldShowCreditWarning, apiBalance, projectBalance, warningMessage }}>
            {children}
        </CreditContext.Provider>
    );
};

export const useCredit = () => useContext(CreditContext);
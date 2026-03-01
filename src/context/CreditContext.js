import { createContext, useContext, useEffect, useRef, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAppContext } from "./AppContext";
import { toNumber } from "lodash";

const CreditContext = createContext();

export const CreditProvider = ({ children }) => {
    const { selectedOrganization } = useAppContext();
    const unsubscribeRef = useRef(null);

    const [creditLoading, setCreditLoading] = useState(true);
    const [apiBalance, setApiBalance] = useState(null);
    const [projectBalance, setProjectBalance] = useState(null);

    const [warningStatus, setWarningStatus] = useState('')
    const [warningMessage, setWarningMessage] = useState('')


    const formatCompact = (value) => {
        return new Intl.NumberFormat('en', {
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(value);
    };

    const handleWarningMessage = (percentageUsed, remaining) => {
        if (percentageUsed >= 100) {
            setWarningMessage("You've used all your API calls for this plan. Upgrade your plan to continue.");
            setWarningStatus(true);
        }
        else if (percentageUsed >= 90) {
            setWarningMessage(`${formatCompact(Number(remaining || 0))} API calls remaining in this plan. Consider upgrading to avoid interruptions.`);
            setWarningStatus(true);
        }
        else if (percentageUsed >= 70) {
            setWarningMessage(`${formatCompact(Number(remaining || 0))} API calls remaining in this plan.`);
            setWarningStatus(true);
        }
        else {
            setWarningStatus(false);
            setWarningMessage("");
        }
    };

    useEffect(() => {

        const orgId = selectedOrganization?.payload?.__auto_id__;

        if (unsubscribeRef.current) {
            unsubscribeRef.current();
            unsubscribeRef.current = null;
        }

        if (!orgId) {
            setApiBalance(null);
            setProjectBalance(null);
            setCreditLoading(false);
            return;
        }

        setCreditLoading(true);

        const docRef = doc(db, "organizations", orgId);

        unsubscribeRef.current = onSnapshot(
            docRef,
            (snapshot) => {
                if (!snapshot.exists()) {
                    setApiBalance(0);
                    setProjectBalance(0);
                } else {
                    const data = snapshot.data();

                    const project_used = toNumber(data?.project_used ?? 0);
                    const project_limlt = toNumber(data?.project_limlt ?? 0);
                    const project_balance = project_limlt - project_used

                    const api_calls_used = toNumber(data?.api_calls_used ?? 0);
                    const api_limit = toNumber(data?.api_limit ?? 0);
                    const api_balance = api_limit - api_calls_used;

                    setProjectBalance(project_balance)
                    setApiBalance(api_balance)

                    const api_percentage = (api_calls_used / api_limit) * 100;
                    handleWarningMessage(api_percentage, api_balance)
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

    const shouldShowCreditWarning = () => {
        if (!selectedOrganization || creditLoading || !warningStatus) return false;
        return warningStatus
    };

    return (
        <CreditContext.Provider value={{
            apiBalance,
            projectBalance,
            warningMessage,
            shouldShowCreditWarning
        }}>
            {children}
        </CreditContext.Provider>
    );
};

export const useCredit = () => useContext(CreditContext);
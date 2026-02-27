import { createContext, useContext, useEffect, useRef, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAppContext } from "./AppContext";

const CreditContext = createContext();

export const CreditProvider = ({ children }) => {
    const { selectedOrganization } = useAppContext();

    const [credit, setCredit] = useState(null);
    const [creditLoading, setCreditLoading] = useState(true);

    const unsubscribeRef = useRef(null);

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
                    console.log("data",data)
                    setCredit(100);
                    // console.log('Credit data from Firestore:', data);
                    // const credit_cycle_end = data.credit_cycle_end ? new Date(data.credit_cycle_end * 1000) : null;
                    // if (credit_cycle_end && credit_cycle_end < new Date()) {
                    //     setCredit(0);
                    // } else {
                    //     setCredit(Number(data.credit_balance ?? 0));
                    // }
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
        if (!selectedOrganization || credit === null || creditLoading) return false;
        return credit <= 0.5 && pathname !== "/user/billing";
    };

    return (
        <CreditContext.Provider value={{ credit, shouldShowCreditWarning }}>
            {children}
        </CreditContext.Provider>
    );
};

export const useCredit = () => useContext(CreditContext);
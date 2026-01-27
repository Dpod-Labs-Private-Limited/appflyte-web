import React, { useEffect, useState } from "react";
import altLogo from "../images/analytics_brand_logo.svg";
import { Shimmer } from "react-shimmer";

export default function LogoPreview({ path }) {
    const [logoUrl, setLogoUrl] = useState(null);
    const [logoPath, setLogoPath] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadLogo = async () => {
        setLoading(true);
        try {

            if (!path) return;
            setLogoPath(path);

            const isSvg = path.endsWith(".svg");
            const res = await fetch(path);
            if (!res.ok) throw new Error("Failed to fetch logo");

            if (isSvg) {
                const text = await res.text();
                setLogoUrl(text);
            } else {
                const blob = await res.blob();
                const objectUrl = URL.createObjectURL(blob);
                setLogoUrl(objectUrl);
            }
        } catch (err) {
            console.error("Logo load failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLogo();
        return () => {
            if (logoUrl && !logoPath?.endsWith(".svg")) {
                URL.revokeObjectURL(logoUrl);
            }
        };
        //eslint-disable-next-line
    }, [path]);

    if (loading) return <Shimmer width={204} height={53} />;

    return logoUrl
        ?
        (logoPath?.endsWith(".svg")
            ?
            (<div
                style={{ width: 300, height: 100 }}
                dangerouslySetInnerHTML={{ __html: logoUrl }}
            />)
            :
            (<img src={logoUrl} alt="Logo" style={{ maxWidth: 300, maxHeight: 100 }} />)
        )
        :
        (<img src={altLogo} alt="Fallback Logo" style={{ maxWidth: 300, maxHeight: 100 }} />);
}

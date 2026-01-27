import React, { useEffect, useState } from "react";
import altLogo from "../images/ameya_logo.svg";
import { Shimmer } from "react-shimmer";
import FilesApi from "../Api/Services/AppflyteBackend/FileServiceApi";
let s3_foldername = process.env.REACT_APP_ANALYTICS_S3_BUCKET_FOLDER

export default function LoadAppLogo({ logo_path }) {
    const [logoUrl, setLogoUrl] = useState(null);
    const logoPath = null;
    const [loading, setLoading] = useState(false);

    const loadLogo = async () => {
        setLoading(true);
        try {
            if (!logo_path) return;
            const full_url = `${s3_foldername}/${logo_path}`
            const bucket_name = process.env.REACT_APP_ANALYTICS_S3_BUCKET_NAME
            const logo_res = await FilesApi.getAmeyaDownloadUrl(bucket_name, full_url);
            if (logo_res.status === 200) {
                const logo_res_data = logo_res?.data?.at(-1) ?? null;
                const logo_url = Object.values(logo_res_data)?.at(-1) ?? null;
                if (logo_url) {
                    setLogoUrl(logo_url)
                }
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
    }, [logo_path]);

    if (loading) return <Shimmer width={204} height={53} />;

    return logoUrl
        ? (logoPath?.endsWith(".svg")
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
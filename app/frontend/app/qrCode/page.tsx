// 'use client'
// import React from "react";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";


// export default function twoFA_qrCodePage() {
//     const [url, setUrl] = useState<string>("");
//     const [userCode, setUserCode] = useState<string>("");

//     useEffect(() => {
//         console.log('Component rendered');
//         const fetchData = async () => {
//             console.log('useEffect called');
//             await axios.get("http://localhost:4000/api/twofa/setup", {
//                 headers: {
//                     Authorization: `Bearer ${Cookies.get("accessToken")}`,
//                 },
//                 withCredentials: true,
//             }).then((response: { data: { qrCode: string } }) => {
//                 console.log("jai recu la reponse", response.data.qrCode);
//                 setUrl(response.data.qrCode);
//             }).catch((error: any) => {
//                 console.error("Error fetching QR code URL:", error);
//             })
//         };

//         fetchData();
//     }, []);

//     return (
//         <div className="flex flex-col items-center justify-evenly">
//             <img src={url} alt="QR Code" />
//         </div>
//     );
// }
'use client'
import React, { FormEvent } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function twoFA_qrCodePage() {
    const [url, setUrl] = useState<string>("");
    const [userCode, setUserCode] = useState<string>("");

    useEffect(() => {
        console.log('Component rendered');
        const fetchData = async () => {
            console.log('useEffect called');
            await axios.get("http://localhost:4000/api/twofa/setup", {
                headers: {
                    Authorization: `Bearer ${Cookies.get("accessToken")}`,
                },
                withCredentials: true,
            }).then((response: { data: { qrCode: string } }) => {
                console.log("jai recu la reponse", response.data.qrCode);
                setUrl(response.data.qrCode);
            }).catch((error: any) => {
                console.error("Error fetching QR code URL:", error);
            })
        };

        fetchData();
    }, []);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
            const response = await axios.post("http://localhost:4000/api/twofa/validate", {
                secret: userCode,
            }, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("accessToken")}`,
                },
                withCredentials: true,
            }).then((response: { data: { success: string } }) => {
                console.log("Code verification state:", response.data);
            }).catch((error: any) => {
                console.error("Error verifying code:", error);
            });
        };

    return (
        <div className="flex flex-col items-center justify-evenly">
            <img src={url} alt="QR Code" />
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    placeholder="Enter your code"
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
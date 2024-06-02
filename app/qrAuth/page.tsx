"use client"
import {useEffect, useRef, useState} from "react";
import {Html5Qrcode} from "html5-qrcode";
import {io} from "socket.io-client";

export default function Page(){
    const [isEnabled, setEnabled] = useState(false);
    const [qrMessage, setQrMessage] = useState("");
    const hasMounted = useRef(false);
    const [socket, setSocket] = useState(io)
    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            const target = io({autoConnect: false,withCredentials: false});

            target.on("qrPost", (socket: any) => {
                alert(socket)
            })

            target.connect()
            setSocket(target)
        }


    }, []);

    const sendMessage = (text: string) => {
        socket.emit("qrPost", text)
    }

    useEffect(() => {
        const config = { fps: 10, qrbox: { width: 200, height: 200 } };

        const html5QrCode = new Html5Qrcode("qrCodeContainer");

        const qrScanerStop = () => {
            if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode
                    .stop()
                    .then((ignore) => console.log("Scaner stop"))
                    .catch((err) => console.log("Scaner error"));
            }
        };

        const qrCodeSuccess = (decodedText: any) => {
            sendMessage(decodedText)
            setEnabled(false);
        };

        if (isEnabled) {
            // @ts-ignore
            html5QrCode.start({facingMode: "environment"}, config, qrCodeSuccess);
            setQrMessage("");
        } else {
            qrScanerStop();
        }

        return () => {
            qrScanerStop();
        };
    }, [isEnabled]);

    return (
        <div className="scaner">
            <div id="qrCodeContainer" />
            {qrMessage && <div className="qr-message">{qrMessage}</div>}
            <button className="start-button" onClick={() => setEnabled(!isEnabled)}>
                {isEnabled ? "On" : "Off"}
            </button>
        </div>
    );
}
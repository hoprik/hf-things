"use client"
import {io} from "socket.io-client";
import {useEffect, useRef, useState} from "react";
import {QRCodeSVG} from "qrcode.react";

export default function Page(){
    const hasMounted = useRef(false);
    const [qr, setQr] = useState("")
    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            const target = io({autoConnect: false,withCredentials: false});

            target.on("qrGet", (socket: any) => {
                setQr(socket)
            })

            target.on("qrPost", (socket: any) => {
                alert(socket)
            })
            target.connect()

            target.emit("qrGet", "")
        }
    }, []);

    return <>
        <QRCodeSVG value={qr} />,
    </>
}
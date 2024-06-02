"use client"
import {io} from "socket.io-client";
import {useEffect, useRef, useState} from "react";

export default function Page(){
    const hasMounted = useRef(false);
    const [messages, setMessages] = useState([""])
    const [text, setText] = useState("")
    const [socket, setSocket] = useState(io)
    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            const target = io({autoConnect: false,withCredentials: false});
            
            target.on("work", (socket: any) => {
                const messanger = messages.slice();
                messanger.push(socket)
                setMessages(messanger)
            })

            target.connect()
            setSocket(target)
        }


    }, []);

    const sendMessage = (e: any) => {
        socket.emit("work", text)
    }

    return <>
        <input onChange={(e)=>setText(e.target.value)} value={text}/>
        <button onClick={sendMessage}>Отправить</button>
        <div>
            {messages.map((value, index) => <div key={index}>{value}</div>)}
        </div>
    </>
}
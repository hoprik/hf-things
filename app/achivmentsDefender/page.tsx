"use client"
import {Encoder} from "./fetch-req";
import { v4 as uuidv4 } from 'uuid';
export default function Page(){
    const send = async () => {
        const json = {
            "achievement": "start"
        }
        const e = new Uint8Array(Encoder(Date.now(), uuidv4(), uuidv4(), JSON.stringify(json)));
        const sends = await fetch("/achivmentsDefender/api", {
            method: "POST",
            body: e
        })
    }
    return <div>
        <button onClick={send}>Получить ачивку</button>
    </div>
}
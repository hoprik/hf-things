"use client"
import {useState} from "react";
import {SmartCaptcha} from "@yandex/smart-captcha";

export default function Page(){
    const [token, setToken] = useState('');
    const [ok, setOk] = useState("")
    const checker = async ()=>{
        const res = await fetch("/capcha/validate", {
            method: "POST",
            body: JSON.stringify({"capcha": token})
        })
        if(res.status !== 200){
            setOk("Проверка не пройдена")
        }
        const json = await res.json();
        if (json["ok"]){
            setOk("Проверка пройдена")
        }
        else{
            setOk("Проверка не пройдена")
        }
    }
    return <><SmartCaptcha sitekey="ysc1_YqNQDirilkPccVbpIZLk9R64iKVvTF0vH9gkpu0Vc00d4734" onSuccess={setToken} /><p>{ok}</p><button onClick={checker}>Отправка капчу на проверку</button></>;
}
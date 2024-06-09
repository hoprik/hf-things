
import {useEffect, useState } from "react";


export function useKeyboard(){
    const [userText, setUserText] = useState<{key: string, code:number}>({key: "", code:0})

    const handleUserKeyPress = (event: KeyboardEvent) => {
        const { key, keyCode } = event;
        setUserText({key: key, code: keyCode})
    };
    
    useEffect(() => {
        window.addEventListener("keydown", handleUserKeyPress);
        return () => {
            window.removeEventListener("keydown", handleUserKeyPress);
        };
    });

    return userText
}

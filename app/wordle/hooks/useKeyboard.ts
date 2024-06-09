import {useEffect, useState } from "react";


export function useKeyboard(){
    const [userText, setUserText] = useState<{key: string, keyCode:number}>({key: "", keyCode:0})

    const handleUserKeyPress = (event: KeyboardEvent) => {
        const { key, keyCode } = event;
        setUserText({key: key, keyCode: keyCode})
    };

    useEffect(() => {
        window.addEventListener("keydown", handleUserKeyPress);
        return () => {
            window.removeEventListener("keydown", handleUserKeyPress);
        };
    });

    return userText
}

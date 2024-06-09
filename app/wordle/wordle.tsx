"use client"
import { useEffect, useState } from 'react';
import './wordle.css'
import { useKeyboard } from './hooks/useKeyboard';

 const REG_EXP_RUS_WORD = /[А-я][а-яё]*$/

export default function Wordle(){
    const {key, keyCode} = useKeyboard()
    const [cursor, setCursor] = useState(0)
    const [row, setRow] = useState(0)
    const [text, setText] = useState<[[string, string, string, string, string], [string, string, string, string, string], [string, string, string, string, string], [string, string, string, string, string], [string, string, string, string, string], [string, string, string, string, string]]>([["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""]])
    useEffect(()=>{
        if (REG_EXP_RUS_WORD.test(key)){
            const item = text.slice()
            item[row][cursor] = key
            // @ts-ignore
            setText(item)
            setCursor(cursor+1)
        }
        if (keyCode == 8){
            const item = text.slice()
            item[row][cursor-1] = ""
            // @ts-ignore
            setText(item)
            setCursor(cursor-2)
        }
        if (cursor == 5){
            console.log("Проверию на беке");
            
        }
    }, [key, keyCode, row])
    return <>
        {new Array(6).fill(0).map((data, key) => {
            return (
                <div className={`wordle_row adress`} key={key}>
                    {new Array(5).fill(0).map((data2, key2) => {
                        return <div className="wordle_item" key={key2}>{text[key][key2]}</div>;
                    })}
                </div>
            );
        })}
    </>
}
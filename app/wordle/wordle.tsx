"use client"
import { useEffect, useState } from 'react';
import './wordle.css'
import j from "refractor/lang/j";
import {boolean} from "property-information/lib/util/types";

const REG_EXP_RUS_WORD = /[А-я][а-яё]*$/

export default function Wordle(){
    const [cursor, setCursor] = useState(0)
    const [row, setRow] = useState(0)
    const [text, setText] = useState<[[string, string, string, string, string], [string, string, string, string, string], [string, string, string, string, string], [string, string, string, string, string], [string, string, string, string, string], [string, string, string, string, string]]>([["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""]])
    const [colorRowGreen, setColorRowGreen] = useState<[[boolean, boolean, boolean, boolean, boolean], [boolean, boolean, boolean, boolean, boolean], [boolean, boolean, boolean, boolean, boolean], [boolean, boolean, boolean, boolean, boolean], [boolean, boolean, boolean, boolean, boolean], [boolean, boolean, boolean, boolean, boolean]]>([[false, false, false, false, false], [false, false, false, false, false], [false, false, false, false, false], [false, false, false, false, false], [false, false, false, false, false], [false, false, false, false, false]])
    const [colorRowYellow, setColorRowYellow] = useState<[[boolean, boolean, boolean, boolean, boolean], [boolean, boolean, boolean, boolean, boolean], [boolean, boolean, boolean, boolean, boolean], [boolean, boolean, boolean, boolean, boolean], [boolean, boolean, boolean, boolean, boolean], [boolean, boolean, boolean, boolean, boolean]]>([[false, false, false, false, false], [false, false, false, false, false], [false, false, false, false, false], [false, false, false, false, false], [false, false, false, false, false], [false, false, false, false, false]])
    const [id, setId] = useState<string>()
    const [win, setWin] = useState<boolean>()
    const handleUserKeyPress = async (event: KeyboardEvent) =>{
        const { key, keyCode } = event;
        if (REG_EXP_RUS_WORD.test(key) && cursor < 5){
            console.log(row)
            const item = text.slice()
            item[row][cursor] = key.toLowerCase()
            // @ts-ignore
            setText(item)
            setCursor(cursor+1)
        }
        if (keyCode == 8 && cursor > 0){
            const item = text.slice()
            item[row][cursor-1] = ""
            // @ts-ignore
            setText(item)
            setCursor(cursor-1)
        }
        if (cursor == 4){
            const word = text[row][0]+text[row][1]+text[row][2]+text[row][3]+text[row][4]
            const json = {
                word: word,
                id: id
            }
            const res = await fetch("wordle/api/ask", {
                method: "POST",
                body: JSON.stringify(json)
            })
            console.log(json)
            if (res.status !== 200) {
                console.log("error response: "+ res.status)
                return
            }
            const ask = await res.json()
            if (!ask["success"]){
                console.log("Слово не нашел")
                return
            }
            const green: [boolean, boolean, boolean, boolean, boolean] = ask["green"]
            const yellow: [boolean, boolean, boolean, boolean, boolean]  = ask["yellow"]
            const newYellow: boolean[] = []

            green.forEach((value, index) => {

                if (value == yellow[index]){
                    newYellow.push(false)
                }
                else {
                    newYellow.push(true)
                }
            })


            const itemGreen = colorRowGreen.slice()
            itemGreen[row] = green
            // @ts-ignore
            setColorRowGreen(itemGreen)

            const itemYellow = colorRowYellow.slice()
            // @ts-ignore
            itemYellow[row] = newYellow
            // @ts-ignore
            setColorRowYellow(itemYellow)

            // @ts-ignore
            if (itemGreen.every(value => value === true)){
                console.log("Вы выйграли!")
                setRow(0)
                setCursor(0)
                setWin(true)
                window.removeEventListener("keydown", handleUserKeyPress);
            }

            setRow(row+1)
            setCursor(0)
        }

        if (row == 5){
            console.log("Вы проиграли!")
        }
    }

    useEffect(() => {
        fetch("wordle/api/init", {
            method: "POST"
        }).then(res => res.json().then(value => {
            if (!value["success"]){
                console.log("error response: "+ res.status)
                return
            }
            setId(value["code"])
        }))
    }, []);

    useEffect( ()=>{
        window.addEventListener("keydown", handleUserKeyPress);
        return () => {
            window.removeEventListener("keydown", handleUserKeyPress);
        };
    })
    return <>
        {new Array(6).fill(0).map((data, key) => {
            return (
                <div className={`wordle_row`} key={key}>
                    {new Array(5).fill(0).map((data2, key2) => {
                        return <div className="wordle_item" style={{backgroundColor: colorRowGreen[key][key2] ? "green" : colorRowYellow[key][key2] ? "yellow" : ""}} key={key2}>{text[key][key2]}</div>
                    })}
                </div>
            );
        })}
    </>
}
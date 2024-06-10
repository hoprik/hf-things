"use client"
import {useEffect, useRef, useState} from 'react';
import { useKeyboard } from './hooks/useKeyboard';
import './wordle.css'

const REG_EXP_RUS_WORD = /[А-я][а-яё]*$/
const ROWS = 6
const COLS = 5
type TextType = { color: string; letter: string };
type GameState = {"id": string, win: boolean}

function getMass(length: number) {
    return new Array(length).fill(0)
}
export default function Wordle(){
    const [texts, setTexts] = useState<TextType[][]>([[]]);
    const keyboardEvent = useKeyboard()
    const gameState = useRef<GameState>({id: "", win: false});
    const hasMounted = useRef(false);

    const getWord = (row: number)=>{
        let word = ""
        texts[row].forEach(container=>word+=container["letter"])
        return word
    }


    const logicGame = async (row: number,)=>{
        const items = texts.slice()
        const json = {
            word: getWord(row),
            id: gameState.current["id"]
        }
        const res = await fetch("wordle/api/ask", {
            method: "POST",
            body: JSON.stringify(json)
        })
        if (res.status !== 200) {
            return [false, "error response: "+ res.status]
        }
        const ask = await res.json()
        if (!ask["success"]){
            return [false, "Слово не нашел"]
        }
        const green: [boolean, boolean, boolean, boolean, boolean] = ask["green"]
        const yellow: [boolean, boolean, boolean, boolean, boolean]  = ask["yellow"]

        yellow.forEach((value, index, array)=>{
            if (value && green[index]){
                items[row][index]["color"] = "green"
                return
            }
            if (value){
                items[row][index]["color"] = "yellow"
                return;
            }
            if (!value || !green[index]){
                items[row][index]["color"] = "gray"
                return;
            }
        })

        if (green.every(value => value)){
            const settings = gameState.current
            settings["win"] = true
            gameState.current = settings
        }

        return [true, items]
    }

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            fetch("wordle/api/init", {
                method: "POST"
            }).then(res => res.json().then(value => {
                if (!value["success"]) {
                    console.log("error response: " + res.status)
                    return
                }
                const settings = gameState.current
                settings["id"] = value["code"]
                gameState.current = settings

            }))
        }
    }, [gameState]);

    useEffect(()=>{
        if (!keyboardEvent || gameState.current["win"]){
            return
        }
        console.log(texts)
        console.log(gameState.current)

        const {key} = keyboardEvent
        let items = texts.slice()
        let row = items.length - 1

        // добавили букву
        if (REG_EXP_RUS_WORD.test(key)){
            items[row].push({"color": "", "letter": key})
        }

        // удаление буквы
        if (key == "Backspace"){
            items[row].pop()
        }

        // слово написали полностью
        if (texts[row]?.length === COLS){
            console.log("triger")
            logicGame(row).then(value => {
                const [success, answer] = value
                console.log("triger2")
                if (success && typeof answer !== "string" && typeof answer !== "boolean"){
                    items = answer
                    items.push([])
                    console.log(items)
                }
                else{
                    items[row] = []
                    console.log(answer)
                }
                if (texts.length == ROWS && !gameState.current["win"]) setTimeout(()=>alert("Ты проиграл, ты лох!"), 1000)
                if (gameState.current["win"]) setTimeout(()=>alert("Ты выйграл, ты не лох!"), 1000)
                setTexts(items)
            })
            return;
        }

        setTexts(items)
    }, [keyboardEvent])

    return <>
        {getMass(ROWS).map((_, row) => (
            <div className="wordle_row adress" key={row}>
                {getMass(COLS).map((_, col) => {
                    const hasItem = row < texts.length && col < texts[row].length
                    return <div className="wordle_item" style={{backgroundColor: hasItem? texts[row][col]["color"] : ""}} key={col}>{hasItem ? texts[row][col]["letter"] : ""}</div>;
                })}
            </div>
        ))}
    </>
}
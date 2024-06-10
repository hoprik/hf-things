"use client"
import {useEffect, useRef, useState} from 'react';
import { useKeyboard } from './hooks/useKeyboard';
import './wordle.css'

const REG_EXP_RUS_WORD = /[А-я][а-яё]*$/
const ROWS = 6
const COLS = 5
type ITextType = { color: string; letter: string };
type IGameState = {id: string; win: boolean}
type IAsk = {success: boolean, green: boolean[]; yellow: boolean[]}

function getMass(length: number) {
    return new Array(length).fill(0)
}
export default function Wordle(){
    const [texts, setTexts] = useState<ITextType[][]>([[]]);
    const keyboardEvent = useKeyboard()
    const IGameState = useRef<IGameState>({id: "", win: false});
    const hasMounted = useRef(false);

    const getWord = (row: number)=>{
        let word = ""
        texts[row].forEach(container=>word+=container.letter)
        return word
    }

    const logicGame = async (row: number,)=>{
        const items = texts.slice()
        const json = {
            word: getWord(row),
            id: IGameState.current.id
        }
        const res = await fetch("wordle/api/ask", {
            method: "POST",
            body: JSON.stringify(json)
        })
        if (res.status !== 200) {
            throw new Error(res.statusText)
        }
        const {success, green, yellow} = (await res.json()) as IAsk
        if (!success){
            return [false, "Слово не нашел"]
        }

        yellow.forEach((value, index, array)=>{
            if (value && green[index]){
                items[row][index].color = "green"
                return
            }
            if (value){
                items[row][index].color = "yellow"
                return;
            }
            if (!value || !green[index]){
                items[row][index].color = "gray"
                return;
            }
        })

        if (green.every(value => value)){
            const settings = IGameState.current
            settings.win = true
            IGameState.current = settings
        }

        return [true, items]
    }

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            fetch("wordle/api/init", {
                method: "POST"
            }).then(res => res.json().then(value => {
                if (!value.success) {
                    return
                }
                const settings = IGameState.current
                settings.id = value.code
                IGameState.current = settings
            }))
        }
    }, [hasMounted, IGameState]);

    useEffect(()=>{
        if (!keyboardEvent || IGameState.current.win){
            return
        }

        const {key} = keyboardEvent
        let items = texts.slice()
        let row = items.length - 1

        // добавили букву
        if (REG_EXP_RUS_WORD.test(key)){
            items[row].push({color: "", letter: key})
        }

        // удаление буквы
        if (key == "Backspace"){
            items[row].pop()
        }

        // слово написали полностью
        if (texts[row]?.length === COLS){
            logicGame(row).then(value => {
                const [success, answer] = value
                if (success && typeof answer !== "string" && typeof answer !== "boolean"){
                    items = answer
                    items.push([])
                }
                else{
                    items[row] = []
                }
                if (texts.length == ROWS && !IGameState.current.win) setTimeout(()=>alert("Ты проиграл, ты лох!"), 1000)
                if (IGameState.current.win) setTimeout(()=>alert("Ты выйграл, ты не лох!"), 1000)
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
"use client"
import { useEffect, useState } from 'react';
import { useKeyboard } from './hooks/useKeyboard';
import './wordle.css'

const REG_EXP_RUS_WORD = /[А-я][а-яё]*$/
const ROWS = 6
const COLS = 5

function getMass(length: number) {
    return new Array(length).fill(0)
}

export default function Wordle(){
    const [texts, setTexts] = useState<string[][]>([[]])

    const keyboardEvent = useKeyboard()

    useEffect(()=>{
        if (!keyboardEvent){
            return
        }

        const {key} = keyboardEvent
        const items = texts.slice()
        let row = items.length - 1

        // добавили букву
        if (REG_EXP_RUS_WORD.test(key)){
            items[row].push(key)
        }

        // удаление буквы
        if (key == "Backspace"){
            items[row].pop()
        }

        // слово написали полностью
        if (texts[row]?.length === COLS){
            items.push([])
            console.log("Проверию на беке");
        }

        setTexts(items)
    }, [keyboardEvent])

    return <>
        {getMass(ROWS).map((_, row) => (
            <div className="wordle_row adress" key={row}>
                {getMass(COLS).map((_, col) => {
                    const hasItem = row < texts.length && col < texts[row].length
                    return <div className="wordle_item" key={col}>{hasItem ? texts[row][col] : ""}</div>;
                })}
            </div>
        ))}
    </>
}
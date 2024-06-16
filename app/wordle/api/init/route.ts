import {closeDB, openDB} from "../../../../mongoDB/general";
import { v4 as uuidv4 } from 'uuid';
import Wordle from "../../../../mongoDB/models/wordle";
import {IWordle} from "@/types";
import {getRandomWord} from "@/app/wordle/api/functions";

export async function POST(){
    const sourceWord = getRandomWord()
    try{
        await openDB()

        const wordleShema: IWordle = {
            sourceWord
        }

        const newUser = new Wordle(wordleShema)
        await newUser.save()

        const _id = newUser["_id"].toString()

        console.log(_id)

        await closeDB()
        return Response.json({"success": true, "code": _id})
    }catch(e){
        console.log(e)
        return Response.json({"error":"Ошибка иницализации"})
    }
}
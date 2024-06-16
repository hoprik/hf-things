import {getGreen, getYellow, isWordInList} from "@/app/wordle/api/functions";
import {closeDB, openDB} from "@/mongoDB/general";
import Wordle from "@/mongoDB/models/wordle";

export async function POST(req: Request){
    const json = await req.json()
    if (!("word" in json) || !("id" in json)){
        return Response.json({"error": "Общий сбой"})
    }

    const word = json["word"]
    const id = json["id"]
    if (!isWordInList(word)){
        return Response.json({"success": false, "error": "Слово не найдено"})
    }

    await openDB()
    const wordle = await Wordle.findOne({ _id: id })
    await closeDB()

    if (wordle == null){
        return Response.json({"error": "Общий сбой"})
    }

    const wordSource = wordle["sourceWord"].toLowerCase()

    return Response.json({"success": true, "green": getGreen(wordSource, word), "yellow": getYellow(wordSource, word)})

}
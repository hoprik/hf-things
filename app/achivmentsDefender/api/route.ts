import {NextResponse} from "next/server";
import {Decoder} from "../fetch-req";

function stringToBytes(text: string){
    let myBuffer = [];
    let buffer = Buffer.from(text);
    for (let i = 0; i < buffer.length; i++) {
        myBuffer.push(buffer[i]);
    }
    return myBuffer
}

export async function POST(req: Request){
    const text = await req.text();
    const e =  Decoder(stringToBytes(text))
    if (!e[0]){
        return Response.json({"error": e[1]})
    }
    return Response.json({"answer": e[1]})
}
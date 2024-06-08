import {NextRequest} from "next/server";

export async function POST(req: NextRequest){
    const ip = req.ip
    const body = await req.json();
    const validator = await fetch(`https://smartcaptcha.yandexcloud.net/validate?secret=${process.env.CAPCHA_SERVER}&token=${body["capcha"]}&ip=${ip}`)
    if (validator.status !== 200){
        return Response.json({"error": "Invalid credentials"});
    }
    const validatorJson = await validator.json()

    return Response.json({"ok": validatorJson.status == "ok"})
}
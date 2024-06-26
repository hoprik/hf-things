import {promises as fs, existsSync} from "fs";

type ISaveData = {
    mdText: string,
    subject: string,
    theme: string,
    nameTheme: string
}

function translit(word: string){
    let answer = '';
    const converter = {
        'а': 'a',    'б': 'b',    'в': 'v',    'г': 'g',    'д': 'd',
        'е': 'e',    'ё': 'e',    'ж': 'zh',   'з': 'z',    'и': 'i',
        'й': 'y',    'к': 'k',    'л': 'l',    'м': 'm',    'н': 'n',
        'о': 'o',    'п': 'p',    'р': 'r',    'с': 's',    'т': 't',
        'у': 'u',    'ф': 'f',    'х': 'h',    'ц': 'c',    'ч': 'ch',
        'ш': 'sh',   'щ': 'sch',  'ь': '',     'ы': 'y',    'ъ': '',
        'э': 'e',    'ю': 'yu',   'я': 'ya',

        'А': 'A',    'Б': 'B',    'В': 'V',    'Г': 'G',    'Д': 'D',
        'Е': 'E',    'Ё': 'E',    'Ж': 'Zh',   'З': 'Z',    'И': 'I',
        'Й': 'Y',    'К': 'K',    'Л': 'L',    'М': 'M',    'Н': 'N',
        'О': 'O',    'П': 'P',    'Р': 'R',    'С': 'S',    'Т': 'T',
        'У': 'U',    'Ф': 'F',    'Х': 'H',    'Ц': 'C',    'Ч': 'Ch',
        'Ш': 'Sh',   'Щ': 'Sch',  'Ь': '',     'Ы': 'Y',    'Ъ': '',
        'Э': 'E',    'Ю': 'Yu',   'Я': 'Ya'
    };

    for (let i = 0; i < word.length; i++ ) {
        // @ts-ignore
        if (converter[word[i]] == undefined){
            answer += word[i];
        } else {
            // @ts-ignore
            answer += converter[word[i]];
        }
    }

    return answer;
}

export async function POST(req: Request){
    const {mdText, subject, theme, nameTheme} = (await req.json()) as ISaveData;
    const infoFile = {
        name: nameTheme
    }
    if (!existsSync(process.cwd() + '/public/'+translit(subject))){
        await fs.mkdir(process.cwd() + '/public/'+translit(subject))
    }
    if (!existsSync(process.cwd() + '/public/'+translit(subject)+"/"+translit(theme))){
        await fs.mkdir(process.cwd() + '/public/'+translit(subject)+"/"+translit(theme))
    }
    await fs.writeFile(process.cwd() + '/public/'+translit(subject)+"/"+translit(theme)+"/lesson.json", JSON.stringify(infoFile))
    await fs.writeFile(process.cwd() + '/public/'+translit(subject)+"/"+translit(theme)+"/lesson.md", mdText)
    return Response.json({"ok": true})
}
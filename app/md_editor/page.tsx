"use client"
import {config, MdEditor, ToolbarNames} from "md-editor-rt";
import {useState} from "react";
import { promises as fs } from 'fs';
import 'md-editor-rt/lib/style.css';
import RU from '@vavt/cm-extension/dist/locale/ru';

config({
    editorConfig: {
        languageUserDefined: {
            'ru': RU
        }
    }
});

const toolbar: ToolbarNames[] = [
    '=',
    'pageFullscreen',
    'fullscreen',
    'preview',
    'previewOnly',
    'htmlPreview',
    'catalog',
    'github'
];

export default function Page() {
    const [mdText, setMdText] = useState<string>('# Привет редактор!');
    const [subject, setSubject] = useState<string>("")
    const [theme, setTheme] = useState<string>("")
    const [nameTheme, setNameTheme] = useState<string>("")
    const onSave = async (e: any)=>{
        const saveData = {
            mdText,
            subject,
            theme,
            nameTheme
        }
        const res = await fetch("/md_editor/api", {
            method: "POST",
            body: JSON.stringify(saveData)
        })
        const json = await res.json()
        console.log(json)
    }
    return <>
        <div style={{display: "flex", height: "50px"}}>
            <input placeholder="Предмет" onChange={e => setSubject(e.target.value)}/>
            <p>/</p>
            <input placeholder="Тема" onChange={e => setTheme(e.target.value)}/>
            <p>/</p>
            <input placeholder="Название урока" onChange={e => setNameTheme(e.target.value)}/>
        </div>
        <MdEditor modelValue={mdText} onChange={setMdText} language="ru" codeTheme="github" toolbarsExclude={toolbar}
                  noUploadImg={true} autoDetectCode={true} onSave={onSave}/>
    </>;
}
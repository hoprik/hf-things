"use client"
import {useEffect, useRef, useState} from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';
import j from "refractor/lang/j";

export default function Page(){
    const [htmlContent, setHtmlContent] = useState(``);
    const [cssContent, setStyleContent] = useState(``);
    const [jsContent, setJsContent] = useState(``);
    const iframeRef = useRef(null);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (iframe) {
            // @ts-ignore
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            const css = `<style>${cssContent}</style>`
            const js = `<script type="text/javascript">${jsContent}</script>`
            doc.open();
            doc.write(css+htmlContent+js);
            doc.close();
        }

    }, [htmlContent, cssContent, jsContent]);

    const handleChangeHtml = (event: any) => {
        setHtmlContent(event.target.value);
    };
    const handleChangeCss = (event: any) => {
        setStyleContent(event.target.value);
    };
    const handleChangeJs = (event: any) => {
        setJsContent(event.target.value);
    };

    return (
        <div>
            <CodeEditor
                value={htmlContent}
                language="html"
                placeholder="Please enter HTML code."
                onChange={handleChangeHtml}
                padding={15}
                data-color-mode="dark"
                style={{
                    marginTop: "10px",
                    backgroundColor: "#f5f5f5",
                    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                }}
            />
            <CodeEditor
                value={cssContent}
                language="css"
                placeholder="Please enter CSS code."
                onChange={handleChangeCss}
                padding={15}
                data-color-mode="dark"
                style={{
                    marginTop: "10px",
                    backgroundColor: "#f5f5f5",
                    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                }}
            />
            <CodeEditor
                value={jsContent}
                language="js"
                placeholder="Please enter JS code."
                onChange={handleChangeJs}
                padding={15}
                data-color-mode="dark"
                style={{
                    marginTop: "10px",
                    backgroundColor: "#f5f5f5",
                    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                }}
            />
            <iframe ref={iframeRef} width="600" height="400" title="iframe"></iframe>
        </div>
    );
}
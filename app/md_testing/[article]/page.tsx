import {MDXRemote} from "next-mdx-remote/rsc";

type Props = {
    params: { article: string }
}

type Article = {
    name: string
    download_url: string
}

type InfoFile = {
    name: string,
    description: string
}

type Author ={
    committer: {login: string, avatar_url: string, html_url: string}
}

const githubOptionsApi: RequestInit = {
    cache: "no-store",
    headers:{
        "Authorization": process.env.Auth ?? ""
    }
}

async function getArticle (article: string) {
    const res = await fetch(`https://api.github.com/repos/hoprik/hf-articles/contents/articles`, githubOptionsApi);

    if (!res.ok) {
        throw new Error("Failed");
    }
    const articleJson: [Article] = await res.json();
    const articleArray = articleJson.filter(value => value.name.includes(article));
    if (articleArray.length == 0){
        return []
    }
    return articleArray[0].name.includes(".md")? [articleArray[0], articleArray[1]] : [articleArray[1], articleArray[0]]
};

async function getSourceArticle(articleObject: { download_url: string }){
    const {name, download_url} = (articleObject) as Article;
    const res = await fetch(download_url, githubOptionsApi);
    if (!res.ok) {
        throw new Error("Failed");
    }
    return res.text()
}

async function getArticleAuthors(article: string){
    const res = await fetch(`https://api.github.com/repos/hoprik/hf-articles/commits?path=articles/`+article, githubOptionsApi);
    if (!res.ok) {
        throw new Error("Failed");
    }
    const authors: [Author] = await res.json()
    const articleArray: { login: string; avatar_url: string; html_url: string }[] = []
    authors.forEach(value => {
        const {committer} = value as Author
        articleArray.push(committer)
    })
    return articleArray
}

export async function generateMetadata({params}: Props,){
    const article = params.article
    const articleData = await getArticle(article)
    if (articleData.length == 0){
        return {
            title: "Ошибка 404"
        }
    }
    const sourceText = await getSourceArticle(articleData[1])
    const parsedText = JSON.parse(sourceText) as InfoFile
    return {
        title: parsedText.name,
        description: parsedText.description,
    }
}

async function Page({params}: Props){
    const article = params.article
    const articleData = await getArticle(article)
    if (articleData.length == 0){
        return <p>404</p>
    }
    const sourceText = await getSourceArticle(articleData[0])
    const articleAuthors = await getArticleAuthors(articleData[0].name)
    return <>
        <div>Редактировали: {articleAuthors.map((value, index) => {
            return <a key={index} href={value.html_url}><img src={value.avatar_url} alt={value.login} title={value.login}/></a>
        })}</div>
        <MDXRemote source={sourceText}/>
    </>
}

export default Page
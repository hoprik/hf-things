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

async function getSourceArticles(articleObject: Article[]){
    const newUrls = []
    for (const item of articleObject){
        const res = await fetch(item.download_url, githubOptionsApi);
        const info = await res.text();
        const parsedText = JSON.parse(info) as InfoFile
        newUrls.push({name: parsedText.name, url: item.name.split(".")[0]})
    }
    return newUrls
    
}

async function getData (){
    const res = await fetch(`https://api.github.com/repos/hoprik/hf-articles/contents/articles`, githubOptionsApi);

    if (!res.ok) {
    }
    const articleJson: [Article] = await res.json();
    const articleArray = articleJson.filter(value => value.name.includes(".json"));
    if (articleArray.length == 0){
        return []
    }   

    const doneAnswer = await getSourceArticles(articleArray)
    return doneAnswer
    
};

async function Page(){
    const info = await getData();
    
    return <div>
        <ul>
        {info.map((value, index) => {
            return <li><a href={"md_testing/"+value.url}>{value.name}</a></li>
        })}
        </ul>
    </div>
}

export default Page
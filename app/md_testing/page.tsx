async function getData (){
    const res = await fetch(`https://api.github.com/repos/hoprik/hf-articles/contents/articles`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed");
    }
    return res.json();
};

async function Page(){
    const data: [{name: string}] = await getData();
    const info = data.filter(value => value.name.includes("md"))
    return <div>
        <ul>
        {info.map((value, index) => {
            return <li><a href={"md_testing/"+value.name.split(".")[0]}>{value.name.split(".")[0]}</a></li>
        })}
        </ul>
    </div>
}

export default Page
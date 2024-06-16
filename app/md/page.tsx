import { MDXRemote } from 'next-mdx-remote/rsc'
import { promises as fs } from 'fs';
// npm i next-mdx-remote
// https://nextjs.org/docs/app/building-your-application/configuring/mdx#remote-mdx
export default async function MD() {
    console.log(process.cwd() + '/pubic/test.md')
    const file = await fs.readFile(process.cwd() + '/public/test.md', 'utf8');
    return <>
        <MDXRemote source={"https://raw.githubusercontent.com/hoprik/hf-articles/master/articles/hello.md"}/>
    </>
}
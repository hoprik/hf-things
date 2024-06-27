import { openDB, closeDB } from "@/mongoDB/general";
import Profile from "@/mongoDB/models/profiles"

async function getProfile(id: string){
    openDB();

    const user = await Profile.findOne({ _id: id });
    if (!user){
        return "Ноу нейм";
    }

    closeDB();

    return `${user["name"]} ${user["surname"]}`
}

async function Page(){
    const profile = await getProfile("667dd9bc3dcca05931be1320");
    return <p>Привет {profile}</p>
}

export default Page;
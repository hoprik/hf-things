import dict from '../../../public/dictionary.json'
function getDictionary(){
    return dict.words
}

export function getRandomWord(){
    const dictionary = getDictionary()
    const random = Math.floor(Math.random() * dictionary.length)
    return dictionary[random]
}

function filterYellow(value: string, index: number, array: string[], sourceWord: string){
    return sourceWord.includes(value)
}

export function getYellow(sourceWord: string, targetWord: string){
    const answer: any = []
    targetWord.split("").filter((value, index, array)=>{
        answer.push(filterYellow(value, index, array, sourceWord))
    })
    return answer
}

function filterGreen(value: string, index: number, array: string[], sourceWord: string){
    return value == sourceWord[index]
}

export function getGreen(sourceWord: string, targetWord: string){
    const answer: any = []
    targetWord.split("").filter((value, index, array)=>{
        answer.push(filterGreen(value, index, array, sourceWord))
    })
    return answer
}

export function isWordInList(word: string) {
    return getDictionary().includes(word[0].toUpperCase() + word.slice(1));
}

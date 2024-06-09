import './wordle.css'
export default function Page(){
    return <>
        {new Array(6).fill(0).map((data, key) => {
            return (
                <div className="wordle_row" key={key}>
                    {new Array(5).fill(0).map((data2, key2) => {
                        return <div className="wordle_item" key={key2} />;
                    })}
                </div>
            );
        })}

    </>
}
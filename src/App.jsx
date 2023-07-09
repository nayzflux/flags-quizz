import data from './data/curiexplore-pays.json';
import {useEffect, useMemo, useState} from "react";
import {compareTwoStrings} from "string-similarity";

// Création du tableau de 0 à 215
const tableau = [];
for (let i = 0; i <= 215; i++) {
    tableau.push(i);
}


function App() {
    const [score, setScore] = useState(0)
    const [current, setCurrent] = useState({});
    const [index, setIndex] = useState(0);

    const [name, setName] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [hasFailed, setHasFailed] = useState(false)

    const order = useMemo(() => {
        return(
            shuffle(tableau)
        )
    }, [tableau]);

    useEffect(() => {
        console.log(`On va prendre l'index : ${order[index]}`)
        setCurrent(data[order[index]])
    }, [index]);

    useEffect(() => {
        console.log(current)
    }, [current])

    function shuffle(tableau) {
        let currentIndex = tableau.length;
        let temporaryValue, randomIndex;

        // Tant qu'il reste des éléments à mélanger
        while (currentIndex !== 0) {
            // Sélectionne un élément restant de façon aléatoire
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // Échange l'élément actuel avec l'élément aléatoire sélectionné
            temporaryValue = tableau[currentIndex];
            tableau[currentIndex] = tableau[randomIndex];
            tableau[randomIndex] = temporaryValue;
        }

        return tableau;
    }

    useEffect(() => {
        if (name === "") return;
        setSuccess('');
        setError('')
    }, [name]);


    const handleSubmit = (e) => {
        e.preventDefault()

        console.log(current.fields.name_fr.toLowerCase(), name.toLowerCase())

        if (compareTwoStrings(current.fields.name_fr, name)) {
            setIndex(i => (i+1))
            setName('')
            setSuccess('Bonne réponse !')

            if (!hasFailed) {
                setScore(s => (s+1))
            }

            setHasFailed(false);
        } else {
            setName('')
            setHasFailed(true);
            setError('Réponse incorrecte, essayé une autre réponse !');
        }
    }

    const skip = () => {
        setError("C'était le " + current.fields.name_fr)
        setIndex(i => (i+1));
    }

    return (
        <main className="p-10 text-white flex flex-col justify-center items-center gap-8 w-full h-screen bg-gray-900">
            {
                index === 216 ?
                    <div className="font-bold text-4xl"}>
                        Votre Score est de {score}/{tableau.length}
                    </div>
                :
                    <>
                        <h1 className="text-2xl font-semibold">Quizz Drapeaux du Monde</h1>

                        <img className="h-[400px]" alt="Drapeau du pays mystère" src={current?.fields?.flag}/>
                        <p className="font-semibold hidden">{current?.fields?.name_fr}</p>

                        <div className="flex gap-4 w-full items-center">
                            <div className="p-3 bg-blue-600 rounded shadow hover:shadow-lg hover:shadow-blue-600 transition">
                                <span>{score}/{index + 1}</span>
                            </div>

                            <form onSubmit={handleSubmit} className="flex gap-4 w-full items-center">
                                <input className="w-full p-3 rounded focus:outline-blue-600 shadow focus:shadow-lg transition focus:shadow-blue-600 outline outline-2 outline-neutral-300 bg-gray-700 text-white placeholder:text-white" value={name} placeholder={"Nom du pays (en FR)..."} onChange={(e) => setName(e.target.value)}/>
                                <button className="ml-auto px-5 py-2.5 bg-blue-600 rounded shadow hover:shadow-lg hover:shadow-blue-600 transition">Valider</button>
                                <button type="button" className="ml-auto px-5 py-2.5 bg-red-600 rounded shadow hover:shadow-lg hover:shadow-red-600 transition" onClick={skip}>Passer</button>
                            </form>
                        </div>

                        <div>
                            {error !== "" && <p className={"p-2 outline outline-2 outline-red-600 rounded text-red-600 "}>{error}</p>}

                            {success !== "" && <p className={"p-2 outline outline-2 outline-green-600 rounded text-green-600"}>{success}</p>}
                        </div>
                    </>
            }

        </main>
    )
}

export default App

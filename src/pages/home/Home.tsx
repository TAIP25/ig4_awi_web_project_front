import axios from "axios"
import { useEffect, useState } from "react"

import "./Home.scss"

/*
model Benevole {
    id        Int      @id @default(autoincrement())
    nom       String
    prenom    String
    email     String   @unique
    password  String
    pseudo    String   @unique
    tailleTShirt String?
    vegetarien Boolean?
    hebergement String?
    gameFavori Int?
    picture   Int?
    associationID Int?
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}
*/

interface Benevole {
    id: number,
    nom: string,
    prenom: string,
    email: string,
    password: string,
    pseudo: string,
    tailleTShirt: string | undefined,
    vegetarien: boolean | undefined,
    hebergement: string | undefined,
    gameFavori: number | undefined,
    picture: number | undefined,
    associationID: number | undefined,
    createdAt: Date,
    updatedAt: Date
}

export default function Home(){

    // UseState
    const [benevoles, setBenevoles] = useState<Benevole[]>([])

    // UseEffect
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/benevoles/`, undefined)
        .then(response => {
            setBenevoles(response.data)
        })
    }, [])

    return(
        <div className="home">
            <h1>Home</h1>
            <div className="benevole-list">
            {benevoles.map((element: Benevole) => {
                return(
                    <div className="benevole" key={element.id}>
                        <p>{element.nom}</p>
                        <p>{element.prenom}</p>
                        <p>{element.email}</p>
                        <p>{element.password}</p>
                        <p>{element.pseudo}</p>
                        <p>{element.tailleTShirt}</p>
                        <p>{element.vegetarien}</p>
                        <p>{element.hebergement}</p>
                        <p>{element.gameFavori}</p>
                        <p>{element.picture}</p>
                        <p>{element.associationID}</p>
                        {/* <p>{element.createdAt.toDateString()}</p>*/}
                        {/* <p>{element.updatedAt.toDateString()}</p>*/}
                    </div>
                )
            })}
            </div>
        </div>
    )
}
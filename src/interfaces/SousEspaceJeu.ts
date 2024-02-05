import Jeu from "./Jeu"

export default class SousEspaceJeu {

    // Constructor
    constructor(id: number, nom: string, description: string | null, nombreBenevoles: number, jeu: Jeu[], createdAt: Date, updatedAt: Date) {
        this.id = id
        this.nom = nom
        this.description = description
        this.nombreBenevoles = nombreBenevoles
        this.jeu = jeu
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    // Fields
    id: number
    nom: string
    description: string | null
    nombreBenevoles: number
    jeu: Jeu[]
    createdAt: Date
    updatedAt: Date
}
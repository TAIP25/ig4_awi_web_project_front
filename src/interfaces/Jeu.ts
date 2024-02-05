export default class Jeu {

    // Constructor
    constructor(id: number, nom: string, aAnimer: boolean, createdAt: Date, updatedAt: Date) {
        this.id = id
        this.nom = nom
        this.aAnimer = aAnimer
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    // Fields
    id: number
    nom: string
    aAnimer: boolean
    createdAt: Date
    updatedAt: Date
}
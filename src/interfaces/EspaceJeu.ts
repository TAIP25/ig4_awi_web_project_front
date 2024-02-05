import SousEspaceJeu from "./SousEspaceJeu";

export default class EspaceJeu {

    // Constructor
    constructor(id: number, nom: string, description: string | null, festivalID: number, sousEspaceJeux: SousEspaceJeu[], createdAt: Date, updatedAt: Date) {
        this.id = id
        this.nom = nom
        this.description = description
        this.festivalID = festivalID
        this.sousEspaceJeux = sousEspaceJeux
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    // Fields
    id: number
    nom: string
    description: string | null
    festivalID: number
    sousEspaceJeux: SousEspaceJeu[]
    createdAt: Date
    updatedAt: Date

}
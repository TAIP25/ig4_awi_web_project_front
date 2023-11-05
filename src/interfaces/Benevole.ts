export default interface Benevole {
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
export default interface Poste {
    id: number,
    festivalID: number,
    nom: string,
    description: string,
    nombreBenevoles: number,
    nombreBenevolesActuel: number,
    createdAt: Date,
    updatedAt: Date
}
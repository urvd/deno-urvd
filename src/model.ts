

// Tables

export interface User {
    id?: any;
    nom: string;
    prenom: string;
    mail: string;
}

export interface Livre {
    id?: any;
    titre: string;
    auteur: string;
    prix: number;
    quantite?: number;
}

export interface Emprunt{
    id: any;
    userref?: string;
    livreref?: string;
    date: Date;
    status: EmpruntStatus;
    penalite?: boolean;
}

// Common
export type EmpruntStatus = 'ATTENDRE' | 'EMPRUNTER' | 'RECEPTIONNER' |  'RETOURNER';
export const MAX_DELAIS = 15;
export interface EmpruntRecap {
    date?: Date;
    iduser?: string;
    idlivre?: string;
    emprunt_id?: string
    qte?: number; 
}
export class EmpruntResult {
    nom: string;
    prenom: string;
    mail: string;
    article: string;
    prix: string;
    date: Date;
    status: EmpruntStatus;

    constructor(emprunt: Emprunt, livre: Livre, user: User) {
        this.nom = user.nom;
        this.prenom = user.prenom;
        this.mail = user.mail;
        this.article = livre.titre + ' - ' + livre.auteur;
        this.prix = livre.prix + " euros";
        this.date = new Date();
        this.status = emprunt.status;
    }
}
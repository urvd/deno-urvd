
import { EmpruntRecap, EmpruntResult } from "./model.ts";
import { retourService, empruntService, receptionService } from './db_connect.ts';
import { Context } from 'https://deno.land/x/abc@v1.3.3/mod.ts';

// Service
export const emprunt = async(ctx: Context) => {
    const body: any = await ctx.body;
    await empruntService(body)
    .then(result => {
        ctx.json(result !== null? {utilisteur: {nom: result.nom, prenom: result.prenom}, 
        commande: {article: result.article, prix: result.prix}, 
        operation: {date: result.date, status: result.status}} : {});
    })
    .catch(err => {
        console.log('error when emprunt ! cause: '+ err);
        return {};
    }); 
}

export const reception = async(ctx: Context) => {
    //const result = new EmpruntResult()
    const body: any = await ctx.body;
    console.log(JSON.stringify(body));
    await receptionService(body.emprunt_id)
    .then((result:any)=> {
        const json = result !== null? {utilisteur: {nom: result.nom, prenom: result.prenom}, 
        commande: {article: result.article, prix: result.prix}, 
        operation: {date: result.date, status: result.status}} : {}
        console.log(JSON.stringify(json));
        ctx.json(json);
    })
    .catch(err => {
        console.log('error when reception ! cause: '+ err);
        return {};
    }); 
}

export const retour = async(ctx: Context) => {
    const body: any = await ctx.body;
    //await retourService(body.emprunt_id, body.date)
    await retourService(body.emprunt_id)
        .then((result:any)=> {
            ctx.json(result !== null? {utilisteur: {nom: result.nom, prenom: result.prenom}, 
            commande: {article: result.article, prix: result.prix}, 
            operation: {date: result.date, status: result.status}} : {});
        })
        .catch(err => {
            console.log('error when retour ! cause: '+ err);
            return {};
        }); 
}
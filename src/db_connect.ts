import { Client } from "https://deno.land/x/postgres/mod.ts";
import { difference } from "https://deno.land/std@0.106.0/datetime/mod.ts";
import { EmpruntRecap, EmpruntResult, MAX_DELAIS } from './model.ts';



const client = new Client('postgres://zlvrvzig:lYysax2jDOxnP9xuT3KhXpL1eiihCt5n@tai.db.elephantsql.com/zlvrvzig');
client.connect()
        .then(r => console.log('DB IS CONNECTED !!'))
        .catch(err => console.log('DB connection fail !!, cause: ' + err));


export const empruntService = async (body: EmpruntRecap): Promise<EmpruntResult | null>  => {
       
        // if(body.qte && body.qte !== 0) {
        //         const book: any = await client.queryObject('SELECT * FROM LIVRE WHERE id = '+body.idlivre+'\'');
        //         if(book.quantite <= body.qte) {
        //                 await client.queryArray('INSERT INTO emprunt(userref, livreref, date, status, qte) '+
        //                 'VALUES('+body.iduser+', '+ body.idlivre+', '+ new Date(), +', EMPRUNTER, '+ body.qte +')');
                        
        //                 await client.queryArray('UPDATE LIVRE SET quantite = '+ (book.quantite - body.qte) +' WHERE id = '+body.idlivre+'\'');
        
        //         }else{
        //                 await client.queryArray('INSERT INTO emprunt(userref, livreref, date, status, qte) '+
        //                 'VALUES('+body.iduser+', '+ body.idlivre+', '+ new Date(), +', ATTENDRE, '+ body.qte +')');
        //         }
        // }else{
                const query = `INSERT INTO emprunt(userref, livreref, status, qte) VALUES('${body.iduser}' , '${body.idlivre}' , 'EMPRUNTER', 0) returning id ;`;
                console.log('QUERY => ' + query);

                return await client.queryArray(query)
                .then(async rows => {
                        if(rows && rows.rows) {
                                console.log("Rows => "+JSON.stringify(rows.rows));
                                const row:any = rows.rows[0];
                                return await resultService(row);
                        }
                        else return null;
                })
                .catch(err => {
                        console.log("db cause: "+err);
                        return  null;
                })

        // }
        // return null;
        
};
export const receptionService = async (empruntId: string): Promise<EmpruntResult | null> => {
        const query = 'UPDATE EMPRUNT SET date = '+ new Date()+ ', status= \'RECEPTIONNER\'  WHERE id = \''+empruntId+'\';';
        console.log('QUERY => ' + query);
        return await client.queryArray(query)
        .then(async rep => await resultService(empruntId))
        .catch(err =>{
                console.log("db cause: "+err);
                return null;
        });
}

export const retourService = async (empruntId: string /*, dateRecu: Date*/): Promise<EmpruntResult | null> =>{
        const today = new Date();
        // const {days} = difference(today, dateRecu);
        // const penalite:boolean = days != null ? days > MAX_DELAIS:false;
        const query = 'UPDATE EMPRUNT SET date = '+ new Date()+ ', status= \'RETOURNER\'  WHERE id = \''+empruntId+'\'';
        console.log('QUERY => ' + query);

        await client.queryArray(query);
        return await resultService(empruntId);
}

export const resultService = async(empruntId: string): Promise<EmpruntResult | null> => {

        const query = 'SELECT u.nom, u.prenom, u.mail, l.titre, l.auteur, l.prix, e.id as emprunt_id, '+
        'e.qte, e.date, e.status, e.userref, e.livreref FROM CUSTOMER u, LIVRE l, EMPRUNT e WHERE u.id = e.userref AND l.id = e.livreref and e.id=\''+empruntId+'\'';
        console.log('QUERY => ' + query);

        return client.queryObject(query)
        .then(rows => {
                if(rows && rows.rows) {
                        console.log("Select Rows => "+JSON.stringify(rows.rows));
                        const row:any = rows.rows[0];
                        return new EmpruntResult({id: row.empruntId, date: row.date, status: row.status, userref: row.userref, livreref: row.livreref}, 
                                 {auteur: row.auteur, titre:row.titre, prix:row.prix},
                                 {nom: row.nom, prenom: row.prenom, mail: row.mail});
                }
                else{
                        console.log("reading fail!");
                        return null;
                }
        })
        .catch(err =>{
                console.log("reading fail, cause: " + err);
                return null;
        })
       
}
// export const resultService2 = async(userref: string, livreref: string): Promise<EmpruntResult | null> => {

//         const query = `SELECT u.nom, u.prenom, u.mail, l.titre, l.auteur, l.prix, e.id as emprunt_id, e.qte, e.date, e.status, e.userref, e.livreref 
//         FROM CUSTOMER u, LIVRE l, EMPRUNT e WHERE e.userref='${userref}' and l.livreref = '${livreref}' and u.id = e.userref AND l.id = e.livreref`;
//         console.log('QUERY => ' + query);

//         return await client.queryObject(query)
//         .then(rows => {
//                 if(rows && rows.rows) {
//                         console.log("Select Rows => "+JSON.stringify(rows.rows));
//                         const row:any = rows.rows[0];
//                         return new EmpruntResult({id: row.empruntId, date: row.date, status: row.status, userref: row.userref, livreref: row.livreref}, 
//                                  {auteur: row.autheur, titre:row.titre, prix:row.prix},
//                                  {nom: row.nom, prenom: row.prenom, mail: row.mail});
//                 }
//                 else{
//                         console.log("reading fail!");
//                         return null;
//                 }
//         })
//         .catch(err =>{
//                 console.log("reading fail, cause: " + err);
//                 return null;
//         })
// }
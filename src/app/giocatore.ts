import { DocumentData } from '@angular/fire/firestore';
import { identifierModuleUrl } from '@angular/compiler';

export class Giocatore {

    id: string;
    nome: String;
    punti: number;

    constructor(id:string,nome:String, punti:number){
        this.id=id;
        this.nome=nome;
        this.punti=punti;
    
    }

    static convertToJson(giocatori: Array<Giocatore>): Array<object>{
        var i;
        var arrObj=[];
        for( i=0; i<giocatori.length; i++){
            arrObj.push(
                {
                    id:giocatori[i].getId(),
                    nome:giocatori[i].getNome(),
                    punti:giocatori[i].getPunti()
                }
            );
        }
        return arrObj;
    }
    
    static convertToGiocatore(obj:Array<object>): Array<Giocatore>{
        let giocatori = obj;
        var i;
        var arrGioc=[];
        let id;
        let nome;
        let punti;
        for( i=0; i<giocatori.length; i++){
            Object.keys( giocatori[i]).map(function(key, index) {
                var value  = giocatori[i][key];
                if(key==="id")
                    id = value
                if(key==="nome")
                    nome = value
                if(key==="punti")
                    punti = value
              });
              //console.log(id+" "+nome+" "+punti)
            arrGioc.push(new Giocatore(id, nome,punti));

        }
        
        return arrGioc
    }

    static findGiocatoreById(id:string,giocatori:Array<Giocatore>): Giocatore{
        var i;
        for( i=0; i<giocatori.length; i++){
            if(giocatori[i].getId()===id)
                return giocatori[i]
        }
    }

    getId(): string{
        return this.id;
    }
    getNome(): String{
        return this.nome;
    }
    getPunti(): number{
        return this.punti;
    }
    setId(id: string): void{
        this.id=id;
    }
    setNome(nome: String): void{
        this.nome=nome;
    }
    setPunti(punti: number): void{
        this.punti=punti;
    }



}

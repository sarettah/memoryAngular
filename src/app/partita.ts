import { identifierModuleUrl } from '@angular/compiler';
import { DocumentData, DocumentSnapshot } from '@angular/fire/firestore';
import { Giocatore } from './giocatore';
import { Mossa } from './mossa';

export class Partita {

    id: string;
    nomi: Array<String>;
    mosse: Array<Mossa>;
    turno: String;
    vincitore: String;
    giocatori: Array<Giocatore>;

    constructor(id:string,nomi:Array<String>,mosse:Array<Mossa>,turno: String,vincitore: String,giocatori: Array<Giocatore>){
        this.id=id;
        this.nomi=nomi;
        this.mosse=mosse;
        this.turno=turno;
        this.vincitore=vincitore;
        this.giocatori=giocatori;
    }

    
    

    static convertToJson(partita: Partita): object{
        return {
            id: partita.getId(),
            nomi: partita.getNomi(),
            mosse:Mossa.convertToJson(partita.getMosse()),
            turno: partita.getTurno(),
            vincitore: partita.getVincitore(),
            giocatori: Giocatore.convertToJson(partita.getGiocatori())
            }


    }

    static convertToPartita(obj:DocumentData): Partita{
        
        let id = obj.id 
        let nomi = obj.nomi; 
        let mosse =  Mossa.convertToMossa(obj.mosse);
        let turno =  obj.turno 
        let vincitore =  obj.vincitore
        //console.log("get giocatori: "+obj.giocatori)
        let giocatori = Giocatore.convertToGiocatore(obj.giocatori)
        //console.log("get giocatori: "+giocatori.length)
        return new Partita(id,nomi, mosse, turno, vincitore,giocatori);
    }

    setNextTurno(idGiocatoreAttuale:string):String{
        var i;
        for(i=0; i<this.giocatori.length;i++){
            //console.log("i "+i)
            if(this.giocatori[i].getId() === idGiocatoreAttuale){
                if(i===this.giocatori.length-1)
                    return this.giocatori[0].getNome();
                else
                    return this.giocatori[i+1].getNome();
            }
        }
        
    }
  
    setPuntiGiocatoreById(id:string, punti:number){
        var i;
        //console.log("cerco giocatore con id "+id);
        for(i=0; i<this.giocatori.length;i++){
            if(this.giocatori[i].getId() === id){
                //console.log("trovato giocatore con id "+id);
                this.giocatori[i].setPunti(punti);
            }
        }
    }

    eliminaMossa(mossa:Mossa){
        var i;
        //console.log("mosse prima : "+this.mosse.length)
        if(mossa===null)
            return
        for(i=0; i<this.mosse.length;i++){
            if(this.mosse[i].getRiga() === mossa.getRiga() && this.mosse[i].getColonna() === mossa.getColonna()){
                console.log("eliminata mossa "+this.mosse[i].getRiga()+this.mosse[i].getColonna() )
                this.mosse.splice(i,1);
                
            }
        }
    }
    addMossa(mossa:Mossa){
       this.mosse.push(mossa);
    }
   /* findGiocatoreById(id:string):Giocatore{
        var i;
        for(i=0; i<this.giocatori.length;i++){
            if(this.giocatori[i].getId() === id){
              return this.giocatori[i];
            }
        }
    }*/

    getId(): string{
        return this.id;
    }
    getNomi(): Array<String>{
        return this.nomi;
    }
    getMosse(): Array<Mossa>{
        return this.mosse;
    }
    getTurno(): String{
        return this.turno;
    }
    getVincitore(): String{
        return this.vincitore;
    }
    getGiocatori(): Array<Giocatore>{
        return this.giocatori;
    }
    setId(id: string): void{
        this.id=id;
    }
    setNomi(nomi: Array<String>): void{
        this.nomi=nomi;
    }
    setMosse(mosse: Array<Mossa>): void{
        this.mosse=mosse;
    }
    setTurno(turno: String): void{
        this.turno=turno;
    }
    setVincitore(vincitore: String): void{
        this.vincitore=vincitore;
    }
    setGiocatori(giocatori: Array<Giocatore>): void{
        this.giocatori=giocatori;
    }

}

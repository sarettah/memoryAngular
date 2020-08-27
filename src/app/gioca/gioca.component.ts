import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";


import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestoreModule } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Partita } from '../partita';
import { Giocatore } from '../giocatore';
import { Mossa } from '../mossa';
import { Button } from 'protractor';
import { map } from 'rxjs/operators';

export interface Tile {
  cols: number;
  rows: number;
  text: string;
  border: string;
 }

@Component({
  selector: 'app-gioca',
  templateUrl: './gioca.component.html',
  styleUrls: ['./gioca.component.css']
})
export class GiocaComponent implements OnInit {
  idGiocatore: string = (Math.floor(Math.random() * 1000) + 1000).toString(); // returns a random integer from 1 to 100
  id: string;
  name: String;
  partita: Partita;
  nomi:Array<String>=[];
  giocatori:Array<Giocatore>=[];
  //mossee:Array<String>=["1A","1B", "1C","1D","2A","2B", "2C","2D"];
  mosse:Array<Mossa>=[new Mossa("1","A","2"), new Mossa("1","B","2"),new Mossa("1","C","3"),new Mossa("1","D","3"),
                      new Mossa("2","A","7"), new Mossa("2","B","7"),new Mossa("2","C","9"),new Mossa("2","D","9"),
                      new Mossa("3","A","1"), new Mossa("3","B","1"),new Mossa("3","C","4"),new Mossa("3","D","4"),
                      new Mossa("4","A","0"), new Mossa("4","B","0"),new Mossa("4","C","5"),new Mossa("4","D","5")
                    ]
  mosseTotali:Array<Mossa>=[new Mossa("1","A","2"), new Mossa("1","B","2"),new Mossa("1","C","3"),new Mossa("1","D","3"),
                            new Mossa("2","A","7"), new Mossa("2","B","7"),new Mossa("2","C","9"),new Mossa("2","D","9"),
                            new Mossa("3","A","1"), new Mossa("3","B","1"),new Mossa("3","C","4"),new Mossa("3","D","4"),
                            new Mossa("4","A","0"), new Mossa("4","B","0"),new Mossa("4","C","5"),new Mossa("4","D","5")];
  turno:String;
  nMossePerTurno:number=0;
  primoValore:String="";
  secondoValore:String="";
  primaMossa:Mossa;
  secondaMossa:Mossa;
  punti:number=0;
  //mossePerTurnoTot:number=2;
  dbGlobal:AngularFirestore;

  constructor(private route: ActivatedRoute, private router: Router,private db: AngularFirestore ) { 
    this.dbGlobal=db;
    this.id = this.route.snapshot.paramMap.get("id");
    this.name = this.route.snapshot.paramMap.get("name");
    console.log("id: "+this.id+" - nome: "+this.name);
    this.partita = new Partita(this.id, this.nomi,this.mosse,"","" ,this.giocatori);//partita vuota, ha solo id settato (e le mosse)
    //inizio firebase
    //chiamata asyncrona per via di firebase
    this.setPartitaNewAsync(db, this.partita, this.name, this.idGiocatore)
    //fine firebase
   


    
 }
///////////////////////////////////////////////////////////////////////////////////
//ONCLICK BUTTON
 btnClick(riga,colonna, valore){
    console.log("Clicked: mossa "+riga+colonna+" - valore "+valore);
    if(this.partita.getTurno() === this.name){
      console.log("é il tuo turno");
      if(this.nMossePerTurno === 0){
        document.getElementById(riga+colonna).innerText=valore;
        this.nMossePerTurno=1;
        this.primoValore=valore;
        this.primaMossa=new Mossa(riga,colonna,valore);
        document.getElementById("mosse").innerText="Mosse: "+(2-this.nMossePerTurno);
      }else if(this.nMossePerTurno === 1){
        document.getElementById(riga+colonna).innerText=valore;
        this.nMossePerTurno=2;
        this.secondoValore=valore;
        this.secondaMossa=new Mossa(riga,colonna,valore);
        document.getElementById("mosse").innerText="Mosse: "+(2-this.nMossePerTurno);

        //controllo se ho fatto punto
        if((this.primoValore === this.secondoValore) && (this.primoValore != "") && (this.secondoValore != "")){
          this.punti=this.punti+1;
          console.log("HAI FATTO UN PUNTO: "+this.punti)
          document.getElementById("punti").innerText="Punti: "+this.punti;
          //tolgo le mosse dalla lista delle mosse
          this.partita.eliminaMossa(this.primaMossa);
          this.partita.eliminaMossa(this.secondaMossa);
        }
      }else{
        console.log("il turno è finito");
      }
      
      
    }
 }

 fineTurno(){
  document.getElementById("mosse").innerText="Mosse: 2"
  var i;
  console.log("mosse "+this.partita.getMosse().length)
  for (i = 0; i < this.partita.getMosse().length; i++) {
    var mossa = this.partita.getMosse()[i];
    var y = document.getElementById(mossa.getRiga().toString()+mossa.getColonna().toString())
    y.innerText="?"
  }

  //annullo tutti le variabili temporanee per il turno successivo
  this.primoValore="";
  this.primoValore="";
  this.nMossePerTurno=0;
  //rendo non cliccabili i tasti
  for (i = 0; i < this.mosseTotali.length; i++) {
    var mossa = this.mosseTotali[i];
    var y = document.getElementById(mossa.getRiga().toString()+mossa.getColonna().toString());
    y.setAttribute('disabled','disabled');
  }

  //salvare il documento del turno
  //cambiare giocatore del turno
  //salvare i punti
  //togliere dalla lista i pulsanti uguali che sono stati scoperti

  this.setFineTurnoAsync(this.dbGlobal, this.partita, this.idGiocatore, this.punti, this.mosseTotali);

 }




////////////////////////////////////////////////////////////////////////////////////
//FINITO IL TURNO SALVO TUTTO
//prima faccio il get del documento
//METODO SET A FINE TURNO (richiama il get di firebase)
async setFineTurnoAsync(db: AngularFirestore, partita:Partita, idGiocatore:string, punti:number, mosseTotali:Array<Mossa>){

  console.log('calling');
  const result = await this.getDataAsync(db, partita, name)
  .then(function (partitaNew) { //nella parentesi c'è il return
    //controllo se su firebase esiste il documento
    if(partitaNew != null){
      //mi salvo la partita che c'è in db per poi aggiungere dati
      var mosse = partita.getMosse();//salvo le mosse prima che vegano sovrascritte
     
      partita=partitaNew; //lavoro con la partita passata in parametro della funzione
      partita.setPuntiGiocatoreById(idGiocatore,punti);
      partita.setTurno(partita.setNextTurno(idGiocatore));
      partita.setMosse(mosse);
      console.log("SET PARTITA");
      //console.log("SET PARTITA: "+partita.getId()+" - "+partita.getNomi()+" - "+partita.getMosse()+" - "+partita.getTurno()+" - "+partita.getVincitore()+" - "+partita.getGiocatori()); 
      //salvo il documento
      db.collection("partite").doc(partita.getId()).set(Partita.convertToJson(partita), { merge: true })
      .then(function() {
      console.log("Document successfully written!");
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });
    }else{
      console.log("Qualcosa è andato storto, la partita è stata cancellata!")
    }
  }) 
  .catch(function (err) { console.log("ERROR:"+ err); });
  
}


/*
 //gestione pulsanti griglia
      var i;
       console.log("mosseTotali: ")
      for (i = 0; i < mosseTotali.length; i++) {
        var mossa = mosseTotali[i];
        var y = document.getElementById(mossa.getRiga().toString()+mossa.getColonna().toString())
        //y.innerText=mossa.getValore()+"";
       // y.setAttribute('disabled','disabled')
        console.log(mossa.getRiga().toString()+mossa.getColonna().toString())
      }
      console.log("mosse: ")
      for (i = 0; i < mosse.length; i++) {
        var mossa = mosse[i];
        var y = document.getElementById(mossa.getRiga().toString()+mossa.getColonna().toString())
        //y.innerText=mossa.getValore()+"";
        y.setAttribute('enabled','enabled');
        console.log(mossa.getRiga().toString()+mossa.getColonna().toString())
      }
      
*/ 
 
 ////////////////////////////////////////////////////////////////////////////////////
 //METODO SET PER INIZIARE LA PARTITA (richiama il get di firebase)
 async  setPartitaNewAsync(db: AngularFirestore, partita:Partita, name: String, idGiocatore:string) {
  console.log('calling');
  const result = await this.getDataAsync(db, partita, name)
  .then(function (partitaNew) { //nella parentesi c'è il return

    //controllo se su firebase esiste il documento
    if(partitaNew != null){
      //mi salvo la partita che c'è in db per poi aggiungere dati
      partita=partitaNew; //lavoro con la partita passata in parametro della funzione
      partita.getNomi().push(name);
      partita.getGiocatori().push(new Giocatore(idGiocatore,name,0));
      console.log("SET PARTITA:");
      //console.log("SET PARTITA: "+partita.getId()+" - "+partita.getNomi()+" - "+partita.getMosse()+" - "+partita.getTurno()+" - "+partita.getVincitore()+" - "+partita.getGiocatori()); 
      //salvo il documento
      db.collection("partite").doc(partita.getId()).set(Partita.convertToJson(partita), { merge: true })
      .then(function() {
      console.log("Document successfully written!");
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });
    }else{
      console.log("documento insesistente")
      partita.getNomi().push(name) //lavoro con la partita passata in parametro della funzione
      partita.getGiocatori().push(new Giocatore(idGiocatore,name,0));
      partita.setTurno(name);
      console.log("SET PARTITA:");
      //console.log("SET PARTITA: "+partita.getId()+" - "+partita.getNomi()+" - "+partita.getMosse()+" - "+partita.getTurno()+" - "+partita.getVincitore()); 
       //creo il documento
      db.collection("partite").doc(partita.getId()).set(Partita.convertToJson(partita), { merge: true })
      .then(function() {
      console.log("Document successfully written!");
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });

    }
  }) 
  .catch(function (err) { console.log("ERROR:"+ err); });
  
  //salvo la partita nella this.partita per visualizzare a video le info
  this.partita=partita;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//METODO GET FIREBASE
  getDataAsync(db: AngularFirestore, partita:Partita, name: String){ //funzione per getDocument di firebase chiamata da funzione async
  var docRef = db.collection("partite").doc(partita.getId());
  return docRef.get().toPromise().then(function(doc) {
      if (doc.exists) {
          //mi salvo la partita che c'è in db per poi aggiungere dati
          partita = Partita.convertToPartita(doc.data());
          console.log("get: "+partita.getId()+" - "+partita.getGiocatori()[0])
          return partita
      } else {
          return null//Promise.reject("No such document");
      }
  })

}
/////////////////////////////////////////////////////////////////////////////////////

  ngOnInit(): void {
  }

/////////////////////////////////////////////////////////////////////////////
  firebaseListener(db: AngularFirestore){
    db.collection("partite").doc(this.id)
      .snapshotChanges().pipe(
        map(action => {
          const data = action.payload.data();
          console.log("listener "+data);

          //return  data ;
          })
        )
  
  }
}

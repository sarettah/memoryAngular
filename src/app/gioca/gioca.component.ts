import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";


import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestoreModule, DocumentSnapshot } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Partita } from '../partita';
import { Giocatore } from '../giocatore';
import { Mossa } from '../mossa';
import { Button } from 'protractor';
import { map } from 'rxjs/operators';
import { AngularFireModule } from '@angular/fire';
import { listenerCount } from 'process';

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
  mosse:Array<Mossa>=[];
  mosseTotali:Array<Mossa>=[];
  mosseFatte:Array<Mossa>=[]
  turno:String;
  nMossePerTurno:number=0;
  primoValore:String="";
  secondoValore:String="";
  primaMossa:Mossa;
  secondaMossa:Mossa;
  primaMossaGet:Mossa = new Mossa("","","");
  secondaMossaGet:Mossa = new Mossa("","","");;
  punti:number=0;
  //mossePerTurnoTot:number=2;
  dbGlobal:AngularFirestore;
  docSnap;
  pattern;


  constructor(private route: ActivatedRoute, private router: Router,private db: AngularFirestore, 
    private dbb:AngularFireModule ) { 
    this.pattern=-1;
    this.caselle()
    this.dbGlobal=db;
    this.id = this.route.snapshot.paramMap.get("id");
    this.name = this.route.snapshot.paramMap.get("name");
   // console.log("id: "+this.id+" - nome: "+this.name);
    this.partita = new Partita(this.id, this.nomi,this.mosse,this.mosseFatte,"","" ,this.giocatori);//partita vuota, ha solo id settato (e le mosse)
    
    //inizio firebase
    //firebase LISTENER
    db.collection('partite').valueChanges().subscribe((userData) => {
     
      var i
      for(i=0;i<userData.length; i++){
        var partaListener = Partita.convertToPartita(userData[i]);
        if(partaListener.getId()===this.id){
         // console.log("listener "+partaListener.getId())
          this.nomi=partaListener.getNomi();
          this.turno=partaListener.getTurno()
          this.partita.setNomi(this.nomi)
          this.partita.setTurno(this.turno)
          this.partita.setGiocatori(partaListener.getGiocatori())
          this.partita.setMosse(partaListener.getMosse())
          this.partita.setMosseFatte(partaListener.getMosseFatte())
          if(partaListener.getVincitore() === ""){
           
          }else{
            document.getElementById("vincitore").innerText="Il vincitore è "+partaListener.getVincitore()
          }
          //gestione pulsanti griglia
          var y=0;
          //è il mio turno
          if(partaListener.getMosse() != null){
            for (y = 0; y < partaListener.getMosse().length; y++) {
              var mossa = partaListener.getMosse()[y];
              var button = document.getElementById(mossa.getRiga().toString()+mossa.getColonna().toString())
              button.setAttribute('enabled','enabled');
            }
          }
          y=0;
          if(partaListener.getMosseFatte() != null){
            for(y = 0; y < partaListener.getMosseFatte().length; y++){
              var mossa = partaListener.getMosseFatte()[y];
              var button = document.getElementById(mossa.getRiga().toString()+mossa.getColonna().toString())
              button.innerText=mossa.getValore()+"";
              button.setAttribute('disabled','disabled');
            }
          }
        
        }
      
      }
    } );
//fine

    //listener per le mosse
    db.collection('mosse').valueChanges().subscribe((userData) => {
    // console.log("listener mosse");
      var i
      for(i=0;i<userData.length; i++){
        var mossaListener:Array<String> = Mossa.convertToMossaAttuale(userData[i]);
        if(mossaListener[0]===this.id){
          if(mossaListener[1]=== "-2"){ //ho svuotato a fine turno e il testo torna a ?
            //mossa vuota
            document.getElementById(this.primaMossaGet.getRiga()+""+this.primaMossaGet.getColonna()).innerText="?"
          }else{
            //prima mossa c'è
            this.primaMossaGet.setRiga(mossaListener[1])
            this.primaMossaGet.setColonna(mossaListener[2])
            this.primaMossaGet.setValore(mossaListener[3])
           document.getElementById(mossaListener[1]+""+mossaListener[2]).innerText=mossaListener[3]+"";
          }
          if(mossaListener[4] === "-1"){//vuol dire che non ho ancora fatto la seconda mossa

          }else if(mossaListener[4] === "-2"){ //ho svuotato a fine turno e il testo torna a ?
            //mossa vuota
            document.getElementById(this.secondaMossaGet.getRiga()+""+this.secondaMossaGet.getColonna()).innerText="?"
          }else{
            //seconda mossa c'è
            this.secondaMossaGet.setRiga(mossaListener[4])
            this.secondaMossaGet.setColonna(mossaListener[5])
            this.secondaMossaGet.setValore(mossaListener[6])
           document.getElementById(mossaListener[4]+""+mossaListener[5]).innerText=mossaListener[6]+"";
          }
          
        }
      }
    });
    //fine
    // devo fare in modo che non si veda dagli altri quando il turno finisce
    //quindi vado su fine turno e setto a zero, poi ascolto e setto testo bottoni a ?
 }
 
  
      
 

///////////////////////////////////////////////////////////////////////////////////
//ONCLICK BUTTON
 btnClick(riga,colonna, valore){
   
    if(this.partita.getTurno() === this.name){
     // console.log("é il tuo turno");
      if(this.nMossePerTurno === 0){

        //per far vedere la mossa agli avversari //salvo il documento
        this.db.collection("mosse").doc(this.id).set({id: this.id, riga1:riga, colonna1:colonna,valore1:valore,riga2:"-1", colonna2:"",valore2:""} )
        .then(function() {
        console.log("Document successfully written!");
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
        //////////////
        document.getElementById(riga+colonna).innerText=valore;
        this.nMossePerTurno=1;
        this.primoValore=valore;
        this.primaMossa=new Mossa(riga,colonna,valore);
        document.getElementById("mosse").innerText="Mosse: "+(2-this.nMossePerTurno);
      
      }else if(this.nMossePerTurno === 1){
      
        //per far vedere la mossa agli avversari //salvo il documento
        this.db.collection("mosse").doc(this.id).set({id: this.id, riga1:this.primaMossa.getRiga(), colonna1:this.primaMossa.getColonna(),valore1:this.primaMossa.getValore(), riga2:riga, colonna2:colonna,valore2:valore} )
        .then(function() {
        console.log("Document successfully written!");
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
        //////////////
        document.getElementById(riga+colonna).innerText=valore;
        this.nMossePerTurno=2;
        this.secondoValore=valore;
        this.secondaMossa=new Mossa(riga,colonna,valore);
        document.getElementById("mosse").innerText="Mosse: "+(2-this.nMossePerTurno);

        //controllo se ho fatto punto
        if((this.primoValore === this.secondoValore) && (this.primoValore != "") && (this.secondoValore != "")){
          this.punti=this.punti+1;
          //console.log("HAI FATTO UN PUNTO: "+this.punti)
          document.getElementById("punti").innerText="Punti: "+this.punti;
          //tolgo le mosse dalla lista delle mosse
          this.partita.eliminaMossa(this.primaMossa);
          this.partita.eliminaMossa(this.secondaMossa);
          this.partita.addMossaFatta(this.primaMossa)
          this.partita.addMossaFatta(this.secondaMossa)
         
        }
      }else{
        console.log("il turno è finito");
      }
      //document.getElementById(riga+colonna).setAttribute('disabled','disabled')
      
    }else{
      console.log("non è il tuo turno");
    }
 }

 fineTurno(){
  if(this.nMossePerTurno===0 || this.nMossePerTurno===1){
    console.log("non hai effettuato tutte le mosse a disposizione");
  }else{

  document.getElementById("mosse").innerText="Mosse: 2"
  var i;
  //console.log("mosse "+this.partita.getMosse().length)
  if(this.partita.getMosse() != null && this.partita.getMosse().length>0){
    for (i = 0; i < this.partita.getMosse().length; i++) {
      var mossa = this.partita.getMosse()[i];
      var y = document.getElementById(mossa.getRiga().toString()+mossa.getColonna().toString())
      y.innerText="?"
    }

    //per far vedere la mossa agli avversari //salvo il documento
    this.db.collection("mosse").doc(this.id).set({id: this.id, riga1:"-2", colonna1:"",valore1:"", riga2:"-2", colonna2:"",valore2:""} )
    .then(function() {
    console.log("Document successfully written!");
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
    //////////////

  }else{
    console.log("sono finite le mosse")
   
    i=0;
    var giocatoreMaxPunteggio=this.partita.getGiocatori()[0];
    for(i = 1; i < this.partita.getGiocatori().length; i++){
      var giocatore =  this.partita.getGiocatori()[i];
      if(giocatore.getPunti() > giocatoreMaxPunteggio.getPunti())
        giocatoreMaxPunteggio =  this.partita.getGiocatori()[i];
    }
      this.partita.setVincitore(giocatoreMaxPunteggio.getNome())
    document.getElementById("vincitore").innerText="Il Vincitore è "+giocatoreMaxPunteggio.getNome()
  }

  //annullo tutti le variabili temporanee per il turno successivo
  this.primoValore="";
  this.primoValore="";
  this.nMossePerTurno=0;

  //salvare il documento del turno
  //cambiare giocatore del turno
  //salvare i punti
  //togliere dalla lista i pulsanti uguali che sono stati scoperti
  this.setFineTurnoAsync(this.dbGlobal, this.partita, this.idGiocatore, this.punti, this.mosseTotali);
 }
 }

///////////////////////////////////////////////////////////////////////////////////
finePartita(){

  this.dbGlobal.collection("partite").doc(this.id).delete().then(function() {
    console.log("Document successfully deleted!");
}).catch(function(error) {
    console.error("Error removing document: ", error);
});

this.dbGlobal.collection("mosse").doc(this.id).delete().then(function() {
  console.log("Document successfully deleted!");
}).catch(function(error) {
  console.error("Error removing document: ", error);
});

this.router.navigate(['/home', this.id]);

}


////////////////////////////////////////////////////////////////////////////////////
//FINITO IL TURNO SALVO TUTTO
//prima faccio il get del documento
//METODO SET A FINE TURNO (richiama il get di firebase)
async setFineTurnoAsync(db: AngularFirestore, partita:Partita, idGiocatore:string, punti:number, mosseTotali:Array<Mossa>){

  //console.log('calling');
  const result = await this.getDataAsync(db, partita, name)
  .then(function (partitaNew) { //nella parentesi c'è il return
    //controllo se su firebase esiste il documento
    if(partitaNew != null){
      //mi salvo la partita che c'è in db per poi aggiungere dati
      var mosse = partita.getMosse();//salvo le mosse prima che vegano sovrascritte
      var mosseFatte = partita.getMosseFatte();
      var vincitore = partita.getVincitore();
      //console.log("mosse: "+mosse.toString())
      partita=partitaNew; //lavoro con la partita passata in parametro della funzione
      partita.setPuntiGiocatoreById(idGiocatore,punti);
      partita.setTurno(partita.getNextTurno(idGiocatore));
      partita.setMosse(mosse);
      partita.setMosseFatte(mosseFatte);
      partita.setVincitore(vincitore)
     
      //console.log("SET PARTITA "+partita.getTurno());
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
  
  //salvo la partita nella this.partita per visualizzare a video le info
  this.partita=partita;
}



 
 ////////////////////////////////////////////////////////////////////////////////////
 //METODO SET PER INIZIARE LA PARTITA (richiama il get di firebase)
 async  setPartitaNewAsync(db: AngularFirestore, partita:Partita, name: String, idGiocatore:string) {
  //console.log('calling');
  const result = await this.getDataAsync(db, partita, name)
  .then(function (partitaNew) { //nella parentesi c'è il return

    //controllo se su firebase esiste il documento
    if(partitaNew != null){
      //mi salvo la partita che c'è in db per poi aggiungere dati
      partita=partitaNew; //lavoro con la partita passata in parametro della funzione
      partita.getNomi().push(name);
      partita.getGiocatori().push(new Giocatore(idGiocatore,name,0));
      //console.log("SET PARTITA:");
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
      //console.log("SET PARTITA:");
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
  this.mosse = partita.getMosse()
  this.mosseTotali = partita.getMosse()
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//METODO GET FIREBASE
  getDataAsync(db: AngularFirestore, partita:Partita, name: String){ //funzione per getDocument di firebase chiamata da funzione async
  var docRef = db.collection("partite").doc(partita.getId());
  return docRef.get().toPromise().then(function(doc) {
      if (doc.exists) {
          //mi salvo la partita che c'è in db per poi aggiungere dati
          partita = Partita.convertToPartita(doc.data());
         // console.log("get: "+partita.getId()+" - "+partita.getGiocatori()[0])
          return partita
      } else {
          return null//Promise.reject("No such document");
      }
  })
}



/////////////////////////////////////////////////////////////////////////////////////

ngOnInit(): void {
 //chiamata asyncrona per via di firebase
 this.setPartitaNewAsync(this.db, this.partita, this.name, this.idGiocatore)
 //fine firebase
 
}

caselle(){
  
  this.pattern =  Math.floor(Math.random() * 4) ;
 // document.getElementById(this.pattern.toString()).style.display === "block"
 // console.log("caselle: "+this.pattern)
  switch(this.pattern){  
    case 1:
      this.mosseTotali=[new Mossa("1","A","2"), new Mossa("1","B","4"),new Mossa("1","C","9"),new Mossa("1","D","3"),
                        new Mossa("2","A","5"), new Mossa("2","B","1"),new Mossa("2","C","7"),new Mossa("2","D","9"),
                        new Mossa("3","A","0"), new Mossa("3","B","5"),new Mossa("3","C","3"),new Mossa("3","D","4"),
                        new Mossa("4","A","0"), new Mossa("4","B","1"),new Mossa("4","C","7"),new Mossa("4","D","2")]
      this.mosse=[new Mossa("1","A","2"), new Mossa("1","B","4"),new Mossa("1","C","9"),new Mossa("1","D","3"),
                  new Mossa("2","A","5"), new Mossa("2","B","1"),new Mossa("2","C","7"),new Mossa("2","D","9"),
                  new Mossa("3","A","0"), new Mossa("3","B","5"),new Mossa("3","C","3"),new Mossa("3","D","4"),
                  new Mossa("4","A","0"), new Mossa("4","B","1"),new Mossa("4","C","7"),new Mossa("4","D","2")]
      break;
      case 2:  
        this.mosseTotali=[new Mossa("1","A","5"), new Mossa("1","B","0"),new Mossa("1","C","9"),new Mossa("1","D","7"),
                          new Mossa("2","A","1"), new Mossa("2","B","7"),new Mossa("2","C","5"),new Mossa("2","D","3"),
                          new Mossa("3","A","4"), new Mossa("3","B","4"),new Mossa("3","C","3"),new Mossa("3","D","1"),
                          new Mossa("4","A","9"), new Mossa("4","B","2"),new Mossa("4","C","7"),new Mossa("4","D","2")]
        this.mosse=[new Mossa("1","A","5"), new Mossa("1","B","0"),new Mossa("1","C","9"),new Mossa("1","D","7"),
                    new Mossa("2","A","1"), new Mossa("2","B","7"),new Mossa("2","C","5"),new Mossa("2","D","3"),
                    new Mossa("3","A","4"), new Mossa("3","B","4"),new Mossa("3","C","3"),new Mossa("3","D","1"),
                    new Mossa("4","A","9"), new Mossa("4","B","2"),new Mossa("4","C","7"),new Mossa("4","D","2")]
        break;
        case 3:
          this.mosseTotali=[new Mossa("1","A","0"), new Mossa("1","B","5"),new Mossa("1","C","1"),new Mossa("1","D","4"),
                            new Mossa("2","A","3"), new Mossa("2","B","1"),new Mossa("2","C","0"),new Mossa("2","D","9"),
                            new Mossa("3","A","7"), new Mossa("3","B","4"),new Mossa("3","C","3"),new Mossa("3","D","9"),
                            new Mossa("4","A","2"), new Mossa("4","B","7"),new Mossa("4","C","5"),new Mossa("4","D","2")]
          this.mosse=[new Mossa("1","A","0"), new Mossa("1","B","5"),new Mossa("1","C","1"),new Mossa("1","D","4"),
                      new Mossa("2","A","3"), new Mossa("2","B","1"),new Mossa("2","C","0"),new Mossa("2","D","9"),
                      new Mossa("3","A","7"), new Mossa("3","B","4"),new Mossa("3","C","3"),new Mossa("3","D","9"),
                      new Mossa("4","A","2"), new Mossa("4","B","7"),new Mossa("4","C","5"),new Mossa("4","D","2")]
          break;
          case 0: 
            this.mosseTotali=[new Mossa("1","A","4"), new Mossa("1","B","3"),new Mossa("1","C","5"),new Mossa("1","D","2"),
                              new Mossa("2","A","2"), new Mossa("2","B","1"),new Mossa("2","C","7"),new Mossa("2","D","0"),
                              new Mossa("3","A","7"), new Mossa("3","B","9"),new Mossa("3","C","3"),new Mossa("3","D","4"),
                              new Mossa("4","A","1"), new Mossa("4","B","5"),new Mossa("4","C","9"),new Mossa("4","D","0")]
            this.mosse=[new Mossa("1","A","4"), new Mossa("1","B","3"),new Mossa("1","C","5"),new Mossa("1","D","2"),
                        new Mossa("2","A","2"), new Mossa("2","B","1"),new Mossa("2","C","7"),new Mossa("2","D","0"),
                        new Mossa("3","A","7"), new Mossa("3","B","9"),new Mossa("3","C","3"),new Mossa("3","D","4"),
                        new Mossa("4","A","1"), new Mossa("4","B","5"),new Mossa("4","C","9"),new Mossa("4","D","0")]
            break;
  }


}


}

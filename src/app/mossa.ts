export class Mossa {

   riga: String;
   colonna: String;
   valore: String;

   constructor(riga:String,colonna:String, valore:String){
       this.riga=riga;
       this.colonna=colonna;
       this.valore=valore;
   
   }

   static convertToJson(mosse: Array<Mossa>): Array<object>{
      var i;
      var arrObj=[];
      for( i=0; i<mosse.length; i++){
          arrObj.push(
              {
                  riga:mosse[i].getRiga(),
                  colonna:mosse[i].getColonna(),
                  valore:mosse[i].getValore()
              }
          );
      }
      return arrObj;
  }
  
  static convertToMossa(obj:Array<object>): Array<Mossa>{
      var i;
      var arrMosse=[];
      let riga;
      let colonna;
      let valore;
      for( i=0; i<obj.length; i++){
          Object.keys( obj[i]).map(function(key, index) {
              var value  = obj[i][key];
              if(key==="riga")
                  riga = value
              if(key==="colonna")
                  colonna = value
              if(key==="valore")
                  valore = value
            });
            //console.log(id+" "+nome+" "+punti)
            arrMosse.push(new Mossa(riga, colonna,valore));

      }
      
      return arrMosse
  }



   getRiga(): String{
      return this.riga;
  }
  getColonna(): String{
      return this.colonna;
  }
  getValore(): String{
      return this.valore;
  }
  setRiga(riga: String): void{
      this.riga=riga;
  }
  setColonna(colonna: String): void{
      this.colonna=colonna;
  }
  setValore(valore: String): void{
      this.valore=valore;
  }


}

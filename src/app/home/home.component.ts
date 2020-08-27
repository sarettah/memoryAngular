import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertService } from '../_alert';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  id: string;
  name: String;
  alert:AlertService;
  //numeroGiocatori: number;
  constructor(private route: ActivatedRoute, private router: Router, private db: AngularFirestore, private alertS: AlertService ) { 

    this.alert = alertS;
    this.id=null;
    this.name=null;
   // this.id = this.route.snapshot.paramMap.get("id");
    //console.log("id gioco: "+this.id);
    // this.userId = this.route.snapshot.paramMap.get("userId");

  }

  gioca(){

  /*  if(this.name === null || this.name === ""){
      console.log("nome nullo");
      this.alert.error("inserire il nickname",this.alert.onAlert());
    }else
    if(this.id === null || this.id === ""){
      console.log("id nullo");
      this.alert.error("inserire il codice",this.alert.onAlert());
    }else*/
    if((this.name === null || this.name === "") || (this.id === null || this.id === "") ){
      console.log("id o nome nulli");
      this.alert.error("inserire il codice");
    }else{
      console.log("id e nome non nulli - "+this.name+" - "+this.id);
      this.router.navigate(['/gioca', this.id,this.name]);
    }

  }

  ngOnInit(): void {
  }

}

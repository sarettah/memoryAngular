import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(private db: AngularFirestore, private fauth: AngularFireAuth, private router: Router) {
    //const things = db.collection('things').valueChanges();
    //things.subscribe(console.log);

    //var provider = new firebase.auth.GoogleAuthProvider();  
   
}

password: string;
email: string;
userId = "PaTJuAr4xxaplK7lZFeDOIFjWF02";
//userName = "sarah";

 title = 'memory';


 login(){  
   var router = this.router; 
   console.log("login clicked! "+this.email+" - "+this.password); 
   if(this.email  === null || this.email === ''){
       //messaggio 

   }else if(this.password  === null || this.password === ''){
       //messaggio
   }else if((this.email  === null || this.email === '') && (this.password  === null || this.password === '') ){
     //messaggio
   }else{
     firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(function(result) {
     
       var user = result.user;
       console.log("user: "+user.uid);
       // ...
       router.navigate(['/home', user.uid]);
   
     }).catch(function(error) {
       // Handle Errors here.
       var errorCode = error.code;
       var errorMessage = error.message;
       // ...
       console.log(errorCode +" - messaggio: "+errorMessage);
     });  
   }
  
   
 }

 route(){

   this.router.navigate(['/home', this.userId]);
 }

  ngOnInit(): void {
  }

}

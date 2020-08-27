import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';


//material components
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatGridList} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';

//firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
//Componenti
import { HomeComponent } from './home/home.component';
import { GiocaComponent } from './gioca/gioca.component';
import { LoginComponent } from './login/login.component';
//alert
import { AlertModule } from './_alert';

// Add credentials for firebase
const config = {
    
    apiKey: "AIzaSyD_sCyb91wJC6IqBGbQ7vRY9j1i-OUKfn0",
    authDomain: "angularmemory.firebaseapp.com",
    databaseURL: "https://angularmemory.firebaseio.com",
    projectId: "angularmemory",
    storageBucket: "angularmemory.appspot.com",
    messagingSenderId: "1069671119898",
    appId: "1:1069671119898:web:5365a9f0b1881ee059e5a3",
    measurementId: "G-9J4GQ18310"
};
//per il route
const routes: Routes = [
 // { path: 'home', redirectTo: 'app-home' }
 // { path: 'hero/:id', redirectTo: '/superhero/:id' },
 // { path: 'superheroes',  component: HeroListComponent, data: { animation: 'heroes' } },
  { path: 'login', component: LoginComponent},
  { path: 'home/:id', component: HomeComponent},
  { path: 'gioca/:id/:name', component: GiocaComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    GiocaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatGridListModule,
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFirestoreModule,
    RouterModule.forRoot(routes),
    AlertModule,
    CommonModule,
  
    
    
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
  
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})



export class AppComponent {

  id = Math.floor(Math.random() * 1000) + 1000; // returns a random integer from 1 to 100

  constructor(private router: Router) {
    this.router.navigate(['/home', this.id]);
  }
 

}

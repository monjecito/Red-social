import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
public title:string;
  constructor() {
    this.title='Bienvenido a CO-UNITY'
   }

  ngOnInit(): void {

    console.log('Componente de la home cargado');
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  clickHistorial(){
    this.router.navigateByUrl('historial');
  }

  clickTransferir(){
    this.router.navigateByUrl('transferir');
  }

  clickNuevo(){
    this.router.navigateByUrl('nuevo-destinatario');
  }
}

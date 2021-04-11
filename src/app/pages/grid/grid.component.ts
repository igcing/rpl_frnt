import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Transaccion } from 'src/app/models/transaccion.interface';
import { TransferenciaService } from 'src/app/services/transferencia.service';
/*export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
*/

//let datasource: Transaccion[] = [];


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})




export class GridComponent implements OnInit {
  displayedColumns: string[] = ['rut_persona', 'nombre_persona', 'nombre_banco', 'nombre_cuenta', 'monto_transferencia'];
  dataSource:Transaccion[] = [];

  constructor(private toastr: ToastrService, 
    private transferenciaService: TransferenciaService) { }

  ngOnInit(): void {
    this.buscarTransacciones();
  }

  buscarTransacciones(){
    this.transferenciaService.obtenerTransferencias().then((data) => {
      this.dataSource = data.body;
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Transaccion } from 'src/app/models/transaccion.interface';
import { TransferenciaService } from 'src/app/services/transferencia.service';
import { MESSAGE_ERROR_UNEXPECTED } from 'src/app/utils/constants';
 
 
@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})




export class GridComponent implements OnInit {
  displayedColumns: string[] = ['nombre_persona', 'rut_persona', 'nombre_banco', 'nombre_cuenta', 'monto_transferencia'];
  dataSource:Transaccion[] = [];
  spinner:boolean = true;
  constructor(private toastr: ToastrService, 
    private transferenciaService: TransferenciaService) { }

  ngOnInit(): void {
    this.buscarTransacciones();
  }

  buscarTransacciones(){
    this.transferenciaService.obtenerTransferencias().then((data) => {
      this.spinner = false;
      this.dataSource = data.body;
    }).catch(error => {
      this.spinner = false;
      this.toastr.error(MESSAGE_ERROR_UNEXPECTED);
    });
  }

}

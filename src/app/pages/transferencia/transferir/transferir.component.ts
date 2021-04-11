import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Banco } from 'src/app/models/banco.interface';
import { Persona } from 'src/app/models/persona.interface';
import { Transferencia } from 'src/app/models/transferencia.interface';
import { BankService } from 'src/app/services/bank.service';
import { DestinatarioService } from 'src/app/services/destinatario.service';
import { TransferenciaService } from 'src/app/services/transferencia.service';
import { MESSAGE_AMOUNT_INVALID, MESSAGE_ERROR_TOO_VALUE, MESSAGE_ERROR_UNEXPECTED, MESSAGE_FORM_INVALID, MESSAGE_TRX_SUCCESS } from 'src/app/utils/constants';
import { bankNameToUniqueNumber } from 'src/app/utils/strUtils';

@Component({
  selector: 'app-transferir',
  templateUrl: './transferir.component.html',
  styleUrls: ['./transferir.component.css']
})
export class TransferirComponent implements OnInit {
  formGroup: FormGroup;
  spinner: false;
  personas: Persona[];
  bancos: Banco[];
  isActiveToTransfer: true;
  messageValid: string = MESSAGE_FORM_INVALID;

  constructor(private toastr: ToastrService,
    private transferenciaService: TransferenciaService,
    private destinatarioService: DestinatarioService,
    private bankService: BankService,
    private router: Router) { }

  ngOnInit(): void {
    this.getBancos();
    this.newForm();
  }

  getBancos() {
    this.bankService.getBanks().then((data) => {
      this.bancos = data.banks
      this.bancos.map(banco => {
        banco.id = bankNameToUniqueNumber(banco.name) + "";
      });
    }, (err) => {
      console.log(err);
      this.toastr.error(MESSAGE_ERROR_UNEXPECTED);
    });
  }

  newForm() {
    this.formGroup = new FormGroup({
      nombre: new FormControl(''),
      rut: new FormControl('', [Validators.required]),
      banco: new FormControl(''),
      email: new FormControl(''),
      telefono: new FormControl(''),
      tipo_cuenta: new FormControl(''),
      numero_cuenta: new FormControl(''),
      monto: new FormControl('', [Validators.pattern('[0-9]*'), Validators.min(1)])
    });
  }

  findBank(): Banco {
    return this.bancos.filter(banco => banco.id == this.formGroup.value.banco)[0];
  }

  buscarDestinatario() {
    let bcoSelected = this.findBank();
    let bcoName = '';
    if (bcoSelected)
      bcoName = bcoSelected.name;
    if (this.formGroup.valid) {
      let data = {
        rut_persona: this.formGroup.value.rut
        , nombre_persona: this.formGroup.value.nombre
        , tipo_cuenta: this.formGroup.value.tipo_cuenta
        , code_banco: this.formGroup.value.banco
        , nombre_banco: bcoName
        , numero_cuenta: this.formGroup.value.numero_cuenta
      };
      this.destinatarioService.obtenerDestinatarios(data).then((response) => {
        this.personas = response.body;
        if (this.personas.length > 1)
          this.toastr.warning(MESSAGE_ERROR_TOO_VALUE);
        else if (this.personas.length == 1) {
          this.formGroup.controls.nombre.setValue(this.personas[0].nombre_persona);
          this.formGroup.controls.email.setValue(this.personas[0].email_persona);
          this.formGroup.controls.banco.setValue(this.personas[0].code_banco);
          this.formGroup.controls.tipo_cuenta.setValue("" + this.personas[0].id_cuenta);
          this.formGroup.controls.numero_cuenta.setValue(this.personas[0].numero_cuenta);
          this.formGroup.controls.telefono.setValue(this.personas[0].telefono_persona);
          this.isActiveToTransfer = true;
        }
      });
    } else {
      this.toastr.error(this.messageValid);
    }
  }

  enviarTransferencia() {
    if (this.formGroup.valid && this.formGroup.value.monto > 0) {
      let data: Transferencia = {
        monto_transferencia: this.formGroup.value.monto,
        tipo_cuenta: this.formGroup.value.tipo_cuenta,
        code_banco: this.formGroup.value.banco,
        id_persona_origen: this.formGroup.value.rut
      };
      this.transferenciaService.enviarTransferencia(data).then((success) => {
        this.toastr.success(MESSAGE_TRX_SUCCESS);
        this.router.navigateByUrl('historial');
      }, (error) => {
        this.toastr.error(MESSAGE_ERROR_UNEXPECTED);
      }).catch(() => {
        this.toastr.error(MESSAGE_ERROR_UNEXPECTED);
      });
    } else {
      this.toastr.error(MESSAGE_AMOUNT_INVALID);
    }
  }
}

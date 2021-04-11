import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Banco } from 'src/app/models/banco.interface';
import { Persona } from 'src/app/models/persona.interface';
import { Transferencia } from 'src/app/models/transferencia.interface';
import { RutPipe } from 'src/app/pipe/rut.pipe';
import { BankService } from 'src/app/services/bank.service';
import { DestinatarioService } from 'src/app/services/destinatario.service';
import { TransferenciaService } from 'src/app/services/transferencia.service';
import { MESSAGE_AMOUNT_INVALID, MESSAGE_ERROR_TOO_VALUE, MESSAGE_ERROR_UNEXPECTED, MESSAGE_FORM_INVALID, MESSAGE_TRX_SUCCESS, MESSAGE_ERROR_NO_RESULTS } from 'src/app/utils/constants';
import { bankNameToUniqueNumber } from 'src/app/utils/strUtils';
import { validatorRut } from 'src/app/validator/rut.validator';

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
  persona: any; // from other form
  constructor(private toastr: ToastrService,
    private transferenciaService: TransferenciaService,
    private destinatarioService: DestinatarioService,
    private bankService: BankService,
    private rutPipe: RutPipe,
    private router: Router,
    private activatedRoute:ActivatedRoute) { 
      if(this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state)
       this.persona = this.router.getCurrentNavigation().extras.state.data;
    }

  ngOnInit(): void {
    //console.log(history.state.data);
    this.getBancos();
    this.newForm();

    if(this.persona){
      this.setFormPersona(this.persona);
    }
   
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
      rut: new FormControl('', [Validators.required, validatorRut()]),
      banco: new FormControl(''),
      email: new FormControl({value: '', disabled:true}),
      telefono: new FormControl({value: '', disabled:true}),
      tipo_cuenta: new FormControl(''),
      numero_cuenta: new FormControl(''),
      monto: new FormControl('', [Validators.pattern('[0-9]*'), Validators.min(1)])
    }, {updateOn: 'blur'});
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
          this.setFormPersona(this.personas[0]);
        } else {
          this.toastr.error(MESSAGE_ERROR_NO_RESULTS);
        }
      });
    } else {
      this.toastr.error(this.messageValid);
    }
  }

  setFormPersona(persona: any){
    this.formGroup.controls.rut.setValue(this.rutPipe.formatRut(persona.rut_persona));
    
    this.formGroup.controls.rut.setErrors(null);
    this.formGroup.controls.rut.clearValidators();
    this.formGroup.controls.rut.updateValueAndValidity();

    this.formGroup.controls.nombre.setValue(persona.nombre_persona);
    this.formGroup.controls.email.setValue(persona.email_persona);
    this.formGroup.controls.banco.setValue(persona.code_banco);
    this.formGroup.controls.tipo_cuenta.setValue("" + persona.id_cuenta);
    this.formGroup.controls.numero_cuenta.setValue(persona.numero_cuenta);
    this.formGroup.controls.telefono.setValue(persona.telefono_persona);
    this.isActiveToTransfer = true;
  }

  enviarTransferencia() {
    if (this.formGroup.valid && this.formGroup.value.monto > 0) {
      let data: Transferencia = {
        monto_transferencia: this.formGroup.value.monto,
        tipo_cuenta: this.formGroup.value.tipo_cuenta,
        code_banco: this.formGroup.value.banco,
        id_persona_origen: this.rutPipe.cleanRut(this.formGroup.value.rut)
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

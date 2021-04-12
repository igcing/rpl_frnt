import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Banco } from 'src/app/models/banco.interface';
import { Persona } from 'src/app/models/persona.interface';
import { BankService } from 'src/app/services/bank.service';
import { DestinatarioService } from 'src/app/services/destinatario.service';
import { ToastrService } from 'ngx-toastr';
import { MESSAGE_ERROR_DUPLICATED_DEST, MESSAGE_ERROR_UNEXPECTED, MESSAGE_FORM_INVALID, MESSAGE_PERSONA_SUCCESS, MESSAGE_TRX_SUCCESS } from 'src/app/utils/constants';
import { Router } from '@angular/router';
import { bankNameToUniqueNumber } from 'src/app/utils/strUtils';
import { validatorRut } from 'src/app/validator/rut.validator';
import { RutPipe } from 'src/app/pipe/rut.pipe';

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent implements OnInit {
  formGroup:FormGroup;
  nombre: string;
  bancos: Banco[];
  selectedBanco: Banco;
  messageValid: string = MESSAGE_FORM_INVALID;
  isValid = true;
  spinner = false;
  constructor(private destinatarioService: DestinatarioService
    , private bankService: BankService,
    private toastr: ToastrService,
    private router: Router,
    private rutPipe:RutPipe) { }

  ngOnInit(): void {
    this.getBancos();
    this.newForm();
  }

  newForm(){
    this.formGroup = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(5)]),
      rut: new FormControl('', [Validators.required, Validators.minLength(8), validatorRut()]),
      correo: new FormControl('', [Validators.required,Validators.email]),
      telefono: new FormControl('', [Validators.required, Validators.minLength(7),Validators.pattern('[0-9]*')]),
      banco: new FormControl('', [Validators.required]),
      tipo_cuenta: new FormControl('', [Validators.required]),
      numero_cuenta: new FormControl('', [Validators.required, Validators.minLength(3)])
    }, {updateOn: 'blur'});
  }


  getBancos(){
    this.bankService.getBanks().then((data) => {
     this.bancos = data.banks
     this.bancos.map( banco => {
       banco.id = bankNameToUniqueNumber(banco.name)+"";
     });
   },(err) => {
     console.log(err);
     this.toastr.error(MESSAGE_ERROR_UNEXPECTED);
   });  
 }

 findBank() : Banco{
    return this.bancos.filter(banco => banco.id == this.formGroup.value.banco)[0];
  }

  guardarDestinatario(){
    if(this.formGroup.valid){
      let bancoselected = this.findBank();
      let destinatarioNuevo: Persona = { nombre_persona: this.formGroup.value.nombre 
                                      , rut_persona: this.rutPipe.cleanRut(this.formGroup.value.rut)
                                      , email_persona: this.formGroup.value.correo
                                      , telefono_persona:this.formGroup.value.telefono
                                      , numero_cuenta: this.formGroup.value.numero_cuenta
                                      , id_cuenta: this.formGroup.value.tipo_cuenta
                                      , tipo_cuenta: this.formGroup.value.tipo_cuenta
                                      , code_banco : bancoselected.id
                                      , nombre_banco: bancoselected.name
                                      } ;
      this.spinner = true;
      this.destinatarioService.crearDestinatario(destinatarioNuevo).subscribe((success) => {
        this.spinner = false;
        this.toastr.success(MESSAGE_PERSONA_SUCCESS);
        this.router.navigate(['/transferir'], {state: {data: success.body[0] } });
      }, (err) => {
        this.spinner = false;
        if(err.error && err.error.detail){
          let str:string =err.error.detail;
          if(str.indexOf('already exists') >= 0)
            this.toastr.error(MESSAGE_ERROR_DUPLICATED_DEST);
        } else{
         this.toastr.error(MESSAGE_ERROR_UNEXPECTED);
        }
      });
    } else{
      this.toastr.error(this.messageValid);
    }
  }
}

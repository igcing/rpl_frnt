import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BankService } from './services/bank.service';
import { BarComponent } from './pages/bar/bar.component';
import { GridComponent } from './pages/grid/grid.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { NuevoComponent } from './pages/destinatario/nuevo/nuevo.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { TransferirComponent } from './pages/transferencia/transferir/transferir.component';
import {MatInputModule} from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ToastrModule } from 'ngx-toastr';
import { RutPipe } from './pipe/rut.pipe';
import { ReplacecurrencyPipe } from './pipe/replacecurrency.pipe';

@NgModule({
  declarations: [
    AppComponent,
    BarComponent,
    GridComponent,
    NuevoComponent,
    TransferirComponent,
    RutPipe,
    ReplacecurrencyPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-right'
    })
  ],
  providers: [BankService,RutPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

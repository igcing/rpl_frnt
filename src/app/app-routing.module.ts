import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GridComponent} from './pages/grid/grid.component'
import {NuevoComponent} from './pages/destinatario/nuevo/nuevo.component'
import {TransferirComponent} from './pages/transferencia/transferir/transferir.component'

const routes: Routes = [
  { path: "", redirectTo: 'nuevo-destinatario', pathMatch:'full' },
  { path: 'nuevo-destinatario', component: NuevoComponent },
  { path: 'transferir', component: TransferirComponent },
  { path: 'historial', component: GridComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

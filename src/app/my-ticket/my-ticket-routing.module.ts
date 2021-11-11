import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyTicketPage } from './my-ticket.page';

const routes: Routes = [
  {
    path: '',
    component: MyTicketPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyTicketPageRoutingModule {}

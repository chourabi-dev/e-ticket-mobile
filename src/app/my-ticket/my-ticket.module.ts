import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyTicketPageRoutingModule } from './my-ticket-routing.module';

import { MyTicketPage } from './my-ticket.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyTicketPageRoutingModule
  ],
  declarations: [MyTicketPage]
})
export class MyTicketPageModule {}

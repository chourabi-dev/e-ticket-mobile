import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-my-ticket',
  templateUrl: './my-ticket.page.html',
  styleUrls: ['./my-ticket.page.scss'],
})
export class MyTicketPage implements OnInit {

  encodedData;

  constructor(private route:ActivatedRoute, private scanner:BarcodeScanner) { }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.scanner.encode(this.scanner.Encode.TEXT_TYPE, id).then(
      res => {
        alert(res);
        this.encodedData = res;
      }, error => {
        alert(error);
      }
  );

  }

  generateBarCode() {

}

}

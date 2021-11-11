import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.page.html',
  styleUrls: ['./trip-details.page.scss'],
})
export class TripDetailsPage implements OnInit {

  t:any = null;

  isReserved = false;

  constructor(private scanner:BarcodeScanner, private router:Router,public alertController:AlertController, private route:ActivatedRoute, private db:AngularFirestore, private auth:AngularFireAuth ) { }

  ngOnInit() {
    this.getTripDetails();
  }


  checkIfReserved(){
    
    var booking:any[] = this.t.booking == null ? [] :this.t.booking ;


    this.auth.authState.subscribe((s)=>{
      if (s.uid != null) {
        if (booking.indexOf(s.uid) != -1) {
          this.isReserved = true;
          console.log(this.isReserved);
          
        }
      }
    })
  }


  getTripDetails(){
    const id  = this.route.snapshot.params.id;
    this.db.collection('triptogo').doc(id).valueChanges().subscribe((data:any)=>{
      this.t = data;
 

      this.db.collection('vehicules').doc(data.vehicule).get().subscribe((res)=>{
        console.log(res.data());
        
        this.t.vehicule = res.data();


        this.checkIfReserved();
         
      })



    })

  }



  async bookPlace(){
    const id  = this.route.snapshot.params.id;

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Prompt!',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'NUMERO CARTE'
        },
        {
          name: 'name2',
          type: 'text',
          placeholder: 'DATE EXP CARTE'
        },
        
        
        
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirmer',
          handler: () => {
            this.db.collection('triptogo').doc(id).get().subscribe((res:any)=>{
              var trip = res.data();
              var booking:any[] = trip.booking == null ? [] :trip.booking ;

              

              this.auth.authState.subscribe((s)=>{
                if (s.uid != null) {
                  if (booking.indexOf(s.uid) == -1) {
                    booking.push(s.uid);
                    this.db.collection('triptogo').doc(id).update({reservedPlases:this.t.reservedPlases+1,
                    booking:booking
                    })

                    // create new ticket for current user
                    const userID= s.uid;
                    const trip = id;

                    const ticket = {
                      trip : trip,
                      user: userID,
                      date : new Date()

                    }

                    this.db.collection('tickets').add(ticket).then((result)=>{

                    }).catch((err)=>{

                    })
                  }
                }
              })

            })


          }
        }
      ]
    });

    await alert.present();
  }

  async showRecu(){
    
     // get ticket id;

     this.auth.authState.subscribe((s)=>{
      const id  = this.route.snapshot.params.id;
      const userUID  = s.uid;
      
      this.db.collection('tickets',ref=>ref.where('trip','==',id).where('user','==',userUID)).get().subscribe((res)=>{
        if (res.docs.length == 1) {
         
          const ticketID  = res.docs[0].id;
          
          this.scanner.encode(this.scanner.Encode.TEXT_TYPE, id).then(
            res => {
             
            }, error => {
              alert(error);
            }
        );


        }
      })
     })
    

    

  }

}

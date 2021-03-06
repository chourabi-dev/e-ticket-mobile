import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  trip:any=null; 
  tripID:any = null;


  constructor(private scanner:BarcodeScanner, private db:AngularFirestore, private auth:AngularFireAuth, private router:Router) { }

  ngOnInit() {
    // get trips to go for the current chauff
    this.auth.user.subscribe((res)=>{
      console.log(res);
      const uid = res.uid; 

      console.log(uid);
       
      this.db.collection('triptogo',ref=>ref.where('driver_id','==',uid).where('isOpen','==',true)).valueChanges().subscribe((tripsDocs)=>{
        console.log(tripsDocs.length);
        this.trip = tripsDocs[0];

        console.log(this.trip);
        
        
      })
      
    })
  }

  updatePlaces(state){

    var old = this.trip.reservedPlases;
    var max = this.trip.nbrPlace;
    

    if (state) {
      if (old < max) {
        old++;
      }
    }else{
      if (old != 0) {
        old--;
      }
    }

    this.auth.user.subscribe((res)=>{
      console.log(res);
      const uid = res.uid; 
 
      this.db.collection('triptogo',ref=>ref.where('driver_id','==',uid)).get().subscribe((tripsDocs)=>{
        
        const tripID= tripsDocs.docs[0].id;
        this.db.collection('triptogo').doc(tripID).update({reservedPlases:old}).then((resqu)=>{}).catch((err)=>{})
       
        
        
      })
      
    })
  }


  goNowGo(){
       
    this.auth.user.subscribe((res)=>{
      console.log(res);
      const uid = res.uid; 

      console.log(uid);
       
      this.db.collection('triptogo',ref=>ref.where('driver_id','==',uid)).get().subscribe((tripsDocs)=>{ 
 

        this.db.collection('triptogo').doc(tripsDocs.docs[0].id).update({isOpen:false}).then((resqu)=>{}).catch((err)=>{})
       

        
      })
      
    })
  }


  scanticket(){
    this.scanner.scan().then(res => {
      const idTicket = res.text;
      // verifier
      this.db.collection('tickets').doc(idTicket).get().subscribe((res:any)=>{
        const data = res.data();

        if (data.trip == this.tripID) {
          alert('Cette ticket valid')
        }else{
          alert("cette ticket n'est pas valid")
        }
      })
    }).catch(err => {
      alert('veuiller selectionner un code QR valid')
    });
  }

  logout(){
    this.auth.signOut().then((r)=>{
      this.router.navigate(['/home'])
    })
  }
}

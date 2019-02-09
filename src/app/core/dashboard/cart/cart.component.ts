import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as fromApp from '../../../reducers/index';
import { Observable } from 'rxjs';
import { IBazaarId } from '../../models/bazaar.model';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { ICartItem } from '../../models/cart-items.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, AfterViewInit {
  @ViewChild("vendor") vendorField: ElementRef;
  @ViewChild("price") priceField: ElementRef;

  cartForm: FormGroup;
  bazaarId: String;
  selectedBazaar$: Observable<IBazaarId>;

  isLoading = false;

  total = 0;

  paymentError = '';


  cart: ICartItem[] = [];
  //  = [
  //   { vendor: 12, price: 10.20 },
  //   { vendor: 32, price: 2 },
  //   { vendor: 65, price: 7.25 },
  //   { vendor: 4, price: 3.20 }
  // ];



  constructor(private store: Store<fromApp.AppState>, private afs: AngularFirestore) { }

  ngOnInit() {
    this.selectedBazaar$ = this.store.select(fromApp.getSelectedBazaar);

    this.selectedBazaar$.subscribe(bazaar => {
      if (bazaar) {
        this.bazaarId = bazaar.id;
        this.cartForm = new FormGroup({
          'vendor': new FormControl('', [Validators.required, Validators.min(1), Validators.max(bazaar.nbOfVendors)]),
          'price': new FormControl('', Validators.required),
        });


      }
    });
    // setTimeout(() => this.simulate(), 5000);
    this.vendorField.nativeElement.focus();
  }

  ngAfterViewInit() {
    // this.renderer.invokeElementMethod(this.vendorField.nativeElement, 'focus');
  }



  simulate() {
    let cItems = Math.floor(Math.random() * 80) + 1;

    for (let index = 0; index < cItems; index++) {
      // setInterval(() => console.log('werte: ', Math.floor(Math.random() * ((10-5)+1) + 5)), 2000);
      const item = {
        vendor: Math.floor(Math.random() * 80) + 1,
        price: Math.floor(Math.random() * 100) / 10
      };

      // push this item to cart
      this.cart.push(item);
      this.calculateSum();
      console.log('in for: ', index);
      // setInterval(() => console.log('verkäufer: ', Math.floor(Math.random()*80) + 1), 2000);
      // setInterval(() => console.log('preise: ', Math.floor(Math.random()*100) / 10), 1000);


    }

    this.payment();
    setTimeout(() => this.simulate(), 5000);
  }

  onKeyDownVendor(event: any) {
    const pattern = /[0-9]/;
    if (event.keyCode === 8 || event.keyCode === 13) {
      return;
    }

    // Tab
    if (event.keyCode === 9) {
      this.priceField.nativeElement.focus();
    }

    if (!pattern.test(event.key)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  onKeyDownPrice(event: any) {
    const pattern = /[0-9\,\ ]/;
    console.log('code', event);
    if (event.keyCode === 8 || event.keyCode === 13) {
      return;
    }

    // Tab
    if (event.keyCode === 9) {
      this.vendorField.nativeElement.focus();
    }

    if (!pattern.test(event.key)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  /*
   * push a single item to cart
   */
  addToCart(): void {
    // single item from form
    const item = {
      vendor: parseFloat(this.cartForm.value.vendor),
      price: parseFloat(this.cartForm.value.price.replace(',', '.'))
    };

    // push this item to cart
    this.cart.push(item);
    this.cartForm.reset();

    this.calculateSum();

    this.vendorField.nativeElement.focus();
  }

  removeFromCart(item: any): void {
    const index = this.cart.indexOf(item);
    this.cart.splice(index, 1);

    // todo
    // this.cartSrv.delete(item);

    this.calculateSum();

    this.vendorField.nativeElement.focus();

  }

  calculateSum(): void {
    this.total = 0;
    if (this.cart.length > 0) {
      this.total = this.cart.filter(c => this.cart).map(c => c.price).reduce((sum, current) => sum + current);
    }
    console.log('Kalkuliere...');

    this.vendorField.nativeElement.focus();
  }


  payment(): void {
    this.isLoading = true;
    this.cart.forEach((value) => {
      //  this.cartSrv.create(value);
      let itemDoc: AngularFirestoreDocument<any>;
      itemDoc = this.afs.doc<any>('bazaars/' + this.bazaarId);

      itemDoc.collection<any>('cartItems').add(value)
        .then((docRef) => {
          this.isLoading = false;
        })
        .catch(function (error) {
          this.isLoading = false;
        });
    });

    // console.log('time', firebase.firestore.FieldValue.serverTimestamp());
    this.store.select(fromApp.getUser).subscribe(user => {

      const protocol = {
        user: user.displayName,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        cartItems: this.cart,
        sum: this.total
      };

      let itemDoc: AngularFirestoreDocument<any>;
      itemDoc = this.afs.doc<any>('bazaars/' + this.bazaarId);
      itemDoc.collection('protocol').add(protocol);
      itemDoc.collection('protocol').valueChanges();

      this.cart = [];

      this.total = 0;
      console.log('Bezahle...');
    });

    this.vendorField.nativeElement.focus();


  }


}

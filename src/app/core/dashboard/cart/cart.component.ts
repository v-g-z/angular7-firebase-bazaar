import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as fromApp from '../../../reducers/index';
import { Observable } from 'rxjs';
import { IBazaarId } from '../../models/bazaar.model';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { ICartItem, ICartItemId } from '../../models/cart-items.model';
import * as moment from 'moment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartForm: FormGroup;
  bazaarId: String;
  selectedBazaar$: Observable<IBazaarId>;

  isLoading = false;

  total = 0;

  paymentError: String = "";


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
      }
    });

    this.cartForm = new FormGroup({
      'vendor': new FormControl('', Validators.required), // bekommt Daten aus this.users$
      'price': new FormControl('', Validators.required),
    });

  }

  /**
 * push a single item to cart
 *
 * @param vendor
 * @param price
 */
  addToCart(): void {
    let now = moment();

    // single item from form
    const item = {
      vendor: parseInt(this.cartForm.value.vendor),
      price: parseFloat(this.cartForm.value.price)
    };

    // push this item to cart
    this.cart.push(item);
    this.cartForm.reset();

    this.calculateSum();
  }

  removeFromCart(item: any): void {
    const index = this.cart.indexOf(item);
    this.cart.splice(index, 1);

    // todo
    // this.cartSrv.delete(item);

    this.calculateSum();

  }

  calculateSum(): void {
    this.total = 0;
    if (this.cart.length > 0) {
      this.total = this.cart.filter(c => this.cart).map(c => c.price).reduce((sum, current) => sum + current);
    }
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
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
          this.isLoading = false;
          console.error("Error adding document: ", error);
        });
    });

    console.log('time', firebase.firestore.FieldValue.serverTimestamp());
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
    });
  }


}

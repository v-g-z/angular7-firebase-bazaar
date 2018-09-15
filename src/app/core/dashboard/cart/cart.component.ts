import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as fromApp from '../../../reducers/index';
import { Observable } from 'rxjs';
import { IBazaar, IBazaarId } from '../../models/bazaar.model';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
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

  // cartItems$: Observable<ICartItem[]>;
  // cartItemCollection;//: AngularFirestoreCollection<ICartItemId[]>;
  total: number = 0;

  paymentError: String = "";


  cart: ICartItem[] = [];;
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
      this.bazaarId = bazaar.id;

    //   let itemDoc: AngularFirestoreDocument<any>;
    //   itemDoc = this.afs.doc<any>('bazaars/' + bazaar.id);
    //   // itemDoc.valueChanges();
    //   console.log('valueChanges', itemDoc);

    //   // this.cartItemCollection = itemDoc.collection<ICartItem>('cartItems', ref => {
    //   //   let query: firebase.firestore.Query = ref;
    //   //   query = query.orderBy('vendor');
    //   //   return query;

    //   // });
    //   // this.cartItems$ = this.cartItemCollection.valueChanges();

    //   this.cartItems$ = itemDoc.collection<any>('cartItems', ref => {
    //     let query: firebase.firestore.Query = ref;
    //     query = query.orderBy('vendor');
    //     return query;

    //   }).valueChanges();

    })

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
    var index = this.cart.indexOf(item);
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

    this.cart.forEach((value) => {
      //  this.cartSrv.create(value);
      let itemDoc: AngularFirestoreDocument<any>;
      itemDoc = this.afs.doc<any>('bazaars/' + this.bazaarId);

      itemDoc.collection<any>('cartItems').add(value)
        .then(function (docRef) {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
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

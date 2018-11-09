import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IBazaarId } from '../../models/bazaar.model';
import { ICartItem } from '../../models/cart-items.model';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../reducers/index';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  selectedBazaar$: Observable<IBazaarId>;
  cartItems$: Observable<ICartItem[]>;
  cartItemCollection: AngularFirestoreCollection<ICartItem>;
  turnover: number;

  constructor(private store: Store<fromApp.AppState>, private afs: AngularFirestore) { }

  ngOnInit() {

    this.selectedBazaar$ = this.store.select(fromApp.getSelectedBazaar);

    this.selectedBazaar$.subscribe(bazaar => {
      if (bazaar) {
        let itemDoc: AngularFirestoreDocument<any>;
        itemDoc = this.afs.doc<any>('bazaars/' + bazaar.id);

        this.cartItemCollection = itemDoc.collection<ICartItem>('cartItems', ref => {
          let query: firebase.firestore.Query = ref;
          query = query.orderBy('vendor');
          return query;


        });

        this.cartItems$ = this.cartItemCollection.valueChanges();

        this.cartItems$.subscribe(items => {
          if (items.length > 0) {
            this.turnover = items.map(item => {
              return item.price;
            }).reduce((sum, current) => sum + current);
          }
        });
      }
    });



  }

}

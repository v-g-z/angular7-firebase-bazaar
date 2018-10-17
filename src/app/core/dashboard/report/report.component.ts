import { Component, OnInit } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

import { ICartItem } from '../../models/cart-items.model';
import { IBazaarId } from '../../models/bazaar.model';
import * as fromApp from '../../../reducers/index';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  cartItems$: Observable<ICartItem[]>;
  vendorItems: Array<any>;
  selectedBazaar$: Observable<IBazaarId>;

  options = {
    fieldSeparator: ';',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: false,
    useBom: true,
    // noDownload: true,
    headers: ['Verkäufer', 'Summe (€)', 'Einzelpositionen (€)', 'Auslagen (€)', 'Marge (%)', 'Auszahlung (€)']
  };

  constructor(private store: Store<fromApp.AppState>, private afs: AngularFirestore) { }

  ngOnInit() {
    this.selectedBazaar$ = this.store.select(fromApp.getSelectedBazaar);

    this.selectedBazaar$.subscribe(bazaar => {

      if (bazaar) {
        let itemDoc: AngularFirestoreDocument<any>;
        itemDoc = this.afs.doc<any>('bazaars/' + bazaar.id);

        this.cartItems$ = itemDoc.collection<any>('cartItems', ref => {
          let query: firebase.firestore.Query = ref;
          query = query.orderBy('vendor');
          return query;

        }).valueChanges();

        this.cartItems$.subscribe(cartItems => {
          const res1 = [];
          for (const item of cartItems) {
            if (!res1[item.vendor]) {
              res1[item.vendor] = {
                vendor: item.vendor,
                sum: 0,
                price: []
              };
            }

            // add to pricelist
            res1[item.vendor].price.push(item.price);
            // calc sum
            res1[item.vendor].sum += item.price;
            // fee
            res1[item.vendor].fee = bazaar.fee;
            // margin
            res1[item.vendor].margin = bazaar.margin;
            // calc pay off
            res1[item.vendor].payoff = res1[item.vendor].sum - (res1[item.vendor].sum * bazaar.margin / 100) - bazaar.fee;

          }


          for (let index = 1; index <= bazaar.nbOfVendors; index++) {
            if (!res1[index]) {
              res1[index] = {
                vendor: index,
                sum: 0,
                price: []
              };
            }
          }

          // console.log('res1', res1.filter(n => n));

          this.vendorItems = res1.filter(n => n);

        });

      }

    });
  }

  download() {
    new Angular5Csv(this.vendorItems, 'Basar', this.options);
  }


}

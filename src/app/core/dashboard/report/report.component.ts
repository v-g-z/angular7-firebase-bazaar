import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
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
    // headers: ['Verkäufer', 'Summe (€)', 'Einzelpositionen (€)', 'Auslagen (€)', 'Marge (%)', 'Auszahlung (€)']
    headers: [
      'Verkäufer',
      'Auszahlungsbetrag (€)',
      'Etikettengebühr',
      'Verkäufernummer',
      'Kasse - Auszahlung',
      'Kasse - Marge (%)',
      'Kasse - Summe (€)',
      'Kasse - Einzelpositionen (€)'
    ]
  };

  constructor(private store: Store<fromApp.AppState>, private afs: AngularFirestore, private cp: CurrencyPipe) { }

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

            // 1 Verkäufernummer
            // add to pricelist
            res1[item.vendor].price.push(item.price);
            // calc sum
            res1[item.vendor].sum += item.price;
            // 3 fee
            res1[item.vendor].fee = bazaar.fee;
            // 3 margin
            res1[item.vendor].margin = bazaar.margin;
            // 2 calc pay off
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

          this.vendorItems = res1.filter(n => n);

        });

      }

    });
  }

  download() {
    // 'Verkäufer',
    // 'Auszahlungsbetrag (€)',
    // 'Etikettengebühr',
    // 'Verkäufernummer',
    // 'Kasse - Auszahlung',
    // 'Kasse - Marge (%)',
    // 'Kasse - Summe (€)',
    // 'Kasse - Einzelpositionen (€)'
    this.selectedBazaar$.subscribe(bazaar => {

      if (bazaar) {

        let dlItem = [];
        for (let i = 0; i < this.vendorItems.length; i++) {

          dlItem[i] = {
            name: 'Ersetzen durch Name des Verkäufers',
            payoff: this.cp.transform(this.vendorItems[i].payoff, '€', 'code', '1.2-2'),
            fee: bazaar.fee,
            vendor: this.vendorItems[i].vendor,
            payoff1: this.cp.transform(this.vendorItems[i].payoff, '€', 'code', '1.2-2'),
            margin: bazaar.margin,
            sum: this.cp.transform(this.vendorItems[i].sum, '€', 'code', '1.2-2'),
            price: this.vendorItems[i].price
          }


        };

        new Angular5Csv(dlItem, 'Basar', this.options);
      }
    });
  }

}

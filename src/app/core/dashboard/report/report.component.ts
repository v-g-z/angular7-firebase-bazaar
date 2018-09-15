import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ICartItem } from '../../models/cart-items.model';
import { IBazaarId } from '../../models/bazaar.model';
import { Store } from '@ngrx/store';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

import * as fromApp from '../../../reducers/index';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

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
    showTitle: true,
    useBom: true,
    // noDownload: true,
    headers: ["Verkäufer", "Summe", "Einzelpositionen"]
  };

  constructor(private store: Store<fromApp.AppState>, private afs: AngularFirestore, private router: Router) { }

  ngOnInit() {
    this.selectedBazaar$ = this.store.select(fromApp.getSelectedBazaar);

    this.selectedBazaar$.subscribe(bazaar => {

      if (!bazaar.id) {
        this.router.navigateByUrl('dashboard');
      }

      let itemDoc: AngularFirestoreDocument<any>;
      itemDoc = this.afs.doc<any>('bazaars/' + bazaar.id);

      this.cartItems$ = itemDoc.collection<any>('cartItems', ref => {
        let query: firebase.firestore.Query = ref;
        query = query.orderBy('vendor');
        return query;

      }).valueChanges();

      this.cartItems$.subscribe(cartItems => {
        var res2 = [];
        var res1 = [];
        for (let item of cartItems) {
          if (!res1[item.vendor]) {
            res1[item.vendor] = {
              vendor: item.vendor,
              sum: 0,
              price: []
            };
            // res2.push(res1[item.vendor])
          }

          res1[item.vendor].price.push(item.price);
          res1[item.vendor].sum += item.price;


        }
        console.log("und hier das resutl", res1);


        for (let index = 1; index <= bazaar.nbOfVendors; index++) {
          if (!res1[index]) {
            res1[index] = {
              vendor: index,
              sum: 0,
              price: []
            };
          }  
        }

        this.vendorItems = res1;
        console.log("vendorItems", this.vendorItems);


      });


    })
  }

  download() {
    new Angular5Csv(this.vendorItems, 'Basar', this.options);
  }


}

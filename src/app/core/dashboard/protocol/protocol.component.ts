import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../reducers/index';
import { Observable } from 'rxjs';
import { IBazaar, IBazaarId } from '../../models/bazaar.model';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { IProtocolId } from '../../models/protocol.model';


@Component({
  selector: 'app-protocol',
  templateUrl: './protocol.component.html',
  styleUrls: ['./protocol.component.css']
})
export class ProtocolComponent implements OnInit {

  selectedBazaar$: Observable<IBazaarId>;

  protocol$: Observable<IProtocolId[]>;

  constructor(private store: Store<fromApp.AppState>, private afs: AngularFirestore) { }

  ngOnInit() {
    this.selectedBazaar$ = this.store.select(fromApp.getSelectedBazaar);
console.log('in protocol');
    this.selectedBazaar$.subscribe(bazaar => {
      console.log('in protocol subscribe');

      let itemDoc: AngularFirestoreDocument<any>;
                itemDoc = this.afs.doc<any>('bazaars/'+bazaar.id);
                // itemDoc.valueChanges();
                // console.log('valueChanges', itemDoc);
                // this.cartItems$ = itemDoc.collection<any>('cartItems').valueChanges();

                this.protocol$ = itemDoc.collection<any>('protocol', ref => {
                  let query : firebase.firestore.Query = ref;
                  query = query.orderBy('createdAt', 'desc').limit(30);
                  return query;
          
                }).valueChanges();
    })
  }


}

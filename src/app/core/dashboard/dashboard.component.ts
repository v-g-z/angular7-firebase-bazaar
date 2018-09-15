import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as BazaarActions from './store/bazaar.actions';
import { Store } from '@ngrx/store';
import * as fromApp from '../../reducers/index';
import { IBazaar, IBazaarId } from '../models/bazaar.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  selectedBazaar$: Observable<IBazaar>;

  // private bazaarCollection: AngularFirestoreCollection<IBazaar>;
  // bazaars$: Observable<IBazaarId[]>;

  constructor(private afs: AngularFirestore, private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    // /**
    //  * select list of bazaars
    //  */
    // this.bazaarCollection = this.afs.collection<IBazaar>('bazaars');
    // this.bazaars$ = this.bazaarCollection.snapshotChanges().pipe(
    //   map(actions => actions.map(a => {
    //     const data = a.payload.doc.data() as IBazaar;
    //     const id = a.payload.doc.id;
    //     return { id, ...data };
        
    //   }))
    // );

    this.selectedBazaar$ = this.store.select(fromApp.getSelectedBazaar);

  }

  // select(bazaar: IBazaarId): void {
  //   // hier über state und effects
  //   console.log('id', bazaar.id);
  //   console.log('bazaar', bazaar);
  //   this.store.dispatch(new BazaarActions.SetSelectedBazaar(bazaar));


  // }

}

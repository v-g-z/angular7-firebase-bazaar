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

  constructor(private afs: AngularFirestore, private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.selectedBazaar$ = this.store.select(fromApp.getSelectedBazaar);
  }

}

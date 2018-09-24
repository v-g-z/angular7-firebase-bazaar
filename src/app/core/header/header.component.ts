import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromApp from '../../reducers/index';
import * as AuthActions from '../../auth/store/auth.actions';
import { IBazaarId, IBazaar } from '../models/bazaar.model';
import * as BazaarActions from '../dashboard/store/bazaar.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isauth$: Observable<boolean>;
  selectedBazaar$: Observable<IBazaarId>;


  // cartItems$: Observable<ICartItem[]>;
  // cartItemCollection: AngularFirestoreCollection<ICartItem>;
  // turnover: number;

  // private bazaarCollection: AngularFirestoreCollection<IBazaar>;
  bazaars$: Observable<IBazaarId[]>;

  constructor(private store: Store<fromApp.AppState>, private router: Router) { }

  ngOnInit() {
    this.isauth$ = this.store.select(fromApp.getIsAuthenticated);


    this.bazaars$ = this.store.select(fromApp.getBazaars);


    this.selectedBazaar$ = this.store.select(fromApp.getSelectedBazaar);

    // place getUser inside header, as this component is initially loaded
    // firebase login refresh makes this call helpfully here
    this.store.dispatch(new AuthActions.GetUser());

    this.store.dispatch(new BazaarActions.Query());

  }


  select(event): void {
    if (event.value) {
      this.store.dispatch(new BazaarActions.SetSelectedBazaar(event.value));
      this.routeToDashboard();
    } else {
      this.store.dispatch(new BazaarActions.ResetSelectedBazaar());
      this.router.navigateByUrl('/administration');
    }
  }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
    this.router.navigateByUrl('');
  }

  routeToDashboard() {
    this.router.navigateByUrl('/dashboard');
  }
}

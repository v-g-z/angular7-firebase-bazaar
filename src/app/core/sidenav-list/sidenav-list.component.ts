import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as AuthActions from '../../auth/store/auth.actions';
import * as fromApp from '../../reducers/index';
import * as BazaarActions from '../dashboard/store/bazaar.actions';
import { IBazaarId } from '../models/bazaar.model';


@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  @Output() closeSidenav = new EventEmitter<void>();
  isAuth$: Observable<boolean>;
  selectedBazaar$: Observable<IBazaarId>;
  bazaars$: Observable<IBazaarId[]>;
  adminUser: string;

  isAdmin: boolean;


  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAuth$ = this.store.select(fromApp.getIsAuthenticated);
    this.store.select(fromApp.getUser).subscribe(user => {
      if (user) {
        this.adminUser = user.email;
        // this.store.dispatch(new BazaarActions.Query(user.email));
      }
    });


    this.bazaars$ = this.store.select(fromApp.getBazaars);

    this.selectedBazaar$ = this.store.select(fromApp.getSelectedBazaar);
    this.selectedBazaar$.subscribe(bazaar => {
      if (bazaar) {
        this.isAdmin = (bazaar.admin === this.adminUser);
      }
    });

  }

  select(event): void {
    this.onClose();
    if (event.value) {
      this.store.dispatch(new BazaarActions.SetSelectedBazaar(event.value));
      this.router.navigateByUrl('/dashboard');
    } else {
      this.store.dispatch(new BazaarActions.ResetSelectedBazaar());
      this.router.navigateByUrl('/administration');
    }
  }


  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.onClose();
    this.store.dispatch(new AuthActions.Logout());
    this.router.navigateByUrl('');
  }

  routeToAdmin() {
    this.onClose();
    this.router.navigateByUrl('/administration');
  }

  routeToDashboard() {
    this.onClose();
    this.router.navigateByUrl('/dashboard');
  }


}

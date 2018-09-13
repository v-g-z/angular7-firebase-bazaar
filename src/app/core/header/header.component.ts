import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromApp from '../../reducers/index';
import * as AuthActions from '../../auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isauth$: Observable<boolean>;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.isauth$ = this.store.select(fromApp.getIsAuthenticated);

    // place getUser inside header, as this component is initially loaded
    // firebase login refresh makes this call helpfully here
    this.store.dispatch(new AuthActions.GetUser());


  }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
  }


}

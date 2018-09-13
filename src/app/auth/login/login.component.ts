import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../reducers/index';
import { User } from '../models/user.model';
import { State } from '../store/auth.reducer';
import * as AuthActions from '../store/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  authState$: Observable<State>;
  constructor(private store: Store<fromApp.AppState>, private router: Router) { }

  ngOnInit() {
    this.authState$ = this.store.select('auth');
    this.authState$.subscribe(state => {
      if (state.authenticated) {
        this.router.navigateByUrl('dashboard');
      }
    })

  }


  googleLogin() {
    this.store.dispatch(new AuthActions.GoogleLogin());
  }



}

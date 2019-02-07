import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../reducers/index';
import { State } from '../store/auth.reducer';
import * as AuthActions from '../store/auth.actions';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  authState$: Observable<State>;
  constructor(private store: Store<fromApp.AppState>, private router: Router) { }
  registerForm: FormGroup;
  disabledAgreement: boolean = true;

  ngOnInit() {
    this.authState$ = this.store.select('auth');
    this.authState$.subscribe(state => {
      if (state.authenticated) {
        this.router.navigateByUrl('dashboard');
      }
    });

  }

  changeCheck(event){
    this.disabledAgreement = !event.checked;
  }

  googleLogin() {
    this.store.dispatch(new AuthActions.GoogleLogin());
  }

  tryRegister(value) {

    this.store.dispatch(new AuthActions.RegisterEmailPassword(value));
  }

}

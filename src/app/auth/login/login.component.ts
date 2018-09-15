import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../reducers/index';
import { User } from '../models/user.model';
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

  tryRegister(value){

    this.store.dispatch(new AuthActions.RegisterEmailPassword(value));

    // this.authService.doRegister(value)
    // .then(res => {
    //   console.log(res);
    //   // this.errorMessage = "";
    //   // this.successMessage = "Your account has been created";
    // }, err => {
    //   console.log(err);
    //   // this.errorMessage = err.message;
    //   // this.successMessage = "";
    // })
  }

}

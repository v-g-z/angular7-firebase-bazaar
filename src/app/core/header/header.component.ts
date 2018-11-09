import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { trigger, state, style, transition, keyframes, animate } from '@angular/animations';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromApp from '../../reducers/index';
import * as AuthActions from '../../auth/store/auth.actions';
import { IBazaarId, IBazaar } from '../models/bazaar.model';
import * as BazaarActions from '../dashboard/store/bazaar.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('highlight', [
      state('pulse', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        animate(3000, keyframes([
          style({
            transform: 'translateX(300px)',
            opacity: 0,
            offset: 0
          }),

          style({
            transform: 'translateX(150px)',
            opacity: 0.5,
            offset: 0.25
          }),
          style({
            transform: 'translateX(0px)',
            opacity: 1,
            offset: 0.5
          }),
          style({ transform: 'scale(1)', offset: 0.6 }),
      style({ transform: 'scale(3)', offset: 0.8 }),
      style({ transform: 'scale(1)', offset: 1 })
        ]))
      ]),
  ])
  ]

  
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();

  state = 'normal';
  isAuth$: Observable<boolean>;
  selectedBazaar$: Observable<IBazaarId>;
  adminUser: string;
  userName: string;
  isAdmin: boolean;

  bazaars$: Observable<IBazaarId[]>;

  constructor(private route: ActivatedRoute, private store: Store<fromApp.AppState>, private router: Router) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.state = 'pulse';        }
      );



    this.isAuth$ = this.store.select(fromApp.getIsAuthenticated);
    this.store.select(fromApp.getUser).subscribe(user => {
      if (user) {
        this.adminUser = user.email;
        this.userName = user.displayName;

        this.store.dispatch(new BazaarActions.Query(user.email));

      }
    });

    this.bazaars$ = this.store.select(fromApp.getBazaars);

    this.selectedBazaar$ = this.store.select(fromApp.getSelectedBazaar);
    this.selectedBazaar$.subscribe(bazaar => {
      if (bazaar) {
        this.isAdmin = (bazaar.admin === this.adminUser);
      }
    });

    // place getUser inside header, as this component is initially loaded
    // firebase login refresh makes this call helpfully here
    this.store.dispatch(new AuthActions.GetUser());


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

  routeToAdmin() {
    this.router.navigateByUrl('/administration');
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
    this.router.navigateByUrl('');
  }

  routeToDashboard() {
    this.router.navigateByUrl('/dashboard');
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

}

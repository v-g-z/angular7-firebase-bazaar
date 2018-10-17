import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { Observable } from 'rxjs';


import { Store } from '@ngrx/store';
import * as fromApp from '../../reducers/index';
import { IBazaar } from '../models/bazaar.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('fadeOne', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        animate(4000, keyframes([
          style({
            transform: 'translateX(-100px)',
            opacity: 0,
            offset: 0
          }),
          style({
            transform: 'translateX(-100px)',
            opacity: 0,
            offset: 0.8
          }),
          style({
            transform: 'translateX(-50px)',
            opacity: 0.5,
            offset: 0.9
          }),
          style({
            transform: 'translateX(-20px)',
            opacity: 1,
            offset: 0.95
          }),
          style({
            transform: 'translateX(0px)',
            opacity: 1,
            offset: 1
          })
        ]))
      ]),
  ])
  ]
})
export class DashboardComponent implements OnInit {
  selectedBazaar$: Observable<IBazaar>;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.selectedBazaar$ = this.store.select(fromApp.getSelectedBazaar);
  }

}

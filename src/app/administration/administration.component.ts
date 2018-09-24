import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as fromApp from '../reducers/index';
import { Observable } from 'rxjs';
import { IBazaarId } from '../core/models/bazaar.model';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {
  bazaarForm: FormGroup;
  selectedBazaar$: Observable<IBazaarId>;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.selectedBazaar$ = this.store.select(fromApp.getSelectedBazaar);

    this.selectedBazaar$.subscribe((bazaar: IBazaarId) => {
      this.bazaarForm = new FormGroup({
        'title': new FormControl((bazaar) ? bazaar.title : '', Validators.required),
        'nbOfVendors': new FormControl((bazaar) ? bazaar.nbOfVendors : '', Validators.required),
        'fee': new FormControl((bazaar) ? bazaar.fee : '', Validators.required),
        'margin': new FormControl((bazaar) ? bazaar.margin : '', Validators.required),
      });
    });


  }

}

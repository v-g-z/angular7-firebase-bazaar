import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromApp from '../reducers/index';
import * as BazaarActions from '../core/dashboard/store/bazaar.actions';
import { IBazaarId } from '../core/models/bazaar.model';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {
  bazaarForm: FormGroup;
  isLoading$: Observable<boolean>;
  selectedBazaar$: Observable<IBazaarId>;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromApp.getIsLoading);

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



  onSubmit() {
    this.selectedBazaar$.subscribe((bazaar: IBazaarId) => {
      if (bazaar) {

        this.store.dispatch(new BazaarActions.UpdateBazaar({
          id: bazaar.id,
          data: this.bazaarForm.value
        }));

      } else {
        this.store.select(fromApp.getUser).subscribe(user => {
          console.log('user', user.email);
          this.bazaarForm.value.admin = user.email;
          this.bazaarForm.value.access = [user.email];
          this.store.dispatch(new BazaarActions.CreateBazaar(this.bazaarForm.value));
        });
      }
    });
  }

}

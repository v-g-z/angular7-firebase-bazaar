import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase';


import { IBazaarId } from '../../core/models/bazaar.model';
import * as fromApp from '../../reducers/index';
import * as BazaarActions from '../../core/dashboard/store/bazaar.actions';


@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {
  inviteForm: FormGroup;
  selectedBazaar$: Observable<IBazaarId>;

  access: string[];

  constructor(private store: Store<fromApp.AppState>, private afs: AngularFirestore) { }

  ngOnInit() {
    this.selectedBazaar$ = this.store.select(fromApp.getSelectedBazaar);

    this.selectedBazaar$.subscribe(bazaar => {
      if (bazaar) {
        this.access = bazaar.access;
      }
    });

    this.initForm();
  }

  initForm() {
    this.inviteForm = new FormGroup({
      'email': new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });
  }


  onSubmit() {
    this.selectedBazaar$.subscribe(bazaar => {
      let itemDoc: AngularFirestoreDocument<any>;
      itemDoc = this.afs.doc<any>(`bazaars/${bazaar.id}`);
      itemDoc.update({
        access: firebase.firestore.FieldValue.arrayUnion(this.inviteForm.value.email)
      }).then(() => {
        this.inviteForm.reset();
        // this.initForm();
        this.store.dispatch(new BazaarActions.FindAndSelectBazaar(bazaar.id));
      }).catch(function (error) {
        console.error('Ooops, da ist was schief gelaufen...', error);
      });
    }).unsubscribe();

  }

  delete(item) {
    this.selectedBazaar$.subscribe(bazaar => {
      let itemDoc: AngularFirestoreDocument<any>;
      itemDoc = this.afs.doc<any>(`bazaars/${bazaar.id}`);
      itemDoc.update({
        access: firebase.firestore.FieldValue.arrayRemove(item)
      }).then(() => {
        this.inviteForm.reset();
        // this.initForm();
        this.store.dispatch(new BazaarActions.FindAndSelectBazaar(bazaar.id));
      }).catch(function (error) {
        console.error('Ooops, da ist was schief gelaufen...', error);
      });
    }).unsubscribe();
  }


}

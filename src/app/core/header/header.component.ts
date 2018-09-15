import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromApp from '../../reducers/index';
import * as AuthActions from '../../auth/store/auth.actions';
import { IBazaarId, IBazaar } from '../models/bazaar.model';
import { ICartItem, ICartItemId } from '../models/cart-items.model';
import { AngularFirestoreDocument, AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, switchMap } from 'rxjs/operators';
import * as BazaarActions from '../dashboard/store/bazaar.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isauth$: Observable<boolean>;
  selectedBazaar$: Observable<IBazaarId>;
  cartItems$: Observable<ICartItem[]>;
  cartItemCollection: AngularFirestoreCollection<ICartItem>;
  turnover: number;

  private bazaarCollection: AngularFirestoreCollection<IBazaar>;
  bazaars$: Observable<IBazaarId[]>;

  constructor(private store: Store<fromApp.AppState>, private router: Router, private afs: AngularFirestore) { }

  ngOnInit() {
    this.isauth$ = this.store.select(fromApp.getIsAuthenticated);
    this.selectedBazaar$ = this.store.select(fromApp.getSelectedBazaar);

    // place getUser inside header, as this component is initially loaded
    // firebase login refresh makes this call helpfully here
    this.store.dispatch(new AuthActions.GetUser());

        /**
     * select list of bazaars
     */
    this.bazaarCollection = this.afs.collection<IBazaar>('bazaars');
    this.bazaars$ = this.bazaarCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IBazaar;
        const id = a.payload.doc.id;
        console.log('bazaar', data);
        return { id, ...data };
        
      }))
    );



    this.selectedBazaar$.subscribe(bazaar => {
      console.log('in header selelcted bazaar');
      if (bazaar) {
        let itemDoc: AngularFirestoreDocument<any>;
        itemDoc = this.afs.doc<any>('bazaars/' + bazaar.id);
        //   // itemDoc.valueChanges();
        //   console.log('valueChanges', itemDoc);

        this.cartItemCollection = itemDoc.collection<ICartItem>('cartItems', ref => {
          let query: firebase.firestore.Query = ref;
          query = query.orderBy('vendor');
          return query;


        });

        this.cartItems$ = this.cartItemCollection.valueChanges();
        // this.cartItems$ = this.cartItemCollection.valueChanges().pipe(
        //   map(items => {
        //     return items.price as ICartItem;
        //     })
        // );

        this.cartItems$.subscribe(items => {
          if (items.length > 0) {
            this.turnover = items.map(items => {
              // console.log('items-price', items.price);
              return items.price
            }).reduce((sum, current) => sum + current);
            // const price = items.filter(items => items.price);
            console.log('price', this.turnover);

            //.reduce((arr, curr) => {return (arr + curr)}))
          }
        });
        // console.log('this.cartItems$', this.cartItems$);
      }
    })


  }

  
  select(event): void {
    // hier über state und effects
    let bazaar: IBazaarId = event.value;
    console.log('id', bazaar.id);
    console.log('bazaar', bazaar);
    this.store.dispatch(new BazaarActions.SetSelectedBazaar(bazaar));


  }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
    this.router.navigateByUrl('');
  }

  routeToDashboard() {
    this.router.navigateByUrl('/dashboard');
  }
}

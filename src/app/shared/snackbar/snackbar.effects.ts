import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import * as SnackbarActions from './snackbar.actions';

@Injectable()
export class SnackbarEffects {

  @Effect({
    dispatch: false
  })
  closeSnackbar: Observable<any> = this.actions$.ofType(SnackbarActions.SNACKBAR_CLOSE)
    .pipe(
      tap(() => this.matSnackBar.dismiss())
    );

  @Effect()
  showSnackbar: Observable<any> = this.actions$.ofType(SnackbarActions.SNACKBAR_OPEN)
    .pipe(
      map((action: SnackbarActions.SnackbarOpen) => {
        return action.payload;
      }),
      tap(payload => this.matSnackBar.open(payload.message, payload.action, payload.config)),
      delay(3000),
      map(() => new SnackbarActions.SnackbarClose())
    );

  constructor(private actions$: Actions,
    private matSnackBar: MatSnackBar) {
  }

}

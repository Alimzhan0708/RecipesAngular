import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, throwError} from 'rxjs';
import { User } from "./user.model";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment.prod";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userSubject = new BehaviorSubject<User>(null);
  key: string = environment.apiKey;
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+ this.key,
      {email: email, password: password, returnSecureToken: true }
      ).pipe(tap(resData => {
        this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
      }),
      catchError(this.handleError));
  }

  login(email: string, password: string){
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+ this.key,
    {email: email, password: password, returnSecureToken: true }
    ).pipe(tap(resData => {
      this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }),
    catchError(this.handleError));
  }

  autoLogin() {
    const userData: {email: string, id: string, _token: string, _tokenExpirationDate} = JSON.parse(localStorage.getItem('userData'));
    if(!userData){
      return;
    }
    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    if(loadedUser.token) {
      this.userSubject.next(loadedUser);
      const exiprationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(exiprationDuration * 1000);
    }
  }

  logout() {
    this.userSubject.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(exiprationDuration: number) {
    this.tokenExpirationTimer = setTimeout( this.logout, exiprationDuration);
  }

  private handleAuth(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + +expiresIn*1000);
        const user = new User(email, userId, token, expirationDate);
        this.userSubject.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Uknown error';
        if(!error.error || !error.error.error)
        {
          return throwError(errorMessage);
        }
        switch(error.error.error.message)
        {
          case 'EMAIL_EXISTS':
            errorMessage = 'This email already exists';
            break;
        }
        return throwError(errorMessage);
  }
}

export interface AuthResponseData {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

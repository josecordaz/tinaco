import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

    // API_URL = 'http://192.168.1.72:8082';
    API_URL = 'http://localhost:8082';
    TOKEN_KEY = 'token';

    constructor(private http: HttpClient, private router: Router) { }

    get token() {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    get isAuthenticated() {
        return !!localStorage.getItem(this.TOKEN_KEY);
    }

    setApiURL(url: string){
        this.API_URL = url
    }

    logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        this.router.navigateByUrl('/');
    }

    login(email: string, pass: string) {
        const headers = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' })
        };

        const data = {
            email: email,
            password: pass
        };

        return this.http.post(this.API_URL + '/login', data, headers)
    }

}

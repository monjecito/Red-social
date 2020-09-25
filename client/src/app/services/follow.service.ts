import { Injectable } from '@angular/core'; //Exportar servicios
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Follow } from '../models/follow';

@Injectable()
export class FollowService {
    public url: string;
    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;

    }
    //Guardar follow en la BD
    addFollow(token, follow): Observable<any> {
        let params = JSON.stringify(follow);
        let headers = new HttpHeaders()
            .set('Content-type', 'application/json')
            .set('Authorization', token);

        return this._http.post(this.url + 'follow', params, { headers: headers });


    }

    //Eliminar follow en la BD
    deleteFollow(token,id):Observable<any> {
        let headers = new HttpHeaders()
            .set('Content-type', 'application/json')
            .set('Authorization', token);


            return this._http.delete(this.url+'follow/'+id,{headers:headers});
    }
}
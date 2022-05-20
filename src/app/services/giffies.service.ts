import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GiffiesResponseT } from './types';

@Injectable({
  providedIn: 'root',
})
export class GiffiesService {
  constructor(private http: HttpClient) {}

  getGiffies() {
    console.log('called');
    return this.http.get<GiffiesResponseT>('api.giphy.com/v1/gifs/search');
  }
}

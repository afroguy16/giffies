import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { endpoints } from '../../environments/environment';
import { GiffiesResponseT } from './types';

@Injectable({
  providedIn: 'root',
})
export class GiffiesService {
  constructor(private http: HttpClient) {}

  getGiffies() {
    return this.http.get<GiffiesResponseT>(
      `${endpoints.search}q=hippy&limit=9&offset=0&rating=g&lang=en`
    );
  }
}

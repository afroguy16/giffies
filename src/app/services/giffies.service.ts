import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { endpoints } from '../../environments/environment';
import { GiffiesResponseT, RequestPayloadT } from './types';

@Injectable({
  providedIn: 'root',
})
export class GiffiesService {
  constructor(private http: HttpClient) {}

  getGiffies({ query, limit, offset, rating, lang }: RequestPayloadT) {
    return this.http.get<GiffiesResponseT>(
      `${endpoints.search}q=${query}&limit=${limit}&offset=${offset}&rating=${rating}&lang=${lang}`
    );
  }
}

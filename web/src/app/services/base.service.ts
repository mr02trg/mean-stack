import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  private base_url = ''
  constructor() { 
    this.base_url = environment.api_url
  }

  get api_base_url() {
    return this.base_url;
  }
}

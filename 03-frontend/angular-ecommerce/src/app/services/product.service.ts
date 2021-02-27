import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private httpClient : HttpClient) { }

  //returns the observable and maps the JSON data from Spring data REST to product array
  getProductList() : Observable<Product[]>{
    return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
      map(response => response._embedded.products)
    )

  }
}
//unwraps the JSON from Spring Data REST _embedded entry
interface GetResponse{
  _embedded: {
    products : Product[];
  }
}
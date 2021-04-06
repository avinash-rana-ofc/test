import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  

  private baseUrl = 'http://localhost:8080/api/products';

  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient : HttpClient) { }

  getProduct(theProductId: number) {
    //need to build URL based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  //returns the page and size and category id
  getProductListPaginate(thePage : number, 
                        theSize : number, 
                        theCategoryId : number) : Observable<GetResponseProducts>{
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                        +`&page=${thePage}&size=${theSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }

  //returns the observable and maps the JSON data from Spring data REST to product array
  getProductList(theCategoryId : number) : Observable<Product[]>{
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);

  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    //need to build url based on Name
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.getProducts(searchUrl);
  }

   //need to build URL based on keyword, page and size
  searchProductsPaginate(thePage : number, 
                          thePageSize : number, 
                          theKeyword : string) : Observable<GetResponseProducts>{
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
  +`&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

//Returns an observable Maps the JSON data from Spring Data REST to ProductCategory Array
  getProductCategories() : Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    )
  }

}
//unwraps the JSON from Spring Data REST _embedded entry
interface GetResponseProducts{
  _embedded: {
    products : Product[];
  },
  page : {
    size : number,//size of the page
    totalElements : number,//Grand total of all elements in the database. But we are NOT returning all of the elements. Just the "count" for the informational purpose only
    totalPages : number,// total pages available
    number : number// current page number
  }
}

//unwraps the JSON from spring Data Rest _embedded entry
  interface GetResponseProductCategory{
    _embedded: {
      productCategory : ProductCategory[];
    }
}
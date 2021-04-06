import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
products: Product[] = [];
currentCategoryId : number = 1;
previousCategoryId: number = 1;
searchMode : boolean = false;

//new properties for pagination
thePageNumber : number = 1;
thePageSize : number = 5;
theTotalElements : number = 0;

previousKeyword : string = null;


//inject our ProductService
//activated route for accesing the route parameters
  constructor(private productService: ProductService,
              private cartService : CartService,
              private route : ActivatedRoute) { }

  //Simailar to @PostConstruct
  ngOnInit(): void {
    this.route.paramMap.subscribe(() =>{
    this.listProducts();
    });
  }


  

  listProducts(){
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }
  }


  handleSearchProducts() {
    const theKeyword : string = this.route.snapshot.paramMap.get('keyword');

    //if we have different keyword than previous
    //then set  the pageNumber to 1
    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword =${theKeyword} and thePageNumber = ${this.thePageNumber}`);


    //now search for products using keyword
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                                this.thePageSize, 
                                                theKeyword).subscribe(this.processResult());
  }

  handleListProducts(){

    const hasCategoryId : boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      //get the "id" param string.  convert to anumber using "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    }
    else{
      //not category id available.. default to id 1
      this.currentCategoryId = 1;
    }


    //
    //Check if we have different category then previous
    //Note: Angular will reuse a component if it is currently being viewed
    //
    //if we have different category id than previous
    //then set thePageNumber back to 1
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    /* //method is invoked when you "subscribe"
    this.productService.getProductList(this.currentCategoryId).subscribe(
      //Assign results to Product array
      data => {
        this.products = data;
      }
    ) */

    //now get the products for the given category id
    this.productService.getProductListPaginate(this.thePageNumber - 1, 
                                                this.thePageSize,
                                                this.currentCategoryId)
                                                .subscribe(this.processResult());
  }
  //left hand side is the properties defined in this class
  //rhs of assignment is data from Spring Data REST JSON
  processResult() {
    return data =>{
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  updatePageSize(pageSize : number){
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct : Product){
    console.log(`Adding to Cart = ${theProduct.name}, ${theProduct.unitPrice}`);

    const thecartItem = new CartItem(theProduct);

    this.cartService.addToCart(thecartItem);
  }
}

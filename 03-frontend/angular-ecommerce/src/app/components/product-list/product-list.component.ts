import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-table.component.html',
  //templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
products: Product[];

//inject our ProductService
  constructor(private productService: ProductService) { }

  //Simailar to @PostConstruct
  ngOnInit(): void {
    this.listProducts();
  }

  listProducts(){
    //method is invoked when you "subscribe"
    this.productService.getProductList().subscribe(
      //Assign results to Product array
      data => {
        this.products = data;
      }
    )
  }
}

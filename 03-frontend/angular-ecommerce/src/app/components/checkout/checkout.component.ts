import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { InstanceFormService } from 'src/app/services/instance-form.service';
import { InstanceFormValidators } from 'src/app/validators/instance-form-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalPrice : number = 0;
  totalQuantity : number = 0;
  checkOutFormGroup : FormGroup;
  
  creditCardMonths : number[] = [];
  creditCardYears : number[] = [];

  countries : Country[] = [];
  states : State[] = [];

  shippingAddressStates : State[] = [];
  billingAddressStates : State[] = [];

  constructor(private formBuilder : FormBuilder,
              private instanceFormService : InstanceFormService,
              private cartService  :CartService,
              private checkoutService : CheckoutService,
              private router : Router) { }

  ngOnInit(): void {

    this.cartReviewDetails();

    this.checkOutFormGroup = this.formBuilder.group({
      customer : this.formBuilder.group({
        // firstName : [''],
        firstName : new FormControl('', [Validators.required,
                                       Validators.minLength(2), 
                                       InstanceFormValidators.notOnlyWhitespace]),
        lastName : new FormControl('', [Validators.required, 
                                        Validators.minLength(2), 
                                        InstanceFormValidators.notOnlyWhitespace]),
        email : new FormControl('', [Validators.required, 
                                    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9._]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress : this.formBuilder.group({
        street : ['', [Validators.required, 
                      Validators.minLength(2), 
                      InstanceFormValidators.notOnlyWhitespace]],
        city : ['', [Validators.required, 
                    Validators.minLength(2), 
                    InstanceFormValidators.notOnlyWhitespace]],
        state : ['', Validators.required],
        country : ['', Validators.required],
        zipCode : ['', [Validators.required, 
                        Validators.minLength(2), 
                        InstanceFormValidators.notOnlyWhitespace]]
      }),
      billingAddress : this.formBuilder.group({
        street : ['', [Validators.required, 
                      Validators.minLength(2), 
                      InstanceFormValidators.notOnlyWhitespace]],
        city : ['', [Validators.required, 
                    Validators.minLength(2), 
                    InstanceFormValidators.notOnlyWhitespace]],
        state : ['', Validators.required],
        country : ['', Validators.required],
        zipCode : ['', [Validators.required, 
                        Validators.minLength(2), 
                        InstanceFormValidators.notOnlyWhitespace]]
      }),
      creditCard : this.formBuilder.group({
        cardType : ['', Validators.required],
        nameOnCard : ['', [Validators.required, 
                    Validators.minLength(2), 
                    InstanceFormValidators.notOnlyWhitespace]],
        cardNumber : ['', [Validators.required, 
                      Validators.pattern('[0-9]{16}')]],
        securityCode : ['', [Validators.required, 
                        Validators.pattern('[0-9]{3}')]],
        expirationMonth : [''],
        expirationYear : ['']
      })
    });

    //populate credit card months
    const startMonth : number = new Date().getMonth() + 1;
    console.log(`Start Month: ${startMonth}`);
    this.instanceFormService.getCreditCardMonths(startMonth).subscribe(
      data =>{
        console.log(`Retrieved Credit Card Months: ${ JSON.stringify(data) }`);
        this.creditCardMonths = data;
      }
    )

    //populate credit card years
    this.instanceFormService.getCreditCardYears().subscribe(
      data => {
        console.log(`Retrived Credit Card Years: ${ JSON.stringify(data) }`);
        this.creditCardYears = data;
      }
    )

    //populate dropdown counries
    this.instanceFormService.getCountries().subscribe(
      data => {
        console.log(`Retrieve counries: ${JSON.stringify(data)}`);
        this.countries = data;
      }
    )

    /* this.instanceFormService.getStates().subscribe(
      data => {
        console.log(`Retrieve states: ${JSON.stringify(data)}`);
        this.states = data;
      }
    ) */

      
  }


  cartReviewDetails() {
    
    //subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    //subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
    
  }



  get firstName(){ return this.checkOutFormGroup.get('customer.firstName'); }
  get lastName(){ return this.checkOutFormGroup.get('customer.lastName'); }
  get email(){ return this.checkOutFormGroup.get('customer.email'); }

  get shippingAddressStreet(){ return this.checkOutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCountry(){ return this.checkOutFormGroup.get('shippingAddress.country'); }
  get shippingAddressCity(){ return this.checkOutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState(){ return this.checkOutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode(){ return this.checkOutFormGroup.get('shippingAddress.zipCode'); }

  get billingAddressStreet(){ return this.checkOutFormGroup.get('billingAddress.street'); }
  get billingAddressCountry(){ return this.checkOutFormGroup.get('billingAddress.country'); }
  get billingAddressCity(){ return this.checkOutFormGroup.get('billingAddress.city'); }
  get billingAddressState(){ return this.checkOutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode(){ return this.checkOutFormGroup.get('billingAddress.zipCode'); }

  get creditCardType(){ return this.checkOutFormGroup.get('creditCard.cardType'); }
  get creditCardName(){ return this.checkOutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber(){ return this.checkOutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode(){ return this.checkOutFormGroup.get('creditCard.securityCode'); }



  copyShippingAddressToBilling(event){
    if(event.target.checked){
      this.checkOutFormGroup.controls.billingAddress
          .setValue(this.checkOutFormGroup.controls.shippingAddress.value); 
          
          //bug resolve for states
          this.billingAddressStates = this.shippingAddressStates;
    }
    else{
      this.checkOutFormGroup.controls.billingAddress.reset();

      //bug resolve for states     
      this.billingAddressStates = [];
    }
  }

  onSubmit() {
    console.log("Handling the submit button");

    if (this.checkOutFormGroup.invalid) {
      this.checkOutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    // - long way
    /*
    let orderItems: OrderItem[] = [];
    for (let i=0; i < cartItems.length; i++) {
      orderItems[i] = new OrderItem(cartItems[i]);
    }
    */

    // - short way of doing the same thingy
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // set up purchase
    let purchase = new Purchase();
    
    // populate purchase - customer
    purchase.customer = this.checkOutFormGroup.controls['customer'].value;
    
    // populate purchase - shipping address
    purchase.shippingAddress = this.checkOutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billing address
    purchase.billingAddress = this.checkOutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;
  
    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe({
        next: response => {
          alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

          // reset cart
          this.resetCart();

        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    );

  }


  resetCart() {
    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //reset form
    this.checkOutFormGroup.reset();

    //navigate back to product page
    this.router.navigateByUrl("/products");
  }


  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkOutFormGroup.get('creditCard');
    console.log("on change");
    const currentYear = new Date().getFullYear();
    const selectedYear = Number(creditCardFormGroup.value.expirationYear);

    //if current year equal selected year, then start with current year
    let startMonth : number;

    if(currentYear == selectedYear){
      startMonth = new Date().getMonth() + 1;
    }
    else{
      startMonth = 1;
    }

    this.instanceFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log(`Retrieved card months: ${ JSON.stringify(data)}`);
        this.creditCardMonths = data;
      }
    );

  }

  getStates(formGroupName : string){

    const formGroup = this.checkOutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.instanceFormService.getStates(countryCode).subscribe(
      data => {

        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }
        else{
          this.billingAddressStates = data;
        }
        
        //select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    );
  }

}

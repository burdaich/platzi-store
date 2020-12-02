import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MyValidators } from './../../../../utils/validators';
import { ProductsService } from './../../../../core/services/products/products.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { Category } from 'src/app/core/models/category.model';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

  form: FormGroup;
  id: string;
  image$: Observable<any>;
  categories: Category[];
  states = [
    { name: "Arizona", abbrev: "AZ" },
    { name: "California", abbrev: "CA" },
    { name: "Colorado", abbrev: "CO" },
    { name: "New York", abbrev: "NY" },
    { name: "Pennsylvania", abbrev: "PA" },
  ];


  constructor(
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storage: AngularFireStorage,
    private categoriesService: CategoriesService

  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params.id;
      this.productsService.getProduct(this.id)
        .subscribe((product: any) => {
          console.log(product);
          this.form.patchValue({ ...product, state: this.getStateFromList(product.state) });
        });
    });

    this.categoriesService.getAllCategories().subscribe(data => this.categories = data);
  }

  private getStateFromList(product: any): any {
    //default;
    let stateToReturn = this.states[0];

    this.states.forEach((element: any) => {
      if (product !== undefined && typeof product.abbrev !== 'undefined' && element.abbrev === product.abbrev) {
        stateToReturn = element;
      }
    });

    return stateToReturn;
  }


  saveProduct(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      const product = this.form.value;
      this.productsService.updateProduct(this.id, product)
        .subscribe((newProduct) => {
          console.log(newProduct);
          this.router.navigate(['./admin/products']);
        });
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required, MyValidators.isPriceValid]],
      image: ['', Validators.required],
      category_id: ['', Validators.required],
      state: ['', Validators.required],
      description: ['', [Validators.required]],
    });
  }

  get priceField() {
    return this.form.get('price');
  }

  get imageField() {
    return this.form.get('image');
  }

  get categoryIdField() {
    return this.form.get('category_id');
  }

  get stateField() {
    return this.form.get('state');
  }

  uploadFile(event) {
    const file = event.target.files[0];
    const name = 'image.png';
    const fileRef = this.storage.ref(name);
    const task = this.storage.upload(name, file);

    task.snapshotChanges()
      .pipe(
        finalize(() => {
          this.image$ = fileRef.getDownloadURL();
          this.image$.subscribe(url => {
            console.log(url);
            this.form.get('image').setValue(url);
          });
        })
      )
      .subscribe();
  }

}

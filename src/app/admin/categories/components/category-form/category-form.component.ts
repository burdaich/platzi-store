import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { MyValidators } from '../../../../utils/validators';
import { Category } from 'src/app/core/models/category.model';
import { CategoriesService } from 'src/app/core/services/categories.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {

  form: FormGroup;
  categoryId: string;
  isNewCategory: boolean = true;

  @Input() set category(data: Category) {
    if (data) {
      this.isNewCategory = false;
      this.form.patchValue(data);
    }
  };
  @Output() createCategory = new EventEmitter();
  @Output() updateCategory = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private storage: AngularFireStorage, private categoriesService: CategoriesService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)], MyValidators.validateCategory(this.categoriesService)],
      image: ['', Validators.required]
    });
  }

  get nameField() {
    return this.form.get('name');
  }

  get imageField() {
    return this.form.get('image');
  }

  save() {
    if (this.form.valid) {
      if (this.isNewCategory) {
        //this.updateCategory();
        this.createCategory.emit(this.form.value);
      } else {
        //this.createCategory();
        this.updateCategory.emit(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  updloadFile(event) {
    const image = event.target.files[0];
    const name = 'category.png';
    const ref = this.storage.ref(name);
    const task = this.storage.upload(name, image);

    task.snapshotChanges().pipe(finalize(() => {
      const urlImage$ = ref.getDownloadURL();
      urlImage$.subscribe(url => {
        console.log(url);
        this.imageField.setValue(url);
      });
    })
    ).subscribe();
  }

}

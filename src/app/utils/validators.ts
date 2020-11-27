import { AbstractControl } from '@angular/forms';
import { CategoriesService } from '../core/services/categories.service';
import { map } from 'rxjs/operators';

export class MyValidators {

  static isPriceValid(control: AbstractControl) {
    const value = control.value;
    console.log(value);
    if (value > 10000) {
      return { price_invalid: true };
    }
    return null;
  }

  static validateCategory(categoriesService: CategoriesService) {
    return (control: AbstractControl) => {
      const value = control.value;
      return categoriesService.checkCategory(value).pipe(
        map((response: any) => {
          const isAvailable = response.isAvailable;
          if (!isAvailable) {
            return { not_available: true };
          }
          return null;
        })
      );
    };
  }

}

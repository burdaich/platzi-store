import { HttpClient } from '@angular/common/http';
import { BuiltinMethod } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searrchField = new FormControl();
  result: any[];

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.searrchField.valueChanges.subscribe(query => this.getData(query));
  }


  private getData(query: string) {
    const API = 'PstCMshiD9aNvhyYEdHR6RNCQtJ6PyXG';
    this.httpClient.get(`https://api.giphy.com/v1/gifs/search?api_key=${API}&q=${query}&limit=&offset=&rating=g&lang=en`)
      .pipe(
        map((response: any) => {
          return response.data.map(item => item.images.downsized);
        }
        ))
      .subscribe(data => console.log(data));
  }
}

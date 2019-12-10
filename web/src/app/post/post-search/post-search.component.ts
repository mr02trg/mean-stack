import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-search',
  templateUrl: './post-search.component.html',
  styleUrls: ['./post-search.component.scss']
})
export class PostSearchComponent implements OnInit, OnDestroy {

  constructor(
    private fb: FormBuilder
  ) { }

  show: boolean = false;

  form: FormGroup = this.fb.group({
    'tags': [[]],
    'date': [null],
  });

  subscription = new Subscription();

  @Output()
  search = new EventEmitter();
  
  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onClear() {
    this.form.patchValue({
      'tags': [],
      'date': null
    });
    this.form.updateValueAndValidity();
    this.onSearch();
  }

  onSearch() {
    const request = { ... this.form.value};
    this.search.emit(request);
  }
}

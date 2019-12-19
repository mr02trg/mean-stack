import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
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

  form: FormGroup = this.fb.group({
    'tags': [[]],
    'date': [null],
  });

  subscription = new Subscription();

  @Input()
  show: boolean = false;

  @Output()
  showChange = new EventEmitter();

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
    const request = { ...this.form.value };
    this.search.emit(request);
  }
}

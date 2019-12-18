import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageService } from 'src/app/services/page.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, OnDestroy {

  constructor(
    private pageService: PageService
  ) { }


  ngOnInit() {
    this.pageService.setPadding(false);
  }

  ngOnDestroy() {
    this.pageService.setPadding(true);
  }

  goto(elementId: string) {
    document.getElementById(elementId).scrollIntoView({behavior: "smooth"});
  }
}

import { Component, OnInit } from '@angular/core';
import { MainService } from './main.service';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [MainService]
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // let url=window.location.href;
    // if(url.indexOf("main") !== -1)
    // {
    //   console.log(url);
    // }
    
  }

}

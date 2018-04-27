import { Component, OnInit } from '@angular/core';
import {AdminHomeService} from './admin-home.service';
@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
  providers: [AdminHomeService]
})
export class AdminHomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}



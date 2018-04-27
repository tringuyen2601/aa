import { Component, OnInit } from '@angular/core';
import { AppConfig } from "../app.config";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }

  public buildVersion:string;

  ngOnInit() {
    this.buildVersion = new AppConfig().buildVersion;
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { Z_VERSION_ERROR } from 'zlib';
import { NgIf } from '@angular/common';

@Component({
  selector: 'row',
  //template: '<h1>ola </h1>',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.css']
  
})

export class RowComponent implements OnInit {
  @Input() data: any;
  @Input() setting:any;
  evilTitle = 'Template <h1>alert("evil never sleeps")</h1>Syntax';
  title:any;  
  dataObject: any;
  listData: any[];
  listData1: any[];
  show:boolean;
  settings: any;
  column:any;
  row: any[][];
  selectedValue = [];
  showButton: boolean;
  createRow: boolean;
  rowTemp:any;
  boo:any;
  constructor() { 
   }

  ngOnInit() {
    this.loadData();
    this.loadColumn();
    this.loadRow();
    //this.loadData1();
    this.loadTitle();
    this.loadCheckbox();
    this.showButton = false;
    this.createRow = false;       
    this.boo = [];   
  }
  add()
  {
    //this.listData.length++;

    let newDataID: any;
    newDataID = this.listData.length++;
    
    console.log(newDataID);

    //console.log(self.listData);
  }

  loadSetting(){
    this.dataObject = this.data[0];
    this.title = Object.getOwnPropertyNames(this.dataObject);
    console.log(  this.title);
  }

  loadData(){
    let a: any;
    let self = this;
    self.listData = [];
    for(let i = 0; i < self.data.length; i++)
    {
      self.listData[i] = self.data[i];
    }
  }
  loadData1(){
    // let a: any;
    // let self = this;
    // this.row = [];
    // for(let u = 0; u < self.title.length; u++)
    // {
    //   this.row[u] = [];
    //   this.row[u].push(self.title[u]);
    //   console.log(this.row[u]);
    //   for(let i = 0; i < self.listData.length; i++)
    //   {
    //     this.row[u][i] = '';
    //    // console.log(this.row[u][i]);
    //    // console.log( self.listData[i].title[u]);
    //     this.row[u][i] = self.listData[i].title[u];
    //   }
    // }
   // console.log(this.row);
   //console.log(this.listData[0].value);
   let a:any;
   a = [];
   let tit:any;
   const descriptor1 = Object.getOwnPropertyDescriptor(this.listData[1], this.title[0]);
   let des:any;
   //console.log(descriptor1.value);
   for(let i = 0; i< this.title.length; i++)
   {
      a[i]=[];
      tit = this.title[i];
      //console.log(tit);
      des = Object.getOwnPropertyDescriptor(this.listData[i], tit).value;
      console.log(des);
      for(let u = 0; u < this.data.length; u++)
      {
        a[i][u] = des;
        console.log(a[i][u]);
      }
   }
   console.log(a);
   //console.log(descriptor1.value);
  }
 
  
  loadColumn(){
    let settingObj = Object.getOwnPropertyNames(this.setting.column);
    let dataObj = Object.getOwnPropertyNames(this.data[0]);
    this.column = [];
    for(let u = 0; u < settingObj.length; u++){
      for(let i = 0; i< dataObj.length; i++){
        if(settingObj[u] == dataObj[i]){
          this.column[u] = settingObj[u];
        }
      }
    }
    //console.log(this.column);
  }
  loadRow(){
    var res = [];    
    // for (var x in this.data[0]){
    //   console.log(x);
    //   this.data[0].hasOwnProperty(x) && res.push(this.data[0][x])
    //   console.log(res);
    // }
    for(let i = 0; i < this.data.length; i++)
    {
      res[i] = [];
      for(let x in this.data[i]){
        this.setting.column.hasOwnProperty(x) && this.data[i].hasOwnProperty(x) && res[i].push(this.data[i][x]);
      }
    }
    this.row = res;
    
    //console.log(this.row);
  }
  loadTitle(){
    var res=[];
    this.title = [];
    for(let x in this.setting.column){
      this.setting.column.hasOwnProperty(x) && res.push(this.setting.column[x]);
    }
    for(let i = 0; i < res.length; i++){
      this.title.push(res[i].name);
    }
    this.rowTemp = this.title;
    this.rowTemp.splice(this.rowTemp.length-1, 1);
    //console.log(tit);
  }
  loadCheckbox(){
    if(this.setting.checkbox == true)
    {
      this.show = true;
    }
  }
  checked(i){
    let leng = this.selectedValue.length;
    if(leng == 0){
      this.selectedValue.push(i);
      this.showButton = true;
    } else {      
      var flag = false;
      for(let u = 0; u < leng; u++){
        if(this.selectedValue[u] == i){
          this.selectedValue.splice(u, 1);
          if(this.selectedValue.length == 0){
            this.showButton = false;
          }
          flag = true; 
        }
      }
      if(flag == false){
        this.selectedValue.push(i);        
      }
        
    }
    console.log(this.selectedValue);
  }
  delete(){
    if(this.selectedValue.length != 0 ){
      for(let i = 0; i < this.selectedValue.length; i ++){
        this.row.splice(this.selectedValue[i], 1);
      }
    }
    this.selectedValue = [];
  }
  onSearch(searchValue)
  {
    let newRow = [];
    for(let i = 0; i < this.row.length;i++)
    {
      for(let j = 0; j < this.row[i].length; j++){
        if(this.row[i][j] == searchValue){
          newRow[0] = this.row[i];
        }
      }
    }
    this.row = newRow;
    console.log(newRow);
  }
  create(){
    this.createRow = true;
  }
  onCreate(){
    console.log(this.boo);
    this.row.length++;
    let n = this.row.length-1;
    this.row[n] = [];
    for(let i = 1; i < this.row.length;i++)
    {
      this.row[n][i] = this.boo[i-1];
    }
    console.log(this.row.length)
    
    console.log(this.row[n].length)
  }
}

import { Component, OnInit,Injectable, Input, Output,  EventEmitter, NgModule } from '@angular/core';
import { AdminBucketService} from '../../services/admin.bucket.service';
import { Ng2SmartTableModule,LocalDataSource } from '../../../ng2-smart-table';
import { ManageBucketsConfig } from '../admin.config';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from "../../confirmation-dialog/confirmation-dialog.service";
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { AuthService } from "../../services/auth.service";
import { Http } from '@angular/http';
import { ngModuleJitUrl } from '@angular/compiler';
import { TableComponent } from '../../table/table.component';

@Injectable()
@Component({
  selector: 'buckets-admin',
  //template:'<app-smart-table></app-smart-table>',
  templateUrl: './buckets.component.html',
  styleUrls: ['./buckets.component.css'],
  providers: []
})

export class BucketsComponent implements OnInit {
  source1: LocalDataSource;
  settings1 = {
    selectMode: 'multi',         
    columns: {
      id: {
        title: 'S.No',
        filter: false
      },
      name: {
        title: 'Bucket Name',
        filter: false
      },
      checkbox:{
        title: 'ola',
        editor:{
          type: 'checkbox',
          config: true
        }
      }
    },
  };

  data1 = [
    {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
      checkbox: true
    },
    {
      id: 2,
      name: 'Ervin Howell',
      username: 'Antonette',
      email: 'Shanna@melissa.tv',
      checkbox: true
      
    },
    {
      id: 3,
      name: 'Clementine Bauch',
      username: 'Samantha',
      email: 'Nathan@yesenia.net',
      checkbox: true
      
    },
    {
      id: 4,
      name: 'Patricia Lebsack',
      username: 'Karianne',
      email: 'Julianne.OConner@kory.org',
      checkbox: true
      
    },
    {
      id: 5,
      name: 'Chelsey Dietrich',
      username: 'Kamren',
      email: 'Lucio_Hettinger@annie.ca',
    },
    {
      id: 6,
      name: 'Mrs. Dennis Schulist',
      username: 'Leopoldo_Corkery',
      email: 'Karley_Dach@jasper.info',
    },
    {
      id: 7,
      name: 'Kurtis Weissnat',
      username: 'Elwyn.Skiles',
      email: 'Telly.Hoeger@billy.biz',
    },
    {
      id: 8,
      name: 'Nicholas Runolfsdottir V',
      username: 'Maxime_Nienow',
      email: 'Sherwood@rosamond.me',
    },
    {
      id: 9,
      name: 'Glenna Reichert',
      username: 'Delphine',
      email: 'Chaim_McDermott@dana.io',
    },
    {
      id: 10,
      name: 'Clementina DuBuque',
      username: 'Moriah.Stanton',
      email: 'Rey.Padberg@karina.biz',
    },
    {
      id: 11,
      name: 'Nicholas DuBuque',
      username: 'Nicholas.Stanton',
      email: 'Rey.Padberg@rosamond.biz',
    },
  ];
  constructor(private adminBucketService: AdminBucketService,
              private toastrService: ToastrService,
              private confirmationDialogService: ConfirmationDialogService,
              private authService: AuthService){
                  this.source1 = new LocalDataSource(this.data1);
              }
  @Input() data: any[] = [];
  @Output() onDelete = new EventEmitter<boolean>();
  @Output() onCreate = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<boolean>();
    
  public settings: any = ManageBucketsConfig.ManageBucketSettings;
  public source: LocalDataSource; 
  
  ngOnInit() {
  }
  onSearch(query: string = '') {
    this.source1.setFilter([
      // fields we want to include in the search
      {
        field: 'id',
        search: query
      },
      {
        field: 'name',
        search: query
      },
      {
        field: 'username',
        search: query
      },
      {
        field: 'email',
        search: query
      }
    ], false);
    // second parameter specifying whether to perform 'AND' or 'OR' search 
    // (meaning all columns should contain search query or at least one)
    // 'AND' by default, so changing to 'OR' by setting false here
  }
  //get all buckets of company
  public getAllBucketsOfCompany(companyId){
    this.adminBucketService.getBucketsOfCompanyService(companyId).subscribe(data =>{
      this.data = data.data;
    }, err => {
      this.toastrService.error(err.error.message, 'Error');
    });
  }

  //create bucket
  public onCreateConfirm(event) {
    this.confirmationDialogService.confirm('Confirm', 'Bucket Create?', 'Yes', 'No').then(result=>{
      if(result){
        console.log('True: ', result);
        let name:string = event.newData['name'];
        console.log('Name: ', name);
        this.adminBucketService.addBucketToCompanyService(this.authService.getSelectedCompanyId(), name).subscribe(data => {
          this.toastrService.success(data.message, 'Success');
          this.adminBucketService.getBucketsOfCompanyService(this.authService.getSelectedCompanyId()).subscribe(data =>{
          this.data = data.data;
          //send notification
          this.onCreate.emit(this.data);
          event.confirm.resolve(event.newData);
          }, err => {
            this.toastrService.error(err.error.message, 'Error');
          });
        }, err => {
          this.toastrService.error(err.error.message, 'Error');
          event.confirm.reject();
        });
      } else {
        console.log('False: ', result);
        event.confirm.reject();
      }
    });
  }

  //delete bucket
  public onDeleteBucket(event){
    console.log('onDeleteBucket Inside', event);
    this.confirmationDialogService.confirm('Confirm', 'Bucket Delete?', 'Yes', 'No').then(result=>{
      if(result){
        let bucketId:string = event.data.id;
        this.adminBucketService.deleteBucketOfCompanyService(this.authService.getSelectedCompanyId(), bucketId).subscribe(data => {
          this.toastrService.success(data.data, 'Success');
          //send notification
          this.onDelete.emit(true);
          event.confirm.resolve(event.newData);
        }, err => {
          this.toastrService.error(err.error.message, 'Error');
          event.confirm.reject();
        });
      } else {
        event.confirm.reject();
      }
    });

  }

  //edit bucket
  public onEditBucket(event){
    this.confirmationDialogService.confirm('Confirm', 'Bucket Edit?', 'Yes', 'No').then(result=>{
      if(result){
        let bucketId:string = event.data.id;
        let newName: string = event.newData['name'];
        this.adminBucketService.editBucketOfCompanyService(this.authService.getSelectedCompanyId(), bucketId, newName).subscribe(data => {
          //this.getAllBucketsOfCompany(this.authService.getSelectedCompanyId());
          this.toastrService.success(data.message, 'Success');
          //send notification
          this.onEdit.emit(true);
          event.confirm.resolve(event.newData);
        }, err => {
          this.toastrService.error(err.error.message, err);
          event.confirm.reject();
        });
      } else {
        event.confirm.reject();
      }
    });
  }


  
}

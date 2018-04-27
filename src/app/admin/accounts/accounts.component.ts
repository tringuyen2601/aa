import { Component, OnInit,Injectable, Input, Output,  EventEmitter } from '@angular/core';
import { AdminAccountService} from '../../services/admin.account.service';
import { Ng2SmartTableModule,LocalDataSource } from 'ng2-smart-table';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from "../../confirmation-dialog/confirmation-dialog.service";
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { AuthService } from "../../services/auth.service";
import { ManageBucketsConfig } from "../admin.config";
import {TreeNode} from 'primeng/api';
@Injectable()
@Component({
  selector: 'accounts-admin',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
  providers: []
})
export class AccountsComponent implements OnInit {

  constructor(private adminAccountService: AdminAccountService,
              private toastrService: ToastrService,
              private confirmationDialogService: ConfirmationDialogService,
              private authService: AuthService,
              private formBuilder: FormBuilder,) {}
  
  @Output() onDelete = new EventEmitter<boolean>();
  @Output() onCreate = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<boolean>();

  @Input() accountObject: any;
  //selected bucket id for account tab
  @Input() selectedAccountBucketId: string = "";
  @Input() listAdminBuckets:any;
  @Input() accountData: any;

  public accountForm: FormGroup;
  public settingsURLAttribues: any = ManageBucketsConfig.URLAttributesSettings;
  public settingsUpdateAccount: any = ManageBucketsConfig.UpdateAccountSettings;

  public urlAttributes: LocalDataSource;
  public attrListData= "";
  public customDataObj={};
  
    public files: TreeNode[] =
      [
            {
                label: "Storage",
                data: {
                  name: "Storage Folder",
                  value: "test"
              },
                expandedIcon: "fa-folder-open",
                collapsedIcon: "fa-folder",
                children: [{
                label: "Storage",
                data: {
                  name: "Storage Folder",
                  value: "test"
              },
                expandedIcon: "fa-folder-open",
                collapsedIcon: "fa-folder"
                }]
            }
      ];

    public selectedFile: TreeNode;
   
  ngOnInit() {
    //create form
    this.resetAccountObject();
    this.createAccountForm(this.accountObject);
    this.urlAttributes = new LocalDataSource(); 
  }

  public nodeSelect(event) {
    console.log('Node Selected: ', event);
  }
  public nodeUnselect(event) {
    console.log('Node Unselected: ', event);
  }

  private createAccountForm(account) {
    this.accountForm = this.formBuilder.group({
      name: [account.name, Validators.required],
      targetURL: [account.targetURL, Validators.required],
      //customData: [account.customData,Validators.required],
      customAttributes:[account.customAttributes,Validators.required],
      accountTags:this.formBuilder.group({
        groupChat:[account.groupChat],
        privateAcc:[account.privateAcc],
        community:[account.community],
        hiddenAcc:[account.hiddenAcc]
      }),
      selectedBucketId: [account.selectedBucketId,Validators.required],
      id: [account.id],
    });
  }

  private resetAccountObject(){
    this.accountObject = {
      name: '',
      targetURL: '',
      customAttributes: '',
      accountTags:{
           groupChat: false,
           privateAcc: false,
           community: false,
           hiddenAcc: false,
      },
      selectedBucketId: this.selectedAccountBucketId,
      id: 0
    };
  }

  public addAttributes(event)
  {
      let attrList=event.source.data;//array
      let newDataInput=event.newData;
      (attrList.length!=0) ? this.attrListData=this.attrListData+"&"+newDataInput.name+"="+newDataInput.value : this.attrListData=newDataInput.name+"="+newDataInput.value;

      //this.urlAttributes=attrList;
      this.urlAttributes.load(attrList);
      console.log("attrlist",attrList);
      console.log("attrListData",this.attrListData);
      console.log("event data",event);
      console.log("urlattr",this.urlAttributes);
      event.confirm.resolve(event.newData);
  }
  public deleteAttributes(event)
  {
      this.attrListData="";
      console.log("event del",event);
      event.confirm.resolve(event.data);
      this.urlAttributes.load(event.source.data);
      console.log("urlattr",this.urlAttributes);
      let attrList=event.source.data;//array
      let newDataInput=event.data;
      let listToDelete=[];
     
      for(var i = 0; i < attrList.length; i++) {
         if(newDataInput["name"]==attrList[i]["name"])
         {
              if(newDataInput["value"]==attrList[i]["value"])
              {
                  listToDelete.push(newDataInput["name"]);
              }
         }
      }
      for(var i = 0; i < attrList.length; i++) {
          var obj = attrList[i];

          if(listToDelete.indexOf(obj.name) !== -1) {
              attrList.splice(i, 1);
          }
      }
      
      if(attrList.length==1)
      {
          this.attrListData=attrList[0]["name"]+"="+attrList[0]["value"];
      }
      else
      {
        for(var i=0;i<attrList.length;i++)
        {
            this.attrListData+=attrList[i]["name"]+"="+attrList[i]["value"]+"&";
        }
        this.attrListData=this.attrListData.slice(0, -1);
      }
      console.log(this.attrListData);
  }

  public onUserRowSelect(event): void {
      console.log(event);
      console.log('Row Data: ', event.data);
      console.log("accform",this.accountForm);
      let selectedRow = event.data;
      let accountTags:string[] = selectedRow.accountTags || [];
      let attrJSON=selectedRow.customAttributes;
      console.log("attrJSON",attrJSON);
      let attr="";
      if(attrJSON!=undefined)
      {
          if(Object.keys(attrJSON).length==1)
          {
              attr=key+"="+attrJSON[key];
          }
          else
          {
              for (var key in attrJSON) {
                attr+=key+"="+attrJSON[key]+"&";
              }
          }
         attr=attr.slice(0, -1);
         console.log("attr",attr);
      }
      let attrData=[];
      if(attr!="")
      {
          for(var key in attrJSON)
          {
            var obj={"name":key,"value":attrJSON[key]};
            attrData.push(obj);
          }
          this.urlAttributes.load(attrData);
      }
      else
      {
          this.urlAttributes.load(attrData);
      }
      console.log(" this.urlAttributes", this.urlAttributes);
      this.accountObject = {
        name: selectedRow.name,
        targetURL: selectedRow.targetURL,
        customAttributes: attr,
        groupChat: accountTags.indexOf('groupChat') != -1,
        privateAcc: accountTags.indexOf('privateAcc') != -1,
        community: accountTags.indexOf('community') != -1,
        hiddenAcc: accountTags.indexOf('hiddenAcc') != -1,
        selectedBucketId: this.selectedAccountBucketId,
        id: selectedRow.id
    };
    this.createAccountForm(this.accountObject);
    // for(selectedRow.customAttributes)
    // this.urlAttributes={}
  }

  public onDeleteAccount(event){
    this.adminAccountService.deleteAccountOfCompanyBucket(this.authService.getSelectedCompanyId(),this.selectedAccountBucketId, event.data.id).subscribe(data => {
      this.getListAccountCompanyBucket(this.authService.getSelectedCompanyId(), this.selectedAccountBucketId);
      this.toastrService.success(data.data, 'Success');
      event.confirm.resolve(event.data);
      }, err => {
        this.toastrService.error(err.error.message, 'Error');
        event.confirm.reject();
      });
  }

  private getListAccountCompanyBucket(companyId, bucketId){
    if(bucketId != ""){
      this.adminAccountService.getListAccountOfCompanyBucket(companyId, bucketId).subscribe(res => {
          //this.toastrService.success(res.message, 'Success');
          console.log('AccountCompanyBucket: ', res);
          this.accountData = res.data;
          this.resetAccountForm();
          
        }, err => {
          console.log("err",err)
            this.toastrService.error(err.message, 'Error');
      });
    }
  }

  public resetAccountForm(){
    this.resetAccountObject();
    this.createAccountForm(this.accountObject);
  }
  
  public onChangeBucket(bucketId){
    this.resetAccountObject();
    console.log('onChangeBucket: ', bucketId);
    this.selectedAccountBucketId = bucketId;
    this.getListAccountCompanyBucket(this.authService.getSelectedCompanyId(), this.selectedAccountBucketId);
  }

  public onSubmitCreateAccount(){
        let data = this.getAccountFormData();
        if(this.accountForm.value.id == 0){
          this.adminAccountService.addAccountToCompanyBucket(this.authService.getSelectedCompanyId(), this.selectedAccountBucketId, data).subscribe(res => {
              this.toastrService.success(res.message, 'Success');
              this.getListAccountCompanyBucket(this.authService.getSelectedCompanyId(), this.selectedAccountBucketId);
              }, err => {
                this.toastrService.error(err.error.message, 'Error');
          });
        } else {
          this.adminAccountService.updateAccountToCompanyBucket(this.authService.getSelectedCompanyId(), this.selectedAccountBucketId, this.accountForm.value.id, data).subscribe(res => {
              this.toastrService.success(res.message, 'Success');
              this.getListAccountCompanyBucket(this.authService.getSelectedCompanyId(), this.selectedAccountBucketId);
              }, err => {
                this.toastrService.error(err, 'Error');
          });
        }
  }

  private getAccountFormData(){
    console.log("accountForm: ", this.accountForm);
    console.log("urlattr: ", this.urlAttributes);
    this.customDataObj={}
    if(this.urlAttributes.count()!=0)
    {
         for(let i=0;i<this.urlAttributes.count();i++)
        {
            let key="",value="";
            key=this.urlAttributes["data"][i].name;
            value=this.urlAttributes["data"][i].value;
            console.log("key",key,"value",value);
            this.customDataObj[key]=value;
        }
    }
   
    console.log("customDataObj",this.customDataObj);
    let name = this.accountForm.value.name;
    let targetURL = this.accountForm.value.targetURL;
    let customAttributes =  this.customDataObj;
    let accountTags = [];
    if(this.accountForm.value.accountTags.groupChat){
      accountTags.push('groupChat');
    }
    if(this.accountForm.value.accountTags.privateAcc){
      accountTags.push('privateAcc');
    }
    if(this.accountForm.value.accountTags.community){
      accountTags.push('community');
    }
    if(this.accountForm.value.accountTags.hiddenAcc){
      accountTags.push('hiddenAcc');
    }
    let data = {
        "name": name,
        "targetURL": targetURL,
        "customAttributes": customAttributes,
        "accountTags": accountTags,
        "dialogName": "menu",
        "dialogType": "PUBLIC_GROUP",
        "dialogId": ""
    }
    return data;
  }

  //validation when mandatory field is empty
  public isFieldValid(field: string) {
      return (
        (!this.accountForm.get(field).valid && this.accountForm.get(field).touched) ||
        (this.accountForm.get(field).untouched)
      );
  }

     //validation code(s)
  public displayFieldCss(field: string) {
    return {
      'has-error': this.isFieldValid(field),
      'has-feedback': this.isFieldValid(field)
    };
  }
  
}

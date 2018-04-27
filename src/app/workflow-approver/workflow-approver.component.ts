import { Component, OnInit, ViewChild } from '@angular/core';
// import { WorkflowApproverService } from './workflow-approver.service';
import {WorkflowApproverService} from '../services/workflow-approver.service';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { IMultiSelectOption,IMultiSelectTexts,IMultiSelectSettings  } from 'angular-2-dropdown-multiselect';
import {FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent} from '../header/header.component';
declare var $: any;
@Component({
  selector: 'app-workflow-approver',
  templateUrl: './workflow-approver.component.html',
  styleUrls: ['./workflow-approver.component.css'],
  providers: [WorkflowApproverService,HeaderComponent]
})
export class WorkflowApproverComponent implements OnInit {
     public tags: FormControl;
  constructor(private ratingsAndTaxonomyService: WorkflowApproverService,
  private userInfoComponent: HeaderComponent,private router: Router) { }


  public users :any;
  public usersData:any;
  public range:any;
  public displayReject:any;
  public reviewedCommentsObjects:any=[];
  public tempProdUserData:any=[];
  public userDataMaster:any=[];
  //new dropdown
  public dropdownList = [];
  public selectedItems = [];
  public dropdownSettings = {};

  public storedropdownList = [];
  public storeSelectedItems = [];
  public storeDropdownSettings = {};

  public catDropdownList = [];
  public catSelectedItems = [];
  public catDropdownSettings = {};
  //new dropdown - end
  public arrayItem=[];
  public arrayCategory=[];
  public arrayStore=[];
  public startPage :any ;
  public paginationLimit :any ;
 
  public onSelectionChange(comment: any): void{
      //funtion of change event.
      console.log("selected comment",comment);
  }  
    public isMarked = (r,index) => {
      if (r >= index + 1) {
        return 'fa-star star-style';
      }
      else if (r > index && r < index + 1) {
        return 'fa-star-half-o star-style';
      }
      else {
        return 'fa-star-o empty-star-style';
      }
  }
  public onSubmitComments(reviewedComments:any){
        console.log("reviewed comments",reviewedComments);
        let a={};
        let flag=1;
        let status="";
        this.reviewedCommentsObjects.length=0;
        for(let i=0;i<reviewedComments.length;i++)
        {
            a={};
            if(reviewedComments[i].selectedDecision.search('reject')!=-1)
            {
                if(reviewedComments[i].reason==null)
                {
                    //pop up enable code
                    flag=0;
                    this.reviewedCommentsObjects.length=0;
                }
            }
            /** 
             * Values accepted in backend - approved,approval_pending,reject
            */
            if(reviewedComments[i].selectedDecision.search('approve')!=-1)
            {
                 status="approved";
            }
            if(reviewedComments[i].selectedDecision.search('reject')!=-1)
            {
                 status="rejected";
            }
            if(reviewedComments[i].selectedDecision.search('approval_pending')!=-1)
            {
                 status="approval_pending";
            }
            if(flag==1)
            {
                a={
                    "id":reviewedComments[i].id,
                    "uniqueUserId":reviewedComments[i].uniqueUserId,
                    "name":reviewedComments[i].name,
                    "itemId":reviewedComments[i].itemId,
                    "itemType":reviewedComments[i].itemType,
                    "title":reviewedComments[i].title,
                    "comment":reviewedComments[i].comment,
                    "status":status,
                    "reason":reviewedComments[i].reason,
                    "product":reviewedComments[i].product,
                    "store":reviewedComments[i].store,
                    "locale":reviewedComments[i].locale
                };

                if(a["status"]!="approval_pending")
                {
                    this.reviewedCommentsObjects.push(a);
                }
            }
        }
        this.ratingsAndTaxonomyService.sendReviewComments(this.reviewedCommentsObjects)
        .subscribe(
        res => {
            console.log("res after create",res);
            location.reload();
        },
        errorCode=>console.log("errorCode",errorCode)
        );

        console.log("obj to send to server",this.reviewedCommentsObjects);
  }
  public fnSelectedChoice(event:any):void{
      //gets the model value of radio
    console.log("event",event);
  }
  public checkDuplicateInObject(propertyName:any, inputArray:any):any {
        let seenDuplicate = false,
            testObject = {};

        inputArray.map(function(item) {
            let itemPropertyName = item[propertyName];    
            if (itemPropertyName in testObject) {
            testObject[itemPropertyName].duplicate = true;
            item.duplicate = true;
            seenDuplicate = true;
            }
            else {
            testObject[itemPropertyName] = item;
             item.duplicate;
            }
        });

        return seenDuplicate;
}
public removeDuplicates(arr, key):any {
    if (!(arr instanceof Array) || key && typeof key !== 'string') {
        return false;
    }

    if (key && typeof key === 'string') {
        return arr.filter((obj, index, arr) => {
            return arr.map(mapObj => mapObj[key]).indexOf(obj[key]) === index;
        });

    } else {
        return arr.filter(function(item, index, arr) {
            return arr.indexOf(item) == index;
        });
    }
}
 public comparer(otherArray){
                return function(current){
                    return otherArray.filter(function(other){
                    return other.productId == current.productId && other.itemName == current.itemName
                    }).length == 0;
                }
}
 public comparerCategory(otherArray){
                return function(current){
                    return otherArray.filter(function(other){
                    return other.categoryId == current.categoryId && other.itemName == current.itemName
                    }).length == 0;
                }
}
 public comparerStore(otherArray){
                return function(current){
                    return otherArray.filter(function(other){
                    return other.storeID == current.storeID && other.itemName == current.itemName
                    }).length == 0;
                }
}
 public showMoreItems()
   {
      this.paginationLimit = Number(this.paginationLimit) + 5;        
   }
   public showLessItems()
   {
     this.paginationLimit = Number(this.paginationLimit) - 5;
   }
  ngOnInit() {
       let localStorageData=localStorage.getItem("user");
   
        if(localStorageData=="undefined"){
            //this.router.navigate(['/home']);
        }
      this.userInfoComponent.loggedIn=true;
      this.displayReject="hide-reject";
      this.range = [];
      for (var i = 0; i < 5; i++) {
             this.range.push(i);
        }
            /* getting a user rating for a comment*/

               this.ratingsAndTaxonomyService.getUserComments()
             .subscribe(
                        data => {
                          this.users=data.data;
                          console.log("users",this.users);
                          this.usersData=this.users;
                          console.log("usersData",this.usersData);
                          for(let i=0;i<this.usersData.length;i++)
                          {
                                this.ratingsAndTaxonomyService.getUserRatings(this.usersData[i].itemId)
                                    .subscribe(
                                            data => {
                                                let ratingdata=data.data;
                                                this.usersData[i]["rating"]=ratingdata.rating;
                                            },
                                            errorCode =>  console.log("errorCode",errorCode)
                                    )
                                let prod=this.usersData[i].itemType;
                                if(prod=="product")
                                {
                                        this.dropdownList.push({"id":i,"productId": this.usersData[i].product.headerData.productId,"itemName":this.usersData[i].product.marketingData.name,"brickCode":this.usersData[i].product.classification.brickCode});
                                        this.ratingsAndTaxonomyService.getCategoryNode(this.usersData[i].product.classification.brickCode)
                                        .subscribe(
                                                data => {
                                                    let categoryData=data.data;
                                                     this.catDropdownList.push({"id":i,"categoryId":categoryData.categoryNode.categoryNodeId,"itemName": categoryData.categoryNode.name,"productId":this.usersData[i].product.headerData.productId});
                                                     this.usersData[i]["categoryname"]=categoryData.categoryNode.name;

                                                     if(i==this.usersData.length-1)
                                                     {
                                                           //console.log("cat dropdown",this.catDropdownList);
                                                            let flag_cat_itemname=this.checkDuplicateInObject("itemName", this.catDropdownList);
                                                            let flag_cat_categoryid=this.checkDuplicateInObject("categoryId", this.catDropdownList);
                                                           if(flag_cat_itemname && !flag_cat_categoryid)
                                                            {
                                                                    let a=[];
                                                                    a=this.removeDuplicates(this.catDropdownList,"itemName");
                                                                    let onlyIncatdropdownlist = this.catDropdownList.filter(this.comparerCategory(a));
                                                                    let onlyInarr_a = a.filter(this.comparerCategory(this.catDropdownList));
                                                                    let result = onlyIncatdropdownlist.concat(onlyInarr_a);
                                                                    let categoryJSON={};let indxProduct=0;
                                                                    for(let i=0;i<a.length;i++)
                                                                    {
                                                                            if(a[i].itemName==result[0].itemName)
                                                                            {
                                                                                categoryJSON[indxProduct]=a[i]["categoryId"];
                                                                                indxProduct++;
                                                                            }
                                                                    }
                                                                    categoryJSON[indxProduct]=result[0]["categoryId"];
                                                                    for(let i=0;i<a.length;i++)
                                                                    {
                                                                            if(a[i].itemName==result[0].itemName)
                                                                            {
                                                                                a[i]["categoryId"]=categoryJSON;
                                                                            }
                                                                    }
                                                                    this.catDropdownList=a;
                                                                    //console.log("categoryjson",categoryJSON);
                                                                    //console.log("result cat",result);
                                                                    //console.log("removed dup cat",a);
                                                                    //console.log("dropdown item category",this.catDropdownList);
                                                            }
                                                            if(flag_cat_categoryid && flag_cat_itemname)
                                                            {
                                                                                //console.log("category dropdown item",this.catDropdownList);

                                                                                let arr_itemname=[];
                                                                                arr_itemname=this.removeDuplicates(this.catDropdownList,"itemName");
                                                                                //console.log("removed dup before cat",arr_itemname);

                                                                                let onlyIncatdropdownlist = this.catDropdownList.filter(this.comparerCategory(arr_itemname));
                                                                                //console.log("onlyincat",onlyIncatdropdownlist);
                                                                                let onlyInarr_item = arr_itemname.filter(this.comparerCategory(this.catDropdownList));

                                                                                let result = onlyIncatdropdownlist.concat(onlyInarr_item);
                                                                                //console.log("result cat",result);

                                                                                let categoryJSON={};let indxProduct=0;

                                                                                if(result.length!=0)
                                                                                {
                                                                                    for(let i=0;i<arr_itemname.length;i++)
                                                                                    {
                                                                                        if(arr_itemname[i].itemName==result[0].itemName)
                                                                                        {
                                                                                            categoryJSON[indxProduct]=arr_itemname[i]["categoryId"];
                                                                                            indxProduct++;
                                                                                        }
                                                                                    }
                                                                                    categoryJSON[indxProduct]=result[0]["categoryId"];
                                                                                    for(let i=0;i<arr_itemname.length;i++)
                                                                                    {
                                                                                        if(arr_itemname[i].itemName==result[0].itemName)
                                                                                        {
                                                                                            arr_itemname[i]["categoryId"]=categoryJSON;
                                                                                        }
                                                                                    }
                                                                                    //console.log("removed dup after category",arr_itemname);
                                                                                    this.catDropdownList=arr_itemname;
                                                                                }
                                                                                else{
                                                                                    this.catDropdownList=arr_itemname;
                                                                                }
                                                                                let arr_categoryid=[];
                                                                                arr_categoryid=this.removeDuplicates(this.catDropdownList,"categoryId");
                                                                                //console.log("removed dup 1 category",arr_categoryid);
                                                            }
                                                     }
                                                    
                                                },
                                                errorCode =>  console.log("errorCode",errorCode)
                                        )

                                        // this.catDropdownList.push({"id":i,"categoryId":data[i].product.categoryNode.categoryNodeId,"itemName": data[i].product.categoryNode.name});
                                }
                                let store=this.usersData[i].itemType;
                                if(store=="store")
                                {
                                    this.storedropdownList.push({"id":i,"storeID":this.usersData[i].store.storeId,"itemName":this.usersData[i].store.displayName}) 
                                    this.usersData[i]["categoryname"]="";
                                }
                          }
                           for(let i=0;i<this.usersData.length;i++)
                            {
                                this.usersData[i].selectedDecision="approval_pending"+this.usersData[i].id;
                            }
                          /******************************Product id dropdown sorting out duplicates *********************************************************************/

                        let flag_itemname=this.checkDuplicateInObject("itemName", this.dropdownList);
                        let flag_productid=this.checkDuplicateInObject("productId", this.dropdownList);
                        //console.log("flag item name",flag_itemname);
                        //console.log("flag product id",flag_productid);
                        if(flag_itemname && !flag_productid)
                        {
                            //the item names are same but different product id's
                           
                            let a=[];
                            a=this.removeDuplicates(this.dropdownList,"itemName");
                           
                            let onlyIndropdownlist = this.dropdownList.filter(this.comparer(a));
                            let onlyInarr_a = a.filter(this.comparer(this.dropdownList));

                            let result = onlyIndropdownlist.concat(onlyInarr_a);
                            let productJSON={};let indxProduct=0;let brickcodeJSON={};
                            for(let i=0;i<a.length;i++)
                            {
                                if(a[i].itemName==result[0].itemName)
                                {
                                    productJSON[indxProduct]=a[i]["productId"];
                                    indxProduct++;
                                }
                            }
                            productJSON[indxProduct]=result[0]["productId"];
                            for(let i=0;i<a.length;i++)
                            {
                                if(a[i].itemName==result[0].itemName)
                                {
                                    a[i]["productId"]=productJSON;
                                }
                            }
                            this.dropdownList=a;
                            //console.log("productjson",productJSON);
                            //console.log("result",result);
                            //console.log("removed dup",a);
                            //console.log("dropdown item",this.dropdownList);
                        }
                        if(flag_productid && !flag_itemname)
                        {
                             //the item names are different but same product id's
                        }
                         if(flag_productid && flag_itemname)
                        {
                             //the item names and product id's are same
                               //console.log("dropdown item",this.dropdownList);

                                let arr_itemname=[];
                                arr_itemname=this.removeDuplicates(this.dropdownList,"itemName");

                                //console.log("removed dup before",arr_itemname);

                                let onlyIndropdownlist = this.dropdownList.filter(this.comparer(arr_itemname));
                                let onlyInarr_item = arr_itemname.filter(this.comparer(this.dropdownList));

                                let result = onlyIndropdownlist.concat(onlyInarr_item);
                                let productJSON={};let indxProduct=0;
                                for(let i=0;i<arr_itemname.length;i++)
                                {
                                    if(arr_itemname[i].itemName==result[0].itemName)
                                    {
                                        productJSON[indxProduct]=arr_itemname[i]["productId"];
                                        indxProduct++;
                                    }
                                }
                                productJSON[indxProduct]=result[0]["productId"];
                                for(let i=0;i<arr_itemname.length;i++)
                                {
                                    if(arr_itemname[i].itemName==result[0].itemName)
                                    {
                                        arr_itemname[i]["productId"]=productJSON;
                                    }
                                }
                                //console.log("removed dup after",arr_itemname);
                                this.dropdownList=arr_itemname;


                                let arr_prodid=[];
                                arr_prodid=this.removeDuplicates(this.dropdownList,"productId");
                                //console.log("removed dup 1",arr_prodid);
                        }
                       
                         /****************************** The End - Product id dropdown sorting out duplicates *********************************************************************/   
                                
                        },
                        errorCode =>  console.log("errorCode",errorCode)
             )
     this.tags = new FormControl([], Validators.required);
        this.tags.valueChanges.subscribe( _tags => {
    });      
    
        this.selectedItems = [];
        this.storeSelectedItems = [];
        this.catSelectedItems=[];
        this.dropdownSettings = { 
                                  singleSelection: false, 
                                  text:"Select Products",
                                  selectAllText:'Select All',
                                  unSelectAllText:'UnSelect All',
                                  enableSearchFilter: true,
                                  classes:"myclass custom-class",
                                  enableCheckAll:false,
                                  badgeShowLimit:1
                                };
         this.storeDropdownSettings = { 
                                  singleSelection: false, 
                                  text:"Select Store",
                                  selectAllText:'Select All',
                                  unSelectAllText:'UnSelect All',
                                  enableSearchFilter: true,
                                  classes:"myclass custom-class",
                                  enableCheckAll:false,
                                  badgeShowLimit:1
                                }; 
        this.catDropdownSettings = { 
                                  singleSelection: false, 
                                  text:"Select Product Category",
                                  selectAllText:'Select All',
                                  unSelectAllText:'UnSelect All',
                                  enableSearchFilter: true,
                                  classes:"myclass custom-class",
                                  enableCheckAll:false,
                                  badgeShowLimit:1
                                };          
      //new dropdown - end
      this.startPage = 0;
      this.paginationLimit = 5;
  }
  
  //new dropdown
    public onItemSelect(item:any){
        //console.log("selected products",this.selectedItems);
        //console.log("tags val",this.tags["_value"]);
        let itemTags=[];
        itemTags=this.tags["_value"];
        if(itemTags.length!=0)
        {
             this.tags = new FormControl(itemTags,Validators.required);
        }
        else
        {
            this.tags = new FormControl([], Validators.required);
            this.arrayStore=[];
            this.arrayCategory=[];
        }
       // this.tags = new FormControl([], Validators.required);
        //console.log("selected products tags", this.tags);
        //console.log("item tags", itemTags);
        this.arrayItem=[];
        for(let i=0;i<this.selectedItems.length;i++)
        {
             this.arrayItem.push(this.selectedItems[i].itemName);
             //this.tags.setValue(this.arrayItem);
        }
        if(this.arrayItem.length!=0)
        {
            this.tags.setValue(this.arrayItem);
        }
        if(this.arrayItem.length!=0 && this.arrayCategory.length!=0)
        {
            let a=[];
            a=this.arrayItem.concat(this.arrayCategory);
            this.tags.setValue(a);
        }
        if(this.arrayItem.length!=0 && this.arrayStore.length!=0)
        {
            let a=[];
            a=this.arrayItem.concat(this.arrayStore);
            this.tags.setValue(a);
        }
         if(this.arrayStore.length!=0 && this.arrayCategory.length!=0)
        {
            let a=[];
            a=this.arrayStore.concat(this.arrayCategory);
            this.tags.setValue(a);
        }
        if(this.arrayStore.length!=0 && this.arrayItem.length!=0 && this.arrayCategory.length!=0)
        {
            let a=[];
            a=this.arrayItem.concat(this.arrayCategory);
            let b=[];
            b=a.concat(this.arrayStore);
            this.tags.setValue(b);
        }
        //console.log("arr a in item",this.arrayItem);
        
        this.tags.valueChanges.subscribe( _tags => {
                let b=[];let arrStoreSelected=[],arrCategorySelected=[];
                b.length=0;arrStoreSelected.length=0;arrCategorySelected.length=0;
                
                for(let j=0;j<this.selectedItems.length;j++)
                {
                    b.push(this.selectedItems[j].itemName);
                }
                for(let j=0;j<this.storeSelectedItems.length;j++)
                {
                    arrStoreSelected.push(this.storeSelectedItems[j].itemName);
                }
                for(let j=0;j<this.catSelectedItems.length;j++)
                {
                    arrCategorySelected.push(this.catSelectedItems[j].itemName);
                }
                console.log("array b",b);
                for (let i=0; i<_tags.length; i++) {
                    let index = b.indexOf(_tags[i]);
                    if (index > -1) {
                        b.splice(index, 1);
                    }
                    let indexStore=arrStoreSelected.indexOf(_tags[i]);
                    if (indexStore > -1) {
                        arrStoreSelected.splice(indexStore, 1);
                    }
                    let indexCategory=arrCategorySelected.indexOf(_tags[i]);
                    if (indexCategory > -1) {
                        arrCategorySelected.splice(indexCategory, 1);
                    }
                }
                console.log("array b after splice",b);
                 for(let j=0;j<this.selectedItems.length;j++)
                    {
                        for(let m=0;m<b.length;m++)
                        {
                            if(b[m]==this.selectedItems[j].itemName)
                            {
                                 this.selectedItems.splice(j, 1);
                            }
                        }
                    }
                   for(let j=0;j<this.storeSelectedItems.length;j++)
                    {
                        for(let m=0;m<arrStoreSelected.length;m++)
                        {
                            if(arrStoreSelected[m]==this.storeSelectedItems[j].itemName)
                            {
                                 this.storeSelectedItems.splice(j, 1);
                            }
                        }
                    }
                    for(let j=0;j<this.catSelectedItems.length;j++)
                    {
                        for(let m=0;m<arrCategorySelected.length;m++)
                        {
                            if(arrCategorySelected[m]==this.catSelectedItems[j].itemName)
                            {
                                 this.catSelectedItems.splice(j, 1);
                            }
                        }
                    }
                this.ratingsAndTaxonomyService.getUserComments()
                .subscribe(
                            res => {
                            this.userDataMaster=res.data;
                            this.usersData=this.users;
                            for(let i=0;i<this.userDataMaster.length;i++)
                            {
                                this.userDataMaster[i].selectedDecision="approval_pending"+this.userDataMaster[i].id;
                                this.ratingsAndTaxonomyService.getUserRatings(this.userDataMaster[i].itemId)
                                        .subscribe(
                                                data => {
                                                    let ratingdata=data.data;
                                                    this.userDataMaster[i]["rating"]=ratingdata.rating;
                                                },
                                                errorCode =>  console.log("errorCode",errorCode)
                                        )
                                 let prod=this.userDataMaster[i].itemType;
                                 if(prod=="product")
                                {
                                        this.ratingsAndTaxonomyService.getCategoryNode(this.userDataMaster[i].product.classification.brickCode)
                                        .subscribe(
                                                data => {
                                                    let categoryData=data.data;
                                                     this.userDataMaster[i]["categoryname"]=categoryData.categoryNode.name;
                                                },
                                                errorCode =>  console.log("errorCode",errorCode)
                                        )
                                        // this.catDropdownList.push({"id":i,"categoryId":data[i].product.categoryNode.categoryNodeId,"itemName": data[i].product.categoryNode.name});
                                }
                                 if(prod=="store")
                                {
                                     this.userDataMaster[i]["categoryname"]="";
                                }
                            }
                            if(this.selectedItems.length!=0)
                            {
                                this.tempProdUserData.length=0;
                                for(let i=0;i<this.selectedItems.length;i++)
                                {
                                    for(let j=0;j<this.userDataMaster.length;j++)
                                    {
                                        if(typeof this.selectedItems[i].productId=="object"){
                                            let selectedItemJson=this.selectedItems[i].productId;
                                            for (let property in selectedItemJson) {
                                                    if(this.userDataMaster[j].itemId==selectedItemJson[property])
                                                    {
                                                        this.tempProdUserData.push(this.userDataMaster[j]);
                                                    }
                                                }
                                        }
                                        else{
                                                if(this.userDataMaster[j].itemId==this.selectedItems[i].productId)
                                                {
                                                    this.tempProdUserData.push(this.userDataMaster[j]);
                                                }
                                        }
                                    }
                                }
                                this.usersData.length=0;
                                for(let k=0;k<this.tempProdUserData.length;k++)
                                {
                                    this.usersData.push(this.tempProdUserData[k]);
                                }
                            }
                            else{
                                this.usersData=this.userDataMaster;
                            }     
                            },
                            errorCode =>  console.log("errorCode",errorCode)
                )
        });
         this.ratingsAndTaxonomyService.getUserComments()
             .subscribe(
                        res => {
                          this.userDataMaster=res.data;
                          this.usersData=this.users;
                         for(let i=0;i<this.userDataMaster.length;i++)
                         {
                            this.userDataMaster[i].selectedDecision="approval_pending"+this.userDataMaster[i].id;
                             this.ratingsAndTaxonomyService.getUserRatings(this.userDataMaster[i].itemId)
                                    .subscribe(
                                            data => {
                                                let ratingdata=data.data;
                                                this.userDataMaster[i]["rating"]=ratingdata.rating;
                                            },
                                            errorCode =>  console.log("errorCode",errorCode)
                                    )
                              let prod=this.userDataMaster[i].itemType;
                                if(prod=="product")
                                {
                                        this.ratingsAndTaxonomyService.getCategoryNode(this.userDataMaster[i].product.classification.brickCode)
                                        .subscribe(
                                                data => {
                                                    let categoryData=data.data;
                                                     this.userDataMaster[i]["categoryname"]=categoryData.categoryNode.name;
                                                },
                                                errorCode =>  console.log("errorCode",errorCode)
                                        )
                                        // this.catDropdownList.push({"id":i,"categoryId":data[i].product.categoryNode.categoryNodeId,"itemName": data[i].product.categoryNode.name});
                                }
                                if(prod=="store")
                                {
                                     this.userDataMaster[i]["categoryname"]="";
                                }
                         }
                         this.tempProdUserData.length=0;

                        console.log("selected products in dropdown",this.selectedItems);
                        console.log("selected category in dropdown",this.catSelectedItems);
                        console.log("selected store in dropdown",this.storeSelectedItems);
                        console.log("user data master",this.userDataMaster);
                        for(let i=0;i<this.selectedItems.length;i++)
                        {
                            for(let j=0;j<this.userDataMaster.length;j++)
                            {
                                    if(this.catSelectedItems.length!=0)
                                    {
                                         for (let l = 0; l < this.selectedItems.length; l++) { 
                                            for (let m = 0; m < this.catSelectedItems.length; m++) { 
                                                if (this.selectedItems[l]["brickCode"] == this.catSelectedItems[m]["categoryId"]&&this.selectedItems[l]["productId"]==this.catSelectedItems[m]["productId"]) {
                                                    this.catSelectedItems.splice(m, 1);
                                                }
                                            }
                                        }
                                    }
                                   
                                 if(typeof this.selectedItems[i].productId=="object"){
                                     let selectedItemJson=this.selectedItems[i].productId;
                                     for (let property in selectedItemJson) {
                                            if(this.userDataMaster[j].itemId==selectedItemJson[property])
                                            {
                                                this.tempProdUserData.push(this.userDataMaster[j]);
                                            }
                                        }
                                 }
                                 else{
                                    if(this.userDataMaster[j].itemId==this.selectedItems[i].productId)
                                    {
                                        this.tempProdUserData.push(this.userDataMaster[j]);
                                    }
                                 }
                            }
                        }
                        for(let i=0;i<this.catSelectedItems.length;i++)
                            {
                                for(let j=0;j<this.userDataMaster.length;j++)
                                {
                                     if(this.userDataMaster[j]["itemType"]!="store")
                                     {
                                         if(this.userDataMaster[j].product.classification.brickCode==this.catSelectedItems[i].categoryId)
                                        {
                                            this.tempProdUserData.push(this.userDataMaster[j]);
                                        }
                                     }
                                }
                            }
                        if(this.storeSelectedItems.length!=0)
                        {
                             for(let i=0;i<this.storeSelectedItems.length;i++)
                             {
                                    for(let j=0;j<this.userDataMaster.length;j++)
                                    {
                                        if(this.userDataMaster[j].itemId==this.storeSelectedItems[i].storeID)
                                        {
                                            this.tempProdUserData.push(this.userDataMaster[j]);
                                        }
                                    }
                             }
                        }
                       
                        this.usersData.length=0;
                        for(let k=0;k<this.tempProdUserData.length;k++)
                        {
                            this.usersData.push(this.tempProdUserData[k]);
                        }  
                        },
                        errorCode =>  console.log("errorCode",errorCode)
             )
        
    }
    public onStoreSelect(item:any){
        //console.log("selected store",this.storeSelectedItems);
        //console.log("tags val",this.tags["_value"]);
        let storeTags=[];
        storeTags=this.tags["_value"];
        if(storeTags.length!=0)
        {
             this.tags = new FormControl(storeTags,Validators.required);
        }
        else
        {
            this.tags = new FormControl([], Validators.required);
            this.arrayCategory=[];
            this.arrayItem=[];
        }
        
        //this.tags = new FormControl([], Validators.required);
        this.arrayStore=[];
        for(let i=0;i<this.storeSelectedItems.length;i++)
        {
             this.arrayStore.push(this.storeSelectedItems[i].itemName);
             //this.tags.setValue(this.arrayStore);
        }
        if(this.arrayStore.length!=0)
        {
            this.tags.setValue(this.arrayStore);
        }
        if(this.arrayItem.length!=0 && this.arrayCategory.length!=0)
        {
            let a=[];
            a=this.arrayItem.concat(this.arrayCategory);
            this.tags.setValue(a);
        }
        if(this.arrayStore.length!=0 && this.arrayItem.length!=0)
        {
            let a=[];
            a=this.arrayStore.concat(this.arrayItem);
            this.tags.setValue(a);
        }
         if(this.arrayStore.length!=0 && this.arrayCategory.length!=0)
        {
            let a=[];
            a=this.arrayStore.concat(this.arrayCategory);
            this.tags.setValue(a);
        }
        if(this.arrayStore.length!=0 && this.arrayItem.length!=0 && this.arrayCategory.length!=0)
        {
            let a=[];
            a=this.arrayItem.concat(this.arrayCategory);
            let b=[];
            b=a.concat(this.arrayStore);
            this.tags.setValue(b);
        }

        this.tags.valueChanges.subscribe( _tags => {
            
                let b=[];let arrItemSelected=[],arrCategorySelected=[];
                b.length=0;arrItemSelected.length=0;arrCategorySelected.length=0;
                for(let j=0;j<this.storeSelectedItems.length;j++)
                {
                    b.push(this.storeSelectedItems[j].itemName);
                }
                for(let j=0;j<this.selectedItems.length;j++)
                {
                    arrItemSelected.push(this.selectedItems[j].itemName);
                }
                for(let j=0;j<this.catSelectedItems.length;j++)
                {
                    arrCategorySelected.push(this.catSelectedItems[j].itemName);
                }
                for (let i=0; i<_tags.length; i++) {
                    let index = b.indexOf(_tags[i]);
                    if (index > -1) {
                        b.splice(index, 1);
                    }
                    let indexItem=arrItemSelected.indexOf(_tags[i]);
                    if (indexItem > -1) {
                        arrItemSelected.splice(indexItem, 1);
                    }
                    let indexCategory=arrCategorySelected.indexOf(_tags[i]);
                    if (indexCategory > -1) {
                        arrCategorySelected.splice(indexCategory, 1);
                    }
                }
                 for(let j=0;j<this.storeSelectedItems.length;j++)
                    {
                        for(let m=0;m<b.length;m++)
                        {
                            if(b[m]==this.storeSelectedItems[j].itemName)
                            {
                                 this.storeSelectedItems.splice(j, 1);
                            }
                        }
                    }
                 for(let j=0;j<this.selectedItems.length;j++)
                    {
                        for(let m=0;m<arrItemSelected.length;m++)
                        {
                            if(arrItemSelected[m]==this.selectedItems[j].itemName)
                            {
                                 this.selectedItems.splice(j, 1);
                            }
                        }
                    }
                  for(let j=0;j<this.catSelectedItems.length;j++)
                    {
                        for(let m=0;m<arrCategorySelected.length;m++)
                        {
                            if(arrCategorySelected[m]==this.catSelectedItems[j].itemName)
                            {
                                 this.catSelectedItems.splice(j, 1);
                            }
                        }
                    }
                this.ratingsAndTaxonomyService.getUserComments()
             .subscribe(
                        res => {
                          this.userDataMaster=res.data;
                           for(let i=0;i<this.userDataMaster.length;i++)
                            {
                                this.userDataMaster[i].selectedDecision="approval_pending"+this.userDataMaster[i].id;
                                 this.ratingsAndTaxonomyService.getUserRatings(this.userDataMaster[i].itemId)
                                    .subscribe(
                                            data => {
                                                let ratingdata=data.data;
                                                this.userDataMaster[i]["rating"]=ratingdata.rating;
                                            },
                                            errorCode =>  console.log("errorCode",errorCode)
                                    )
                            }
                        if(this.storeSelectedItems.length!=0)
                        {  
                          this.tempProdUserData.length=0;
                            for(let i=0;i<this.storeSelectedItems.length;i++)
                            {
                                for(let j=0;j<this.userDataMaster.length;j++)
                                {
                                    if(this.userDataMaster[j].itemId==this.storeSelectedItems[i].storeID)
                                    {
                                        this.tempProdUserData.push(this.userDataMaster[j]);
                                    }
                                }
                            }
                            this.usersData.length=0;
                            for(let k=0;k<this.tempProdUserData.length;k++)
                            {
                                this.usersData.push(this.tempProdUserData[k]);
                            }
                        }
                        else{
                            this.usersData=this.userDataMaster;
                        }    
                        },
                        errorCode =>  console.log("errorCode",errorCode)
             )
        });
      
        this.ratingsAndTaxonomyService.getUserComments()
             .subscribe(
                        res => {
                          this.userDataMaster=res.data;
                          this.usersData=this.users;
                           for(let i=0;i<this.userDataMaster.length;i++)
                            {
                                this.userDataMaster[i].selectedDecision="approval_pending"+this.userDataMaster[i].id;
                                 this.ratingsAndTaxonomyService.getUserRatings(this.userDataMaster[i].itemId)
                                    .subscribe(
                                            data => {
                                                let ratingdata=data.data;
                                                this.userDataMaster[i]["rating"]=ratingdata.rating;
                                            },
                                            errorCode =>  console.log("errorCode",errorCode)
                                    )
                                 let prod=this.userDataMaster[i].itemType;
                                  if(prod=="product")
                                    {
                                            this.ratingsAndTaxonomyService.getCategoryNode(this.userDataMaster[i].product.classification.brickCode)
                                            .subscribe(
                                                    data => {
                                                        let categoryData=data.data;
                                                        this.userDataMaster[i]["categoryname"]=categoryData.categoryNode.name;
                                                    },
                                                    errorCode =>  console.log("errorCode",errorCode)
                                            )
                                            // this.catDropdownList.push({"id":i,"categoryId":data[i].product.categoryNode.categoryNodeId,"itemName": data[i].product.categoryNode.name});
                                    }
                                    if(prod=="store")
                                    {
                                        this.userDataMaster[i]["categoryname"]="";
                                    }
                            }
                          this.tempProdUserData.length=0;
                        console.log("selected products in dropdown",this.selectedItems);
                        console.log("selected category in dropdown",this.catSelectedItems);
                        console.log("selected store in dropdown",this.storeSelectedItems);
                         console.log("user data master",this.userDataMaster);
                        if(this.selectedItems.length!=0)
                        {
                             for(let i=0;i<this.selectedItems.length;i++)
                            {
                                for(let j=0;j<this.userDataMaster.length;j++)
                                {
                                        if(this.catSelectedItems.length!=0)
                                        {
                                             for (let l = 0; l < this.selectedItems.length; l++) { 
                                                for (let m = 0; m < this.catSelectedItems.length; m++) { 
                                                    if (this.selectedItems[l]["brickCode"] == this.catSelectedItems[m]["categoryId"]&&this.selectedItems[l]["productId"]==this.catSelectedItems[m]["productId"]) {
                                                        this.catSelectedItems.splice(m, 1);
                                                    }
                                                }
                                            }
                                        }
                                       
                                    if(typeof this.selectedItems[i].productId=="object"){
                                        let selectedItemJson=this.selectedItems[i].productId;
                                        for (let property in selectedItemJson) {
                                                if(this.userDataMaster[j].itemId==selectedItemJson[property])
                                                {
                                                    this.tempProdUserData.push(this.userDataMaster[j]);
                                                }
                                            }
                                    }
                                    else{
                                        if(this.userDataMaster[j].itemId==this.selectedItems[i].productId)
                                        {
                                            this.tempProdUserData.push(this.userDataMaster[j]);
                                        }
                                    }
                                }
                            }
                        }
                        if(this.catSelectedItems.length!=0)
                        {
                            for(let i=0;i<this.catSelectedItems.length;i++)
                            {
                                for(let j=0;j<this.userDataMaster.length;j++)
                                {
                                     if(this.userDataMaster[j]["itemType"]!="store")
                                     {
                                         if(this.userDataMaster[j].product.classification.brickCode==this.catSelectedItems[i].categoryId)
                                        {
                                            this.tempProdUserData.push(this.userDataMaster[j]);
                                        }
                                     }
                                }
                            }
                        }
                        
                        for(let i=0;i<this.storeSelectedItems.length;i++)
                        {
                            for(let j=0;j<this.userDataMaster.length;j++)
                            {
                                if(this.userDataMaster[j].itemId==this.storeSelectedItems[i].storeID)
                                {
                                    this.tempProdUserData.push(this.userDataMaster[j]);
                                }
                            }
                        }
                        this.usersData.length=0;
                        for(let k=0;k<this.tempProdUserData.length;k++)
                        {
                            this.usersData.push(this.tempProdUserData[k]);
                        }    
                        },
                        errorCode =>  console.log("errorCode",errorCode)
             )
    }
    public onCategorySelect(item:any){
        //console.log("selected category",this.catSelectedItems);
        //console.log("tags val",this.tags["_value"]);
        let catTags=[];
        catTags=this.tags["_value"];
        if(catTags.length!=0)
        {
             this.tags = new FormControl(catTags,Validators.required);
        }
        else
        {
            this.tags = new FormControl([], Validators.required);
            this.arrayItem=[];
            this.arrayStore=[];
        }
        
        //console.log("selected category tags", this.tags);
        //console.log("tags cat", catTags);
        this.arrayCategory=[];
        for(let i=0;i<this.catSelectedItems.length;i++)
        {
             this.arrayCategory.push(this.catSelectedItems[i].itemName);
             //this.tags.setValue(this.arrayCategory);
        }
        if(this.arrayCategory.length!=0)
        {
            this.tags.setValue(this.arrayCategory);
        }
        if(this.arrayItem.length!=0 && this.arrayCategory.length!=0)
        {
            let a=[];
            a=this.arrayItem.concat(this.arrayCategory);
            this.tags.setValue(a);
        }
         if(this.arrayStore.length!=0 && this.arrayCategory.length!=0)
        {
            let a=[];
            a=this.arrayStore.concat(this.arrayCategory);
            this.tags.setValue(a);
        }
        if(this.arrayStore.length!=0 && this.arrayItem.length!=0)
        {
            let a=[];
            a=this.arrayStore.concat(this.arrayItem);
            this.tags.setValue(a);
        }
        if(this.arrayStore.length!=0 && this.arrayItem.length!=0 && this.arrayCategory.length!=0)
        {
            let a=[];
            a=this.arrayItem.concat(this.arrayCategory);
            let b=[];
            b=a.concat(this.arrayStore);
            this.tags.setValue(b);
        }
        //console.log("arr a in cat",this.arrayCategory);
        this.tags.valueChanges.subscribe( _tags => {
                let b=[];let arrStoreSelected=[],arrItemSelected=[];
                b.length=0;arrStoreSelected.length=0;arrItemSelected.length=0;
                for(let j=0;j<this.catSelectedItems.length;j++)
                {
                    b.push(this.catSelectedItems[j].itemName);
                }
                for(let j=0;j<this.selectedItems.length;j++)
                {
                    arrItemSelected.push(this.selectedItems[j].itemName);
                }
                for(let j=0;j<this.storeSelectedItems.length;j++)
                {
                    arrStoreSelected.push(this.storeSelectedItems[j].itemName);
                }
                for (let i=0; i<_tags.length; i++) {
                    let index = b.indexOf(_tags[i]);
                    if (index > -1) {
                        b.splice(index, 1);
                    }
                    let indexStore=arrStoreSelected.indexOf(_tags[i]);
                    if (indexStore > -1) {
                        arrStoreSelected.splice(indexStore, 1);
                    }
                    let indexItem=arrItemSelected.indexOf(_tags[i]);
                    if (indexItem > -1) {
                        arrItemSelected.splice(indexItem, 1);
                    }
                }
                 for(let j=0;j<this.catSelectedItems.length;j++)
                    {
                        for(let m=0;m<b.length;m++)
                        {
                            if(b[m]==this.catSelectedItems[j].itemName)
                            {
                                 this.catSelectedItems.splice(j, 1);
                            }
                        }
                    }
                    for(let j=0;j<this.selectedItems.length;j++)
                    {
                        for(let m=0;m<arrItemSelected.length;m++)
                        {
                            if(arrItemSelected[m]==this.selectedItems[j].itemName)
                            {
                                 this.selectedItems.splice(j, 1);
                            }
                        }
                    }
                    for(let j=0;j<this.storeSelectedItems.length;j++)
                    {
                        for(let m=0;m<arrStoreSelected.length;m++)
                        {
                            if(arrStoreSelected[m]==this.storeSelectedItems[j].itemName)
                            {
                                 this.storeSelectedItems.splice(j, 1);
                            }
                        }
                    }
                  this.ratingsAndTaxonomyService.getUserComments()
             .subscribe(
                        res => {
                          this.userDataMaster=res.data;
                          for(let i=0;i<this.userDataMaster.length;i++)
                            {
                                this.userDataMaster[i].selectedDecision="approval_pending"+this.userDataMaster[i].id;
                                 this.ratingsAndTaxonomyService.getUserRatings(this.userDataMaster[i].itemId)
                                    .subscribe(
                                            data => {
                                                let ratingdata=data.data;
                                                this.userDataMaster[i]["rating"]=ratingdata.rating;
                                            },
                                            errorCode =>  console.log("errorCode",errorCode)
                                    )
                                     let prod=this.userDataMaster[i].itemType;
                                 if(prod=="product")
                                {
                                        this.ratingsAndTaxonomyService.getCategoryNode(this.userDataMaster[i].product.classification.brickCode)
                                        .subscribe(
                                                data => {
                                                    let categoryData=data.data;
                                                    
                                                     this.userDataMaster[i]["categoryname"]=categoryData.categoryNode.name;
                                                },
                                                errorCode =>  console.log("errorCode",errorCode)
                                        )
                                        // this.catDropdownList.push({"id":i,"categoryId":data[i].product.categoryNode.categoryNodeId,"itemName": data[i].product.categoryNode.name});
                                }
                                 if(prod=="store")
                                {
                                     this.userDataMaster[i]["categoryname"]="";
                                }
                            }
                            if(this.catSelectedItems.length!=0)
                            {
                                    this.tempProdUserData.length=0;
                                    for(let i=0;i<this.catSelectedItems.length;i++)
                                    {
                                        for(let j=0;j<this.userDataMaster.length;j++)
                                        {
                                            if(this.userDataMaster[j]["itemType"]!="store")
                                            {
                                                if(this.userDataMaster[j].product.classification.brickCode==this.catSelectedItems[i].categoryId)
                                            {
                                                this.tempProdUserData.push(this.userDataMaster[j]);
                                            }
                                            }
                                            
                                        }
                                    }
                                    this.usersData.length=0;
                                    for(let k=0;k<this.tempProdUserData.length;k++)
                                    {
                                        this.usersData.push(this.tempProdUserData[k]);
                                    }
                            }
                            else
                            {
                                 this.usersData=this.userDataMaster;
                            }  
                        },
                        errorCode =>  console.log("errorCode",errorCode)
             )
        });
        
        this.ratingsAndTaxonomyService.getUserComments()
             .subscribe(
                        res => {
                          this.userDataMaster=res.data;
                          for(let i=0;i<this.userDataMaster.length;i++)
                            {
                                this.userDataMaster[i].selectedDecision="approval_pending"+this.userDataMaster[i].id;
                                 this.ratingsAndTaxonomyService.getUserRatings(this.userDataMaster[i].itemId)
                                    .subscribe(
                                            data => {
                                                let ratingdata=data.data;
                                                this.userDataMaster[i]["rating"]=ratingdata.rating;
                                            },
                                            errorCode =>  console.log("errorCode",errorCode)
                                    )
                                     let prod=this.userDataMaster[i].itemType;
                                 if(prod=="product")
                                {
                                        this.ratingsAndTaxonomyService.getCategoryNode(this.userDataMaster[i].product.classification.brickCode)
                                        .subscribe(
                                                data => {
                                                    let categoryData=data.data;
                                                    
                                                     this.userDataMaster[i]["categoryname"]=categoryData.categoryNode.name;
                                                },
                                                errorCode =>  console.log("errorCode",errorCode)
                                        )
                                        // this.catDropdownList.push({"id":i,"categoryId":data[i].product.categoryNode.categoryNodeId,"itemName": data[i].product.categoryNode.name});
                                }
                                if(prod=="store")
                                {
                                     this.userDataMaster[i]["categoryname"]="";
                                }
                            }
                            this.tempProdUserData.length=0;
                             console.log("selected products in dropdown",this.selectedItems);
                        console.log("selected category in dropdown",this.catSelectedItems);
                        console.log("selected store in dropdown",this.storeSelectedItems);
                        console.log("user data master",this.userDataMaster);
                            for(let i=0;i<this.selectedItems.length;i++)
                            {
                                for(let j=0;j<this.userDataMaster.length;j++)
                                {
                                        if(this.catSelectedItems.length!=0)
                                        {
                                            for (let l = 0; l < this.selectedItems.length; l++) { 
                                                for (let m = 0; m < this.catSelectedItems.length; m++) { 
                                                    if (this.selectedItems[l]["brickCode"] == this.catSelectedItems[m]["categoryId"]&&this.selectedItems[l]["productId"]==this.catSelectedItems[m]["productId"]) {
                                                        this.catSelectedItems.splice(m, 1);
                                                    }
                                                }
                                            }
                                        }
                                        
                                    if(typeof this.selectedItems[i].productId=="object"){
                                        let selectedItemJson=this.selectedItems[i].productId;
                                        for (let property in selectedItemJson) {
                                                if(this.userDataMaster[j].itemId==selectedItemJson[property])
                                                {
                                                    this.tempProdUserData.push(this.userDataMaster[j]);
                                                }
                                            }
                                    }
                                    else{
                                        if(this.userDataMaster[j].itemId==this.selectedItems[i].productId)
                                        {
                                            this.tempProdUserData.push(this.userDataMaster[j]);
                                        }
                                    }
                                }
                            }
                            for(let i=0;i<this.catSelectedItems.length;i++)
                            {
                                for(let j=0;j<this.userDataMaster.length;j++)
                                {
                                     if(this.userDataMaster[j]["itemType"]!="store")
                                     {
                                         if(this.userDataMaster[j].product.classification.brickCode==this.catSelectedItems[i].categoryId)
                                        {
                                            this.tempProdUserData.push(this.userDataMaster[j]);
                                        }
                                     }
                                }
                            }
                            if(this.storeSelectedItems.length!=0)
                            {
                                for(let i=0;i<this.storeSelectedItems.length;i++)
                                {
                                    for(let j=0;j<this.userDataMaster.length;j++)
                                    {
                                        if(this.userDataMaster[j].itemId==this.storeSelectedItems[i].storeID)
                                        {
                                            this.tempProdUserData.push(this.userDataMaster[j]);
                                        }
                                    }
                                }
                            }
                            
                            this.usersData.length=0;
                            for(let k=0;k<this.tempProdUserData.length;k++)
                            {
                                this.usersData.push(this.tempProdUserData[k]);
                            }   
                        },
                        errorCode =>  console.log("errorCode",errorCode)
             )
    }
    public OnItemDeSelect(item:any){
        //console.log("deselected products",this.selectedItems);
        //console.log("tags val",this.tags["_value"]);
        let itemTags=[];
        itemTags=this.tags["_value"];
        if(itemTags.length!=0)
        {
             this.tags = new FormControl(itemTags,Validators.required);
        }
        else
        {
            this.tags = new FormControl([], Validators.required);
            this.arrayCategory=[];
            this.arrayStore=[];
        }
        //this.tags = new FormControl([], Validators.required);
        this.arrayItem=[];
        for(let i=0;i<this.selectedItems.length;i++)
        {
             this.arrayItem.push(this.selectedItems[i].itemName);
             //this.tags.setValue(this.arrayItem);
        }
        if(this.arrayItem.length!=0)
        {
            this.tags.setValue(this.arrayItem);
        }
        else
        {
             this.tags = new FormControl([], Validators.required);
        }
        if(this.arrayCategory.length!=0)
        {
            this.tags.setValue(this.arrayCategory);
        }
        if(this.arrayStore.length!=0)
        {
            this.tags.setValue(this.arrayStore);
        }
        if(this.arrayItem.length!=0 && this.arrayCategory.length!=0)
        {
            let a=[];
            a=this.arrayItem.concat(this.arrayCategory);
            this.tags.setValue(a);
        }
         if(this.arrayStore.length!=0 && this.arrayCategory.length!=0)
        {
            let a=[];
            a=this.arrayStore.concat(this.arrayCategory);
            this.tags.setValue(a);
        }
        if(this.arrayStore.length!=0 && this.arrayItem.length!=0 && this.arrayCategory.length!=0)
        {
            let a=[];
            a=this.arrayItem.concat(this.arrayCategory);
            let b=[];
            b=a.concat(this.arrayStore);
            this.tags.setValue(b);
        }
        //console.log("arr a in item",this.arrayItem);
        this.tags.valueChanges.subscribe( _tags => {
         let b=[];let arrStoreSelected=[],arrCategorySelected=[];
                b.length=0;b.length=0;arrStoreSelected.length=0;arrCategorySelected.length=0;
                for(let j=0;j<this.selectedItems.length;j++)
                {
                    b.push(this.selectedItems[j].itemName);
                }
                for(let j=0;j<this.storeSelectedItems.length;j++)
                {
                    arrStoreSelected.push(this.storeSelectedItems[j].itemName);
                }
                for(let j=0;j<this.catSelectedItems.length;j++)
                {
                    arrCategorySelected.push(this.catSelectedItems[j].itemName);
                }
                for (let i=0; i<_tags.length; i++) {
                    let index = b.indexOf(_tags[i]);
                    if (index > -1) {
                        b.splice(index, 1);
                    }
                     let indexStore=arrStoreSelected.indexOf(_tags[i]);
                    if (indexStore > -1) {
                        arrStoreSelected.splice(indexStore, 1);
                    }
                    let indexCategory=arrCategorySelected.indexOf(_tags[i]);
                    if (indexCategory > -1) {
                        arrCategorySelected.splice(indexCategory, 1);
                    }
                }
                 for(let j=0;j<this.selectedItems.length;j++)
                 {
                        for(let m=0;m<b.length;m++)
                        {
                            if(b[m]==this.selectedItems[j].itemName)
                            {
                                 this.selectedItems.splice(j, 1);
                            }
                        }
                 }
                 for(let j=0;j<this.storeSelectedItems.length;j++)
                    {
                        for(let m=0;m<arrStoreSelected.length;m++)
                        {
                            if(arrStoreSelected[m]==this.storeSelectedItems[j].itemName)
                            {
                                 this.storeSelectedItems.splice(j, 1);
                            }
                        }
                    }
                    for(let j=0;j<this.catSelectedItems.length;j++)
                    {
                        for(let m=0;m<arrCategorySelected.length;m++)
                        {
                            if(arrCategorySelected[m]==this.catSelectedItems[j].itemName)
                            {
                                 this.catSelectedItems.splice(j, 1);
                            }
                        }
                    }
                console.log("after removal from tag",this.selectedItems);
        });
        
         this.ratingsAndTaxonomyService.getUserComments()
             .subscribe(
                        res => {
                        
                        // this.userDataMaster=res.data;
                        
                        // for(let i=0;i<this.userDataMaster.length;i++)
                        // {
                        //     this.userDataMaster[i].selectedDecision="approval_pending"+this.userDataMaster[i].id;
                        //      this.ratingsService.getUserRatings(this.userDataMaster[i].itemId)
                        //             .subscribe(
                        //                     data => {
                        //                         let ratingdata=data.data;
                        //                         this.userDataMaster[i]["rating"]=ratingdata.rating;
                        //                     },
                        //                     errorCode =>  console.log("errorCode",errorCode)
                        //             )
                        //         let prod=this.userDataMaster[i].itemType;
                        //          if(prod=="product")
                        //         {
                        //                 this.ratingsService.getCategoryNode(this.userDataMaster[i].product.classification.brickCode)
                        //                 .subscribe(
                        //                         data => {
                        //                             let categoryData=data.data;
                                                    
                        //                              this.userDataMaster[i]["categoryname"]=categoryData.categoryNode.name;
                        //                         },
                        //                         errorCode =>  console.log("errorCode",errorCode)
                        //                 )
                        //                 // this.catDropdownList.push({"id":i,"categoryId":data[i].product.categoryNode.categoryNodeId,"itemName": data[i].product.categoryNode.name});
                        //         }
                        //          if(prod=="store")
                        //         {
                        //              this.userDataMaster[i]["categoryname"]="";
                        //         }
                        // }
                        // if(this.selectedItems.length!=0)
                        // {
                        //         this.tempProdUserData.length=0;
                        //         for(let i=0;i<this.selectedItems.length;i++)
                        //         {
                        //             for(let j=0;j<this.userDataMaster.length;j++)
                        //             {
                        //                 if(this.userDataMaster[j].itemId==this.selectedItems[i].productId)
                        //                 {
                        //                     this.tempProdUserData.push(this.userDataMaster[j]);
                        //                 }
                        //             }
                        //         }
                        //         this.usersData.length=0;
                        //         for(let k=0;k<this.tempProdUserData.length;k++)
                        //         {
                        //             this.usersData.push(this.tempProdUserData[k]);
                        //         }
                        // }
                        // else
                        // {
                        //     this.usersData=this.userDataMaster;
                        // }   

                         this.userDataMaster=res.data;
                          this.usersData=this.users;
                         for(let i=0;i<this.userDataMaster.length;i++)
                         {
                            this.userDataMaster[i].selectedDecision="approval_pending"+this.userDataMaster[i].id;
                             this.ratingsAndTaxonomyService.getUserRatings(this.userDataMaster[i].itemId)
                                    .subscribe(
                                            data => {
                                                let ratingdata=data.data;
                                                this.userDataMaster[i]["rating"]=ratingdata.rating;
                                            },
                                            errorCode =>  console.log("errorCode",errorCode)
                                    )
                              let prod=this.userDataMaster[i].itemType;
                                if(prod=="product")
                                {
                                        this.ratingsAndTaxonomyService.getCategoryNode(this.userDataMaster[i].product.classification.brickCode)
                                        .subscribe(
                                                data => {
                                                    let categoryData=data.data;
                                                     this.userDataMaster[i]["categoryname"]=categoryData.categoryNode.name;
                                                },
                                                errorCode =>  console.log("errorCode",errorCode)
                                        )
                                        // this.catDropdownList.push({"id":i,"categoryId":data[i].product.categoryNode.categoryNodeId,"itemName": data[i].product.categoryNode.name});
                                }
                                if(prod=="store")
                                {
                                     this.userDataMaster[i]["categoryname"]="";
                                }
                         }
                         if(this.selectedItems.length!=0)
                        {
                            this.tempProdUserData.length=0;
                            for(let i=0;i<this.selectedItems.length;i++)
                            {
                                for(let j=0;j<this.userDataMaster.length;j++)
                                {
                                        if(this.catSelectedItems.length!=0)
                                        {
                                            for (let l = 0; l < this.selectedItems.length; l++) { 
                                                for (let m = 0; m < this.catSelectedItems.length; m++) { 
                                                    if (this.selectedItems[l]["brickCode"] == this.catSelectedItems[m]["categoryId"]&&this.selectedItems[l]["productId"]==this.catSelectedItems[m]["productId"]) {
                                                        this.catSelectedItems.splice(m, 1);
                                                    }
                                                }
                                            }
                                        }
                                    
                                    if(typeof this.selectedItems[i].productId=="object"){
                                        let selectedItemJson=this.selectedItems[i].productId;
                                        for (let property in selectedItemJson) {
                                                if(this.userDataMaster[j].itemId==selectedItemJson[property])
                                                {
                                                    this.tempProdUserData.push(this.userDataMaster[j]);
                                                }
                                            }
                                    }
                                    else{
                                        if(this.userDataMaster[j].itemId==this.selectedItems[i].productId)
                                        {
                                            this.tempProdUserData.push(this.userDataMaster[j]);
                                        }
                                    }
                                }
                            }
                             for(let i=0;i<this.catSelectedItems.length;i++)
                            {
                                for(let j=0;j<this.userDataMaster.length;j++)
                                {
                                     if(this.userDataMaster[j]["itemType"]!="store")
                                     {
                                         if(this.userDataMaster[j].product.classification.brickCode==this.catSelectedItems[i].categoryId)
                                        {
                                            this.tempProdUserData.push(this.userDataMaster[j]);
                                        }
                                     }
                                }
                            }
                        if(this.storeSelectedItems.length!=0)
                        {
                             for(let i=0;i<this.storeSelectedItems.length;i++)
                             {
                                    for(let j=0;j<this.userDataMaster.length;j++)
                                    {
                                        if(this.userDataMaster[j].itemId==this.storeSelectedItems[i].storeID)
                                        {
                                            this.tempProdUserData.push(this.userDataMaster[j]);
                                        }
                                    }
                             }
                        }
                       
                        this.usersData.length=0;
                        for(let k=0;k<this.tempProdUserData.length;k++)
                        {
                            this.usersData.push(this.tempProdUserData[k]);
                        }
                        }
                        else{
                            this.usersData=this.userDataMaster;
                        }
                           
                        },
                        errorCode =>  console.log("errorCode",errorCode)
             )
    }
     public OnStoreDeSelect(item:any){
        //console.log("de selected store",this.storeSelectedItems);
        //console.log("tags val",this.tags["_value"]);
        let storeTags=[];
        storeTags=this.tags["_value"];
        if(storeTags.length!=0)
        {
             this.tags = new FormControl(storeTags,Validators.required);
        }
        else
        {
            this.tags = new FormControl([], Validators.required);
            this.arrayItem=[];
            this.arrayCategory=[];
        }

        //this.tags = new FormControl([], Validators.required);
        this.arrayStore=[];
        for(let i=0;i<this.storeSelectedItems.length;i++)
        {
             this.arrayStore.push(this.storeSelectedItems[i].itemName);
             //this.tags.setValue(this.arrayStore);
        }
        if(this.arrayStore.length!=0)
        {
            this.tags.setValue(this.arrayStore);
        }
        else
        {
             this.tags = new FormControl([], Validators.required);
        }
        if(this.arrayCategory.length!=0)
        {
            this.tags.setValue(this.arrayCategory);
        }
        if(this.arrayItem.length!=0)
        {
            this.tags.setValue(this.arrayItem);
        }
        if(this.arrayItem.length!=0 && this.arrayCategory.length!=0)
        {
            let a=[];
            a=this.arrayItem.concat(this.arrayCategory);
            this.tags.setValue(a);
        }
        if(this.arrayStore.length!=0 && this.arrayCategory.length!=0)
        {
            let a=[];
            a=this.arrayStore.concat(this.arrayCategory);
            this.tags.setValue(a);
        }
        if(this.arrayStore.length!=0 && this.arrayItem.length!=0 && this.arrayCategory.length!=0)
        {
            let a=[];
            a=this.arrayItem.concat(this.arrayCategory);
            let b=[];
            b=a.concat(this.arrayStore);
            this.tags.setValue(b);
        }

        this.tags.valueChanges.subscribe( _tags => {
         let b=[];let arrItemSelected=[],arrCategorySelected=[];
                b.length=0;arrItemSelected.length=0;arrCategorySelected.length=0;
                
                for(let j=0;j<this.storeSelectedItems.length;j++)
                {
                    b.push(this.storeSelectedItems[j].itemName);
                }
                for(let j=0;j<this.selectedItems.length;j++)
                {
                    arrItemSelected.push(this.selectedItems[j].itemName);
                }
                for(let j=0;j<this.catSelectedItems.length;j++)
                {
                    arrCategorySelected.push(this.catSelectedItems[j].itemName);
                }
                for (let i=0; i<_tags.length; i++) {
                    let index = b.indexOf(_tags[i]);
                    if (index > -1) {
                        b.splice(index, 1);
                    }
                    let indexItem=arrItemSelected.indexOf(_tags[i]);
                    if (indexItem > -1) {
                        arrItemSelected.splice(indexItem, 1);
                    }
                    let indexCategory=arrCategorySelected.indexOf(_tags[i]);
                    if (indexCategory > -1) {
                        arrCategorySelected.splice(indexCategory, 1);
                    }
                }
                for(let j=0;j<this.storeSelectedItems.length;j++)
                    {
                        for(let m=0;m<b.length;m++)
                        {
                            if(b[m]==this.storeSelectedItems[j].itemName)
                            {
                                 this.storeSelectedItems.splice(j, 1);
                            }
                        }
                    }
                for(let j=0;j<this.selectedItems.length;j++)
                    {
                        for(let m=0;m<arrItemSelected.length;m++)
                        {
                            if(arrItemSelected[m]==this.selectedItems[j].itemName)
                            {
                                 this.selectedItems.splice(j, 1);
                            }
                        }
                    }
                for(let j=0;j<this.catSelectedItems.length;j++)
                    {
                        for(let m=0;m<arrCategorySelected.length;m++)
                        {
                            if(arrCategorySelected[m]==this.catSelectedItems[j].itemName)
                            {
                                 this.catSelectedItems.splice(j, 1);
                            }
                        }
                    }
                console.log("after removal from tag",this.storeSelectedItems);
        });
        
        this.ratingsAndTaxonomyService.getUserComments()
             .subscribe(
                        res => {
                            this.userDataMaster=res.data;
                            this.usersData=this.users;
                            // for(let i=0;i<this.userDataMaster.length;i++)
                            // {
                            //     this.userDataMaster[i].selectedDecision="approval_pending"+this.userDataMaster[i].id;
                            //      this.ratingsService.getUserRatings(this.userDataMaster[i].itemId)
                            //         .subscribe(
                            //                 data => {
                            //                     let ratingdata=data.data;
                            //                     this.userDataMaster[i]["rating"]=ratingdata.rating;
                            //                 },
                            //                 errorCode =>  console.log("errorCode",errorCode)
                            //         )
                                    
                            // }
                            // if(this.storeSelectedItems.length!=0)
                            // {
                            //         this.tempProdUserData.length=0;
                            //         for(let i=0;i<this.storeSelectedItems.length;i++)
                            //         {
                            //             for(let j=0;j<this.userDataMaster.length;j++)
                            //             {
                            //                 if(this.userDataMaster[j].itemId==this.storeSelectedItems[i].storeID)
                            //                 {
                            //                     this.tempProdUserData.push(this.userDataMaster[j]);
                            //                 }
                            //             }
                            //         }
                            //         this.usersData.length=0;
                            //         for(let k=0;k<this.tempProdUserData.length;k++)
                            //         {
                            //             this.usersData.push(this.tempProdUserData[k]);
                            //         }
                            // }
                            // else
                            // {
                            //     this.usersData=this.userDataMaster;
                            // }
                            for(let i=0;i<this.userDataMaster.length;i++)
                            {
                                this.userDataMaster[i].selectedDecision="approval_pending"+this.userDataMaster[i].id;
                                 this.ratingsAndTaxonomyService.getUserRatings(this.userDataMaster[i].itemId)
                                    .subscribe(
                                            data => {
                                                let ratingdata=data.data;
                                                this.userDataMaster[i]["rating"]=ratingdata.rating;
                                            },
                                            errorCode =>  console.log("errorCode",errorCode)
                                    )
                                 let prod=this.userDataMaster[i].itemType;
                                  if(prod=="product")
                                    {
                                            this.ratingsAndTaxonomyService.getCategoryNode(this.userDataMaster[i].product.classification.brickCode)
                                            .subscribe(
                                                    data => {
                                                        let categoryData=data.data;
                                                        this.userDataMaster[i]["categoryname"]=categoryData.categoryNode.name;
                                                    },
                                                    errorCode =>  console.log("errorCode",errorCode)
                                            )
                                            // this.catDropdownList.push({"id":i,"categoryId":data[i].product.categoryNode.categoryNodeId,"itemName": data[i].product.categoryNode.name});
                                    }
                                    if(prod=="store")
                                    {
                                        this.userDataMaster[i]["categoryname"]="";
                                    }
                            }
                          this.tempProdUserData.length=0;
                          if(this.storeSelectedItems.length!=0)
                          {
                                if(this.selectedItems.length!=0)
                                {
                                    for(let i=0;i<this.selectedItems.length;i++)
                                    {
                                        for(let j=0;j<this.userDataMaster.length;j++)
                                        {
                                                if(this.catSelectedItems.length!=0)
                                                {
                                                    for (let l = 0; l < this.selectedItems.length; l++) { 
                                                        for (let m = 0; m < this.catSelectedItems.length; m++) { 
                                                            if (this.selectedItems[l]["brickCode"] == this.catSelectedItems[m]["categoryId"]&&this.selectedItems[l]["productId"]==this.catSelectedItems[m]["productId"]) {
                                                                this.catSelectedItems.splice(m, 1);
                                                            }
                                                        }
                                                    }
                                                }
                                            
                                            if(typeof this.selectedItems[i].productId=="object"){
                                                let selectedItemJson=this.selectedItems[i].productId;
                                                for (let property in selectedItemJson) {
                                                        if(this.userDataMaster[j].itemId==selectedItemJson[property])
                                                        {
                                                            this.tempProdUserData.push(this.userDataMaster[j]);
                                                        }
                                                    }
                                            }
                                            else{
                                                if(this.userDataMaster[j].itemId==this.selectedItems[i].productId)
                                                {
                                                    this.tempProdUserData.push(this.userDataMaster[j]);
                                                }
                                            }
                                        }
                                    }
                                }
                            if(this.catSelectedItems.length!=0)
                            {
                                for(let i=0;i<this.catSelectedItems.length;i++)
                                {
                                    for(let j=0;j<this.userDataMaster.length;j++)
                                    {
                                        if(this.userDataMaster[j]["itemType"]!="store")
                                        {
                                            if(this.userDataMaster[j].product.classification.brickCode==this.catSelectedItems[i].categoryId)
                                            {
                                                this.tempProdUserData.push(this.userDataMaster[j]);
                                            }
                                        }
                                    }
                                }
                            }
                            
                            for(let i=0;i<this.storeSelectedItems.length;i++)
                            {
                                for(let j=0;j<this.userDataMaster.length;j++)
                                {
                                    if(this.userDataMaster[j].itemId==this.storeSelectedItems[i].storeID)
                                    {
                                        this.tempProdUserData.push(this.userDataMaster[j]);
                                    }
                                }
                            }
                            this.usersData.length=0;
                            for(let k=0;k<this.tempProdUserData.length;k++)
                            {
                                this.usersData.push(this.tempProdUserData[k]);
                            } 
                          }
                          else{
                            this.usersData=this.userDataMaster;
                          }
                             
                        },
                        errorCode =>  console.log("errorCode",errorCode)
             )
    }
    public OnCategoryDeSelect(item:any){
        //console.log("deselected category",this.catSelectedItems);
        //console.log("tags val",this.tags["_value"]);
        let catTags=[];
        catTags=this.tags["_value"];
        if(catTags.length!=0)
        {
             this.tags = new FormControl(catTags,Validators.required);
        }
        else
        {
            this.tags = new FormControl([], Validators.required);
            this.arrayItem=[];
            this.arrayStore=[];
        }

        //this.tags = new FormControl([], Validators.required);
        this.arrayCategory=[];
        for(let i=0;i<this.catSelectedItems.length;i++)
        {
             this.arrayCategory.push(this.catSelectedItems[i].itemName);
             //this.tags.setValue(this.arrayCategory);
        }
        if(this.arrayCategory.length!=0)
        {
            this.tags.setValue(this.arrayCategory);
        }
        else
        {
             this.tags = new FormControl([], Validators.required);
        }
        if(this.arrayStore.length!=0)
        {
            this.tags.setValue(this.arrayStore);
        }
        if(this.arrayItem.length!=0)
        {
            this.tags.setValue(this.arrayItem);
        }
        if(this.arrayItem.length!=0 && this.arrayCategory.length!=0)
        {
            let a=[];
            a=this.arrayItem.concat(this.arrayCategory);
            this.tags.setValue(a);
        }
         if(this.arrayStore.length!=0 && this.arrayCategory.length!=0)
        {
            let a=[];
            a=this.arrayStore.concat(this.arrayCategory);
            this.tags.setValue(a);
        }
        if(this.arrayStore.length!=0 && this.arrayItem.length!=0 && this.arrayCategory.length!=0)
        {
            let a=[];
            a=this.arrayItem.concat(this.arrayCategory);
            let b=[];
            b=a.concat(this.arrayStore);
            this.tags.setValue(b);
        }
        this.tags.valueChanges.subscribe( _tags => {
         let b=[];let arrStoreSelected=[],arrItemSelected=[];
                b.length=0;arrStoreSelected.length=0;arrItemSelected.length=0;
                for(let j=0;j<this.catSelectedItems.length;j++)
                {
                    b.push(this.catSelectedItems[j].itemName);
                }
                for(let j=0;j<this.selectedItems.length;j++)
                {
                    arrItemSelected.push(this.selectedItems[j].itemName);
                }
                for(let j=0;j<this.storeSelectedItems.length;j++)
                {
                    arrStoreSelected.push(this.storeSelectedItems[j].itemName);
                }
                for (let i=0; i<_tags.length; i++) {
                    let index = b.indexOf(_tags[i]);
                    if (index > -1) {
                        b.splice(index, 1);
                    }
                    let indexStore=arrStoreSelected.indexOf(_tags[i]);
                    if (indexStore > -1) {
                        arrStoreSelected.splice(indexStore, 1);
                    }
                    let indexItem=arrItemSelected.indexOf(_tags[i]);
                    if (indexItem > -1) {
                        arrItemSelected.splice(indexItem, 1);
                    }
                }
                 for(let j=0;j<this.catSelectedItems.length;j++)
                    {
                        for(let m=0;m<b.length;m++)
                        {
                            if(b[m]==this.catSelectedItems[j].itemName)
                            {
                                 this.catSelectedItems.splice(j, 1);
                            }
                        }
                    }
                 for(let j=0;j<this.selectedItems.length;j++)
                    {
                        for(let m=0;m<arrItemSelected.length;m++)
                        {
                            if(arrItemSelected[m]==this.selectedItems[j].itemName)
                            {
                                 this.selectedItems.splice(j, 1);
                            }
                        }
                    }
                    for(let j=0;j<this.storeSelectedItems.length;j++)
                    {
                        for(let m=0;m<arrStoreSelected.length;m++)
                        {
                            if(arrStoreSelected[m]==this.storeSelectedItems[j].itemName)
                            {
                                 this.storeSelectedItems.splice(j, 1);
                            }
                        }
                    }
                
        });
       
        this.ratingsAndTaxonomyService.getUserComments()
             .subscribe(
                        res => {
                            this.userDataMaster=res.data;
                            for(let i=0;i<this.userDataMaster.length;i++)
                            {
                                this.userDataMaster[i].selectedDecision="approval_pending"+this.userDataMaster[i].id;
                                 this.ratingsAndTaxonomyService.getUserRatings(this.userDataMaster[i].itemId)
                                    .subscribe(
                                            data => {
                                                let ratingdata=data.data;
                                                this.userDataMaster[i]["rating"]=ratingdata.rating;
                                            },
                                            errorCode =>  console.log("errorCode",errorCode)
                                    )
                                    let prod=this.userDataMaster[i].itemType;
                                 if(prod=="product")
                                {
                                        this.ratingsAndTaxonomyService.getCategoryNode(this.userDataMaster[i].product.classification.brickCode)
                                        .subscribe(
                                                data => {
                                                    let categoryData=data.data;
                                                    
                                                     this.userDataMaster[i]["categoryname"]=categoryData.categoryNode.name;
                                                },
                                                errorCode =>  console.log("errorCode",errorCode)
                                        )
                                        // this.catDropdownList.push({"id":i,"categoryId":data[i].product.categoryNode.categoryNodeId,"itemName": data[i].product.categoryNode.name});
                                }
                                 if(prod=="store")
                                {
                                     this.userDataMaster[i]["categoryname"]="";
                                }
                            }
                            // if(this.catSelectedItems.length!=0)
                            // {
                            //         this.tempProdUserData.length=0;
                            //         for(let i=0;i<this.catSelectedItems.length;i++)
                            //         {
                            //             for(let j=0;j<this.userDataMaster.length;j++)
                            //             {
                            //                  if(this.userDataMaster[j]["itemType"]!="store")
                            //                 {
                            //                      if(this.userDataMaster[j].product.classification.brickCode==this.catSelectedItems[i].categoryId)
                            //                 {
                            //                     this.tempProdUserData.push(this.userDataMaster[j]);
                            //                 }
                            //                 }
                                           
                            //             }
                            //         }
                            //         this.usersData.length=0;
                            //         for(let k=0;k<this.tempProdUserData.length;k++)
                            //         {
                            //             this.usersData.push(this.tempProdUserData[k]);
                            //         }
                            // }
                            // else
                            // {
                            //     this.usersData=this.userDataMaster;
                            // }
                            if(this.catSelectedItems.length!=0)
                            {
                                 this.tempProdUserData.length=0;

                                 if(this.selectedItems.length!=0)
                                 {
                                       for(let i=0;i<this.selectedItems.length;i++)
                                        {
                                            for(let j=0;j<this.userDataMaster.length;j++)
                                            {
                                                    if(this.catSelectedItems.length!=0)
                                                    {
                                                        for (let l = 0; l < this.selectedItems.length; l++) { 
                                                            for (let m = 0; m < this.catSelectedItems.length; m++) { 
                                                                if (this.selectedItems[l]["brickCode"] == this.catSelectedItems[m]["categoryId"]&&this.selectedItems[l]["productId"]==this.catSelectedItems[m]["productId"]) {
                                                                    this.catSelectedItems.splice(m, 1);
                                                                }
                                                            }
                                                        }
                                                    }
                                                    
                                                if(typeof this.selectedItems[i].productId=="object"){
                                                    let selectedItemJson=this.selectedItems[i].productId;
                                                    for (let property in selectedItemJson) {
                                                            if(this.userDataMaster[j].itemId==selectedItemJson[property])
                                                            {
                                                                this.tempProdUserData.push(this.userDataMaster[j]);
                                                            }
                                                        }
                                                }
                                                else{
                                                    if(this.userDataMaster[j].itemId==this.selectedItems[i].productId)
                                                    {
                                                        this.tempProdUserData.push(this.userDataMaster[j]);
                                                    }
                                                }
                                            }
                                        }
                                 }
                                 if(this.storeSelectedItems.length!=0)
                                {
                                    for(let i=0;i<this.storeSelectedItems.length;i++)
                                    {
                                        for(let j=0;j<this.userDataMaster.length;j++)
                                        {
                                            if(this.userDataMaster[j].itemId==this.storeSelectedItems[i].storeID)
                                            {
                                                this.tempProdUserData.push(this.userDataMaster[j]);
                                            }
                                        }
                                    }
                                }
                                 for(let i=0;i<this.catSelectedItems.length;i++)
                                    {
                                        for(let j=0;j<this.userDataMaster.length;j++)
                                        {
                                            if(this.userDataMaster[j]["itemType"]!="store")
                                            {
                                                if(this.userDataMaster[j].product.classification.brickCode==this.catSelectedItems[i].categoryId)
                                                {
                                                    this.tempProdUserData.push(this.userDataMaster[j]);
                                                }
                                            }
                                        }
                                    }
                                 this.usersData.length=0;
                                 for(let k=0;k<this.tempProdUserData.length;k++)
                                  {
                                        this.usersData.push(this.tempProdUserData[k]);
                                  }   
                            }
                            else
                            {
                                this.usersData=this.userDataMaster;
                            }
                        },
                        errorCode =>  console.log("errorCode",errorCode)
             )
    }
//new dropdown - end 
      ngAfterViewChecked() {
        // $(function () {
        //   $('[data-toggle="tooltip"]').tooltip()
        // })
        //put your jquery code here
    }
    ngAfterViewInit(){
        let t = <HTMLScriptElement>document.getElementsByTagName('simple-ng-tags')[0];
        t.style.border="none";
        // let t1 = <HTMLInputElement>document.getElementsByName('tag-input')[0];
        // t1.placeholder="";
    }
}

import { LightningElement,api } from 'lwc';
import historyTrackingController from '@salesforce/apex/HistoryTrackingController.historyTrackingMethod';
//import historyTracking from '@salesforce/apex/HistoryTracking.historyTrackingMethod';
import activityTracking from '@salesforce/apex/HistoryTrackingController.activityTrackingMethod';
//changed for JIRA-123
//another change for Jira-123

export default class HistoryComponent extends LightningElement {
    list=[];
    @api recordId;
    accounts;
    activities;
    connectedCallback() {
		this.loadAccounts();
	}
    loadAccounts() {
		historyTrackingController({ recordId: this.recordId })
			.then(result => {
				this.accounts=result;
                console.log(result);
                this.list=this.accounts.concat(this.activities);
                this.accountsSort(this.list);
			})
			.catch(error => {
				this.error = error;
			});
            activityTracking({ recordId: this.recordId })
			.then(result => {
                console.log(result);
                this.activities=result[0].ActivityHistories;
                this.list=this.accounts.concat(this.activities);
                this.accountsSort(this.list);
                
			})
			.catch(error => {
				this.error = error;
			});
            
            
	}
    /*
    @wire(historyTracking, {recordId: '$recordId'})
	loadAccounts(result) {
        if (result.data) {
           this.accounts=result.data;
           this.accountsSort(this.accounts);
           
        }
    }
    @wire(activityTracking, {recordId: '$recordId'})
	loadActivityAccounts(result) {
        if (result.data) {
           this.activities=result.data[0].ActivityHistories;
           console.log('from activity');
           console.log(this.activities); 
        }
    }
    */
    accountsSort(listAccounts){
        const arr1 = listAccounts.map(obj => {
            return {...obj, CreatedDate: new Date(obj.CreatedDate)};
          });
        const sortedAsc = arr1.sort(
            (objA, objB) => Number(objB.CreatedDate) - Number(objA.CreatedDate),
          );
        this.accounts=sortedAsc;
        
    }
    /*
     accountsUpdate(formatAccounts){
        const calcDaysPassed=(date1,date2)=>Math.round(Math.abs(date2-date1)/(1000*60*60*24));
        formatAccounts.forEach((acc) => {
            const cDate=new Date(acc.CreatedDate);
            const daysPassed=calcDaysPassed(new Date(),cDate);
            console.log(daysPassed);
            if(daysPassed===0){
               // acc.CreatedDate='TODAY';
               acc.CreatedDate=new Date();
                console.log(acc.CreatedDate);
            } 
            else if(daysPassed===1){ 
                //acc.CreatedDate='Yesterday';
                acc.CreatedDate=new Date();
                console.log(acc.CreatedDate);
            }
            else if(daysPassed<=7){
                //acc.CreatedDate=`${daysPassed} days ago`;
                acc.CreatedDate=new Date();
                console.log(acc.CreatedDate);
            } 
            else{
               // const day=cDate.getDate();
               // const month=cDate.getMonth();
                //const year=cDate.getFullYear();
               // acc.CreatedDate=`${day}/${month}/${year}`;
                acc.CreatedDate=new Date();
                console.log(acc.CreatedDate);
            }  
        });
        
    }
    */
    
}
/*
사용예) smAction.addTags(..)
어드민용은 넣지 말것..
 */
var SMAction = function()
{
    // svcIds : string array , tags : string array
    this.addTagsByMultiSvcId = function (svcCd, svcIds, tags, callback) {
        post('/api/tag/multiSaveTag/'+svcCd, {svcIds:svcIds, tags:tags}, callback);
    }
    // tags : string array
    this.addTags = function(svcCd, svcId, tags, callback) {
        post('/api/tag/saveTag/'+svcId+'/'+svcCd, {tags:tags}, callback);
    }
    this.getQuota = function(notExistAdd, callback){
        post('/api/quota/getTeamByUserId?NotExistAdd=' + (notExistAdd?"Y":"N"),{}, callback);
    }
    this.doPowerAction = function(vmId, action, callback)
    {
        /** action: powerOn, powerOff, suspend, shutdownGuest, reboot **/
       post('/api/vm/' + action , {VM_ID:vmId}, callback);
    }
    // vmIds string array
    this.vmOwnerChange = function (vmIds , newName, callback){
        post('/api/vm/chg_owner_pk_multi' , {VM_ID:vmIds, NEW_USER:newName}, callback);
    }
// return SHARED_VM_CNT, MY_VM_CNT, MY_FEE, TEAM_VM_CNT, TEAM_VM_FEE, WILL_EXPIRE_VM_CNT, EXPIRED_VM_CNT,EXPIRE_DELETE_DAY
    this.getHomeCountIncludeQuota = function(expireDay, callback){
        if(!expireDay){
            expireDay=-30;
        }
        post('/api/monitor/info/home_count_includeQuota/' , {DAY:expireDay}, callback);
    }
    this.renameVM = function(vmId, newName, callback)
    {
        post('/api/vm/renameVM' , {VM_ID:vmId, NEW_VM_NM:newName}, callback);

    }
    // vmArr=[{VM_ID:'',CPU_CNT:1, RAM_SIZE:1}]
    this.vmSpecChangeMulti = function(vmArr, callback)
    {
        sendJson('/api/vm/updateMultiSpecReq' , vmArr, callback);

    }
    this.openConsole = function(vmId){
        post('/api/vm/openConsole', {VM_ID: vmId}, function(  data){
            window.open(data.url, '_blank');
        });
    }
    this.openRemote = function(linuxYN, ip){
        if(linuxYN=='Y'){
            window.open('ssh://'+ip, '_blank');
        }else if(linuxYN=='N'){
            window.open('rdp://'+ip, '_blank');
        }else{
            alert('Unknown OS');
        }
    }
}
var smAction = new SMAction();



/**
 * W:반영전(진행중)
 * S:완료
 * F:실패
 * D:거부
 */
function getStatusMsg(obj){
	 
	if(obj.CUD_CD) {
		return obj.CUD_CD_NM + ' ' + obj.APPR_STATUS_CD_NM;
	} else {
		return obj.TASK_STATUS_CD_NM;
	}
}

function expiryDate(dt, mm, oldMM){
	var date = new Date(dt);
		var orgDate = new Date(date);
		var expiry_Date = orgDate.addMonths(1*mm);
		if(oldMM && mm>oldMM) {
			var now = new Date();
			if (now > expiry_Date) {
				orgDate.setYear(now.getFullYear());
				orgDate.setMonth( now.getMonth());
				mm -= oldMM;
				expiry_Date = orgDate.addMonths(1*mm);
			}
		}

	 
	 

	 
	var html ="";
	html += formatDate(date,'date') + ' (' + label_expire + ' ' + formatDate(expiry_Date,'date') +')';
	
	return html;
}
function apprSelectChange(cd, comment){
	if($("#" + cd + " option:selected").val() == "newItem"){
		 
		$("#newItem_button").click();
	}else{
		$("#" + comment).css("display","inline-block");
		$("#" + comment).val($("#" + comment).val() + $("#" + cd + " option:selected").html()+" ");
	}
}
function getStatuVRAsMsg(obj){
	 
	if(obj.CUD_CD) {
		return obj.CUD_CD_NM + ' ' + obj.APPR_STATUS_CD_NM;
	} else {
		if(obj.TASK_STATUS_CD == "F"){
			 
			return obj.TASK_STATUS_CD_NM + (ADMIN_YN == 'N' ? '(' + msg_admin_chk + ')': ' ('+  obj.FAIL_MSG + ')' );
		} else{
			return obj.TASK_STATUS_CD_NM;
		}
	}
}

function isShowReqBtn(isAppr, direct, action, obj, btnType)
{
	if(isAppr=='Y') return false;
	if(direct=='Y')
	{
		if(btnType=='save' && isSavable(obj)) return true;
	}
	else
	{
		if(action=="insert"  && btnType=='work') return true;
		if(action=="update"  && btnType=='work' && isSavable(obj)) return true;
		if(action=='save')
		{
			if(btnType=='save'   )
			{
				return  isSavable(obj);
			}
			else if(btnType=='owner' && (!obj.CUD_CD || obj.CUD_CD=='') && isSavable(obj))
			{
				return true;
			}
		}
		if(!action=="save" && !obj.CUD_CD && isOwner(obj, false) && btnType=='work') return true; // 추가요청, 변경요청
		if(obj.CUD_CD == 'D') return false;

	}
	return false;

}

function isReqInputDisabled(action, obj, kubun)
{
	if(!isSavable(obj)){ return true;}
	if(action=='insert'  || obj.CUD_CD=='C'){ return false;}
	if(kubun=="updateReq" && (action=='update'  || obj.CUD_CD=='U' )){ return false;} //추가
	if(kubun=='save' && (  !obj.CUD_CD) && action !='update'){ return false;}
	
	return true;
}
function isRequestable(obj)
{
	if(obj.CUD_CD || !isSavable(obj))
	{
		return false;
	}
	return true;
}


function isRunnable(obj)
{
	if(obj.CUD_CD == 'C'|| obj.TASK_STATUS_CD != 'S')
	{
		return false;
	}
	return true;
}
function isDeletable(obj)
{
	if(obj.CUD_CD=='C' && isOwner(obj, false) && obj.APPR_STATUS_CD == 'W')
	{
		return true;
	}
	return false;
}
function isSavable(obj)
{
	if((obj.TASK_STATUS_CD && obj.TASK_STATUS_CD == 'W') || (obj.APPR_STATUS_CD == 'W' && !isOwner(obj, true)) || !isOwner(obj, false) || obj.APPR_STATUS_CD == 'R' || (obj.RUN_CD && obj.RUN_CD == 'W'))
	{
		return false;
	}else{
		
		return true;
	}
}

function isOwner(obj, isSame){
	try
	{

		var bol = false;
		if((isSame == undefined || isSame == false) && ADMIN_YN=='Y') bol = true;
		if((isSame == undefined || isSame == false) && GRP_ADMIN_YN=='Y' && obj.TEAM_CD==_TEAM_CD_) bol = true;
		if(obj.INS_ID ==_USER_ID_) bol= true;
		if( !obj.INS_ID || !obj.TEAM_CD ) bol = true;
		return bol;
	}
	catch(e)
	{
		 
		return false;
	}
}
function getObjFromInput(selector, result)
{
	if(!result)
	{
		result = new Object();
	}
	$(selector).each(function(idx, obj){

		chkMinMax($(obj));
		var val = $(obj).val();
		var sectionObj = $(obj).parents().filter(".section");
		var id = $(obj).attr("name");
		var pos = id.lastIndexOf(":");
		if(pos>=0)
		{
			id = id.substring(pos+1);
		}

		var result1 = result ;
		if(sectionObj.length >0 && sectionObj.attr("id"))
		{


			if(!result[sectionObj.attr("id")])
			{
				result[sectionObj.attr("id")] = {};
			}
			result1 = result[sectionObj.attr("id")];
		}


		if($(obj).attr("isMultiValued")=="true")
		{
			if(!result1[id])
			{
				result1[id] = [];
			}
			result1[id].push(val);

		}
		else
		{
			result1[id] = val;
		}
	})

	return result;

}

/**
 *
 * @param DC_ID	템플릿인 경우 필수
 * @param DISK_SIZE 필수
 * @param SPEC_ID VM인 경우, 템플릿인 경우 null
 * @param targetId 금액이 디스플레이될 요소ID
 * @returns
 */
function getDayFee(DC_ID, CPU_CNT, RAM_SIZE,DISK_TYPE_ID, DISK_SIZE, DISK_UNIT, SPEC_ID, targetId, callback, GPU_MODEL, GPU_SIZE)
{

	if(DISK_UNIT == 'T') DISK_SIZE *= 1024;
	$.get('/api/etc/get_fee?ID=1&DISK_TYPE_ID=' + DISK_TYPE_ID + '&DC_ID=' + DC_ID + '&DISK_SIZE=' + DISK_SIZE + '&SPEC_ID=' + SPEC_ID + '&CPU_CNT=' + CPU_CNT + '&RAM_SIZE=' + RAM_SIZE+ '&GPU_MODEL=' + GPU_MODEL + '&GPU_SIZE=' + (GPU_SIZE ? GPU_SIZE:0) ,
		function(data){
			var fee = formatNumber(data.FEE);
			if(targetId != undefined && targetId != null && targetId != ''){
				$("#" + targetId).val(data.FEE);
				$("#" + targetId).text(fee);
			}
			if(callback) callback(data);

	})
}
// Disk Path 보일 지 여부
function isShowDiskPath(publicYN, defaultVal){
	if(publicYN=='Y'){
		return false;
	}
	else{
		return defaultVal ;

	}
}
// 사양을 Set으로 선택하게 할 지 여부 : publicYN='Y' public cloud
function isVMSpecSet(publicYN, defaultVal){
	if(publicYN=='Y'){
		return true;
	}
	else{
		return defaultVal;
	}
}
function getDiskSizeGB(DISK_SIZE, DISK_UNIT)
{
	if(DISK_UNIT == 'T')
		return DISK_SIZE *= 1024;
	else
		return DISK_SIZE;
}

function getServerSpecinfo(data){
	var serverSpecinfo = '';
	if(data.OLD_SPEC_INFO && data.OLD_SPEC_INFO != form_data.SPEC_INFO){
		serverSpecinfo = data.OLD_SPEC_INFO + ' -> ' + data.SPEC_INFO;
	} else {
		serverSpecinfo = data.SPEC_INFO;
		 
	}
	return serverSpecinfo;
}

function getServerStatus(data){
	var serverStatus = '';
	 
	if(data && data.RUN_CD) {
		serverStatus = data.RUN_CD_NM;
		if(data && (data.APPR_STATUS_CD == 'W' || data.APPR_STATUS_CD=='R') && data.CUD_CD){
			if(data.CUD_CD == 'C') serverStatus = data.CUD_CD_NM + ' ' + data.APPR_STATUS_CD_NM;
			else  serverStatus += '('+data.CUD_CD_NM + ' ' + data.APPR_STATUS_CD_NM + ')';
		}
		if(data.RUN_CD != 'F' && (data.TASK_STATUS_CD == 'F' || data.TASK_STATUS_CD == 'W')){
			serverStatus += "(변경 " + data.TASK_STATUS_CD_NM + ")";
		}
	}

	return serverStatus;
}

function getFee(data){
	var fee = '';
	 
	if(data.DD_FEE != undefined){
		if(data.DD_FEE == 0) fee = ' / ';
		else {
			fee = formatNumber(data.DD_FEE) + msg_price_unit;
			if(data.TOTAL_DD_FEE != undefined) fee += ' / ' + formatNumber(data.TOTAL_DD_FEE) + msg_price_unit;
			else fee += ' / '
		}
	}
	 return fee;
}
function getDiskSize(arr){
	var result = {
		DEF_DISK_SIZE: 0,
		DISK_SIZE: 0
	}
	for(var i=0; i<arr.length; i++){
		if(arr[i].CUD_CD == 'C' || arr[i].KUBUN == 'DISK_REQ') {
			result.DISK_SIZE += Number(arr[i].DISK_SIZE);
		}else {
			result.DEF_DISK_SIZE += Number(arr[i].DISK_SIZE);
		}
	}
	return result;
	/*for(var i in arr) {
		if(arr[i].CUD_CD == 'C' || arr[i].KUBUN == 'DISK_REQ') {
			result.DISK_SIZE += Number(arr[i].DISK_SIZE);
		}else {
			result.DEF_DISK_SIZE += Number(arr[i].DISK_SIZE);
		}
	}*/
}
function getSimpleSpecInfo(spec, cpuCnt, ramSize){
	var specNm = null;
	if(typeof spec == 'object'){
		var data = $.extend({}, spec);
		cpuCnt = data.CPU_CNT;
		ramSize = data.RAM_SIZE;
	}
	if(cpuCnt < 1) return '';
	return formatNumber(cpuCnt) + 'vCore, ' + formatNumber(ramSize) + 'GB Mem';
}

function getSpecInfo(spec, cpuCnt, ramSize, diskSize, diskUnit, gpuSize, diskTypeNm){
	var specNm = null;
	if(spec != null && typeof spec == 'object'){
		var data = $.extend({}, spec);
		cpuCnt = data.CPU_CNT;
		ramSize = data.RAM_SIZE;
		diskSize = data.DISK_SIZE;
		diskUnit = data.DISK_UNIT;
		diskTypeNm = data.DISK_TYPE_NM;
		gpuSize = data.GPU_SIZE;
		specNm = data.SPEC_NM;
	} else {
		specNm = spec;
	}
	if(diskUnit == 'T') {
		diskUnit = 'TB';
	} else if(diskSize){
		diskUnit = 'GB';
		if(diskSize % 1024 ==0)
		{
			diskSize = diskSize / 1024;
			diskUnit = 'TB';
		}
	}
	return nvl(specNm,'')+ '(' + formatNumber(cpuCnt) + 'vCore, ' + formatNumber(ramSize) + 'GB Mem' + (diskSize ? ( ', ' + formatNumber(diskSize) + diskUnit + ' ' + nvl(diskTypeNm,'') + 'Disk') : '') + (gpuSize ? ( ', ' + formatNumber(gpuSize) +   ' ' + nvl(diskTypeNm,'') + 'GPU') : '') + ')';}

function getTaskStatusCdNm(data) {

	if(data.CUD_CD_NM){
		data.TASK_STATUS_CD_NM = data.CUD_CD_NM + ' ' + data.APPR_STATUS_CD_NM;
	}
	return data.TASK_STATUS_CD_NM;
}

function getTemplateDiskSize(data, dftMsg){
	var diskSize = '';
	if(data.DISK_SIZE != undefined){
		if(data.DISK_SIZE == 0){
			diskSize = dftMsg != undefined ? dftMsg: '-';
		} else {
			diskSize = formatNumber(data.DISK_SIZE) + 'GB';
		}
	}
	return diskSize;
}

function getCUDCDStyle(data){
	if(data.CUD_CD){
		if(data.CUD_CD == 'C') return 'color:blue;';
		else if(data.CUD_CD == 'U') return 'color:#04ba0e;';
		else return 'color:red;';
	}
	return '';
}

function getSpecinfoStyle(data){
	if(data.OLD_SPEC_INFO && data.OLD_SPEC_INFO != form_data.SPEC_INFO){
		return 'color:#04ba0e;';
	}
	return '';
}

function getUseMMAndExpireDT(data, month, expire){
	var useMM = '';
	if(data.USE_MM) useMM = formatNumber(data.USE_MM) + month;
	if(data.EXPIRE_DT){
		useMM += ' / '+ expire +':'+ ( (data.EXPIRE_DT.indexOf(':') == -1) ? formatDate(data.EXPIRE_DT, 'date') : data.EXPIRE_DT );
	} else if(data.INS_TMS && data.USE_MM){
		var dt = new Date(data.INS_TMS)
		dt.addMonths( data.USE_MM);
	    useMM += ' / '+ expire +':'+ formatDate(dt, 'date');
	}
	else useMM += ' / -';
	 
	return useMM;
}

function getUseMMStyle(data){
	if(data.EXPIRE_DT){
		if(new Date(data.EXPIRE_DT) - new Date() <= 0){
			return 'color:red';
		}
	}
	return '';
}

function setVueFormData(vue, data){
	for(var x in data) {
		vue.$set(vue.form_data, x, data[x]);
	}
}

function setVueData(vue, prop, value){
	vue.$set(vue.form_data, prop, value);
}


function chkWinDriver(val){
	if(val.length>1){
		alert('문자 하나만 입력하세요.');
		return false;
	}
	val = val.toUpperCase();
	if(val == 'A' || val == 'B' || val=='C' || val=='Z'){
		alert('A, B, C, Z는 사용하실 수 없습니다.');
		return false;
	}
	return true;
}

function getUseMonthList(valList){
	var monthArray = [];
	for(var w = 0 ; w < valList.length; w++){
		var valListS = valList[w].split("|");
		var object = new Object();
		if(valListS.length > 1){
			object.title = valListS[1];
			object.val = valListS[0];
		} else{
			if(valList[w]=='999'){
				object.title = '영구';
			}
			else{
				object.title = valList[w];
			}
			object.val = valList[w];
		}
		monthArray.push(object);
	}
	return monthArray;
}
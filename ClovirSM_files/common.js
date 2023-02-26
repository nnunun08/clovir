var g_config = {
      code : { key_field : "ID", title_field : "TITLE"}
}
var defaultWidth = 480;
var defaultHeight = 350;
function extractLast( term ) {
    return split( term ).pop();
  }
function split( val ) {
    return val.split( /,\s*/ );
  }
function getInnerStr(str, startStr, finishStr){
	var pos = str.indexOf(startStr);
	if(pos<0) return null;
	var pos1 = str.indexOf(finishStr, pos+1);
	if(pos1<0){
		pos1 = str.length;
	}
	return str.substring(startStr.length+pos, pos1);
}
function findInArrayByFieldValue(list, field, value){

   for(var i=0; i < list.length; i++){
      if(list[i][field]  == value){
         return list[i];
      }
   }
   return  null;
}
function deleteOptionExcept(selId, ids){
   $("#" + selId + " OPTION").each(function(index, item){
      if(ids.indexOf($(item).val())<0){
         $(item).remove();
      }
   })
}
function removeEmpty(arr){
	var result = [];
	for(var i=0; i < arr.length; i++){
		if(arr[i] &&  "" != arr[i].trim()){
			result.push(arr[i].trim());
		}
	}
	return result;
}
String.prototype.format = function() {
   var args = arguments;

   return this.replace(/\{(\d+)\}/g, function() {
      return args[arguments[1]];
   });
};
Array.prototype.updateAtIdx = function(idx, val, def){
	  if(this.length<=idx){
		  var diff = idx - this.length 
		  for(var i=0; i< diff; i++){
			  this.push(def);
		  }
		  this[idx] = val
		  return this;
	  }
	}
function getMessage(msg, arr){
   if(msg.replace(/\{(\d+)\}/g, "") != msg){
      if(arr instanceof Array){
         eval("msg = msg.format('" + arr.join("','") + "');");
      }else {
         msg = msg.format(arr);
      }
   }
   return msg;
}

function chgHighlight(origin, target, classNM, newline) {
   if(classNM == null) {
      classNM = "chg";
   }
   if(!origin || origin==null){
	   origin="";
   }
   if(!target || target==null){
	   target="";
   }
   var result = "";
   var originArr = origin.split(",");
   var targetArr = target.split(",");
   var flag = false;
   if(newline==null){
	   for(var t in targetArr) {
	      var f = false;
	      for(var o in originArr) {
	         if(targetArr[t] === originArr[o]) {
	            f = true;
	            break;
	         }
	      }
	      if(f == false) {
	         if(flag == false) {
	            result += '<div class="' + classNM + '">';
	            flag = true;
	         }
	      }else {
	         if(flag == true) {
	            result += '</div>';
	            flag = false;
	         }
	      }
// result += targetArr[t] + ',';
	      result += '<div>' + targetArr[t] + '</div>';
	      
	   }
   }else{
	   for(var t in targetArr) {
		      var f = false;
		      for(var o in originArr) {
		         if(targetArr[t] === originArr[o]) {
		            f = true;
		            break;
		         }
		      }
		      if(f == false) {
		         if(flag == false) {
		        	 
		            result += '<div class="' + classNM + '">';
		            flag = true;
		         }
		      }else {
		         if(flag == true) {
		            result += '</div>';
		            flag = false;
		         }
		      }
		      result +=  '<div>' + targetArr[t] + '</div>';
		   }
   }
   // result = result.substr(0, result.length - 1);
   if(flag == true) {
      result += '</div>';
   }
   return result;
}

function enter_search( form )
{
   if(form.target != '') return true
   	$(form).find(".searchBtn,button.search").focus();
   $(form).find(".searchBtn,button.search").trigger("click");
   return false;
}
function exportExcelServer(formId, action, fileName, colDef, param)
{


   var obj = $("#extraField");
   if(obj.length==0)
   {
      $("body").append("<form id='downForm' method='post' target='downWin' action='" + action + "'><input type='hidden' name='colDef' id='excel_colDef' /><input type='hidden' name='fileName' id='excel_fileName' /><div id='extraField'></div></form>");
      obj = $("#extraField");
   }
   if(param)
   {
      var html = '';
      Object.keys(param).forEach(function(key){
         if(key != "pageSize")
         {
            var val = param[key];
            if(val != null) {
               if (val instanceof Array) {
                  for (var i = 0; i < val.length; i++) {
                     html += '<input type="hidden" name="' + key + '" value="' + val[i] + '">';
                  }
               } else {
                  html += '<input type="hidden" name="' + key + '" value="' + val + '">';
               }
            }
         }
      })
      obj.html(html);
   }
   $("#excel_colDef").val(JSON.stringify(colDef));
   var today = formatDatePattern(new Date(), "yyyyMMddHHmmss");
   $("#excel_fileName").val(fileName + "_" + today);

   $("#downForm" ).submit();

   showLoading();
   setTimeout(downloadCompleteChk, 1000);
}

function extendNotExist(target, src){
	 
	Object.keys(src).forEach(function(key){
		if(!target[key] || target[key]==null){
			target[key] = src[key]
		}
	})
}
function downloadCompleteChk()
{
   if(document.downWin.document.readyState == "loading")
   {
      setTimeout(downloadCompleteChk, 1000);
   }
   else
   {
      hideLoading();
   }

}
function encryptData(fields){
   if(RSAModulus != ''){
      for(var i=0; i < fields.length; i++){
         if(jsEncryptParam && jsEncryptParam.length>0 && jsEncryptParam.indexOf(fields[i])>=0){
            $("#" + fields[i]).val(encrypt($("#" + fields[i]).val()));
         }
      }
   }
}
function removeOptionByVal(id, val){
	$("#" + id + " option[value='" + val + "']").remove();
}
function isEmpty(obj)
{
   if(!obj) return true;
   if(obj == null) return true;
   if(obj == '') return true;
   if(obj == "undefined") return true;
   return false;
}
function isEmptyNm(obj)
{
   if(!obj) return '';
   if(obj == null) return '';
   if(obj == '') return '';
   return obj;
}
function getParamSize(param)
{
   var idx = 0;
   for(var x in param)
   {
      if(x.indexOf("_")==0) continue;
      if(param[x] && param[x] != '') idx += 1;
   }
   return idx;
}
var Req = function()
{
   this.beforeSendSearch=function()
   {
      this.beforeSend(searchvue);
   }
   this.beforeSend = function(vue)
   {
      var arr = vue.$children;

      for(var i=0; i < arr.length; i++)
      {
         try
         {
            var isok = arr[i].beforeSubmit();
            if(!isok)
            {
               return false;
            }
         }
         catch(e)
         {

         }
      }
      return true;
   },
   this.searchSubPaging = function(url, search_param, grid1, callback)
   {
      grid1.gridOptions.api.showNoRowsOverlay();
      grid1.setTotal(0);
      var that = this;
      var datasource = {
          rowCount: null, // behave as infinite scroll
          getRows: function(params) {

             if(params.sortModel.length>0)
                search_param.orderClause= that.getSortField(grid1, params.sortModel[0]) + " " +  params.sortModel[0].sort.toUpperCase();
             else
                search_param.orderClause = "";
             search_param.pageSize= ( params.endRow - params.startRow);
             search_param.pageNo= params.endRow/ ( params.endRow - params.startRow);

             that.searchSub(url, search_param, function(data) {
                if(data.total>0) grid1.gridOptions.api.hideOverlay();
                grid1.setTotal(data.total);
                var lastRow = -1;
                  if (data.total <= params.endRow) {
                      lastRow = data.total;
                  }
               params.successCallback(data.list, lastRow);
               if(callback)
               {
                  callback.call(null,data);
               }
             }, true);

          }
      }
      grid1.gridOptions.api.setDatasource(datasource);
   }
   this.getSortField = function(grid1, sortModel)
   {
      var sort_field =  grid1.gridOptions.columnApi.getColumn(sortModel.colId).colDef.sort_field;
      if(sort_field)
      {
         return sort_field;
      }
      else
      {
         return sortModel.colId;
      }
   }
   this.searchPaging = function(url, grid1, callback)
   {
      if(!this.beforeSend(searchvue)) return;
      grid1.gridOptions.api.showNoRowsOverlay();
      grid1.setTotal(0);
      var that = this;
      var datasource = {
          rowCount: null, // behave as infinite scroll
          getRows: function(params) {
              
             if(params.sortModel.length>0)
                that.setSearchData("orderClause", that.getSortField(grid1, params.sortModel[0]) + " " +  params.sortModel[0].sort.toUpperCase())
             else
                that.setSearchData("orderClause","");
             that.setSearchData("pageSize", ( params.endRow - params.startRow));
             that.setSearchData("pageNo", params.endRow/ ( params.endRow - params.startRow));

             that.search(url, function(data) {
                if(data.total>0) grid1.gridOptions.api.hideOverlay();
                grid1.setTotal(data.total);
                var lastRow = -1;
                  if (data.total <= params.endRow) {
                      lastRow = data.total;
                  }
               params.successCallback(data.list, lastRow);
               if(callback)
               {
                  callback.call(null,data);
               }
             }, true);

          }
      }
      grid1.gridOptions.api.setDatasource(datasource);
   }
   this.getRunSearchData = function()
   {
      if(!this.run_seach_data) return this.getSearchData();
      return this.run_seach_data;
   }
   this.searchSub = function(url, param, callback, notloading)
   {

      var that = this;
      if(url != null)
      {
         post(url, param, function(data)
         {
            that.run_seach_data = $.extend({},param);
            if(callback)
            {
               callback.call(null,data);
            }

         },notloading);
      }
      else
      {
         callback.call(null);
      }
   }
   this.search = function(url, callback, notloading)
   {
      if(!this.beforeSend(searchvue)) return;
      var that = this;
      if(url != null)
      {
         post(url, this.getSearchData(), function(data)
         {
            that.run_seach_data = $.extend({},that.getSearchData());
            if(callback)
            {
               callback.call(null,data);
            }

         },notloading);
      }
      else
      {
         callback.call(null);
      }
   }
   this.getSearchData = function()
   {
      return searchvue.form_data;
   }
   this.setSearchData = function(k, v)
   {
      if(k instanceof Object)
      {

         for (var x in k) {
            searchvue.$set( searchvue.form_data, x, k[x]);
         }
      }
      else
      {
         searchvue.$set(searchvue.form_data, k, v);
      }
   }
   this.getInfo = function(url, callback)
   {
      var that = this;
      post(url, null, function(data)
      {

          
            that.setData( data) ;
            if(callback)
            {
               callback.call(null,data);
            }

      });

   }
   this.clearData = function()
   {
      clearObj(inputvue.form_data);

   }
   this.setData = function(data)
   {
       
      this.clearData();
      this.putData( data);
   }
   this.putData = function(data)
   {

      for (var x in data) {

         inputvue.$set( inputvue.form_data, x, data[x]);

      }

   }
   this.getData = function()
   {
      return inputvue.form_data;
   }

   this.del = function(url, callback)
   {
      if(confirm(msg_confirm_delete))
      {
         this.save(url, callback);
      }
   }
   this.saveGrid = function(grid1, url, callback, isDel, notRunStop)
   {

      if(!notRunStop)
      {
         grid1.stopEditing();
         var that = this;
         setTimeout(function(){
            that.saveGrid(grid1,url,callback, isDel, true);
         }, 100)
         return;
      }
      if(grid1.getSelectedRows().length==0)
      {
         alert(msg_select_first);
         return;
      }
      var that = this;
      this.setData({"selected_json" : JSON.stringify(grid1.getSelectedRows())});
      this.save(url, function(data){
         that.setData("selected_json", null);
         callback.call(null, data);
      })
   },
   this.delGrid = function(grid1, url, callback)
   {
      if(confirm(msg_confirm_delete))
         this.saveGrid(grid1, url, callback, true);
   },

   this.save = function(url, callback)
   {
      if(!this.beforeSend(inputvue)) return;
       
      post(url, this.getData() , function(data){
         hideLoading();
         if(callback) callback.call(null,data);

      })
   }
   this.saveFiles = function(url, fileField, callback)
   {
      url += '/' + fileField;
      if(!this.beforeSend(inputvue)) return;
      var formData = new FormData();
      for(var x in form_data) {
         formData.append(x, form_data[x]);
      }
      var fileObj = $("input[name=" + fileField );
      var files = fileObj[0].files;

      for(var i=0; i < files.length;i++ )
      {
           formData.append(fileField, files[i]);
      }
      showLoading();
      $.ajax({
         url: url,
         data: formData,
         processData: false,
         contentType: false,
         type: 'POST',
         success: function(data){
            fileObj.parent().find(":text").val("");
            fileObj.val("");
            if(callback) callback.call(null,data);
            hideLoading();
            },

         }).fail(function(jqXHR){
            processError(false, jqXHR, callback)
         });



   }
}
function acceptCheck(allowTypes, mediaType){
   if(!mediaType || mediaType==''){
      return false;
   }
   if(allowTypes.indexOf(mediaType)>=0){
      return true;
   }
   var pos = mediaType.indexOf("/");
   if(allowTypes.indexOf(mediaType.substring(0,pos+1) + "*")>=0){
      return true;
   }
   return false;
}
function validateFileType( file){

   var result = true;
   for(var i=0; i  < file.files.length; i++){
      var fileName = file.files[i].name;
      var pos = fileName.lastIndexOf(".");
      if(pos<0){
         result = false;
         break;
      }
      if(file.accept.indexOf(fileName.substring(pos))<0 && !acceptCheck(file.accept,file.files[i].type)){
         result = false;
         break;
      }
   }
   if(!result){
      alert("허용되지 않는 파일입니다.");
   }
   return result;
}
function validateNotAllowFileType(  file){
   var result = true;
   var reg = new RegExp('(.*?)\.(jsp|jspx|sh|exe|bat|cmd|php|ps1|pv|js|asp|pl)$');
   for(var i=0; i<file.files.length; i++){
      if(reg.test(file.files[i].name)) {
         result = false;
         break;
      }
   }
   if(!result){
      alert("허용되지 않는 파일입니다.");
   }
   return result;
}
function validateFileExt( id){
   var array = [];

   var result;
   var files = $('#' + id + ' :file');
   for(var i=0; i < files.length; i++){
      if(files[i].value != '') {
         if(files[i].accept){
            result = validateFileType(files[i])
         }
         else{
            result = validateNotAllowFileType(files[i])
         }
         if(!result){
            return false;
         }
      }
   }
   return true;
}
function validate(id)
{
   var arr = $("#" + id +" *[required='required']");
   var isok=true;
   var msg = '';
   for(var i=0; i < arr.length; i++)
   {

         $(arr[i]).find("input,select,textarea").each(function(idx){
            if(!$(this).is(":visible")) return;
            if($(this).hasClass("select2-search__field")) return;
            if($(this).val()=="" || $(this).val() == null)
            {
               isok = false;
               msg += $(arr[i]).find("label").text().trim() + msg_empty_value + "\n";
               $(this).focus();
               return false;
            }
         })
         if($(arr[i]).is(":input") && $(arr[i]).is(":visible")){
            if($(arr[i]).val()=="" || $(arr[i]).val() == null){
               isok = false;
               msg += $(arr[i]).attr("title") + msg_empty_value + "\n";
               arr[i].focus();
            }
         }

   }
   if(!isok) alert(msg);
   return isok;
}


function numValidate(id)
{
   var arr = $("#" + id +" *[numberValidate='numberValidate']");
   var isok=true;
   var msg = '';
   var regexp = /^[0-9]*$/;
   for(var i=0; i < arr.length; i++)
   {

         $(arr[i]).find("input,select").each(function(idx){
            if(!$(this).is(":visible")) return;
            if( !regexp.test($(this).val()) ) 
            {
               isok = false;
               msg += $(arr[i]).find("label").text() + msg_not_number + ' \n';
               $(this).focus();

            }
         })

   }
   if(!isok) alert(msg);
   return isok;
}

function ipValidate(ip)
{
   var reg = new RegExp('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$') // 255.255.255.255
   var val = reg.test(ip)
   var msg = '';
   if(!val){
      msg=msg_ip_reg;
      alert(msg);
      return false;
   }
   else{
      return true;
   }
}
function clearObj(obj)
{
   for (x in obj) {
      if(x.indexOf("_")==0) continue;
       obj[x] = null ;
   }
}
function getFormData(obj)
{
   return getVueRoot(obj).form_data;
}
function getFormDataValue(obj)
{
   if(obj.name)
     {
        return getFormData(obj)[obj.name];
     }
     else
     {
        return "";
     }
}
function setFormDataValue(obj, val)
{
   if(obj.name)
   {
      getVueRoot(obj).$set( getFormData(obj), obj.name, val);
   }
}
function checkedCheckboxByArr(id, arr)
{

   var objs= $("#" + id + " :checkbox");
   if(!objs) { alert("#" + id + " :checkbox"); }
   for(var i=0; i< objs.length ; i++)
   {
      for(var j=0; j < arr.length; j++)
      {
         if(objs[i].value==arr[j])
         {
            objs[i].checked = true;
            break;
         }

      }
   }
}
function getJSONAsync(url)
{
   var data = null;

}
function copyFormData(obj, trg_data)
{

   var form_data1 =  getFormData(obj);
   clearObj(form_data1);
   Object.keys(trg_data).forEach(function(key){
         obj.$set(form_data1, key, trg_data[key]);
      }
   );
}
function getVueRoot(obj)
{
   if(obj.$parent == undefined)
   {
      return obj;
   }
   return getVueRoot(obj.$parent);
}

function fillOptionByData(id, data, emptyStr, keyField, titleField)
{
   $("#" + id).empty();
   if(emptyStr != null && emptyStr != undefined && emptyStr != true)
   {
      var emptyValue="";
      if(emptyStr == "0"){
         emptyValue="0";
      }
      $("#" + id).append('<option  value="' + emptyValue + '">' + emptyStr + '</option>');
   }
   if(!keyField) keyField = g_config.code.key_field;
   if(!titleField) titleField = g_config.code.title_field;

   if(data instanceof Array)
   {
      // var select_data = {};
      for (var i = 0; i < data.length; i++) {
         $opt = newOption(data[i], keyField, titleField)
         $("#" + id).append($opt);
       }
      // $("#"+id).all_data = select_data;
   }
   else
   {
      var keys = Object.keys(data);
      keys.forEach(function(key, i)
      {
         $("#" + id).append('<option  value="' + key + '">' + data[key] + '</option>');
      });
   }

}
function groupingArrayToMap(arr, field){
   var result = {};
   for(var i=0; i < arr.length; i++){
      var key = arr[i][field];
      if(!key) {
         key = "N/A";
      }
      var subArr = result[key];
      if(!subArr){
         subArr = [];
         result[key] = subArr;
      }
      subArr.push(arr[i]);
   }
   return result;
}
function newOption(data1, keyField, titleField){
// select_data[data1[keyField]]=data1;
   var title = '';
   var val = '';
   if(data1 instanceof Object)
   {
      val = data1[keyField];
   }
   else
   {
      val = data1;
   }
   if(titleField instanceof Array){
      title += data1[titleField[0]];
      if(titleField.length > 1){
         title += '(';
         for(var j = 1; j < titleField.length; j++){
            if(j > 1) title += '/';
            if(data1[titleField[j]])
            {
               title += data1[titleField[j]];
            }
         }
         title += ')';
      }
   } else {
      if(data1 instanceof Object)
      {
         title = data1[titleField];
      }
      else
      {
         title = data1;
      }

   }
   var $opt = $('<option  value="' + val + '">' + title + '</option>');
   $opt.prop('data', data1);
   return $opt;
}
function newOptGroup(key, arr, keyField, titleField){
   var $optgroup = $("<optgroup label='" + key + "'></optgroup>");
   arr.forEach( function (arr1 ) {
      $optgroup.append(newOption(arr1, keyField, titleField));
   })
   return $optgroup;
}
function mapToSelectHasGroup(selectObj, map, orderArr, keyField, titleField){

   for(var i=0; i < orderArr.length; i++){
      var val = map[orderArr[i]];
      if(val){
         selectObj.append(newOptGroup(orderArr[i], val, keyField, titleField))
      }
      delete map[orderArr[i]];
   }
   var keys = Object.keys(map)
   for(var i=0; i < keys.length; i++){
      var val = map[keys[i]];
      if(val){
         selectObj.append(newOptGroup(keys[i], val, keyField, titleField))
      }

   }

}

function initSelect2()
{
   var originalVal = $.fn.val;
   $.fn.val = function(value) {
      if (arguments.length >= 1) {
        var obj =  originalVal.call(this, value);
        if($(this).hasClass('select2-hidden-accessible'))
        {

         $(this).trigger("change");

        }
        return obj;
      }
      // getter invoked do processing
      return originalVal.call(this);
   };
}
function getArray(arr){
	if(arr instanceof Array){
		return arr;
	}
	else{
		var result = [];
		result.push(arr);
		return result;
	}
}
function isDate(str){
   try{
      if(!str || str=='' ){
         return true;
      }
      var d = new Date(str);
      if(d == 'Invalid Date'){
         return false;
      }
      return true;
   }
   catch(e){
      return false;
   }
}
function fillOption(id, url, emptyStr, callback, keyField, titleField)
{
   post(url, null, function(data){
      fillOptionByData(id, data, emptyStr, keyField, titleField);
      if(!emptyStr || emptyStr == null  )
      {
         $("#" + id + " option:first").prop("selected",true);
         $("#" + id).trigger("change");
      }
      
      if(callback)
      {
            callback.call(null, data);
      }
   }, true)
}
function spinner(obj,isPlus)
{
   var inputObj = $(obj).parents(".spinner:first").find("input");
   var v = inputObj.val();
   if(v=='') v=0;
   inputObj.val( 1*v +  (isPlus?1:-1));
   inputObj.trigger("change")
}
function go(e, url)
{
   location.href=url;
   e.stopPropagation();
}

function showLoading()
{

   $('#loading_dialog').show();
   return;
   try
   {
      if(!$(".modal-backdrop").is(":visible")) $("#loading").modal("show");
   }
   catch(e){}
}
function hideLoading()
{
   $('#loading_dialog').hide();
   return;
   try
   {
      $("#loading").modal("hide");
   }catch(e){}
}
function formatDatePattern(formatDate, formatString) {
   if(!formatDate) return "";
   if(typeof formatDate == 'number')
   {
      formatDate = new Date(formatDate);
   }
   if(formatDate instanceof Date) {
      var months = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
      var yyyy = formatDate.getFullYear();
      var yy = yyyy.toString().substring(2);
      var m = formatDate.getMonth()+1;
      var mm = m < 10 ? "0" + m : m;
      var mmm = months[m];
      var d = formatDate.getDate();
      var dd = d < 10 ? "0" + d : d;

      var h = formatDate.getHours();
      var hh = h < 10 ? "0" + h : h;
      var n = formatDate.getMinutes();
      var nn = n < 10 ? "0" + n : n;
      var s = formatDate.getSeconds();
      var ss = s < 10 ? "0" + s : s;


      formatString = formatString.replace(/yyyy/, yyyy);
      formatString = formatString.replace(/yy/, yy);
      formatString = formatString.replace(/MMM/, mmm);
      formatString = formatString.replace(/MM/, mm);
      formatString = formatString.replace(/M/, m);
      formatString = formatString.replace(/dd/, dd);
      formatString = formatString.replace(/d/, d);
      formatString = formatString.replace(/HH/, hh);
      formatString = formatString.replace(/H/, h);

      formatString = formatString.replace(/mm/, nn);
      formatString = formatString.replace(/m/, n);
      formatString = formatString.replace(/ss/, ss);
      formatString = formatString.replace(/s/, s);
      return formatString;
   } else {
      return "";
   }
}
function formatDate(str, pattern)
{
   if(str == null || ""==str) return "";
   if(str instanceof Date)
   {
      var dt = str;
      if(pattern == 'date')
      {
         return dt.getFullYear() + '-' +  ("" + (dt.getMonth()+1)).lpad(2,'0') + '-' + ("" + (dt.getDate())).lpad(2,'0');
      }
      else if(pattern == 'datetime')
      {
         return dt.getFullYear() + '-' +  ("" + (dt.getMonth()+1)).lpad(2,'0') + '-' + ("" + (dt.getDate())).lpad(2,'0') + ' ' + ("" + (dt.getHours())).lpad(2,'0') + ':' + ("" + (dt.getMinutes())).lpad(2,'0') + ':' + ("" + (dt.getSeconds())).lpad(2,'0') ;
      }
   }
   else if(typeof str == 'number')
   {
      var dt = new Date(str);
      if(pattern == 'date')
      {
         return dt.getFullYear() + '-' +  ("" + (dt.getMonth()+1)).lpad(2,'0') + '-' + ("" + (dt.getDate())).lpad(2,'0');
      }
      else if(pattern == 'datetime')
      {
         return dt.getFullYear() + '-' +  ("" + (dt.getMonth()+1)).lpad(2,'0') + '-' + ("" + (dt.getDate())).lpad(2,'0') + ' ' + ("" + (dt.getHours())).lpad(2,'0') + ':' + ("" + (dt.getMinutes())).lpad(2,'0') + ':' + ("" + (dt.getSeconds())).lpad(2,'0') ;
      }
   }
   else
   {
      try
      {
         if(pattern == 'date')
         {
             
            return str.substring(0,4) + '-' +  str.substring(4,6) + '-' + str.substring(6,8)
         }
         else if(pattern == 'time')
         {
            return str.substring(8,10) + ':' +  str.substring(10,12) + ':' + str.substring(12)
         }
         else
         {
            return str.substring(0,4) + '-' +  str.substring(4,6) + '-' + str.substring(6,8) + ' ' + str.substring(8,10) + ':' +  str.substring(10,12) + ':' + str.substring(12) ;

         }
      }
      catch(e){
         return str;
      }
   }
}
function removeTag(str)
{
   return str.replace(/(<([^>]+)>)/ig,"");
}

function toLowerCaseJson(obj)
{
   var json = JSON.stringify(obj);
   var newJson = json.replace(/"([\w]+)":/g, function($0, $1) {
     return ('"' + $1.toLowerCase() + '":');
   });
   var newObj = JSON.parse(newJson);
   return newObj;
}
function post(url, param, callback, notloading)
{
   if(!notloading) showLoading();
   $.post(url, param,
         function (data,textStatus, jqXHR)
         {

            if(!notloading) hideLoading();
            if(chkErr4Ajax(data))
            {
               if(callback && callback != null)
               {
                  callback.call(null, data);
               }
            }
         }
      , 'json'
   ) .fail(function(jqXHR) {
      processError(notloading, jqXHR, callback);
   });
}
function sendJson(url, param, callback, notloading)
{
   if(!notloading) showLoading();
   $.ajax({
      // [요청 시작 부분]
      url: url, //주소
      data: JSON.stringify(param), //전송 데이터
      type: "POST", //전송 타입
      async: true, //비동기 여부
      dataType: "JSON", //응답받을 데이터 타입 (XML,JSON,TEXT,HTML,JSONP)
      contentType: "application/json; charset=utf-8", //헤더의 Content-Type을 설정

      // [응답 확인 부분 - json 데이터를 받습니다]
      success: function(data) {
         if(chkErr4Ajax(data))
         {
            if(callback && callback != null)
            {
               callback.call(null, data);
            }
         }
      },
    // [완료 확인 부분]
      complete:function(data,textStatus) {
         if(!notloading) hideLoading();
      }
   });

}
function fileSizeCheck(fieldName, maxFileSize){
   if(!maxFileSize){
      maxFileSize = maxLength.file;
   }
   if($("input[name=" + fieldName +"]")[0].files.length == 0){
      return true;
   }
   var count = $("input[name=" + fieldName +"]")[0].files.length;
   if(maxLength.uploadFileCount>0){
      if(count>maxLength.uploadFileCount){
         alert(msg_file_max_count)
         return false;
      }
   }
   for(var i=0; i < count; i++){
      var fileSize = $("input[name=" + fieldName +"]")[0].files[i].size;

      if( maxFileSize < fileSize){
         alert(msg_file_upload_size)
         return false;
      }
   }
   return true;
}
function checkEditorCharCount(id, title){
  var currSize =  $("#" + id).Editor("getCharCount" )
   if(currSize>maxLength.editor){
      alert(msg_max_legnth.format(title, formatNumber(maxLength.editor)))
      return false;
   }
   return true;
}
$(function () {
   //setup ajax error handling
   $.ajaxSetup({
      error: function (jqXHR, status, error) {
         jqXHR.processError = false;
         var data ;
         try{
            data = JSON.parse(jqXHR.responseText);
            if(!data)
            {
               data = {error:msg_jsp_error};
            }
            chkErr4Ajax(data);
            jqXHR.processError = true;
         }
         catch(e) {
            // evoke : 로컬 작업을 위한 임시 주석
            //    if (!jqXHR.responseText || jqXHR.responseText.indexOf("<!DOCTYPE") >= 0) {
            //       alert(msg_jsp_error);
            //       jqXHR.processError = true;
            //    }
         }
         if(jqXHR.status==701)
         {
            location.href="/";
         }
      }
   });
});
function processError(notloading, jqXHR, callback){

   if(!notloading) hideLoading();

         if(!jqXHR.processError && jqXHR.status == 200){
            if(callback && callback != null)
            {
               var data = jqXHR.responseText;
               callback.call(null, data);
            }
         }




}
function encrypt(str)
{
   if(RSAModulus != '') {
      var rsa = new RSAKey();
      rsa.setPublic(RSAModulus, RSAExponent);

      return rsa.encrypt(str);
   }
   else{
      return str;
   }

}
var loginNeed = false;
function chkErr4Ajax(data)
{
//  
   if(data.error)
   {
      if(data.error == "NEED_LOGIN")
      {
         if(loginNeed){
            return false;
         }
         loginNeed = true;
         alert(msg_need_login);
         location.href="/";

         return false;
      }
      alert(data.error);
      return false;
   }
   return true;
}
function formatNumber(number, digit) {
    // this puts commas into the number eg 1000 goes to 1,000,
    // i pulled this from stack overflow, i have no idea how it works
   if(isNaN(number)) {
      return '';
   }
   number = number.toString();
   var idx = number.indexOf(".");
   var i = idx < 0 ? number.length : idx;
   var int = number.substring(0, i);
   var _digit = number.substring(i, i + 1 + digit);
   _digit = digit != null && digit > 0 ? _digit : '';
   return int.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + _digit;
}
function formatNumberM(number, unit){
	
	number = number.toString();
	if(isNaN(number)) {
	    return '';
	}
	number = number.toString();
	var idx = number.indexOf(".");
	var i = idx < 0 ? number.length : idx;
	var int = number.substring(0, i);
	var result = '';
	if(int.length > 4){
		 result = "<div style='display: inline-block; position: relative; top: 6px;'>"+formatNumber(number.substring(0, int.length - 4))+ "</div>" + "<div style='display: inline-block; font-size: 20px; position: relative; top: -2px;'>&nbsp"+unit+"</div>";
	} else{
		result =  formatNumber(number.substring(0, i));
	}
	return result;
   
}

String.prototype.lpad = function(padLength, padString){
    var s = this;
    while(s.length < padLength)
        s = padString + s;
    return s;
}

String.prototype.rpad = function(padLength, padString){
    var s = this;
    while(s.length < padLength)
        s += padString;
    return s;
}

var month = [];
var year = [];
var hh = [];
function sleep(milliseconds) {
     var start = new Date().getTime();
     for (var i = 0; i < 1e7; i++) {
       if ((new Date().getTime() - start) > milliseconds){
         break;
       }
     }
   }
function setDateComboList()
{
   for(var i=1; i < 13; i++)
   {
      month.push({ID:  ('' + i).lpad( 2, '0'), TITLE: i + dateLabel.month });
   }
   for(var i=0; i < 24; i++)
   {
      hh.push({ID:  ('' + i).lpad( 2, '0'), TITLE: i + dateLabel.hour });
   }
   var yy = (new Date()).getFullYear();
   for(var i= yy ; i > yy - 4 ; i--)
   {
      year.push({ID: i, TITLE: i + dateLabel.year })
   }
}



function insertArrBySameVal(titleArr, titleArr2, data, dataRow2, sameFieldIdx1, sameFieldIdx2)
{
   var isFind=false;
   for(var i=0; i < data.length; i++)
   {
      var data1 = data[i];
      if(!isFind && data1[sameFieldIdx1]==dataRow2[sameFieldIdx2])
      {

         var jidx = 0;
         for(var j=0; j < titleArr2.length; j++)
         {
            if(j==sameFieldIdx2) continue;
            if(data1.length<jidx+titleArr.length)
            {
               data1.push(dataRow2[j])
            }
            else
            {
               data1[jidx+titleArr.length] = dataRow2[j];
            }
            jidx++;
         }

         isFind=true;

      }
      else if(data1.length<titleArr.length+titleArr2.length-1)
      {
         for(var j=0; j < titleArr2.length-1; j++)
         {
            data1.push(0);
         }
      }
   }
}

function max(t, u)
{
   if(Math.max(t,u) == u)
   {

      return t;
   }
   return u;
}
function isInt(n){
    return Number(n) === 1*n && n % 1 === 0;
}
function makePer(v)
{
   if(!v) return 0;
   if(isInt(v))
   {
      return v.toFixed(0);
   }
   else
   {
      v = v.toFixed(1);
      if(isInt(v))
      {
         return v.toFixed(0);
      }

      return v;
   }
}

function makePopupVue(popupId, containerId, param)
{
   newPopup(popupId + "_button", popupId);
   var popup_param = $.extend(param, {});
   return new Vue({
      el: "#"+ containerId,
      data: {
         form_data: popup_param
      }
   });
}
function nvl(data, def)
{
   if(data)
   {
      return data;
   }
   else
   {
      return def;
   }

}
if (!String.format) {
     String.format = function(format) {
       var args = Array.prototype.slice.call(arguments, 1);
       return format.replace(/{(\d+)}/g, function(match, number) {
         return typeof args[number] != 'undefined'
           ? args[number]
           : match
         ;
       });
     };
}


function chkMinMax(obj)
{
   var val =obj.val();
   if(obj.attr("minvalue"))
   {
      if(val<obj.attr("minvalue"))
      {
         throw String.format(msg_max_err, obj.attr("title") ,  obj.attr("minvalue"));
      }
   }
   if(obj.attr("maxvalue"))
   {
      if(val>obj.attr("maxvalue"))
      {
         throw String.format(msg_min_err, obj.attr("title") ,  obj.attr("maxvalue"));
      }
   }
}


function setButtonClickable(buttonId, clickable){
   $('#' + buttonId).prop('disabled', !clickable);
}

function setInputEnable(inputId, enabled, childrenEnabled){
   $('#' + inputId).prop('disabled', !enabled);
   if(childrenEnabled != undefined){
      $('#' + inputId).parent().find(':input, button').prop('disabled', !childrenEnabled);
   }
}

function extractKeys(mappings) {
    return Object.keys(mappings);
}
function extractValues(mappings) {
    return Object.values(mappings);
}
function lookupValue(mappings, key) {
    return mappings[key];
}

function lookupKey(mappings, name) {
    for (var key in mappings) {
        if (mappings.hasOwnProperty(key)) {
            if (name === mappings[key]) {
                return key;
            }
        }
    }
}

function autocomplete(field, url, key , title, minLength, callback )
{
   if(!minLength)  minLength = 1;
    $( field ) .on( "keydown", function( event ) {
        if ( event.keyCode === $.ui.keyCode.TAB &&
                $( this ).autocomplete().data("ui-autocomplete").menu.active ) {
              event.preventDefault();
            }
          })
      .autocomplete({
         minLength: minLength,
         delay:10,
         source: function( request, response ) {
            var url1 =  null;
            if(!(url instanceof Function))
            {
               url1=url;
            }
            else
            {
             url1  = url.call(null)  ;

            }
            $.getJSON(url1, request, function( data, status, xhr ) {

                response( data );

              });
         },
         select: function( event, ui ) {
             var obj = getVueObj($(event.target));
             if(obj && obj.name)
             {
                // obj.$set( getFormData(obj), obj.name + "_data", ui.item );
                obj.$set( getFormData(obj), obj.name, ui.item[key] );
                if(callback) callback.call(null, ui.item);
               return false;
             }
             else
             {
                $(event.target).val(ui.item[key]);
                if(callback) callback.call(null, ui.item);
                return false;
             }
         }
    }).autocomplete().data("ui-autocomplete")._renderItem = function( ul, item ) {
      return $( "<li>" )
        .append( "<div>" + item[title] + "</div>" )
        .appendTo( ul );
    };
}



function post_to_url(url, params, method) {
    method = method || "post"; // Set method to post by default, if not
								// specified.
    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", url);
    for(var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);
        form.appendChild(hiddenField);
    }
    document.body.appendChild(form);
    form.submit();
}


function arr_unique(array){
    return array.filter(function(el,index,arr){
        return index == arr.indexOf(el);
    });
}

function menuOnOff(){
   $('.nav-side-menu').toggle( "slide" );
   if($('.menuOnOff').css("left") == "0px"){
      $('.menuOnOff').animate({left: "250px"});
      $('.menu-layout-3 .main').animate({"margin-left": "250px"});
   } else{
      $('.menuOnOff').animate({left: "0px"});
      $('.menu-layout-3 .main').animate({"margin-left": "0px"});
   }


}


function openPopupById(popupId, _param, callback)
{

    eval('checked = ' + popupId + '_click(null, _param, callback)');
    if(checked){
       var new_popup = getPopup(popupId + "_button");
       if(new_popup != undefined){
          cur_popup = new_popup;
          cur_popup.targetObj = event.target;
          cur_popup.modal(this);
          try {
             eval(popupid + '_onAfterOpen();');
          } catch(e){

          }
       }
    }
}

function setCookie(cookieName, value, exdays){
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());
    document.cookie = cookieName + "=" + cookieValue;
}

function deleteCookie(cookieName){
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() - 1);
    document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
}

function getCookie(cookieName) {
    cookieName = cookieName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cookieName);
    var cookieValue = '';
    if(start != -1){
        start += cookieName.length;
        var end = cookieData.indexOf(';', start);
        if(end == -1)end = cookieData.length;
        cookieValue = cookieData.substring(start, end);
    }
    return unescape(cookieValue);
}

function drawChart(id,type,data, inputType, color, unit){
	var highChartsObj =  new Highcharts.Chart({

	    chart: {
	        renderTo: 'container_' + id,
	        type: type
        },
        title : {
           text : null
        },
        xAxis : {
           type : 'datetime',
           labels: {
               useHTML:true,// Set to true
               style:{
            	   width:'80px',
                   'min-width':'80px',
                   whiteSpace:'normal'// set to normal

               },
               step: 1,
               rotation: 45
           },
           dateTimeLabelFormats : {
				millisecond: '%Y-%m-%d %H:%M',
				second:      '%Y-%m-%d %H:%M',
				minute:      '%Y-%m-%d %H:%M',
				hour:        '%Y-%m-%d %H:%M',
				day:         '%Y-%m-%d',
				week:        '%Y-%m-%d',
				month:       '%Y-%m-%d',
				year:        '%Y-%m-%d'
           }
        },
        legend : {
           enabled : false

        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [
                        [0, '#00B4DB'],
                        [1, '#f4f4f4']
                    ]
                },
                lineWidth: 1,
                marker: {
                    enabled: false
                },
                shadow: false,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        yAxis : {
           title : {
              text : ''
           },
           labels: {
               formatter: function () {
            	   var val  = this.value;
            	   if(this.value>1024*1024*1024){
            		   val= (this.value/(1024*1024*1024)).toFixed(1) + 'G';
            	   }
            	   else if(this.value>1024*1024){
            		   val= (this.value/(1024*1024)).toFixed(1) + 'M';
            	   }
            	   else if(this.value>1024 ){
            		   val= (this.value/(1024 )).toFixed(1) + 'K';
            	   }
            	   if(unit=='%'){
            		   return (1*val * 100).toFixed(1) + '%';
            	   }
            	   else{
            		   return val + (unit?unit:'') ;
               		}
               }
           },
           plotLines : [ {
              value : 0,
              width : 1,
              color : '#808080'
           } ]
        },
        tooltip : {
           valueSuffix : ''
        },

        series : seriesData(id, data, color)
     });
	}

	function seriesData(id, data, color){
		var object = null;
		var array = new Array();
		 
		for(var d = 0 ; d < data.length ; d++){
			
			object = new Object();
			object.name = data[d][0][2];
			object.data = data[d];
			object.color;
			array.push(object);
		}
		return array;
		
	}
   function validateNumber(isPlus, val, multi){
      if(multi){
         var arr = val.split(",")
         for(var i=0; i<arr.length; i++){
            if(!isInt(arr[i]) || (1*arr[i]>0 != isPlus)){
               alert(getMessage(msg_invalid_format, val))
               return false;
            }
         }
         return true;
      }
      else{
         if(!isInt(val) || (1*val>0 != isPlus)){
            alert(getMessage(msg_invalid_format, val))
            return false;
         }
         return true;
      }
   }
	function vaildateEng_Num_H(obj){
		 var regexp = /(^[a-z0-9-]*$)/g;
		   if(regexp.test($(obj).val())){
			  return true;
		   } else{
			   alert($(obj).siblings().eq(0).html()+"에 소문자, 숫자, 하이픈 이외의 문자가 들어가 있습니다.");
			   return false;
		   }
	}
   function vaildateEng_Num(obj){
      var regexp = /(^[A-Za-z0-9]*$)/g;
      if(regexp.test($(obj).val())){
         return true;
      } else{
         alert($(obj).siblings().eq(0).html()+"에 영문, 숫자이외의 문자가 들어가 있습니다.");
         return false;
      }
   }
	function vaildateEng_Num_H_T(obj){
		   var regexp = /^[a-z][a-z0-9-]{2,}$/g;
		   if(regexp.test($(obj).val())){
			  return true;
		   } else{
			   alert($(obj).siblings().eq(0).html()+"에 다음과 같은 규칙으로 입력하셔야됩니다. \n 1. 최소 3자리 이상 입력해야합니다. \n 2. 소문자, 숫자, 하이픈만 사용 가능합니다 . \n 3. 숫자로 시작 할 수 없습니다.");
			   return false;
		   }
	}
	
	function vaildateEng_Num_H_LOGIN_ID(obj){
		 var regexp = /^[a-z0-9-]{2,}$/g;
		   if(regexp.test($(obj).val())){
			  return true;
		   } else{
			   alert($(obj).siblings().eq(0).html()+"에 다음과 같은 규칙으로 입력하셔야됩니다. \n 1. 최소 3자리 이상 입력해야합니다. \n 2. 소문자, 숫자, 하이픈만 사용 가능합니다 .");
			   return false;
		   }	      
	}
	
	function vaildate_Num_Zero(obj){
		   if($(obj).val()!=0){
			  return true;
		   } else{
			   alert($(obj).siblings().eq(0).html()+"에 다음과 같은 규칙으로 입력하셔야됩니다. \n 1. 0보다 커야 합니다.");
			   return false;
		   }	      
	}
	
	function vaildateEng_Num_H_PRJ_ID(obj){
		   var regexp = /^[a-z][a-z0-9-]{2,}$/g;
		   if(regexp.test($(obj).val())){
			  return true;
		   } else{
			   alert($(obj).siblings().eq(0).html()+"에 다음과 같은 규칙으로 입력하셔야됩니다. \n 1. 최소 3자리 이상 입력해야합니다. \n 2. 소문자, 숫자, 하이픈만 사용 가능합니다 . \n 3. 숫자로 시작 할 수 없습니다.");
			   return false;
		   }
	}
	
	function vaildateEng_Num_H_APP_CD(obj){
		   var regexp = /^[a-z][a-z0-9-]{2,}$/g;
		   if(regexp.test($(obj).val())){
			  return true;
		   } else{
			   alert($(obj).siblings().eq(0).html()+"에 다음과 같은 규칙으로 입력하셔야됩니다. \n 1. 최소 3자리 이상 입력해야합니다. \n 2. 소문자, 숫자, 하이픈만 사용 가능합니다 . \n 3. 숫자로 시작 할 수 없습니다.");
			   return false;
		   }
			   
		   
	}

	function vaildate_Num_Zero(obj){
		   if($(obj).val()!=0){
			  return true;
		   } else{
			   alert($(obj).siblings().eq(0).html()+"에 다음과 같은 규칙으로 입력하셔야됩니다. \n 1. 0보다 커야 합니다.");
			   return false;
		   }	      
	}
	
	function userInfo(){
		if($("#userInfoBtn").is(':visible')){
			$("#userInfoBtn").css("display","none");
		}else{
			$("#userTaskDetail").css("display","none");
			$("#userInfoBtn").css("display","inline-block");
			$("#userInfoBtn").css("top","65px");
		}
	}
	function userTask(){
		if($("#userTaskDetail").is(':visible')){
			$("#userTaskDetail").css("display","none");
		}else{
			var param = new Object();
			param.KUBUN = 'U';
			
			if(GRP_ADMIN_YN != 'Y'){
				post("/api/category/map/list", param, function(data){
					var html = ''
					for(var i = 0 ; i < data.list.length; i++){
						html += "<div>"+ data.list[i].CATEGORY_FULL_NM +"</div>";
					}
					
					if(data.list.length == 0){
						html += '<div style="text-align: center; margin-bottom: 10px; margin-top: 20px;"><img src="/res/img/hynix/caution.png"></div>'
						html +=	'<div style="text-align: center;"><spring:message code="no_task" text="담당업무"></spring:message></div>' 
					}
					
					$(".taskContents").html(html);
					
					$("#userInfoBtn").css("display","none");
					$("#userTaskDetail").css("display","inline-block");
					$("#userTaskDetail").css("top","65px");
					
				}, true);
			}
		}
	}
	
	
	function isNull(v) {
	    return (v === undefined || v === null) ? true : false;
	}
	
	function isNullValue(v) {
		return (v === undefined || v === null) ? '' : v;
	}
	function isNullURLValue(v) {
		return (v === undefined || v === null) ? '#' : v;
	}

	function isNullURLValue(v) {
		return (v === undefined || v === null) ? '#' : v;
	}
	
	jQuery.fn.serializeObject = function() {
		var obj = null; 
		try { 
			if(this[0].tagName && this[0].tagName.toUpperCase() == "FORM" ) { 
				var arr = this.serializeArray(); 
				if(arr){ 
					obj = {}; 
					jQuery.each(arr, function() { 
						obj[this.name] = this.value; 
					}); 
				} 
			} 
		}catch(e) { 
			alert(e.message); 
		}finally {} 
		
		return obj; 
	}
	
	var Select2Orders = function(){
		this.map={};
		this.make = function(id, placeholder){
			var select2 = new Select2Order(id, placeholder);
			this.map[id] = select2;
			return select2;
		}
		this.onShow = function(){
			  for(var key in this.map) {
				  this.map[key].init();
			  }
		}
		this.has = function(id){
			return this.map[id] != null;
		}
		this.get = function(id){
			return this.map[id];
		}
	}
	var Select2Order = function(id, placeholder){
		this.id=id;
		this.placeholder = placeholder;
		this.init = function(){ 
			$("#"+this.id).select2({ placeholder: this.placeholder, allowClear: true,	closeOnSelect : true,  templateResult: hideSelected4Select2 }); // ,
			$("#" + this.id).on("select2:unselecting", function (evt) {
				  
				  idx=1
				});
				$("#"+this.id  ).parent().find("ul.select2-selection__rendered").sortable({
			         containment: 'parent'
				})
				  
				$("#"+this.id).on("select2:select", function (evt) {
					    
					   idx=1;
					   var element = evt.params.data.element;
					   var $element = $(element);
					    
					   $element.detach();
					   $(this).append($element);
					   // $(this).trigger("change");
				});																															// templateSelection:viewResult
		}
		idx=1;
		
		 
		
	 
		function viewResult(state){
				if(state.text=='') return '';
			 	 
			    return (idx++) + '.' + state.text
		} 
		function hideSelected4Select2(value) {
			  if (value && !value.selected) {
			    return $('<span>' + value.text + '</span>');
			  }
		}
		this.val= function(){
			var myVal = [];
			var options = $('#' + this.id  + ' option');
		    $('#' + this.id  ).parent().find('li.select2-selection__choice').each(function(index) {
		        /*
				 * below we're getting the value from the 'title' attribute of
				 * the containing 'li'; might want to look and see if there's
				 * another bit of the dom you'd rather use like the actual text
				 */
		        var item = $( this ).attr('title');
		        var val = '';
		        for(var i=0; i < options.length; i++){
		        	if(options[i].text==item){
		        		val = options[i].value;
		        	}
		        }
		        myVal.push(val);
		      });
		      return myVal
		}
	}
	function removeBRP(str){
		str = str.replace(/<\/p>/g,"\n");
		str = str.replace(/<p>/g,"");
		str = str.replace(/<\/div>/g,"\n");
		str = str.replace(/<div>/g,"");
		str = str.replace(/<br>/g,"\n");
		return str;
	}
	function areaLoading(id, isHide){
		if(!isHide){
			$("#" + id).after('<div id="' + id + '_loading"   > <img src="/res/img/loading.gif" style="background-color:white"></div>');
			 
				$("#" + id + "_loading").css("position", "absolute")
				$("#" + id + "_loading").css("top", $("#" + id ).offset().top-$("#" + id ).parent().offset().top);
				$("#" + id + "_loading").css("left", $("#" + id ).offset().left-$("#" + id ).parent().offset().left);
				$("#" + id + "_loading").css("width", $("#" + id ).css("width"));
				$("#" + id + "_loading").css("height", $("#" + id ).css("height"));
				$("#" + id + "_loading").css("line-height", $("#" + id ).css("height"));
				$("#" + id + "_loading").css("z-index","999999");
				$("#" + id + "_loading").css("text-align","center");
				$("#" + id + "_loading").css("vertical-align","middle");
				$("#" + id + "_loading").css("background-color","rgba(200, 200, 200, 0.5)");
   
		}
		else{
		 
			$("#" + id + "_loading").remove();
	        
		}
	
	}
	
	
	function FMconfirm(message,  okAction, cancelAction, title){
		 if(!title){
		    	title=msg_confirm
		    }
		   
		    
		    $(document.createElement('div'))
		        .attr({title: title, 'class': 'confirm'})
		        .html(message)
		        .dialog({
		            buttons: {OK: function(){$(this).dialog('close'); okAction.call(null)}, Cancel:  function(){$(this).dialog('close'); if(cancelAction){cancelAction.call(null)}}},
		            close:function(){$(this).remove();},
		            draggable: true,
		            modal: true,
		            resizable: false,
		            width: 'auto',
		            minWidth: '140px'
		        });
		
	}
	function FMAlert(message, title, oklabel, okAction , width, height){
			    if(!title){
			    	try
			    	{
			    		title=msg_jsf_notifications 
			    	}
			    	catch(e){
			    		title = "Alert"
			    	}
			    }
			    if(width == null)
			    	width = defaultWidth;
			    if(height == null)
			    	height = defaultHeight;
			    
			   
			    $(document.createElement('div'))
			        .attr({title: title, 'class': 'alert alertStyle'})
			        .html(message)
			        .dialog({
			            buttons: {OK: function(){$(this).dialog('close'); if(okAction){okAction.call(null);}}},
			            close:function(){$(this).remove();},
			            draggable: true,
			            modal: true,
			            resizable: false,
			            width: width,
			            height: height,
			            open: function( event, ui ) {
			            	var element = $('.ui-dialog-titlebar');
			            	element.removeClass();
			 			    element.addClass("modal-header");
			 			    var element2 = $('.ui-dialog-titlebar-close');
			            	element2.removeClass();
			 			    element2.addClass("close");
			 			    var element3 = $('.ui-dialog-title');
			            	element3.removeClass();
			 			    element3.addClass("header-title");
				        	if(oklabel){
				        		$(".alert").parent().parent().find(".ui-dialog-buttonset button").text(oklabel);
				        		$(".alert").parent().parent().find(".ui-dialog-buttonset button").addClass("btn contentsBtn popupBtn save top5");
				        	}
				        }
			        });
			        
			
	} 
	function obj2array(obj, iskey){
 		var result = [];
 		Object.keys(obj).forEach(function(key){
 			if(iskey){
 				result.push(key);
 			}
 			else{
 				result.push(obj[key]);
 			}
 		});
 		return result;
 	}
	function putAll(src, target){
		Object.keys(target).forEach(function(key){
			src[key] = target[key];
		});
	}
	function removeOptionNotExist(id, startPos, arr){
		var options = $("#" + id + " option");
		for(var i=startPos ; i < options.length; i++){
			if(arr.indexOf($(options[i]).val())<0){
				$(options[i]).remove();
			}
		}
		$("#" + id ).trigger("change");
	}
	
	function array_sort(arr, field, isDesc){
		arr = arr.sort(function(a, b) { // 오름차순
			if(isDesc){
				try{
					return parseInt(b[field]) - parseInt(a[field])
				}
				catch(e){
					return a[field] > b[field] ? -1 : a[field] < b[field] ? 1 : 0;
				}
			}
			else{
				try{
					return parseInt(a[field]) - parseInt(b[field])
				}
				catch(e){
					return a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
				}
			}
			
		    
		});
		return arr; 
	}
	 
	
	function checkTrueAndFalse(arr){
		if(arr.length > 1)
			return true;
		else
			return false;	
}
	function replaceAll(str, searchStr, replaceStr) {

		   return str.split(searchStr).join(replaceStr);
		}


	var entityMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;', '`': '&#x60;', '=': '&#x3D;', '-' : '	&ndash;' }; 
	
	function escapeHtml (string) {
		if(string){
			for(key in entityMap){
				string = replaceAll(string, entityMap[key] ,key);
			}
			return string;
		}
	}

	function getDatePicker(paramFmt) {
	    var _this = this;
	    _this.fmt = "yy-mm-dd";
	    if(paramFmt){
	        _this.fmt = paramFmt;
	    }
	    // function to act as a class
	    function Datepicker() {}
	 
	    // gets called once before the renderer is used
	    Datepicker.prototype.init = function(params) {
	        // create the cell
	        this.eInput = document.createElement('input');
	        this.eInput.value = params.value;
	 
	        // https://jqueryui.com/datepicker/
	        $(this.eInput).datepicker({
	            dateFormat: _this.fmt
	        });
	    };
	 
	    // gets called once when grid ready to insert the element
	    Datepicker.prototype.getGui = function() {
	        return this.eInput;
	    };
	 
	    // focus and select can be done after the gui is attached
	    Datepicker.prototype.afterGuiAttached = function() {
	        this.eInput.focus();
	        this.eInput.select();
	    };
	 
	    // returns the new value after editing
	    Datepicker.prototype.getValue = function() {
	        return this.eInput.value;
	    };
	 
	    // any cleanup we need to be done here
	    Datepicker.prototype.destroy = function() {
	        // but this example is simple, no cleanup, we could
	        // even leave this method out as it's optional
	    };
	 
	    // if true, then this editor will appear in a popup
	    Datepicker.prototype.isPopup = function() {
	        // and we could leave this method out also, false is the default
	        return false;
	    };
	 
	    return Datepicker;
	}
	function numberPad(n, width) {
	    n = n + '';
	    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
	}
	function preventEnter(event){
       if (event.keyCode === 13) {
          event.preventDefault();
          return false;
       }
       return true;
    }
	function getNumericCellEditor() {
		  function isCharNumeric(charStr) {
		    return !!/\d/.test(charStr);
		  }

		  function isKeyPressedNumeric(event) {
		    var charCode = getCharCodeFromEvent(event);
		    var charStr = String.fromCharCode(charCode);
		    return isCharNumeric(charStr);
		  }

		  function getCharCodeFromEvent(event) {
		    event = event || window.event;
		    return typeof event.which === 'undefined' ? event.keyCode : event.which;
		  }

		  // function to act as a class
		  function NumericCellEditor() {}

		  // gets called once before the renderer is used
		  NumericCellEditor.prototype.init = function(params) {
		    // we only want to highlight this cell if it started the edit, it is possible
		    // another cell in this row started the edit
		    this.focusAfterAttached = params.cellStartedEdit;

		    // create the cell
		    this.eInput = document.createElement('input');
		    this.eInput.style.width = '100%';
		    this.eInput.style.height = '100%';
		    this.eInput.value = isCharNumeric(params.charPress)
		      ? params.charPress
		      : params.value;

		    var that = this;
		    this.eInput.addEventListener('keypress', function(event) {
		      if (!isKeyPressedNumeric(event)) {
		        that.eInput.focus();
		        if (event.preventDefault) event.preventDefault();
		      }
		    });
		  };

		  // gets called once when grid ready to insert the element
		  NumericCellEditor.prototype.getGui = function() {
		    return this.eInput;
		  };

		  // focus and select can be done after the gui is attached
		  NumericCellEditor.prototype.afterGuiAttached = function() {
		    // only focus after attached if this cell started the edit
		    if (this.focusAfterAttached) {
		      this.eInput.focus();
		      this.eInput.select();
		    }
		  };

		  // returns the new value after editing
		  NumericCellEditor.prototype.isCancelBeforeStart = function() {
		    return this.cancelBeforeStart;
		  };

		  // example - will reject the number if it contains the value 007
		  // - not very practical, but demonstrates the method.
		  NumericCellEditor.prototype.isCancelAfterEnd = function() {};

		  // returns the new value after editing
		  NumericCellEditor.prototype.getValue = function() {
		    return this.eInput.value;
		  };

		  // when we tab onto this editor, we want to focus the contents
		  NumericCellEditor.prototype.focusIn = function() {
		    var eInput = this.getGui();
		    eInput.focus();
		    eInput.select();
		     
		  };

		  // when we tab out of the editor, this gets called
		  NumericCellEditor.prototype.focusOut = function() {
		    // but we don't care, we just want to print it for demo purposes
		     
		  };

		  return NumericCellEditor;
		}

	function inputNumber(that){
		that.value = that.value.replace(/[^0-9.]/g, '').replace(/(\.*)\./g, '$1');
	}
	function getEtcValue  (id, key){
		var sel = $("#" +  id + " option:selected")
		
		if(sel && sel.length>0){
			 
				var result = "";
				for(var i=0; i < sel.length; i++){
					if(i>0){
						result += ",";
					}
					result += sel[i].data[key];
				}
				return result;
			 
			
		}
		return null;
	}
	function getFirstVal(val){
		if(val instanceof Array ){
			if(  val.length>0){
				return val[0];
			}
			else{
				return null;
			}
		}
		else {
			return val;
		}
	}
	function toObj(id){
		var inputs = $(  id ).find("input,select");
		var obj = {};
		for(var i=0; i < inputs.length; i++){
			obj[$(inputs[i]).attr("name")] = $(inputs[i]).val();
		}
		return obj;
	}
	function addDate(date, addNum){
		var kubun = addNum.substring(  addNum.length-1,  addNum.length);
		var num = 1* addNum.substring(0, addNum.length-1);
		if(kubun == 'd'  ){
			date.setDate(date.getDate()+num);
		}
		else if(kubun == 'm'  ){
			date.addMonths( num);
		}
		if(kubun == 'y'  ){
			date.setYear(date.getYear()+num);
		}
		return date;
	}
	
	Date.isLeapYear = function (year) { 
	    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
	};

	Date.getDaysInMonth = function (year, month) {
	    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
	};

	Date.prototype.isLeapYear = function () { 
	    return Date.isLeapYear(this.getFullYear()); 
	};

	Date.prototype.getDaysInMonth = function () { 
	    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
	};

	Date.prototype.addMonths = function (value) {
	    var n = this.getDate();
	    this.setDate(1);
	    this.setMonth(this.getMonth() + value);
	    this.setDate(Math.min(n, this.getDaysInMonth()));
	    return this;
	};
	function StringRandom(num){
		var arr = window.crypto.getRandomValues(new Uint32Array(20))
		var html = '';
		for(var i = 0 ; i < arr.length; i++){
			html += arr[i].toString(36).replace(/[^a-z]+/g, '');
		}
		
		return html.substring(0,num);
		
	}
	
	function HangeulAndEnglishAndNumberSpaceVaildate(obj){
		var regexp = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9 ]*$/g;
		if(regexp.test($(obj).val())){
			return true;
		} else{
			alert($(obj).siblings().eq(0).html()+"에 특수문자를 사용할 수 없습니다. 다시 한번 확인해주세요.");
			return false;
		}
			
	}
	
function convertLocalDateTime(date){
	   //{"month":"FEBRUARY","year":2022,"dayOfMonth":24,"hour":7,"minute":0,"monthValue":2,"nano":0,"second":0,"dayOfWeek":"THURSDAY","dayOfYear":55,"chronology":{"id":"ISO","calendarType":"iso8601"}}
   return date.year + "-" + (""+date.monthValue).lpad(2,'0') + "-" + ("" + date.dayOfMonth).lpad(2,'0') + " " + (""+date.hour).lpad(2,'0')
       + ":" + ("" + date.minute).lpad(2,'0') + ":" + (""+date.second).lpad(2,'0');
}


// Tag 관련 함수
function onChangeTag(that) {
   var selectHeight = $(that).next().css("height");
   $(that).prev().css({"height": selectHeight, "min-height":"43px"});
}

function setTag(id, addable, titleField, data) {
   createDynamicSelect2ByTag('/api/tag/selectTagList', id, true, titleField);
}

function createDynamicSelect2ByTag(url, id, addable, field, selectedData) {
   post(url, null, function (data) {
      var value = [];
      if(data.length) {
         fillOptionByData(id, data, null, field, field);
      }

      $("#"+id).select2({multiple: true, tags: addable, tokenSeparators: [',', ' ']});

      if(selectedData) {
         value = selectedData;
      }
      $("#"+id).val(value).trigger('change');
   })
}

function createAjaxSelect2ByUser(id, multiple) {
   $("#"+id).select2({
      multiple:multiple,
      minimumInputLength: 1,
      ajax: {
         type: "POST",
         url: '/api/code_list?grp=dblist.com.clovirsm.common.Component.list_UserAndTeamForNC',
         dataType: 'json',
         data: function (state) {
            return {keyword:state.term};
         },
         processResults: function (data) {
            return {
               results: $.map(data, function (item) {
                  if(item.id == 0) item.id = "0";
                  return item;
               })
            };
         },
         error: function (error) {

         }
      }
   });
}

function createAjaxSelect2(id, url, param, keyField, textField, multiple) {
   $("#"+id).select2({
      multiple:multiple,
      minimumInputLength: 1,
      ajax: {
         type: "POST",
         url: url,
         dataType: 'json',
         data: function (state) {
            param.keyword = state.term;
            return param;
         },
         processResults: function (data) {
            return {
               results: $.map(data, function (item) {
                  var text = ((item[keyField] == item[textField]) ? '#' : '')+item[textField];
                  return {
                     id: item[keyField],
                     text:text
                  }
               })
            };
         }
         ,error:function (error) {

         }
      }
   });
}
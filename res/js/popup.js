var popupMap = new Object();
function newPopup(id, popupId, model)
{
	if(!popupId) popupId = id;
	var p = new popup(id, popupId, model);
	popupMap[id] = p;
	return p;
}
function getPopup(popupId){
	return popupMap[popupId];
}
function setPopupReturnVal(obj  )
{
	cur_popup.setReturnVal(obj );
}

var cur_popup;
function resetPopupReturnVal(obj, targetvue)
{
	var new_popup = getPopup(targetvue.id);
	if(new_popup != undefined){
		cur_popup = new_popup;
		cur_popup.targetvue = targetvue;
		var resetVal = {};
		for(key in cur_popup.mappingInfo){
			var isOK=true;
			for(key1 in cur_popup.inputInfo)
			{
				 if(cur_popup.inputInfo[key1]==cur_popup.mappingInfo[key])
				 {
					isOK=false;
					break;
				 };
			}
			if(isOK)
			{
				targetvue.$set(getFormData(targetvue),cur_popup.mappingInfo[key], "");
			}

		}

	}
}
function openPopupByUrl(id, url){
	$.ajax({
		url: url,
		dataType: 'html',
		async: false,
		success: function (data) {
			$("#popup_area ." + id).remove();
			$("#popup_area").append("<div class=\'" + id + "'></div>");
			$(data).appendTo($('#popup_area .' + id));
			$('.modal-dialog').draggable({
				handle: ".modal-header",
				containment: "window"
			});

		}
	}).fail(function(jqXHR){
		processError(false, jqXHR )
	});
}
function clickOpenPopup(obj, targetvue, id){
	var new_popup = getPopup( !id ? targetvue.id : id );

	if(new_popup != undefined){
		cur_popup = new_popup;
		cur_popup.targetObj = obj;
		cur_popup.search(targetvue);
	}
}

var popup = function( id, popupId)
{
	this.id = id;
	this.popupId = popupId;
	this.targetObj;
	this.setMapping = function( mappingInfo1 )
	{
		this.mappingInfo = mappingInfo1;
	}
	this.setInputInfo = function( setInputInfo1 )
	{
		this.inputInfo = setInputInfo1;
	}
	this.setInputVal = function( inputVal1 )
	{
		this.inputVal = inputVal1;
	}
	this.setReturnVal = function(  obj )
	{
		for(key in this.mappingInfo){
			 var key2 = this.mappingInfo[key];
			 this.targetvue.$set(getFormData(this.targetvue),key2, obj[key]);
		}

		try
		{
			this.onClosePopup.call(this, obj);
		}
		catch(e)
		{}

		if(!this.multi )
		{
			$('#' + this.popupId).modal('hide');
		}
	}
	this.isOpened = false;
	this.doSearch = function()
	{
		 
		var that = this;
		var url = $("#" + this.popupId + "_form" ).attr("action");
		if(!url || url==null)
		{
			url = "/api/popup_list";
		}
		else if(url == "none")
		{
			$("#"+ that.popupId).modal();
			return;
		}
		post(url, $("#" + this.popupId + "_form" ).serialize(),
				function(data){
					if(! that.isOpened )
					{
						if(data && data.total==1 && that.targetObj && that.targetObj.tagName == 'INPUT')
						{
							that.setReturnVal(data.list[0]);
						}
						else
						{

							$("#"+ that.popupId).modal();
							$("#"+ that.popupId).find("input:text")[0].focus();
							try
							{
								eval("onAfterSearch_" + that.popupId + "(data)");
							}
							catch(e){
								eval( that.popupId + "_grid1.setData(data)");
							}
							this.isOpened = true;
						}
					}
					else
					{
						// TODO grid 그리기
					}
				});

	}
	this.search = function(targetvue)
	{
		this.targetvue = targetvue;
		this.isOpened = false;
		for(key in this.inputInfo){
			var key2 = this.inputInfo[key];
			popupvue.$set(popup_search_data, key, getFormData(targetvue)[key2]);
		}

		if(this.inputVal != null){
			for(key in this.inputVal){
				var val = this.inputVal[key];
				popupvue.$set(popup_search_data,key, val);

			}
		}
		var that = this;
		setTimeout(function(){that.doSearch()},5)


	}

	this.modal = function(targetvue){
		this.targetvue = targetvue;
		this.isOpened = false;
		$("#"+ this.popupId).modal();
	}
}
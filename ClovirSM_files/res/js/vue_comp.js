
Vue.component('fm-date-from-to',
{
  props: ['id', 'start_dt', 'finish_dt','title', 'kubunYn', 'kubun'],

  created : function(){
	
	 if(!this.start_dt){ 
		 this.start_dt = this.id+"_FROM"
	 }
	 if(!this.finish_dt){ 
		 this.finish_dt = this.id+"_TO"
	 }
	 var data = getFormData(this);
	 this.setStartData(data[this.start_dt]);
	 this.setFinishData( data[this.finish_dt] );

  },
  methods:{

	beforeSubmit : function ( )
	{
		var data = getFormData(this)

		if(this.kubun == 'D')
		{
			if($("#"+this.start_dt).val())
				data[this.start_dt] = $("#"+this.start_dt).val().replace(/-/gi, '') + '000000';
			if($("#"+this.finish_dt).val())
				data[this.finish_dt] = $("#"+this.finish_dt).val().replace(/-/gi, '') + '235959';
			
		}
		else if(this.kubun == 'M')
		{
			data[this.start_dt] = data[this.start_yy_id] +''+ data[this.start_mm_id] + "01000000" ;
			data[this.finish_dt] = data[this.finish_yy_id] +''+ data[this.finish_mm_id] + "31235959";
		}
		else if(this.kubun == 'H')
		{
			data[this.start_dt] = data[this.dt_id].replace(/-/gi, '') +''+ data[this.start_hh_id] +  "0000" ;
			data[this.finish_dt] =data[this.dt_id].replace(/-/gi, '') +''+ data[this.finish_hh_id] +  "5959";
		}
		if(data[this.start_dt] != '' && data[this.finish_dt] != '' && data[this.start_dt]>data[this.finish_dt])
		{
			alert(msg_start_dt_over_end_dt);
			return false;
		}
		return true;
	} ,
	setStartData : function(start_dt )
	{
		 
		  var s_mm,s_yy,s_dd,s_hh='00';
		  var f_mm,f_yy,f_dd,f_hh='23';
		  var today = new Date();
		  if(start_dt  )
		  {
			  s_yy = data[this.start_dt].substring(0,4);
			  s_mm = data[this.start_dt].substring(4,6);
			  s_dd = data[this.start_dt].substring(6,8);
			  s_hh=  data[this.start_dt].substring(8,10);
			  data[this.start_dt_id] = s_yy+ "-" + s_mm +   "-" + s_dd;

			  data[this.start_yy_id] = s_yy;
			  data[this.start_mm_id] = s_mm;
			  data[this.start_hh_id] = s_hh;
		  }
		 
		 

 
	},
	setFinishData : function(  finish_dt)
	{
		 
		  var s_mm,s_yy,s_dd,s_hh='00';
		  var f_mm,f_yy,f_dd,f_hh='23';
		  var today = new Date();
		 
		  if(finish_dt)
		  {
			  f_yy =  data[this.finish_dt].substring(0,4);
			  f_mm =  data[this.finish_dt].substring(4,6);
			  f_dd =  data[this.finish_dt].substring(6,8);
			  f_hh =  data[this.finish_dt].substring(8,10);
			  data[this.finish_dt_id] = f_yy+ "-" + f_mm +   "-" + f_dd;
			  data[this.finish_yy_id] = f_yy;
			  data[this.finish_mm_id] = f_mm;
			  data[this.finish_hh_id] = f_hh;
		  }
		  
		  
		
	}

  },
  computed:{
	  start_dt_id : function(){ return this.id + "_FROM"; },
	  dt_id : function(){ return this.id + "_dt"; },
	  kubun_id : function(){ return  this.id + "_kubun"; },
	  finish_dt_id : function(){ return  this.id + "_TO"; },
	  start_yy_id : function(){ return this.id + "_start_yy"; },
	  start_mm_id : function(){ return this.id + "_start_mm"; },
	  finish_yy_id : function(){ return this.id + "_finish_yy"; },
	  finish_mm_id : function(){ return this.id + "_finish_mm"; },
	  finish_hh_id : function(){ return this.id + "_finish_hh"; },
	  start_hh_id : function(){ return this.id + "_start_hh"; },
	  kubun : function()
	  {
			var val = getFormData(this)[this.kubun_id] ;
			if(!val){
				getFormData(this)[this.kubun_id]="D";
				return "D";
			}
			else{

				return val;
			}
	  }

  },
  template: '#date-fromto-template'
})
Vue.component('fm-modal',
{
  props: ['id', 'title','cmd','bodyClass','dialogClass'],
  template: '#modal-template'
})
Vue.component('fm-sbutton',
{
  props: ['cmd', 'className', 'id', 'onclick', 'style'],
  template: '<button type="button" :id="id" class="btn btn-primary" :class="className" :style="style" :onclick="onclick" :disabled="disabled" :data-disabled="disabled" ><slot></slot></button>',
  computed :
	{
	  disabled : function()
	  {
		  return !accessInfo[this.cmd]
	  }
	}
})
 
Vue.component('fm-multi-select', {
  props: ['id','name','title','url',  'keyfield', 'titlefield', 'emptystr',  'parfield', 'rootdata', 'label_style', 'selectcmd' , 'callback' ],
  
  methods :
	{
	  	getEtcValue : function(key){
	  		 var data = getFormData(this)[this.name];
	  		for(var i=0; i < this.allMap.length; i++){
	  			if(this.allMap[i][this.keyfield]==data){
	  				return this.allMap[i][key];
	  			}
	  		}
	  		return null;
	  	},
	  	getNotEmptyValue: function(){
	  		var sels = $("#" + this.id).find("select");
	  		
	  		for(var i=0; i < sels.length; i++){
	  			
	  			var data = $(sels[sels.length-i-1]).val();
	  			if(data != ''){
	  				return data;
	  			}
	  		}
	  		 
	  	},
		setVal : function(event){
		

		},
		goNextSelect : function(event){
			var obj = $(event.target)
			var val = obj.val();
			this.makeSelect(1+1*obj.attr("data-index"), val);
			//setFormDataValue(this, $(obj).parent().find("select:last").val());
		},
		setVals: function(vals){
			this.makeSelect(1, vals[0], vals);
			 
		},
		makeSelect : function(idx, parentData, defaultVals){
		
			var count = this.selectdata.length;
			for(var i= idx; i<count; i++){
				this.selectdata.splice(idx, 1)
			}
			if(parentData=='') return;
			var sel=[];
			var initRow = 0;
			var that = this;
			var firstData = null;
			if(defaultVals && idx< defaultVals.length){
				if(idx==1){
					 this.selectdata[0].forEach(function (item, index, array) {
						 if(defaultVals[0] == item.value){
							 item.selected = true;
						 }
						 else{
							 item.selected = false;
						 }
					 });
				}
				firstData=defaultVals[idx ];
			}
			else if( this.selectdata.length>=idx){
				 this.selectdata[idx-1].forEach(function (item, index, array) {
					 
					 if(parentData == item.value){
						 item.selected = true;
					 }
					 else{
						 item.selected = false;
					 }
					  
				 });
			}
			
			for(var i=0; i < this.allMap.length; i++){
				//that.allMap[data[i][that.keyfield]] = data[i];
				
				if(this.allMap[i][this.parfield]==parentData){
					if(firstData == null){
						firstData = this.allMap[i][this.keyfield];
					}
					var data1 = {'value':this.allMap[i][this.keyfield], 'title': this.allMap[i][this.titlefield] };
					if(firstData == this.allMap[i][this.keyfield]){
						data1.selected = true;
					}
					if(this.emptystr){ 
						if(sel.length==0){
							sel.push({value:'', 'title':this.emptystr});
						}
					}
					sel.push(data1)
					 
				}
			}
			if(sel.length>initRow){	
				this.selectdata.push(sel);
				this.makeSelect(idx+1, firstData);
			} else {
				setFormDataValue(this, parentData);
			}
		}
	},
	data:function(){
		return {selectdata:[]}
	} ,
	computed :
	{

	  value : function(){
		  return getFormDataValue(this);

	  }
	},
	created:function(){
		//this.selectdata = [];
	},
	mounted: function(){

	  if(this.url)
	  {
		//this.selectdata = [];
		var that   = this;
		$.ajax(  {type: 'GET',
	               url: this.url,
	               async: false,
	               success: function(data) {
	            	   that.allMap =  data;
	                    if(data != null) {
	                    	if(that.callback){
	                    		eval(that.callback + "(that)");
	                    	} 
	                    	that.makeSelect(1, that.rootdata)
	                    	
	                    	
	                    }
	               }
		});
		
	  }


  },
  template: '\
	  <div :id="id"><label class="control-label grid-title value-title" v-if="title" :style="label_style" >{{title}}</label>\
	  <div class="input-group" style="display: inline; position: absolute; top: 10px; margin-left: 6px;"><select style="width:auto" :class="selectcmd" v-for="(sel, index) in selectdata" v-on:change="goNextSelect" :data-index="index"><option v-for="opt in sel" :selected="opt.selected"  :value="opt.value">{{opt.title}}</option></select></div>\
	  </div>'
})
Vue.component('fm-tree',
{
  props: ['id', 'url', 'field_config', 'dnd', 'callback', 'param', 'notusedsearch', 'refresh'],
  template: "<div><div class='tree-btn-group' :data-id='id'><a v-if='notusedsearch === undefined' href='#' :onclick='click'><i class='fa fa-search'></i></a> <a href='#' :onclick='expandAll'><i class='fa fa-plus-square-o'></i></a> <a href='#' :onclick='closeAll'><i class='fa fa-minus-square-o'></id></a> <a v-if='refresh' href='#'><i class='fa fa-rotate-right tree_reload' :data-url='url'></i></a></div><div :id='id'></div></div>" ,
  created: function(){
	  if(this.url)
	  {
		  getTreeData(this);

	  }
  },
  computed :{
	  click:function()
	  {
		  return "searchTree('" + this.id + "');return false";
	  },
	  expandAll : function()
	  {
		  return "expandAllTree('" + this.id + "');return false";
	  }
	  ,
	  closeAll : function()
	  {
		  return "closeAllTree('" + this.id + "');return false";
	  }
	},
  methods : {
	  reload : function()
	  {
		  reloadTreeData(this);
	  },



  }

})
Vue.component('fm-date', {
  props: ['id','name','title','has_time','disabled','div_style','label_style','input_style','className'],
  methods :
  	{
		setVal : function(event)
		{
			if(event instanceof Object)
			{
				setFormDataValue(this, event.target.value);
			}
			else
			{
				setFormDataValue(this, event);
			}

		},
	  	beforeSubmit : function ( )
		{

	  		var val = this.value.replace(/-/gi, '');;
	  		val = val.replace(/:/gi, '');
	  		val = val.replace(' ', '');
	  		getFormData(this)[this.name]= val;
	  		return true;
		}

  	},
  computed :
	{
		divStyle: function (){
			if(this.div_style){
				return this.div_style;
			}
			else{
				return "width:120px;";
			}
		},
	  value : function(){
		  var val =  getFormDataValue(this);
		  if(val && val != null && val.indexOf("-")<0)
		  {
			  if(this.className == 'dateTimeInput'){
					return formatDate(val,'datetime').slice(0,16);

			  }else{
					return formatDate(val,'date');

			  }
		  }
		  else
		  {
			return val;
		  }
	  },
	  className :function()
	  {
		  if(this.has_time)
		  {
			return "dateTimeInput";
		  }
		  else
		  {
			  return "dateInput";
		  }
	  }
	},

  mounted : function() {
      var that = this;

      if(this.has_time==undefined)
      {
    	  this.has_time=false;
      }

      that.format = that.has_time?'YYYY-MM-DD HH:mm':'YYYY-MM-DD';
      if(this.id=="S_RSV_DT"){
          $("#" + this.id).datetimepicker({
        	  keepOpen:false, language : 'ko', pickTime : that.has_time,format:that.format,minDate : new Date()
          		}).on("dp.change",function(e){	
          			var formatedValue = e.date.format(that.format);
         			setFormDataValue(that,  formatedValue);
         		});
      }else{
          $("#" + this.id).datetimepicker({
			    language : 'ko', pickTime : that.has_time,format:that.format
          		}).on("dp.change",function(e){
          			var formatedValue = e.date.format(that.format);
         			setFormDataValue(that,  formatedValue);
         		});
      }

    },
  template: '\
	  <span>\
	  <label class="control-label value-title grid-title" v-if="title" :for="id" :style="label_style">{{title}}</label>\
		<div class="input-group"      :style="divStyle" :class="{hastitle:title}">\
			<input :disabled="disabled" type="text" style="min-width: 90px;"  :value="value" @input="setVal" :name="name" :id="id"\
				class="form-control " readonly :class="className" :style="input_style" >\
			<span class="input-group-addon calendar-btn"><i\
				class="icon-append fa fa-calendar"></i></span>\
		</div>\
	</span>'
})
Vue.component('fm-time', {
	props: ['id','name','title','div_style','label_style','select_style','className', 'value'],
	data : function() {
	 return {
				hours : [],
				minutes : []
			}
	},
	mounted : function() {
		console.log(this);
			for(var i = 0 ; i < 24 ; i++){
				this.hours.push(numberPad(i,2));
			}
			for(var i = 0 ; i < 60 ; i++){
				this.minutes.push(numberPad(i,2));
			}
	},
	template: '\
		<span>\
		<label class="control-label value-title grid-title" v-if="title" :for="id" :style="label_style">{{title}}</label>\
		<div style="display: inline; color: #898989; margin-right: 10px;" class="calendar" v-if="value">{{value}}</div>\
		<div class="input-group" v-if="div_style" :style="div_style" :class="{hastitle:title}">\
		<select style="width:auto" :id="id" :name="name" :class="select_style"><option v-for="h in hours">{{h}}</option></select>\
		<span>시</span>\
		<select style="width:auto" :class="select_style"><option v-for="m in minutes">{{m}}</option></select>\
		<span>분</span>\
		</div>\
		</span>'
})
Vue.component('fm-popup', {
  props: ['id','name', 'title', 'input_div_class', 'btn_class', 'disabled', 'label_style','input_style'],
  computed :
  {
	  form_data : function(){
		  return getFormData(this);

	  }
  },
  methods:{
	 openPopup : function(event)
	 {
		 if(event.target.tagName != 'BUTTON')
		 {
			if(event.target.value == '')
			{
				this.resetVal(event);
				return;
			}
		 }
		 try {
			 eval(this.id + '_onAfterOpen();');
		 } catch(e){console.log(this.id + '_onAfterOpen() not found')}
		 clickOpenPopup(event.target, this);

		 return false;


	 },
	 resetVal : function(event)
	 {
		 resetPopupReturnVal(event.target, this);
	 },
	 setVal : function(event)
	 {
		 setFormDataValue(this, event.target.value);

	 }
  }	,
  template: '\
	  <div>\
	  	<label class="control-label input-group-title grid-title value-title" v-if="title" :for="id" :style="label_style">{{title}}</label>\
	  	<div class="input-group">\
	  		<input type="text" :value="$parent.form_data[name]" @input="setVal" :name="name" :style="input_style" :id="id"\ class="form-control" :class="{hastitle:title}" @change="openPopup" disabled="disabled">\
	  		<div class="input-group-btn" :class="input_div_class">\
	  			<button class="btn" type="button"  :class="btn_class" @click.stop="openPopup">\
	  				<i class="fa fa-search"></i>\
	  			</button>\
	  		</div>\
	  	</div>\
	  </div>'
})
Vue.component('fm-popup-button', {
  props: ['name', 'title', 'cmd', 'popupid', 'popup', 'param', 'callback', 'popup_title', 'tooltip', 'action', 'action_title'],
  computed :
  {	 
	   disabled : function()
	   {
			  return !accessInfo[this.cmd]
	   },
		 
	  value : function(){
		  return eval(this.param);
	  },
	  id : function()
	  {
		  return this.popupid + "_button";
	  },
	  popup_url : function()
	  {
		  if(this.popup.indexOf('?') > -1) {
			  return this.popup + "&popupid=" + this.popupid;
		  } else {
			  return this.popup + "?popupid=" + this.popupid;
		  }
	  }
  },
  methods:{
	 openPopup : function(event)
	 {
		 var _this = this;
		 var isContinue = true;
		 try {
			 console.log(this.popup_title);
			 eval('isContinue = ' + this.popupid + '_onBeforeOpen();');
		 } catch(e){

		 }
		 if(isContinue == false) { return false; }
		  $.ajax({
			  url: this.popup_url,
			  dataType: 'html',
			  async: false,
			  success: function(data){
				  
				  $('#' + _this.popupid).remove();
				  
				  $(data).appendTo($('#popup_area'));
				  if(_this.popup_title) $('#' + _this.popupid + '_title').text(_this.popup_title);
				  if(_this.action) {
					  _this.action = eval(_this.action);
					  $('#' + _this.popupid + '_actionArea').show();
					  if(_this.action_title) {
						  $('#' + _this.popupid + '_action_button').val(_this.action_title);
					  }
				  }
				  $('.modal-dialog').draggable({
					  handle: ".modal-header",
					  containment: "window"
				  });
				  if(_this.callback) $(data).attr('callback', _this.callback);
			  }
		  }).fail(function(jqXHR){
			  processError(false, jqXHR )
		  });
		 var _param = eval(this.param);
		 var checked = false;
		 console.log(this.param , _param);
		 eval('checked = ' + this.popupid + '_click(this, _param, this.callback)');
		 if(checked){
			 var new_popup = getPopup(this.id);
			 if(new_popup != undefined){
				 cur_popup = new_popup;
				 cur_popup.targetObj = event.target;
				 cur_popup.modal(this);
				 try {
					 initForm();
					 eval(this.popupid + '_onAfterOpen();');
				 } catch(e){

				 }
			 }
		 }
		 return false;
	 }
  },
  mounted: function(){
	 
  },
  template: '<button type="button" class="btn btn-primary fm-popup-button" :title="tooltip" :class="cmd" @click.stop="openPopup" :id="id" ><slot></slot></button>'
})
Vue.component('fm-ibutton', {
  props: ['id','name', 'title', 'callback', 'param', 'disabled', 'tooltip', 'div_style', 'onchange','input_div_class','btn_class'],
  computed :
  {
	  value : function(){
		  return getFormDataValue(this);
	  }
  },
  mounted: function(){
	  $('#' + this.id).parent().find('.fm-popup-button').hide();



  },
  methods:{
	  trigger: function(e){
		  if(this.disabled) return false;
		  if(e.type =='click'|| (e.type == 'keyup' && e.keyCode && e.keyCode == 13)){
			  if(this.link) $('#' + this.link).val( $('#' + this.id).val());
			  if(this.target){
				  $('#' + this.target+ "_button").trigger('click.stop');
				  return false;
			  } else if(this.callback) {
				  var callback = this.callback;
				  if(this.param) callback += "(" + this.param + ")";
				  else callback += "(e)";
				  eval(callback);
			  } else {
				  if($('#' + this.id).parent().find('.fm-popup-button').length > 0){
					  $('#' + this.id).parent().find('.fm-popup-button').trigger('click.stop');
				  }
			  }
		  }
	  }
  }	,
  template: '\
	  	<div class="input-popup" :class="{hastitle:title}">\
	  		<label class="control-label input-group-title grid-title value-title" v-if="title" :for="id">{{title}}</label>\
		  	<div class="input-group input" :style="div_style">\
		  		<input :disabled="disabled" type="text" :name="name" :title="tooltip"  readonly :id="id"\ class="form-control input" :class="{hastitle:title}" @keyup.stop="trigger" :value="value" :onchange="onchange"   />\
			  	<div class="input-group-btn" :class="input_div_class">\
			  		<button :disabled="disabled"  class="btn" type="button" @click.stop="trigger" :class="btn_class"  style="margin-left: -3px;">\
			  			<i class="fa fa-search"></i>\
			  		</button>\
			  	</div>\
	  			<slot></slot>\
		  	</div>\
	  	</div>'
});
Vue.component('fm-select', {
  props: ['id','name','title','url', 'emptystr', 'options', 'keyfield','titlefield', 'callback', 'select_style', 'multiple', 'disabled', 'onchange', 'tooltip', 'label_style', 'div_style'],
  methods :
	{


		setVal : function(event)
		{

			if(event)
			{
					setFormDataValue(this, $("#" + this.id).val());
					if(this.name != this.titlefield) this.$set(getFormData(this), this.titlefield, $(event.target).find('option:selected').text());
				 
			}
			else
			{
				  if(this.value)
				  {
					setFormDataValue(this, this.value);
					$("#" + this.id).val(this.value).trigger('change');
				  }
				  else
				  {
					  setFormDataValue(this,   $("#" + this.id).val());
				  }
			}

		},
		getEtcValue : function(key){
			return getEtcValue(this.id, key);
			 
		}
	},
  computed :
	{

	  value : function(){

		  var val = getFormDataValue(this);
		  return val;
	  }
	},
  mounted: function(){
	  var that = this;
	  if(this.url)
	  {

		fillOption(this.id, this.url, this.emptystr, function(data){
			if(that.callback) eval(that.callback + '(data);');
			that.setVal();
			
		}, this.keyfield,this.titlefield);
	  }
	  else
	  {
		  if(this.options) {
			  fillOptionByData(this.id, this.options, this.emptystr,  this.keyfield,this.titlefield);
			  
		  }
		  if(that.callback) eval(that.callback + '(data);');
		  this.setVal();
      }


  },
  template: '\
	  <div class="fm-select" :style="div_style">\
	  	<label class="control-label grid-title value-title" v-if="title" :style="label_style" :for="id" :title="title">{{title}}</label>\
	  	<select :disabled="disabled" @change="setVal" :title="tooltip" :value="value" :multiple="multiple" :name="name" :id="id"   :onchange="onchange"\ class="form-control input" :class="{hastitle:title}" :style="select_style"></select>\
	  </div>'
})
Vue.component('fm-select2', {
  props: ['id','name','title','url', 'emptystr', 'options', 'keyfield','titlefield', 'callback', 'select_style','label_style' , 'multiple', 'disabled', 'onchange', 'tooltip'],
  methods :
	{

	  	beforeSubmit : function ( )
		{
	  		setFormDataValue(this, $("#" + this.id).val());

	  		return true;
		},
		getEtcValue : function(key){
			return getEtcValue(this.id, key);
		}
	},
  computed :
	{

	  value : function(){

		  var val = getFormDataValue(this);
		  return val;
	  }
	},
  mounted: function(){
	  var that = this;
	  if(this.url)
	  {
		  var val  = this.value;
		  initSelect2();
		  fillOption(this.id, this.url, this.emptystr, function(data){
			  that.option_datas = data;

			  $(that.$el).find("select")
				.select2({multiple:that.multiple });
			  $("#" + that.id).val(val)
		}, this.keyfield,this.titlefield);
	  }
	  else
	  {
		  if(this.options) {
			  fillOptionByData(this.id, this.options, this.emptystr,  this.keyfield,this.titlefield);
		  }
		  $(that.$el).find("select").select2();
		  $("#" + this.id).val(this.value)
      }


  },
  template: '\
	  <div>\
	  	<label class="control-label grid-title value-title" v-if="title" :for="id" :style="label_style">{{title}}</label>\
	  	<select :disabled="disabled"   :title="tooltip"   :name="name" :id="id"   :onchange="onchange"\ class="form-control input" :class="{hastitle:title}" :style="select_style"></select>\
	  </div>'
})

Vue.component('fm-select-yn', {
  props: ['id','name','title', 'emptystr', 'callback', 'select_style', 'onchange'],
  template: '\
	  <fm-select :id="id"\ :options="{Y:\'' + msg_yes + '\', N:\'' + msg_no + '\'}"\
		:name="name" :onchange="onchange" :emptystr="emptystr" :callback="callback" :select_style="select_style" :title="title">\
	</fm-select>'
})
Vue.component('fm-radio', {
  props: ['id','name','title','url',  'data','callback','onchange'],
  methods :
	{
		setVal : function(event)
		{
			setFormDataValue(this,  $("#" + this.id).val());
			$("#"+ this.id).val($(event.target).val());
			$("#"+ this.id).trigger("change");


				 
		}
	},
	mounted : function()
	{
		var that = this;
		if(that.onchange){

			$("#" + this.id).change(function(){
				eval(that.onchange );
			})
		}
	},
	computed :
	{

	  value : function(){

		  return getFormDataValue(this);

	  }
	},
  created: function(){
	  var that   = this;
	  if(this.url)
	  {

		$.ajax(  {type: 'GET',
	               url: this.url,
	               async: false,
	               success: function(data) {
	                    if(data != null) {
	                    	that.data=data;
							setTimeout(function(){
								$("#" + that.id + "_div :radio:first").click();
							},100);
							if(that.on) eval(that.callback + '(data);');
	                    }
	               }
		});

	  }




  },
  template: `\
	  <div :id="id + '_div'"><label class="control-label grid-title value-title" v-if="title" :for="id">{{title}}</label>\
	  <label class="checkbox-inline" v-for="o in Object.keys(data)">\
	  <input type="radio" @change="setVal"   :value="o" :name="name + '_radio'" \
		>{{data[o]}} </label> \
		<input type="hidden" :name="name" :id="id"  />\
	  </div>`
})
Vue.component('fm-checkbox', {
  props: ['id','name','title','url',  'data'],
  methods :
	{
		setVal : function(event)
		{
			var chkObj = $("#"+ this.id + " :checkbox");
			if(chkObj.length>1)
			{
				var arr = new Array();

				var obj = $("#"+ this.id + " :checkbox:checked");
				for(var i=0; i < obj.length;i++)
				{
					arr.push(obj[i].value);
				}
				setFormDataValue(this, arr);
			}
			else
			{
				if(chkObj[0].checked)
				{
					setFormDataValue(this, chkObj[0].value);
				}
				else
				{
					setFormDataValue(this, "");
				}
			}

		}
	},
	mounted : function()
	{

	},
	computed :
	{

	  value : function(){

		  return getFormDataValue(this);

	  }
	},
  created: function(){

	  if(this.url)
	  {
		var that   = this;
		$.ajax(  {type: 'GET',
	               url: this.url,
	               async: false,
	               success: function(data) {
	                    if(data != null) {
	                    	that.data=data;

	                    }
	               }
		});

	  }


  },
  template: '\
	  <span :id="id"><label class="control-label grid-title" v-if="title" :for="id">{{title}}</label>\
	  <div class="checkbox-group"><label class="checkbox-inline" v-for="o in Object.keys(data)">\
	  <input type="checkbox" @change="setVal"  v-model="value" :value="o" :name="name" \
		>{{data[o]}} </label></div>\
	  </span>'
})
Vue.component('fm-password', {
  props: ['id','name','title','placeholder', 'autocomplete'],
  methods :
	{
		setVal : function(event)
		{
			setFormDataValue(this, event.target.value);

		}
	},
  computed :
	{
	  value : function(){
		  return getFormDataValue(this);
	  }
	},
	mounted: function(){
		if(this.autocomplete){
			$(this.$el).find("input").attr("autocomplete",this.autocomplete);
		}

	},
  template: '\
	  <div><label class="control-label value-title grid-title" v-if="title" :for="id">{{title}}</label>\
	  <input type="password" :value="value" @change="setVal" :placeholder="placeholder" :name="name" :id="id"\
			class="form-control input " :class="{hastitle:title}">\
	  </div>'
})
Vue.component('fm-hidden', {
  props: ['id','name'],
  methods :
	{
		setVal : function(event)
		{
			setFormDataValue(this, event.target.value);

		}
	},
  computed :
	{
	  value : function(){
		  return getFormDataValue(this);
	  }
	},
  template: '<input type="hidden" :value="value" :name="name" :id="id" />'
});
Vue.component('fm-input', {
	props: ['id','name','title','placeholder', 'type', 'oninput', 'onchange', 'disabled', 'tooltip', 'label_style','onfocusout', 'autocomplete','onkeydown','onkeyup' , 'input_style', 'div_style', 'value', 'maxlength'],
	methods :
		{
			setVal : function(event)
			{
				setFormDataValue(this, event.target.value);
			}
		},
	mounted: function(){

		if(this.autocomplete){
			$(this.$el).find("input").prop("autocomplete",this.autocomplete);
		}

	},
	computed :
		{
			value : function(){

				return getFormDataValue(this);
			}
		},
	template: '\
	  <div :style="div_style">\
	  	<label class="control-label grid-title value-title" v-if="title" :for="id" :style="label_style">{{title}}</label>\
	  	<input :type="type" :value="value" :disabled="disabled" @change="setVal" :oninput="oninput" :maxlength="maxlength" :placeholder="placeholder" :title="tooltip" :style="input_style" :name="name" :id="id" class="form-control input" :class="{hastitle:title}" :value="value" :onchange="onchange" :onkeyup="onkeyup" :onkeydown="onkeydown" :onfocusout="onfocusout" />\
	  </div>'
});

Vue.component('fm-output', {
	  props: ['id','name','title','value','ostyle','div_style','tooltip', 'multiline','label_style'],

	  computed :
		{
		  value1 : function(){
			  if(this.value)
			  {
				  return this.value;
			  }
			  else
			  {
				  return getFormDataValue(this);
			  }

		  },
		  value2 : function(){
			  if(this.tooltip === ''|| this.tooltip === null || this.tooltip === undefined || this.tooltip ==='undefined'){
				  return this.value;
			  }
			  else{
				  return getFormDataValue(this);
			  }
		  }
		},
	  template: '\
		  <div class="fm-output" :style="div_style">\
		  	<label class="control-label grid-title value-title" v-if="title" :title="tooltip" :for="id" :style="label_style">{{title}}</label>\
		  	<div :id="id" class="output " :name="name" :class="{hastitle:title, multiline:multiline}" :style="ostyle" v-bind:title="value2" >{{value1}}</div>\
		  </div>'
});

Vue.component('fm-sliderrange', {
	props: ['id','name','title','value','ostyle','div_style','tooltip', 'input_id','label_style'],

	computed :
		{
			value1 : function(){
				if(this.value)
				{
					return this.value;
				}
				else
				{
					return getFormDataValue(this);
				}

			},
			value2 : function(){
				if(this.tooltip === ''|| this.tooltip === null || this.tooltip === undefined || this.tooltip ==='undefined'){
					return this.value;
				}
				else{
					return getFormDataValue(this);
				}
			}
		},
	template: '\
		  <div class="fm-output" :style="div_style">\
		  	<label class="control-label grid-title value-title" v-if="title" :title="tooltip" :for="id" :style="label_style">{{title}}</label>\
		  	<div :id="id" class="output " :name="name" :data-id="input_id" :class="{hastitle:title}" :style="ostyle" v-bind:title="value2" >{{value1}}</div>\
		  </div>'
});
Vue.component('fm-file', {
	  props: ['id','name','title','value','multiple','disabled', 'accept'],
	  mounted: function(){

	  },

	  template: '\
		  <div>\
		  	<label class="control-label grid-title value-title" v-if="title" :for="id">{{title}}</label>\
		  		<div class="input-group input input-file" :id="id" :name="name" :accept="accept" :multiple="multiple">\
		  			<input :disabled="disabled" type="text" class="form-control" placeholder="' + msg_file_choose + '"  style="min-width: 320px;height: 30px; width:calc(100% - 58px);"/>\
		  			<span class="input-group-btn" style="border: none !important;width: 64px; height: 30px;">\
		        		<button class="btn btn-default btn-choose" type="button" style="height: 30px;  border-bottom: 1px solid #b5b5b5 !important;">' + btn_file_choose + '</button>\
		    		</span>\
				</div>\
		  </div>'
});
Vue.component('fm-spin', {
	  props: ['id','name','title', 'min', 'max', 'disabled', 'pl', 'onchange', 'label_style', 'input_style', 'div_style', 'group_style'],
	  mounted: function(){

	  },
	  methods :
		{
			chkMinMax: function(val){
				if(this.min && 1*this.min > 1*val){
					return false;
				}
				if(this.max && 1*this.max < 1*val){
					return false;
				}
				return true;
			},
			setVal : function(event)
			{

				if(isNaN(event.target.value) || (this.pl == undefined && event.target.value.indexOf('.') > -1) || !this.chkMinMax(event.target.value)){
					event.target.value = getFormDataValue(this);
				} else {
					if(event.target.value.indexOf('.') > -1){
						if(event.target.value.split('.')[1].length > (this.pl ? this.pl: 1)){
							event.target.value = getFormDataValue(this);
							return;
						}
					}
					setFormDataValue(this, event.target.value);
				}

			},
			plusVal : function()
			{
				var val =  getFormDataValue(this);
				if($(this.$el).find('.fm-spin-input').is(':disabled') || isNaN(val)) return;
				if(!this.max || val<this.max) {
					setFormDataValue(this, Number(val) + 1);
					$('#' + this.id).val(Number(val)+1);
					$('#' + this.id).trigger("change");
					 
				}
			},
			minusVal : function()
			{
				var val =  getFormDataValue(this);
				if($(this.$el).find('.fm-spin-input').is(':disabled') || isNaN(val)) return;
				if(!this.min || val > this.min) {
					setFormDataValue(this, Number(val) - 1);
					$('#' + this.id).val(Number(val)-1);
					$('#' + this.id).trigger("change");
					 
				}
			}
		},
	  computed :
		{
		  value : function(){
			  var v =  getFormDataValue(this);
			  if(v == undefined)
			  {
				  setFormDataValue(this,0);
				  return 0;
			  }
			  else
			  {
				  return v;
			  }
		  }
		},
	  template: '\
		  <div class="input-spinner" :class="{hastitle:title}" :style="div_style">\
		  	<label class="control-label grid-title value-title" v-if="title" :for="id" :style="label_style">{{title}}</label>\
		  	<div class="input-group spinner" :class="{hastitle:title}" :style="group_style">\
		  		<input :disabled="disabled" type="text" :value="value" :style="input_style" @input="setVal" :name="name" :id="id"\ class=" form-control input" :class="{hastitle:title}"  :onchange="onchange">\
		  		<div class="input-group-btn-vertical">\
		  			<button :disabled="disabled" class="btn btn-default" @click="plusVal();" type="button" ><i class="fa fa-caret-up"></i></button>\
		  			<button :disabled="disabled" class="btn btn-default" @click="minusVal();" type="button"  ><i class="fa fa-caret-down"></i></button>\
		  		</div>\
		  		<slot></slot>\
		  	</div>\
		  </div>'
	});

/*Vue.component('fm-arr', {
	 props: ['id','name','title'],
	 computed :
		{
		  value : function(){
			  var str =  getFormDataValue(this);

			  return str;
		  },
		  arr : function()
		  {
			  alert('onn')
			  return this.value.split(',')
		  }
		},
		 mounted:function()
		  {
			 alert(this.arr);
		  },
	  methods:
		{
		  removeArr : function(idx)
		  {
			  this.arr.splice(idx, 1);
			  setFormDataValue(this, this.arr.join(','));
		  }
		},
	  template: '\
			  <div>\
			  	<label class="control-label grid-title value-title" v-if="title" :for="id">{{title}}</label>\
			 	<input type="hidden" :name="name" :id="id" :value="value />\
			 	<ul>\
		  			<template v-for="(a,idx) in arr"><li   class="choice"><span :click="removeArr(idx)"   class="choice_remove">×</span> \
			 			{{a}}</li></template> \
			  	</ul>\
			  </div>'
});*/
Vue.component('fm-textarea', {
  props: ['id','name','title', 'disabled', 'tooltip','style','sty','label_style', 'placeholder', 'maxlength' ],
  mounted:function()
  {

  },
  methods :
	{

	},
  computed :
	{
		form_data : function(){
			return getFormData(this);

		}
	},
  template: '\
	  <div>\
	  	<label class="control-label grid-title value-title" :style="label_style" v-if="title" :for="id">{{title}}</label>\
	  	<textarea :disabled="disabled"   :name="name" :id="id" :title="tooltip" :placeholder="placeholder" :style="sty" class="form-control form-textarea input" :class="{hastitle:title}" :maxlength="maxlength" v-model="form_data[name]"></textarea>\
	  </div>'
})


Vue.component('fm-auto-reload', {
	props: ['value'],
	template: '#auto-reload-template',
	created: function(){},
	methods : {
		interval: function(type, _this){
			var that = $(_this);
			if(type == "play"){
				var val = that.prev().val();
				val = Number(val);
				val = val * 60 * 1000;
				if(val == 0){
					alert("");
					that.prev().focus();
					return false;
				}
				that.next().show();
				that.hide();
				var fncName = that.prev().prev().val();
				fncName += "()";
				that.intervalId = setInterval(function(){eval(fncName);}, val);
			}else{
				that.prev().show();
				that.hide();
				clearInterval(that.intervalId);
			}
		}
	}
})

Vue.filter('date', function (value, type) {
  if (!value) return ''
  return formatDate(value, type);
})
Vue.filter('substr', function (value, len) {
  if (!value) return ''
  return value.substring(0,len);
})
Vue.filter('number', function (value) {
	if(value==0) return '0';
	if (!value) return ''
	return formatNumber(value);
})
Vue.filter('diff', function (value, target, className) {
  if (!value) return ''
  return chgHighlight(target,value, className);
})
var inputvue;
var searchvue;
var popupvue;
var form_data = {};
var search_data = {};
var popup_search_data = {  };

$(document).ready(function(){

	setDateComboList();
	try
	{
		search_data.S_dt_kubun ="D";
		if(__query_param__){
			search_data= $.extend(search_data, __query_param__)
		}
		initFormData();
	}
	catch(e)
	{
	}
	topvue   = new Vue({
		el: '#topbar',
		data: {
			form_data:form_data
		}
	});

	inputvue = new Vue({
		  el: '#input_area',
		  data: {
			  form_data:form_data

		  }
		  } );
	popupvue = new Vue({
		  el: '#popup_area',
		  data: {
			  form_data:popup_search_data

		  }
		  } );
	searchvue = new Vue({
		  el: '#search_area',
		  data: {
			  form_data:search_data

		  }
		  } );
 
	try{ 
		$(".dateInput").datetimepicker({   language : 'ko', pickTime : false,format:'YYYY-MM-DD'});
		$(".dateTimeInput").datetimepicker({  language : 'ko', pickTime : true,format:'YYYY-MM-DD HH:mm'});
	 
		$(".calendar-btn").click(function()
				{
					$(this).parent().find("input:first").focus();
					$(this).parent().find("input:first").click();
				})
	
		$('.modal-dialog').draggable({
		    handle: ".modal-header"
		  });

	}
	catch(e){}
	initForm();
	bs_input_file();


})
function initForm(){
	$("form").keydown(function (e){
		if(e.keyCode == 13)
		{
			//console.log(e);
			if($(e.target).parents('#search_area').length == 0 && $(e.target).parents('.search_area').length == 0) return true;
			if($(e.target).parent().hasClass("Editor-editor") || $(e.target).hasClass("Editor-editor")|| e.target.tagName=="TEXTAREA") return true;
			return enter_search(this);
		}
	})
}
function getVueObj(obj)
{
	var vue = obj[0].__vue__;
	if(vue == null)
	{
		return getVueObj(obj.parent())
	}
	else
	{
		return vue;
	}
}



function bs_input_file() {
	$(".input-file").after(
	function () {
		if (!$(this).next().hasClass('input-ghost')) {
			var element = $("<input type='file' class='input-ghost'    style='display: contents;visibility:hidden; height:0'>");
			if($(this).attr("accept")) element.attr("accept", $(this).attr("accept"));
			element.attr("name", $(this).attr("name"));
			if($(this).attr("multiple"))
			{
				element.prop("multiple",true);
			}
			element.change(function () {
				var files = '';
				for(var i=0; i < element[0].files.length ; i++)
				{
					if(i>0) files += ' , ';
					files += element[0].files[i].name;
				}
				element.prev(element).find('input').val(files);
			});
			$(this).find("button.btn-choose").click(function () {
				element.click();
			});
			$(this).find("button.btn-reset").click(function () {
				element.val(null);
				$(this).parents(".input-file").find('input').val('');
			});
			$(this).find('input').css("cursor", "pointer");
			$(this).find('input').mousedown(function () {
				$(this).parents('.input-file').prev().click();
				return false;
			});
			return element;
		}
	});

}

function arr_has_delbtn(container, str)
{
	var arr = str.split(',');
	var html = '';
	for(var i=0; i < arr.length; i++)
	{
		html +='<li   class="choice"><span class="choice_remove">×</span>' + arr[i] + '</li>'
	}

	$("#" + str).html(html);
}

function processScrollBar(){

	if($(".modal:visible").length>1){

		$("body").css("overflow","hidden");
		$(".modal:visible").css("overflow","auto");
	}else if($(".modal:visible").length == 1) {
		$("body").css("overflow","");
	}

}
var gridMap = {};
//window.addEventListener("resize", allGridFit());
$( window ).resize(function() {
	  clearTimeout(this._grid_fit_);
	  this._grid_fit_ = setTimeout(allGridFit, 10);

});


function NumericEditor(){

}
NumericEditor.prototype.init = function(params){
		// create the cell
		this.eInput = document.createElement('input');
		this.eInput.setAttribute("imeMode", "disabled");
		this.isMulti = params.column.colDef.multi_number
		if( params.column.colDef.maxLength){
			this.eInput.maxLength =  params.column.colDef.maxLength;
		}
		if (this.isCharNumeric(params.charPress)) {
			this.eInput.value = params.charPress;
		} else {
			if (params.value !== undefined && params.value !== null) {
				this.eInput.value = params.value;
			}
		}

	this.eInput.addEventListener('keydown', function (event)  {
			if(event.ctrlKey){
				event.preventDefault();

			}
			else if(event.key=='Backspace' || event.key=='Delete'){
				// nothing
			}
			else if (!this.isKeyPressedNumeric(event) && !(this.isMulti && event.code == "Comma")) {
				this.eInput.focus();
				if (event.preventDefault) event.preventDefault();
			} else if (this.isKeyPressedNavigation(event)) {
				event.stopPropagation();
			}
		});

		// only start edit if key pressed is a number, not a letter
		const charPressIsNotANumber =
			params.charPress && '1234567890'.indexOf(params.charPress) < 0;
		this.cancelBeforeStart = charPressIsNotANumber;
	}
NumericEditor.prototype.isKeyPressedNavigation=function (event) {
		return event.keyCode === 39 || event.keyCode === 37;
	}

	// gets called once when grid ready to insert the element
NumericEditor.prototype.getGui = function () {
		return this.eInput;
	}

	// focus and select can be done after the gui is attached
NumericEditor.prototype.afterGuiAttached=function () {
		this.eInput.focus();
	}

	// returns the new value after editing
NumericEditor.prototype.isCancelBeforeStart = function () {
		return this.cancelBeforeStart;
	}

	// example - will reject the number if it contains the value 007
	// - not very practical, but demonstrates the method.
NumericEditor.prototype.isCancelAfterEnd=function () {
		const value = this.getValue();
		return value.indexOf('007') >= 0;
	}

	// returns the new value after editing
NumericEditor.prototype.getValue=function () {
		return this.eInput.value;
	}

	// any cleanup we need to be done here
NumericEditor.prototype.destroy=function () {
		// but this example is simple, no cleanup, we could  even leave this method out as it's optional
	}

	// if true, then this editor will appear in a popup
NumericEditor.prototype.isPopup=function () {
		// and we could leave this method out also, false is the default
		return false;
	}

NumericEditor.prototype.getCharCodeFromEvent = function (event) {
		event = event || window.event;
		return typeof event.which == 'undefined' ? event.keyCode : event.which;
	}

NumericEditor.prototype.isCharNumeric=function (charStr) {
		return !!/\d/.test(charStr);
	}

NumericEditor.prototype.isKeyPressedNumeric=function (event) {
		var charCode = this.getCharCodeFromEvent(event);
		if (charCode >= 96 && charCode <= 105) {
			charCode =charCode- 48;
		}
		const charStr = String.fromCharCode(charCode);
		return this.isCharNumeric(charStr);
	}


function getGrid(id)
{
	return gridMap[id];
}
function allGridFit()
{
	var keys = Object.keys(gridMap);
	for(var i=0; i < keys.length; i++)
	{
		gridMap[keys[i]].sizeColumnsToFit();
	}
}
function onCellEditingStopped(params)
{
	if(!params.data.IU)
	{
		params.data.IU = 'U';
		params.node.setSelected(true)
		params.api.refreshCells({
		       force: false,
		       rowNodes: [params.node]
		  });
	}
}
function newGrid(container, settings)
{

		var callback = settings.onGridReady;
		settings.localeText={noRowsToShow:msg_no_data}
		settings.onGridReady = function(params) {
			params.api.addEventListener('gridSizeChanged', function(){
		        if(settings.sizeColumnsToFit || settings.sizeColumnsToFit==undefined) params.api.sizeColumnsToFit();
		    });
	        if(settings.sizeColumnsToFit || settings.sizeColumnsToFit==undefined) params.api.sizeColumnsToFit();
	        if(callback) callback.call(null, params);
	    }
		settings.components={
			numericCellEditor: NumericEditor
		};
		try
		{
			settings.headerHeight = grid_row_height;
			settings.rowHeight = grid_row_height;
		}
		catch(e){}

		for(var i in settings.columnDefs){
			var row =  settings.columnDefs[i];
			var format = row.format;
			var conf = {}
			switch (format) {
				case "number":
					conf.valueFormatter = function(params) { return formatNumber(params.value); };
					conf.cellStyle = {'text-align':'right'};
					break;

				case "datetime":
					conf.valueGetter = function(params) {
							 
							if(params.data && params.data[params.colDef.field]){

								return formatDate(params.data[params.colDef.field],'datetime')
							}
							return "";
						}
					break;
				case "date":
					conf.valueGetter = function(params) {
							 
							if(params.data && params.data[params.colDef.field]){

								return formatDate(params.data[params.colDef.field],'date')
							}
							return "";
						}
					break;
				case "StringDate":
					conf.valueGetter = function(params) {
							 
							if(params.data && params.data[params.colDef.field]){
								  
								return formatDate(String(params.data[params.colDef.field]),'String')
							}
							return "";
						}
					break;
				default:
					break;
			}
			settings.columnDefs[i] = $.extend(conf, settings.columnDefs[i]);
			delete settings.columnDefs[i].format;
		}
		if(settings.editable == true)
		{
			/*settings.onRowSelected = function(node,data)
			{
				if(!node.node.selected)
				{
					node.node.setDataValue("IU","");
				}
			};
			*/

			settings.suppressRowClickSelection = true;
			settings.enableCellChangeFlash= true;
			settings.rowSelection= 'multiple';
			settings.onCellEditingStopped = onCellEditingStopped;
			settings.columnDefs.unshift({headerName: "", field: "IU", maxWidth: 60, width:60,
				getQuickFilterText: function(params) {
					return "";
				},headerCheckboxSelection: true, checkboxSelection: true,
				/*valueFormatter:function(params){
					if(params.value){
						params.node.setSelected(true);
					}
					return params.value;
				}*/
			})

		}

		 for(var i=0; i < settings.columnDefs.length ; i++) {
			   if(settings.columnDefs[i].editable)
			   {
				   settings.columnDefs[i].headerClass="editable-cell-header";
				   settings.columnDefs[i].cellClass="editable-cell";
				    
			   }
			   if(settings.columnDefs[i].editable && settings.columnDefs[i].cellEditor=='agSelectCellEditor' && settings.columnDefs[i].values) {
				   settings.columnDefs[i].cellEditorParams = {
		    			values: Object.keys(settings.columnDefs[i].values)
		    	   };
				   settings.columnDefs[i].valueFormatter = function(params) {
						return params.colDef.values[params.value];
				   }
			   }
		   }
		if(settings.hasNo == true)
		{
			settings.columnDefs.unshift({headerName : "No",
				width:60,
				maxWidth:60,
				minWidth:60,
				sortable:false,  getQuickFilterText: function(params) {
					return "";
				},

				suppressSorting: true,
				field:"ROWNUM",
				valueGetter : function(data)
				{
					 
					try{
						if(isNaN(data.node.id)){
							return 1 + data.node.rowIndex
						}
						else {
							return 1 + 1 * data.node.id;
						}
					}
					catch(e){
						return 1 + data.node.rowIndex
					}
				}});
		}

	var gridObj =  new grid(container, settings);
	gridMap[container] = gridObj;
	return gridObj;
}
function YNCheckboxRenderer(params)
{

	 var html = '<input type="checkbox" onclick="grid_checkbox(' + params.rowIndex + ',this)"  value="Y" name="' + params.colDef.field + '"';
   	 if(params.value=="Y")
   	 {
   		html += " checked";
   	 }
   	 html += ">";
   	 return html;
}

function YNCheckSelectboxRenderer(params)
{
	 var html = '<select  value="Y" name="' + params.colDef.field + '" onchange="grid_select(' + params.rowIndex + ',this)" >';
	 html +='<option value="Y">Y</option>' +
	 		 '<option value="N">N</option>';
	 html += '</select>';
	 if(params.data.READONLY_YN == null){
		 params.data.READONLY_YN = 'Y';
	 }
	  
   	 return html;
}


function grid_text(rowIdx,  obj)
{
	var grid1 = getGrid($(obj).parents(".ag-layout-normal:first").parent().attr("id"));
	var rowData = grid1.getRowData(rowIdx);
	rowData[obj.name]= obj.value;
	
	if(!rowData.IU) rowData.IU="U";
	
	grid1.updateRow(rowData);
	grid1.setSelected(rowIdx);
}

function grid_select(rowIdx,  obj)
{
	var grid1 = getGrid($(obj).parents(".ag-layout-normal:first").parent().attr("id"));
	var rowData = grid1.getRowData(rowIdx);
	rowData[obj.name]= obj.value;
	if(!rowData.IU) rowData.IU="U";
	
	grid1.updateRow(rowData);
	grid1.setSelected(rowIdx);
}

function grid_checkbox(rowIdx,  obj)
{
	var grid1 = getGrid($(obj).parents(".ag-layout-normal:first").parent().attr("id"));
	var rowData = grid1.getRowData(rowIdx);

	if(obj.checked) rowData[obj.name]="Y";
	else rowData[obj.name]="N";
	if(!rowData.IU) rowData.IU="U";

	grid1.updateRow(rowData);
	grid1.setSelected(rowIdx);
}
var grid = function(container, gridOptions)
{
	 this.container = container;
	 this.gridOptions = gridOptions;
	 this.total = 0;
	 new agGrid.Grid($("#" + container)[0], gridOptions);

	 function paste($this,text,e)
	 {
		 var target = $(e.currentTarget).find("input");
		 if(text && text.indexOf("\r\n")<0)
		 {
			 target.val(text);
			 return;
		 }
		 try
		 {
			 text = text.trim('\r\n');
			 if($this.getSelectedRows()[0].IU=='I')
			 {
				 $this.deleteRow();
			 }
	         $.each(text.split('\r\n'), function(i2, v2){
	        	 var row = {};

	             $.each(v2.split('\t'), function(i3, v3){
	            	 if(i3+1<gridOptions.columnDefs.length)
	            	 {
	            		 if(v3 != '')
	            		 {
	            			 row[ gridOptions.columnDefs[i3+1].field ] = v3;
	            		 }
	            	 }
	             })
	             $this.insertRow(row);


	         })
		 }
		 catch(e)
		 {

			 target.val(text);
		 }


	 }
	 this.refresh = function(){
		 this.gridOptions.api.redrawRows();
	 }
	 this.onPasteBind = function()
	 {
		 var $this =  this ;
		 $("#" + container + " .ag-cell").bind('paste', function(e){
				if(window.clipboardData)
				{
					try
					{
						paste($this, window.clipboardData.getData('Text'),e )
					}
					catch(  e)
					{
						return true;
					}
				}
				else
				{


					var items = e.originalEvent.clipboardData.items;
					for( var i=0; i < items.length; i++)
					{
						var v = items[i];
						if (v.type === 'text/plain'){
					            v.getAsString(function(text){
					            	try
					            	{
					            		paste($this, text, e);
					            	}
					            	catch(e)
					            	{
					            		hasErr = true;
					            	}
					            })
						}

					}


				}
			    return false;
			});
	 }
	 this.chkValue = function(){
		 var arr = this.getData();
		 var requiredField = [];
		 for(var i=0; i < this.gridOptions.columnDefs.length; i++){
			 if(this.gridOptions.columnDefs[i].required){
				 requiredField.push(this.gridOptions.columnDefs[i].field);
			 }
		 }
		 for(var i=0; i < arr.length; i++){
			 for(var j=0; j < requiredField.length; j++){
				 try{
					 var v = arr[i][requiredField[j]] ;
					 if(!v || v == ''){
						 alert(msg_empty_value + "(" + i + "," + requiredField[j] + ")" );
						 return false;
					 }	 
				 }catch(e){
					 alert(msg_empty_value + "(" + i + "," + requiredField[j] + ")" );
					 return false;
				 }
				 
			 }
			 
		 }
		 return true;
	 }
	 this.setTotal = function(total)
	 {
		 this.total = total ;
		 $("#" + this.container + "_total" ).text(formatNumber(this.total));
	 }
	this.findByFieldValue = function(field, value)
	{
		var list = this.getData();
		for(var i=0; i < list.length; i++){
			if(list[i][field]  == value){
				return list[i];
			}
		}
		return  null;
	}
	 this.setData  = function(data)
	 {
		 if(data instanceof Array)
		 {
			 this.setTotal(data.length);
			 this.gridOptions.api.setRowData(data);
		 }
		 else
		 {
			 if(data.total)
			 {
				 this.setTotal(data.total);
			 }
			 else
			 {
				 this.setTotal(data.list.length);
			 }



			 this.gridOptions.api.setRowData(data.list);
		 }
		 if(this.gridOptions.sizeColumnsToFit || this.gridOptions.sizeColumnsToFit==undefined) this.sizeColumnsToFit();
		 if(this.gridOptions.editable) this.onPasteBind();
	 }
	 this.clearData = function()
	 {
		 this.setData([]);
	 }
	 this.getFirstEditableField = function()
	 {
		 var arr = this.gridOptions.columnDefs;
		 for(var i=0; i <arr.length; i++)
		 {
			 if(arr[i].editable)
			 {
				return arr[i].field;
			 }
		 }
	 }
	 this.getSelectedRows = function()
	 {
		 return this.gridOptions.api.getSelectedRows();
	 }
	 this.getSelectedRowIndex = function()
	 {
		 var nodes =  this.gridOptions.api.getSelectedNodes();
		 if(nodes.length>0)
		 {
			 return nodes[0].rowIndex;
		 }
		 return -1;
	 }
	 this.stopEditing = function( )
	 {

		 this.gridOptions.api.stopEditing();



	 }
	 this.setSelected = function(rowIdx, selected)
	 {
		 if(selected == undefined) selected = true;
		 this.getRow(rowIdx).setSelected(selected);



	 }
	 this.setSelectedById = function(id, selected)
	 {
		 if(selected == undefined) selected = true;
		 var node = this.gridOptions.api.getRowNode(id);
		 if(node)
		 {
		 	node.setSelected(selected);
		 	return true;
		 }
		 else
		 {
			 return false;
		 }
	 }
	 this.exportCSV = function(params)
	 {
		 var fileName = params.fileName;
		 var pos = fileName.lastIndexOf(".csv");
		 var today = formatDatePattern(new Date(), "yyyyMMddHHmmss");
		 if(pos>0)
		 {
			 fileName = fileName.substring(0, pos) + "_" + today + ".csv";
		 }
		 else
		 {
			 fileName = fileName  + "_" + today + ".csv";
		 }
		 params.fileName = fileName;
		 this.gridOptions.api.exportDataAsCsv(params);
	 }
	 this.insertRow = function(newItem)
	 {
		var changed ;
		if(this.gridOptions.getRowNodeId)
		{
			var rowNode = this.gridOptions.api.getRowNode(this.gridOptions.getRowNodeId(newItem));
			if(rowNode)
			{

				if(rowNode.data.IU != 'I')
				{
					newItem.IU = 'U';
				}
				else
				{
					newItem.IU = 'I';
				}
				changed = this.updateRow(newItem);
			}
		}
		if(!changed)
		{
			newItem.IU = 'I';
			changed = this.gridOptions.api.updateRowData({add: [newItem]});
		}
		if(changed.add.length>0)
		{
			this.gridOptions.api.setFocusedCell(changed.add[0].rowIndex, this.getFirstEditableField());
		    this.gridOptions.api.startEditingCell({
		        rowIndex: changed.add[0].rowIndex,
		        colKey: this.getFirstEditableField()
		    });
		    changed.add[0].setSelected(true);
		    if(this.gridOptions.editable)
		    {

		    	var that = this;
		    	setTimeout(function()
		    		{
		    			that.onPasteBind();
		    		}, 10);
		    }
			return changed.add[0];
		}
		else
		{
			return null;
		}
	 }
	 this.deleteRow = function(selectedData)
	 {
		 selectedData = selectedData ? selectedData: this.gridOptions.api.getSelectedRows();
		 return this.gridOptions.api.updateRowData({remove: selectedData});
	 }
	 this.sizeColumnsToFit = function()
	 {
		 this.gridOptions.api.sizeColumnsToFit();
	 }
	 this.updateRow = function(updateData)
	 {
		 var updateRows = new Array();
		 if(!(updateData instanceof Array))
		 {
			 updateRows.push(updateData);
		 }
		 else
		 {
			 updateRows = updateData;
		 }

		 var r =  this.gridOptions.api.updateRowData({update: updateRows});
		 this.refresh();
		 return r;
	 }
	 this.getData = function()
	 {
		 var arr = [];
		 this.gridOptions.api.forEachNode(
				 function(rowNode, index) {
					  
					 arr.push(rowNode.data);
				 });
		 return arr;
	 }
	 this.isValueChange = function(){
	 	var arr = this.getData();
	 	for(var i=0; i < arr.length; i++){
	 		if(arr[i].IU && ( arr[i].IU=='I' || arr[i].IU=='U' ) ){
	 			return true;
			}
		}
	 	return false;

	 }
	 this.getRowData = function(rowIndex)
	 {

		 var node =  this.getRow(rowIndex);
		 if(node)
		 {
			 return node.data;
		 }
		 else
		 {
			 return null;
		 }
	 }
	 this.getRowDataById = function(id)
	 {

		 var node = this.gridOptions.api.getRowNode(id);
		 if(node != null)
		 {
			 return node.data;
		 }
		 return null;
	 }
	 this.getRow  = function(rowIndex)
	 {

		 return this.gridOptions.api.getModel().getRow(rowIndex);

	 }
	 /** 페이징 시작 **/
	 this.paging={};
	 this.search4Paging = function(url, pageSize, param, callback){
		 param.pageSize = pageSize;
		 param.pageNo=1;
		 this.paging.pageSize = pageSize;
		 if($("#" + this.container+ "_pageNo").length==0){
			  	var html ="<div class='pageNoArea'>";
		           	html += "<button class='pageFirstBtn' onclick='" + this.container + ".goPage(1, true);return false;'><<</button>";
		           
		           	html += '<button class="pagePrevBtn" onclick="' + this.container + '.goPagePrev();return false;"><</button>';
		           	
		        	html += '<select class="pageNo" id="' + this.container + '_pageNo" onchange="' + this.container + '.goPage(this.value)"></select>';
		        	html += '<button class="pageNextBtn" onclick="' + this.container + '.goPageNext();return false;">></button>';
		            
		        	html += '<button class="pageLastBtn" onclick="' + this.container + '.goPageLast();return false;" >>></button>'
		        	html += '</div>';
		        	$(html).insertAfter("#" + this.container);	
		 }
		 this.paging.param = param;
		 this.paging.url = url;
		 var that = this;
		 post(url, param, function(data){
	    	  var totalPage =  parseInt(data.total/search_data.pageSize) + (data.total%search_data.pageSize==0?0:1) ;
	    	  that.paging.lastPageNo = totalPage;
	    	  $("#" + that.container + "_pageNo option").remove()
	    	  for(var i=1; i <= totalPage; i++){
	    		  $("#" + that.container + "_pageNo").append("<option value='" + (i) + "'>" + (i));
	    	  }
	    	  that.setData(data);
	    	  if(callback)
              {
                 callback.call(null,data);
              }
	       })
	 }
	 this.goPageLast = function() {
	     
		   this.goPage(this.paging.lastPageNo ,true);
	}

	this.goPageNext = function() { 
		 
		 	if(this.paging.lastPageNo > this.paging.param.pageNo)
		 	{
		 		this.goPage(this.paging.param.pageNo +1 ,true);
		 	}
			 
	}
	this.goPagePrev = function() { 
		 
	 	if(  this.paging.param.pageNo > 1)
	 	{
	 		this.goPage(this.paging.param.pageNo - 1 ,true);
	 	}
		 
	}
	 
			
	 this.goPage = function (pageNo, sel){
		  this.paging.pageNo = pageNo;
		  this.paging.param.pageNo=pageNo;
	 	  var that = this;	 
	 	  if(sel) $("#" + this.container + "_pageNo").val(pageNo);
	       post(this.paging.url, this.paging.param, function(data){
	    	   that.setData(data);
	    	   if(that.onPagingEvent){
	    		   that.onPagingEvent.call(that,data);
	    	   }
	       })
	   }
	 /** 페이징 끝 **/

	 this.setQuickFilter = function (value) {
		 this.gridOptions.api.setQuickFilter(value);
	 }
}
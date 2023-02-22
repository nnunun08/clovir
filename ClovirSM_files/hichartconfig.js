function barRate(id,rate)
{
	var barClass="error";
	if(rate <=50)
	{
		barClass="normal";
	}
	else if(rate <=80)
	{
		barClass="warning";
	}
	var container = $("#" + id);
	var html ='<div class="progress_per ' + barClass + '">';
	html += '<span>' + rate + '</span><span class="progress_unit">%</span>';
	html += '</div>';
	html += '<div class="progress">';
	
	html += '<span class="progress_bar progress_' + barClass + '" style="width:' + rate + '%"><span></span></span>';
	html += '</div>';
	container.html(html);
}


function customRate(id, rate, textPos)
{
	/*
	 * textPos : in, down, up
	 * 예)
	 * <div class="custom_rate" id="test3" src="/res/img/disk.png" height="170" width="170" color="orange"></div>
	 * run("test3", 50, 'down');
	 */
	if(!textPos)
	{
		textPos = 'in';	
	}
	var container = $("#" + id);
	
	var title = (container.attr("title")?container.attr("title")+ ":" : "" )+ rate + "%"
	
	var h = container.attr("height");
	var w = container.attr("width");
	var src = container.attr("src");
	var rh = (1*h ) * rate / 100;
	if(src.indexOf("http")==0)
	{
		var href = location.href;
		var pos = href.indexOf('/',10);
		src = href.substring(0,pos) + src;	
	}
	var html = "";
	if(textPos == 'up')
	{	
		html += "<div class='custom_rate_text' style='text-align:center; color: " +  container.attr("color") + ";width:" + w + "'>" + title + "</div>";
	}
	html += "<svg height='" +  h + "' width='" + w + "'><g>";
	html += '<rect height="' + rh + '" width="' + w + '" y="' + (h - rh) + '" x="0" fill="' + container.attr("color") + '"/>';
	html += "<image xlink:href='" + src + "' height='" +  h + "' width='" + w + "' y='0' x='0'/>";
	if(textPos == 'in')
	{
		var ty = (h - rh*0.7);
		var tcolor = "#ffffff";
		if(rate<50)
		{
			ty = h/2;
			tcolor = container.attr("color"); 
		}
		html += '<text fill="' + tcolor + '" class="custom_rate_text" y="' + ty + '">';
		html += '<tspan x="50%" text-anchor="middle">' +  title + '</tspan>';
		html += '</text>'
	}
	html += "</g></svg>";
	if(textPos == 'down')
	{	
		html += "<div class='custom_rate_text' style='text-align:center; color: " +  container.attr("color") + ";width:" + w + "'>" + title + "</div>";
	}
	// 
	container.html(html);
}
function makeChartData(list , xField, yField)
{
	var result = [];
	for(var i=0; i < list.length; i++)
	{
		var  arr1 = [];
		arr1[0] = list[i][xField];
		arr1[1] = list[i][yField];
		result.push(arr1);
	}
	return result;
}
function ForceLinkChart(container, jsonUrl)
{
	var svg = d3.select("#" + container),
    width = +svg.attr("width"),
    height = +svg.attr("height");
	var color = d3.scaleOrdinal(d3.schemeCategory20b);
	var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }).strength(0.05))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2)).alpha(1)
    var x = d3.scaleLinear().range([0, 20]);
	d3.json(jsonUrl, function(error, graph) {
		if (error) {
			alert("error"); 
			return;
		}
		x.domain([0, d3.max(graph.nodes, function(d){return d.size;})]);
  
		var link = svg.append("g")
			.attr("class", "links")
			.selectAll("line")
			.data(graph.links)
			.enter().append("line").attr("class",function(d){ return "source-" + d.source + " target-" + d.target });

		var anchorNode = svg.selectAll("g.nodes").data(graph.nodes).enter().append("g").attr("class", function(d){ return "nodes node-" + d.id; })
			.on("click", this.clicked).call(d3.drag()
	          .on("start", this.dragstarted)
	          .on("drag", this.dragged)
	          .on("end", this.dragended));
		var node = anchorNode.append("circle").attr("r",  function(d){ 
			return x(d.size);
			}
			).style("fill", function(d,i){ return color(i);})
	          ;
		anchorNode.append("title")
			.text(function(d) { return d.id; });
	
		var text = anchorNode.append("text").text(function(d, i) {
				return d.id
			})//.style("fill", "#555"); //.style("font-family", "Arial").style("font-size", 12);
	  
		simulation.nodes(graph.nodes).on("tick", ticked);
		simulation.force("link").links(graph.links);

		function ticked() {
	
		    link
		        .attr("x1", function(d) { return d.source.x; })
		        .attr("y1", function(d) { return d.source.y; })
		        .attr("x2", function(d) { return d.target.x; })
		        .attr("y2", function(d) { return d.target.y; });
		
		    node
		        .attr("cx", function(d) { return d.x; })
		        .attr("cy", function(d) { return d.y; });
		    text
		    .attr("x", function(d) { return d.x + x(d.size); })
		    .attr("y", function(d) { return d.y; });
		}
	});
	var oldNode = null;
	this.clicked = function (d) {
		
		if(oldNode != null)
		{
			svg.selectAll("g.node-" + oldNode)
		      .classed("selected", false)
		    svg.selectAll("g line.source-" + oldNode)
		      .classed("selected", false);
			svg.selectAll("g line.target-" + oldNode)
		      .classed("selected", false);   
		}	
		svg.selectAll("g.node-" + d.id)
	      .classed("selected", true);
		
		svg.selectAll("g line.source-" + d.id)
	      .classed("selected", true);
		svg.selectAll("g line.target-" + d.id)
	      .classed("selected", true);
		oldNode = d.id;
	}
	this.dragstarted = function (d) {
		if (!d3.event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
	}

	this.dragged = function (d) {
	  d.fx = d3.event.x;
	  d.fy = d3.event.y;
	}

	this.dragended = function (d) {
	  if (!d3.event.active) simulation.alphaTarget(0);
	  d.fx = null;
	  d.fy = null;
	}

}
function ChartConfig(type, container, title, subTitle, xTitle, yTitle)
{
	this.type = type;
	this.container = container;
	var type1 = type;
	var polar = false;
	var stacking = "";
	if(type == "radar")
	{
		type1 = "line";
		polar = true;
	}
	else if(type == "column_stack")
	{
		type1 = "column";
		stacking = "normal";
		
	}
	else if(type == "bar_stack")
	{
		type1 = "bar";
		stacking = "normal";
		
	}	
	this.setPointClick = function(callback)
	{
		var series = this.config.plotOptions.series || {};
		series.point = series.point || [];
		series.point.events = series.point.events || [];
		this.config.plotOptions.wordcloud={cursor : 'pointer'};
		var that = this;
		//series.allowPointSelect= true;
	        
		series.point.cursor = 'pointer';
		series.point.events.click=function()
		{
			if(this.category )
			{
				this.category_cd = that.getCategoryId(this.category);
			}
			callback.call(this);
		}
		this.config.plotOptions.series = series;
	}
	this.config =  {
			
		 
		chart: {
			type: type1,
			polar : polar
		},
		exporting:{
			scale : 1,
			filename : title + "_" + formatDatePattern(new Date(), "yyyyMMddHHmmss")
		},
		title: {
			text: title
		},
		subtitle: {
			useHTML : true,
			text: subTitle
		},
		xAxis: {
            title: {
                text: xTitle
            }
        },
		yAxis: {
            title: {
                text: yTitle
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    }
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            },
            column: {
                    stacking: stacking
            },
            series: {
                stacking: stacking
            }
        },

        series:[]
	};
	
	this.onBeforeDraw = function()
	{
		if(this.type=='area')
		{
			this.setAreaGradient();
		}
		else if(this.type=='bubble')
		{
			this.setBubbleLabel();
		}
		else if(this.type=='radar')
		{
			this.setRadar();
		}
		else if(this.type=='wordcloud')
		{
			this.setWordCloudSetting();
		}
	};
	this.setWordCloudSetting = function()
	{
		this.config.tooltip={
				pointFormat: '' 
		}
	}
	this.setRadar = function()
	{
		this.config.xAxis.lineWidth = 0;
		this.config.yAxis.lineWidth = 0;
		this.config.yAxis.gridLineInterpolation = 'polygon';
	}
	this.setBubbleLabel=function()
	{
		 this.config.plotOptions={
			 series: {
		 
	            dataLabels: {
	                enabled: true,
	                format: '{point.name}'
	            }
	        }
		 };
	}
	this.setAreaGradient = function()
	{
		this.config.series.forEach(function(data,index){
		data.fillColor = {
			stops : [
			         [0, Highcharts.getOptions().colors[index]],
			         [1, Highcharts.Color(Highcharts.getOptions().colors[index]).setOpacity(0).get('rgba')]
			         ]
			}
		});
	};
	this.setChartData = function(data)
	{
		setData(this, data, this.container)
	}
	this.getCategoryId = function(categoryName)
	{
		if(this.category_map)
		{
			return this.category_map[categoryName];
		}
		return null;
	}
	this.emptyChart = function( )
	{
		this.chart = Highcharts.chart(this.container, this.config);
	}
 
	function setData(that, data, container, beforeDraw)
	{
		that.category_map = data.category_map;
		that.config.series = data.series;
		
		if(data.series.length==1)
		{
			if(!data.series[0].name)
			{	
				that.config.series[0].name=that.config.yAxis.title.text;
			}
		}
		else
		{
			if(data.series[0].name)
			{
				that.config.legend.enabled = true;
			}
		}
		setAxis(that.config.xAxis, data.xAxis);
		setAxis(that.config.yAxis, data.yAxis);
		
		
		that.onBeforeDraw();
		if(beforeDraw)
		{
			beforeDraw.call(that.config, data);
		}
		that.chart = Highcharts.chart(container, that.config);
		if(that.config.onAfterLoad)
		{
			that.config.onAfterLoad.call(that.config, data);
		}
		 

	}
	this.setChartDataUrl = function(url, param, callback)
	{
		var that = this;
		post(url, param,
					function (data)
					{
						setData(that, data, that.container, callback);
						
					}
				 
			);
		
	}
	this.getCategoryIndex = function(category)
	{
		var categories = this.config.xAxis.categories;
		for(var i=0; i < categories.length; i++)
		{
			if(categories[i]==category)
			{
				return i;
			}
		}
		return -1;
	}
}
function setAxis (configAxis, dataAxis)
{
	if(dataAxis == null) return;
	dataAxis = $.extend(configAxis, dataAxis);
	
	
	if(dataAxis.type)
	{
		if(dataAxis.type == 'datetime')
		{
			configAxis.dateTimeLabelFormats = {
                day: '%m-%d',
                month: '%Y-%m',
                week: '%m-%d',
            };
		}
	}
	
};

Highcharts.setOptions({                                            // This is for all plots, change Date axis to local timezone
    global : {
        useUTC : false,
       
    },
    exporting : {
    	libURL : '/res/js',
    	 
    },
	lang:{
    	noData : msg_no_data
	},
    credits : {
        enabled: false
    } 
});



	function margeExcelData(dataAll, data, oldTitleArr )
	{
		var titleArr = data.shift();
		if(dataAll.length==0){
			for(var i=0; i<data.length; i++)
			{
				dataAll.push(data[i]);
			}
			for(var i=0; i<titleArr.length; i++)
			{
				oldTitleArr.push(titleArr[i]);
			}
			//dataAll.push(...data);
			//oldTitleArr.push(...titleArr);
		}
		else
		{
			var  sameFieldIdx1, sameFieldIdx2;
			for(var i=0; i < oldTitleArr.length; i++)
			{
				for(var j=0; j < titleArr.length; j++)
				{
					if(oldTitleArr[i]==titleArr[j])
					{
						sameFieldIdx1=i;
						sameFieldIdx2=j;
						break;
					}	
				}
			}
			for(var i=0; i < data.length; i++)
			{	
				insertArrBySameVal(oldTitleArr, titleArr, dataAll, data[i],sameFieldIdx1, sameFieldIdx2 )
			}
			
			titleArr.splice(sameFieldIdx2,1);
			//oldTitleArr.push(...titleArr);
			for(var i=0; i<titleArr.length; i++)
			{
				oldTitleArr.push(titleArr[i]);
			}
		}
	}
	
	
 
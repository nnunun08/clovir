function setChartButton( ){
	  var defaultButtons = Highcharts.getOptions().exporting.buttons; // get default Highchart Export buttons

	  var menuItems = defaultButtons.contextButton.menuItems;
	  var newBtn = new Array();
	  for(var i=0; i < menuItems.length; i++)
	  {
		  if(menuItems[i] == 'printChart' ||menuItems[i] == 'downloadPNG'   ||menuItems[i] == 'downloadSVG'  || menuItems[i] == 'downloadCSV'||menuItems[i] == 'downloadXLS' )
		  {
			  newBtn.push(menuItems[i])  ;
		  }


	  }
	 //  
	  defaultButtons.contextButton.menuItems=newBtn;

}
 setChartButton();
$(document).ready(function(){

	$("#menu-button").click(function ()
	{
		$('.nav-side-menu').toggle('slide', {}, 500);
		$('.main').switchClass('', 'fullscreen', 500);
		$('.main.fullscreen').switchClass('fullscreen', '', 500);
	})

	 
});
  
var app = app || {
	setUI: function () {
		var listingHeight = $(window).height() - ($('#filters').height() + $('#listing div').height());
		$('#listing ul').height(listingHeight);
	},
	getAjaxClusterDetails: function (params) {
		console.log(params);
		$.ajax({
			url:'js/data.json',
			data:params,
			success:function (data) {
				var filterStr = '',
					str = '<div>' + data.total + ' Propreties for ' + data.city + ' city</div>';
				str += '<ul>';
				console.log(data);
				$.each(data.results, function (index, val) {
				    //console.log(val);
					var availability = val.AVAILABILITY.toLowerCase().replace(/ /g, '');
					str += '<li data-type="' + availability +'">';	 
					str += '<a href=""><img width="120" height="100" src="' + val.DEFAULT_THUMB.url +'" border="0" /></a>';
					str += '<p>' + val.PROP_NAME + '</p>';
					str += '</li>';	 					
				});
				str += '</ul>';
				
				$.each(data.filters, function (index, val) {
					var availability = val.toLowerCase().replace(/ /g, '');
					filterStr += '<label for="' + availability + '">';
					filterStr += '<input checked="checked" name="filterlist" class="filterlist" type="checkbox" value="' + availability + '" id="' + availability + '">' + val; 
					filterStr += '</label>';
				});
				
				$('#listing').html(str);
				$('#filterset').html(filterStr);
				app.setUI();
			},
			error: function () {
			}
		});
	},
	initializeMap: function () {
		// Initializing a map
		var latlng = new google.maps.LatLng(29.392971,79.454051); // latitude is 29.392971,longitude: 79.454051
		var myOptions = {
			zoom: 7,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		// Draw a map on DIV "map_canvas"
		map = new google.maps.Map($("map"), myOptions);
		// Listen Click Event to draw Polygon
		google.maps.event.addListener(map, 'click', function(event) {
			polyCoordinates[count] = event.latLng;
			createPolyline(polyCoordinates);
			count++;
		});
		
		//refreshMap();
	},
	changeListing: function (type) {
		console.log(type);
		$('#listing li').hide();
		/*$.each(type, function (i, val) {
			var filterType = val;
			$('#listing li[data-type="' type '"]').show();
		});*/
	}
}

$(function () {
	var paramsObj = {'cityName':'Noida'};
	app.getAjaxClusterDetails(paramsObj);
	
	$("#citySelect").change(function(e) {
		var cityName = $(this).val(),
			paramsObj = {'cityName':cityName};
		app.getAjaxClusterDetails(paramsObj);
	});
	
	$('body').on('change', "input.filterlist", function(e) {
		var arry = [];
		$('input[name="filterlist"]:checked').each(function() {
   			arry.push(this.value);
		});
		app.changeListing(arry);
	});
	
	//app.initializeMap();
});
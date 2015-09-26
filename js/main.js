var map,
	app = app || {
	cityConfig: {
		'Noida': {
			'longitude':28.5700,
			'latitude':77.3200
		},
		'Gurgaon': {
			'longitude':28.4700,
			'latitude':77.0300
		},
		'Delhi': {
			'longitude':28.6100,
			'latitude':77.2300
		},
		'Mumbai': {
			'longitude':18.9750,
			'latitude':72.8258
		}
	},
	setUI: function () {
		var listingHeight = $(window).height() - ($('#filters').height() + $('#listing div').height());
		$('#listing ul, #map').height(listingHeight);
	},
	getAjaxClusterDetails: function (params) {
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
	renderMap: function (paramsObj) {
		var long = app.cityConfig[paramsObj.cityName].longitude,
			lat = app.cityConfig[paramsObj.cityName].latitude,
			myCenter = new google.maps.LatLng(long, lat),
			mapProp = {
				center:myCenter,
				zoom:13,
				mapTypeId:google.maps.MapTypeId.ROADMAP
			},
			myCity = new google.maps.Circle({
			    center:myCenter,
			    radius:2000,
			    strokeColor:"#0000FF",
			    strokeOpacity:0.8,
			    strokeWeight:2,
			    fillColor:"#0000FF",
			    fillOpacity:0.4
			}),
			marker = new google.maps.Marker({
  				position:myCenter,
				icon:'images/pinkicon.png'
  			});
		
		/*var infowindow = new google.maps.InfoWindow({
		  content:"Hello World!"
		});*/
		
		map = new google.maps.Map(document.getElementById("map"), mapProp);
		marker.setMap(map);
		myCity.setMap(map); 
		
		google.maps.event.addListener(map, 'click', function(event) {
			app.placeMarker(event.latLng);
		  //infowindow.open(map,marker);
		});

	},
	placeMarker: function (location) {
		var marker = new google.maps.Marker({
				position: location,
				map: map,
			}),
			infowindow = new google.maps.InfoWindow({
				content: 'Latitude: ' + location.lat() + '<br>Longitude: ' + location.lng()
			});
	  	infowindow.open(map, marker);
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
		app.renderMap(paramsObj);
	});
	
	$('body').on('change', "input.filterlist", function(e) {
		var arry = [];
		$('input[name="filterlist"]:checked').each(function() {
   			arry.push(this.value);
		});
		app.changeListing(arry);
	});
	
	app.renderMap(paramsObj);
});
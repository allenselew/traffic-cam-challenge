// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

$(document).ready(function() {
	//global map variable
	var map;

	//creates map on web page
	function createMap(center, zoom) {
		var mapElement = document.getElementById('map');
		map = new google.maps.Map(mapElement, {
			center: center,
			zoom: zoom
		});
	} //ends createMap function

	var uwCoords = {
		lat: 47.655,
		lng: -122.3080
	};

	createMap(uwCoords, 12);
	var infoWindow = new google.maps.InfoWindow();

	//will use to store places for searching later
	var places = [];

	$.getJSON("http://data.seattle.gov/resource/65fc-btcc.json")
		.done(function (data) {
			data.forEach(function(place) {
                //for each object in the array returned, create a marker
                var marker = new google.maps.Marker({
                    position: {
                        lat: Number(place.location.latitude),
                        lng: Number(place.location.longitude)
                    },
                    map: map
                });

                //put object in array for searching later
                places.push([place, marker]);

                //and create a listener for clicking on the marker that makes relevant html when clicked
                google.maps.event.addListener(marker, 'click', function() {
                    var html = '<h2>' + place.cameralabel + '</h2>';
                    html += '<img src=' + place.imageurl.url + '></img>';
                    map.panTo(this.getPosition());
                    infoWindow.setContent(html);
                    infoWindow.open(map, this);
                    //animation to bounce once
  					marker.setAnimation(google.maps.Animation.BOUNCE);
  					setTimeout(function() {
  						marker.setAnimation(null); 
  					}, 750);
                });
			})
		})
		.fail(function (error) {
			alert("No traffic cameras available.");
		})
		.always(function() {
			console.log('success');
		}); //ends getJSON function

	//search bar
	var searchText;
	var placeText;

	$('#search').bind('search keyup', function() {
		searchText = document.getElementById('search').value.toLowerCase();
		for (var idx = 0; idx < places.length; idx++) {
			var place = places[idx][0];
			var marker = places[idx][1];
			placeText = place.cameralabel.toLowerCase();
			if(placeText.indexOf(searchText) == -1) {
				marker.setMap(null);
			}
			else {
				marker.setMap(map);
			}
		}
	});
}); //ends document ready function
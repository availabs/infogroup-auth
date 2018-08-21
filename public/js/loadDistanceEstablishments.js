// distance is in meters.
function loadDistanceEstablishments(lon, lat, dist) {
	// --
	// load data from api
	// then add to map
	// --
	$("div.Object-desc").empty();
	$("#pieChart").empty();

	// Creates a request URL for the API
	var reqURL = '/api/bydistance';
	if (lon) {
		reqURL += '?lon=' + lon;
		if (lat) {
			reqURL += '&lat=' + lat;
			if (dist) {
				reqURL += '&dist=' + dist;
			}
		}
	}
	// console.log(reqURL);

	//---
	//Maybe add county polygon request here.
	//---

	d3.json(reqURL)
		.then(data => {
			mapEstablishments(data);
			loadPieChart(data);
			loadDatatable(data);
		}, function (err) {
			alert("Query Error");
			console.log(err);
		});
}
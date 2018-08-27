//TODO: SEPARATE TO PIE CHART FILE.JS
function loadPieChart(establishments) {

	var arr_data = [];
	var pie_content = [];
	establishments.data.map( est => {
		arr_data.push(est.NAICSDS);
	});
	
	var i=0, x, count, item, it;

	while(i < arr_data.length) {
		count = 1;
		item = arr_data[i];
		x = i+1;

		while(x < arr_data.length && (x=arr_data.indexOf(item,x))!=-1) {
			count+=1;
			arr_data.splice(x,1);
		}
		if (count > 20) { // if number of specific industries more than 20
			arr_data[i] = new Array(arr_data[i],count);
			it = {};
			it["label"] = arr_data[i][0];
			it["value"] = count;
			pie_content.push(it);
		} // TODO: have to create additional section for all others, where numbers less than 20
		++i;
	}
	//console.log(pie_content);

	var wh = $(window).height();
	pie_h = (wh >= 670 && wh < 800) ? 260 : 380;
	pie_w = (wh >= 670 && wh < 800) ? 560 : 750;

	var pie_c = new d3pie("pieChart", {
		"header": {
			"title": {
				"fontSize": 24,
				"font": "open sans"
			},
			"subtitle": {
				"color": "#999999",
				"fontSize": 12,
				"font": "open sans"
			},
			"titleSubtitlePadding": 9
		},
		"footer": {
			"color": "#999999",
			"fontSize": 10,
			"font": "open sans",
			"location": "bottom-left"
		},
		"size": {
			"canvasHeight": pie_h, //380
			"canvasWidth": pie_w, //750 
			"pieOuterRadius": "70%"
		},
		"data": {
			"sortOrder": "value-desc",
			"content": pie_content
		},
		"labels": {
			"outer": {
				"pieDistance": 32
			},
			"inner": {
				"format": "none",
				"hideWhenLessThanPercentage": 3
			},
			"mainLabel": {
				"fontSize": 11
			},
			"percentage": {
				"color": "#ffffff",
				"decimalPlaces": 0
			},
			"value": {
				"color": "#adadad",
				"fontSize": 11
			},
			"lines": {
				"enabled": true
			},
			"truncation": {
				"enabled": true
			}
		},
		"tooltips": {
			"enabled": true,
			"type": "placeholder",
			"string": "{label}: {percentage}%"
		},
		"effects": {
			"pullOutSegmentOnClick": {
				"effect": "linear",
				"speed": 400,
				"size": 8
			}
		},
		"misc": {
			"gradient": {
				"enabled": true,
				"percentage": 100
			}
		},
		"callbacks": {
			// onClickSegment: function(a) {
			// 	alert("Segment clicked!");
			// 	console.log(a);
			//}
		}
	});
}
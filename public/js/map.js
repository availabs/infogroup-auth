//Setup Leaflet Map
var markerList = [];
//markers will contain the markers for the plugin markerClusterGroup
var markers = L.markerClusterGroup({    
    spiderfyOnMaxZoom: false,
    disableClusteringAtZoom: 20,
    chunkedLoading: true,
    chunkProgress: updateProgressBar
});
var usrMarkers = [];
var table;
var lat, lon;
var redoBuffer = [];

var mymap = L.map('mapid',{editable: true}).setView([40.755, -74.00], 13);
var drawnItems = new L.FeatureGroup().addTo(mymap);
L.tileLayer(
    'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 20,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(mymap);

//--- Init Control tools
L.EditControl = L.Control.extend({
    options: {
        position: 'topleft',
        callback: null,
        type: '',
        kind: '',
        html: ''
    },
    onAdd: function (map) {
        var container = L.DomUtil.create('div', '');
        switch (this.options.type){
            case 'draw':
                container = L.DomUtil.create('div', 'leaflet-control leaflet-bar');
                var link = L.DomUtil.create('a', '', container);
                link.href = '#';
                link.title = 'Create a new ' + this.options.kind;
                link.innerHTML = this.options.html;
                L.DomEvent.on(link, 'click', L.DomEvent.stop)
                .on(link, 'click', function () {
                    window.LAYER = this.options.callback.call(map.editTools);
                }, this);
                break;
            case 'query':
                container = L.DomUtil.create('div', 'leaflet-control leaflet-bar');
                var link = L.DomUtil.create('a', '', container);
                link.href = '#';
                link.title = 'Query drawing';
                link.innerHTML = this.options.html;
                L.DomEvent.on(link, 'click', L.DomEvent.stop)
                .on(link, 'click', loadDrawingEstablishments, this);
                break;
            default:
                var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar');
                break;
        }
        return container;
    }
});

L.NewPolygonControl = L.EditControl.extend({
    options: {
        position: 'topleft',
        callback: mymap.editTools.startPolygon,
        kind: 'polygon',
        html: '▰',
        type: 'draw'
    }
});

L.NewMarkerControl = L.EditControl.extend({
    options: {
        position: 'topleft',
        callback: mymap.editTools.startMarker,
        kind: 'marker',
        html: '🖈',
        type: 'draw'
    }
});

L.NewRectangleControl = L.EditControl.extend({
    options: {
        position: 'topleft',
        callback: mymap.editTools.startRectangle,
        kind: 'rectangle',
        html: '⬛',
        type: 'draw'
    }
});

L.NewCircleControl = L.EditControl.extend({
    options: {
        position: 'topleft',
        callback: mymap.editTools.startCircle,
        kind: 'circle',
        html: '⬤',
        type: 'draw'
    }
});

L.NewQueryControl = L.EditControl.extend({
    options: {
        position: 'topleft',
        callback: mymap.editTools.startCircle,
        kind: 'circle',
        html: '&#128269',
        type: 'query'
    }
});
L.EmptyControl = L.EditControl.extend({
    options: {
        position: 'topleft',
        callback: null,
        kind: '',
        html: '',
        type: ''
    }
});

// mymap.addControl(new L.NewPolygonControl());
mymap.addControl(new L.NewRectangleControl());
mymap.addControl(new L.NewCircleControl());
mymap.addControl(new L.NewMarkerControl());
mymap.addControl(new L.EmptyControl()); //space
mymap.addControl(new L.EmptyControl()); //space
mymap.addControl(new L.NewQueryControl());
//---

//---
// MAP EVENT LISTENERS
//---
// mymap.addEventListener('mousemove', function (ev) {
//     lat = ev.latlng.lat;
//     lon = ev.latlng.lng;
// });

// mymap.addEventListener("contextmenu", function (event) {
//     // Prevent the browser's context menu from appearing
//     // event.preventDefault();

//     if (usrMarkers.length !== 0) mymap.removeLayer(usrMarkers.pop());
//     // Add marker
//     let marker = L.marker([lat, lon]);
//     marker.addTo(mymap);
//     usrMarkers.push(marker);
//     loadDistanceEstablishments(lon, lat);
//     return false; // To disable default popup.
// });

mymap.on('editable:drawing:end', (e)=>{
    // console.log('end');
    usrMarkers.push(e.layer);
    drawnItems.addLayer(e.layer);
    // drawnItems.clearLayers();
});
mymap.on('editable:drawing:start', (e)=>{
    // console.log('start'); 
    usrMarkers.pop();
    drawnItems.clearLayers();
});

//Event listeners key down during drawing
var onKeyDown = function(e) {
    //ESC button to stop drawing.
    if (e.keyCode == 27) {
        if (!this.editTools._drawingEditor) return;
        this.editTools._drawingEditor.pop();
        //drawnItems.clearLayers();
        this.editTools.stopDrawing();
    }
    //UNDO button CTRL + Z.
    if (e.keyCode === 90 && e.ctrlKey) {
        if (!this.editTools._drawingEditor) {
            //Not drawing. Remove last feature.
            if(usrMarkers.length > 0){
                //usually 1 drawing
                usrMarkers.pop();
                drawnItems.clearLayers();
            }
            return;
        }
        latlng = this.editTools._drawingEditor.pop();
        if(!latlng) this.editTools.stopDrawing();
    }
};
L.DomEvent.addListener(document, 'keydown', onKeyDown, mymap);
//---
// END MAP EVENT LISTENER
//---


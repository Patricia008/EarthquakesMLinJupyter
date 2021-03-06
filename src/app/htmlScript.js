require([
	"esri/Map",
	"esri/views/MapView",
	"esri/Graphic",
	"esri/layers/GraphicsLayer",
	"esri/layers/FeatureLayer",
	"esri/symbols/PictureMarkerSymbol",
], function(Map, MapView, Graphic, GraphicsLayer, FeatureLayer, PMS) {
	
	const map = new Map({
		basemap: "topo-vector"
	})

	const graphicsLayer = new GraphicsLayer()
	map.add(graphicsLayer)

	var platesLayer = new FeatureLayer({
		url: "http://edumaps.esricanada.com/ArcGIS/rest/services/MapServices/TectonicPlates/MapServer"
	})
	map.add(platesLayer)

	// succession quakes
	// fetch('graph.json')
	// 	.then(response => response.json())
	// 	.then(jsonResponse => {
	// 		console.log(jsonResponse[0])
	// 		const view = new MapView({
	// 			container: "viewDiv",
	// 			map: map,
	// 			center: [jsonResponse[0][0].geometry.coordinates[0], jsonResponse[0][0].geometry.coordinates[1]],
	// 			zoom: 4,
	// 		})
		
	// 		jsonResponse.forEach(vertex => {
	// 			// Mark the earthquake with a point
	// 			createAndAddPoint(Graphic, graphicsLayer, vertex[0].geometry.coordinates[0], vertex[0].geometry.coordinates[1])
	// 			// Draw lines between earthquakes
	// 			// const adjQuakes = vertex[1]
	// 			// adjQuakes.forEach(adjVertex => {
	// 			// 	createAndAddArrow(
	// 			// 		PMS,
	// 			// 		Graphic,
	// 			// 		graphicsLayer,
	// 			// 		vertex[0].geometry.coordinates[0],
	// 			// 		vertex[0].geometry.coordinates[1],
	// 			// 		adjVertex.geometry.coordinates[0],
	// 			// 		adjVertex.geometry.coordinates[1]
	// 			// 	)
	// 			// })
	// 		})
	// 	})

	const radius = window.location.href.split('radius=')[1]

	const fileName = radius ? `quakes_radius${radius}.json` : `quakes_radius5000.json`
	// all quakes points
	fetch(fileName)
		.then(response => response.json())
		.then(jsonResponse => {
			console.log(jsonResponse[0])
			const view = new MapView({
				container: "viewDiv",
				map: map,
				center: jsonResponse[0] && [jsonResponse[0].geometry.coordinates[0], jsonResponse[0].geometry.coordinates[1]],
				zoom: 5,
			})

			const targetQuake = jsonResponse.shift()

			jsonResponse.forEach(vertex => {
				// Mark the earthquake with a point
				createAndAddPoint(Graphic, graphicsLayer, vertex.geometry.coordinates[0], vertex.geometry.coordinates[1], [226, 119, 40])
				// Draw lines between earthquakes
				// const adjQuakes = vertex[1]
				// adjQuakes.forEach(adjVertex => {
				// 	createAndAddArrow(
				// 		PMS,
				// 		Graphic,
				// 		graphicsLayer,
				// 		vertex[0].geometry.coordinates[0],
				// 		vertex[0].geometry.coordinates[1],
				// 		adjVertex.geometry.coordinates[0],
				// 		adjVertex.geometry.coordinates[1]
				// 	)
				// })
			})

			// add target quake in indigo, last to put it above
			createAndAddPoint(Graphic, graphicsLayer, targetQuake.geometry.coordinates[0], targetQuake.geometry.coordinates[1], [128,0,255])
		})

})

function createAndAddPoint(Graphic, graphicsLayer, long, lat, color) {
	const point = {
		type: "point",
		longitude:long,
		latitude: lat,
	};
	const simpleMarkerSymbol = {
		type: "simple-marker",
		color: color,
		outline: {
			color: [255, 255, 255],
			width: 1
		}
	};
	const pointGraphic = new Graphic({
		geometry: point,
		symbol: simpleMarkerSymbol
	});
	graphicsLayer.add(pointGraphic);
}

function createAndAddArrow(PMS, Graphic, graphicsLayer, long1, lat1, long2, lat2) {
	let animating = true;
	const simpleLineSymbol = {
		type: "simple-line",
		color: [226, 119, 40], // orange
		width: 1
	};

	const polyline = {
		type: "polyline",
		paths: [
			[long1, lat1],
			[long2, lat2],
		]
	  }

	const polylineGraphic = new Graphic({
		geometry: polyline,
		symbol: simpleLineSymbol
	})

	let dx = long2 - long1,
		dy = lat2 - lat1,
		rads = Math.atan2(dy, dx);
		
	if (rads < 0) {
		rads = Math.abs(rads);
	} else {
		rads = 2 * Math.PI - rads;
	}
	
	const degrees = (rads * 180 / Math.PI) + 180
	
	const arrowSymbol = new PMS({
		url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNTcxLjgxNXB4IiBoZWlnaHQ9IjU3MS44MTVweCIgdmlld0JveD0iMCAwIDU3MS44MTUgNTcxLjgxNSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTcxLjgxNSA1NzEuODE1OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTExNy41MTgsMjk2LjA0MmwzMzMuMTYxLDI3Mi4xMzJjOC4yODYsNi42NDYsMTIuMDYyLDMuOTQxLDguNDMtNi4wNGwtODguNDQyLTI2MC4wNDkgICAgYy0zLjYzLTkuOTgxLTMuNTk2LTI2LjE1NiwwLjA3Ni0zNi4xMjNsODguMjktMjU2LjI2YzMuNjcyLTkuOTY2LTAuMTAxLTEyLjcwMi04LjQzMS02LjExTDExNy41OTQsMjcyLjA3ICAgIEMxMDkuMjY1LDI3OC42NjEsMTA5LjIzMSwyODkuMzk1LDExNy41MTgsMjk2LjA0MnoiLz4KCTwvZz4KPC9nPgo8L3N2Zz4=',
		angle: degrees,
		color: [226, 119, 40], // orange
		})

	const arrowGeometry = { type: 'point', longitude: long2, latitude: lat2 }

	const arrowHeadGraphic = new Graphic({
		symbol: arrowSymbol,
		geometry: arrowGeometry,
	});

	graphicsLayer.addMany([polylineGraphic, arrowHeadGraphic]);
}

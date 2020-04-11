import EarthquakeModel from './EarthquakeModel'
import { writeToFile } from '../utils/fileHandlers'

let csv = `latitude,longitude,depth,mag\n`

export default class GraphModel {
	adjList: Map<EarthquakeModel, EarthquakeModel[]> = new Map<EarthquakeModel, EarthquakeModel[]>()

	addVertex = (v: EarthquakeModel) => {
		this.adjList.set(v, [])
		try {
			// tslint:disable-next-line:max-line-length
			csv += `${v.geometry.coordinates[1]},${v.geometry.coordinates[0]},${v.geometry.coordinates[2]},${v.properties.mag}\n`
		} catch (err) {
			console.error(err)
		}
	}

	addEdge = (v: EarthquakeModel, w: EarthquakeModel) => {
		this.adjList.get(v).push(w)
	}

	isVertexPresent = (v: EarthquakeModel) => {
		for (const [key, value] of this.adjList) {
			if (key.id === v.id) {
				return key
			}
		}

		return false
	}

	isEdgePresent = (a: EarthquakeModel, b: EarthquakeModel) => {
		if (!this.isVertexPresent(a)) {
			return false
		}
		if (!this.adjList.get(a)) {
			this.adjList.set(a, [])

			return false
		}
		this.adjList.get(a).forEach(vertex => {
			if (vertex.id === b.id) {
				return true
			}
		})

		return false
	}

	writeGraphToFile = (filename) => {
		writeToFile(filename + '.json', JSON.stringify([...this.adjList]))
		writeToFile(filename + '.csv', csv)
	}


	printGraph = () => {
		for (const vertex of this.adjList.keys()) {
			const children = this.adjList.get(vertex)
			let auxString = ''
			// Vertex has no edges
			if (!(children instanceof Array)) {
				continue
			}
			for (const child of children) {
				auxString += child.properties.title + ` (${child.properties.time})` + ', '
			}
			console.log(vertex.properties.title + ` (${vertex.properties.time})` + ' -> ' + auxString)
		}
	}
}

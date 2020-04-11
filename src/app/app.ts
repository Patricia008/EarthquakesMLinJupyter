import { buildGraph } from '../graph/graphOps'
import GraphModel from '../graph/GraphModel'
import { writeToFile } from '../utils/fileHandlers'
import { getAllQuakesForParams } from '../services/QuakesService'

// export const computeAndExportToMap = async () => {
// 	const graph = new GraphModel()
// 	await buildGraph(graph, counties.CHILE)
// 	graph.printGraph()
// 	graph.writeToGeoJsonFile('out/quakes.json')
// }

export const computeAndExportToGraphJson = async () => {
	const graph = new GraphModel()
	await buildGraph(graph)
	graph.printGraph()
	graph.writeGraphToFile('src/graph')
}

// get all earthquakes in region
export const getAllQuakes = async () => {

	const {quakes, csv} = await getAllQuakesForParams()
	writeToFile('src/quakes.json', JSON.stringify(quakes))
	writeToFile('src/quakes.csv', csv)
}

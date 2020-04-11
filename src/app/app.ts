import { buildGraph } from '../graph/graphOps'
import GraphModel from '../graph/GraphModel'
import { writeToFile } from '../utils/fileHandlers'
import { getAllQuakesForParams } from '../services/QuakesService'
import { applyPredictionAlgo } from '../services/MLService'

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


export const getAllRadiusCombinations = async () => {
	await getAllQuakes('50')
	await getAllQuakes('200')
	await getAllQuakes('1000')
	await getAllQuakes('1500')
	await getAllQuakes('3000')
	await getAllQuakes('5000')
}

// get all earthquakes in region
const getAllQuakes = async (radius: string) => {

	const {quakes, csv} = await getAllQuakesForParams(radius)

	// for map
	writeToFile(`src/quakes_radius${radius}.json`, JSON.stringify(quakes))
	// for notebook
	writeToFile(`jupyter/quakes_radius${radius}.csv`, csv)

	// can't do this in node, takes too long
	// await applyPredictionAlgo(quakes)
}

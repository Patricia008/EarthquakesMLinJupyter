import EarthquakeModel from '../graph/EarthquakeModel'
import { writeToFile } from '../utils/fileHandlers'
import { getAllQuakesForParams } from '../services/QuakesService'
import { callJupyterForRadius } from '../services/CallPythonService'
import { getCustomEarthquakesInRadius } from '../fetchData/fetchData'
import { coordinates } from '../config/regionCoordinates'
import parameterConfig from '../config/parameterConfig'

export const getAllRadiusCombinations = async () => {
	// write form here, in order to be written only once
	// tslint:disable-next-line:max-line-length
	writeToFile(`jupyter/predictions.csv`, `Radius,Real_Magnitude,Random_Forest_Classifier,Multi_Layer_Perceptron,MLP_With_Scaling,Logistic_Regression,Support_Vector_Machines\n`)

	// first quake (for which we predict) should always be the same for all computations, radius and params
	const targetQuake = await getTargetQuake()
	if (!targetQuake) {

		// if no earthquakes found, clean up files
		for (const r of parameterConfig.RADIUSES) {

			writeToFile(`src/quakes_radius${r}.json`, JSON.stringify(``))
			writeToFile(`jupyter/quakes_radius${r}.csv`, ``)
		}

		return
	}

	for (const r of parameterConfig.RADIUSES) {
		await getAllQuakes(r, targetQuake)
		callJupyterForRadius(r)
	}
	// get quakes without location contraints
	// await getAllQuakes('global', targetQuake)
	// callJupyterForRadius('global')
}

// get all earthquakes in region
const getAllQuakes = async (radius: string, targetQuake: EarthquakeModel) => {

	const {quakes, csv} = await getAllQuakesForParams(radius, targetQuake)

	// for map
	writeToFile(`src/quakes_radius${radius}.json`, JSON.stringify(quakes))
	// for notebook
	writeToFile(`jupyter/quakes_radius${radius}.csv`, csv)

	// can't do this in node, takes too long
	// await applyPredictionAlgo(quakes)
}

const getTargetQuake = async (): Promise<EarthquakeModel> => {
	const usgsData = await getCustomEarthquakesInRadius(
		coordinates[parameterConfig.START_POINT],
		// get first earthquake, radius 100 km from selected coordinates
		'100',
		parameterConfig.STARTTIME,
		parameterConfig.ENDTIME,
		// most recent
		'time',
		// limit
		'1',
		// offset
		'1',
	)

	if (!(usgsData.features instanceof Array)) {
		console.log('Failed Response', usgsData)

		return null
	}

	if (usgsData.features.length === 0) {
		console.log('No earthquakes found')

		return null
	}
	const entry = usgsData.features[0]
	const quakeModel = new EarthquakeModel(entry)

	return quakeModel
}

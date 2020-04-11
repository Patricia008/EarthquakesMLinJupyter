import EarthquakeModel from '../graph/EarthquakeModel'
import { RandomForestClassifier } from 'random-forest-classifier'

export async function applyPredictionAlgo(quakes: EarthquakeModel[]) {
	// this takes too long compared to python

	// REMOVE NULLS
	const quakesWithoutNulls = quakes.filter(q => q.properties.mag)

	const dataset = quakesWithoutNulls.map(quake => ({
		longitude: quake.geometry.coordinates[0],
		latitude: quake.geometry.coordinates[1],
		depth: quake.geometry.coordinates[2],
		mag: quake.properties.mag,
	}))

	const datasetTrain = [...dataset]
	datasetTrain.splice(0, 1)
	const datasetTest = [dataset[0]]

	const datasetMag = dataset.map(quake => quake.mag)
	const datasetNoMag = dataset.map(quake => ({
		longitude: quake.longitude,
		latitude: quake.latitude,
		depth: quake.depth,
	}))


	// remove first element for which we want to predict
	const xTrain = [...datasetNoMag]
	xTrain.splice(0, 1)
	const xTest = [datasetNoMag[0]]
	const yTrain = [...datasetMag]
	yTrain.splice(0, 1)
	const yTest = [datasetMag[0]]

	console.log('Real magnitude', yTest)
	await applyRFC(datasetTrain, datasetTest)

}

function applyRFC(trainData, testData) {
	const rfc = new RandomForestClassifier({
		n_estimators: 10,
	})

	/*
		parameters

		data: training data array
		features: if null it defaults to all features except the target, otherwise it only uses the array of features passed
		target: the target feature
	*/
	rfc.fit(trainData, null, 'mag', (err, trees) => {
		if (err) {
			console.log(err)
		}
		console.log(JSON.stringify(trees, null, 4))
		const pred = rfc.predict(testData, trees)
		console.log('Predicted: ', pred)
		// pred = ["virginica", "setosa"]
	})
}

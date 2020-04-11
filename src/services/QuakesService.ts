
import { getCustomEarthquakesInRadius } from '../fetchData/fetchData'
import { coordinates } from '../config/regionCoordinates'
import parameterConfig from '../config/parameterConfig'
import EarthquakeModel from '../graph/EarthquakeModel'

export async function getAllQuakesForParams(radius: string) {
	const quakes = []
	let csv = `latitude,longitude,depth,mag\n`
	let offset = 1
	let usgsData = await getCustomEarthquakesInRadius(
		coordinates[parameterConfig.START_POINT],
		radius,
		parameterConfig.STARTTIME,
		parameterConfig.ENDTIME,
		'time',
		parameterConfig.LIMIT,
		'' + offset,
	)

	offset += usgsData.metadata.count

	if (!(usgsData.features instanceof Array)) {
		console.log('Failed Response', usgsData)
	}

	if (usgsData.features.length === 0) {
		console.log('No earthquakes found')
	}

	for (const entry of usgsData.features) {
		const quakeModel = new EarthquakeModel(entry)
		// tslint:disable-next-line:max-line-length
		csv += `${entry.geometry.coordinates[1]},${entry.geometry.coordinates[0]},${entry.geometry.coordinates[2]},${entry.properties.mag}\n`
		quakes.push(quakeModel)
	}

	while (
		usgsData.metadata.count === usgsData.metadata.limit &&
		offset + usgsData.metadata.count < parameterConfig.MAX_GRAPH_SIZE) {
		usgsData = await getCustomEarthquakesInRadius(
			coordinates[parameterConfig.START_POINT],
			parameterConfig.RADIUS,
			parameterConfig.STARTTIME,
			parameterConfig.ENDTIME,
			'time',
			parameterConfig.LIMIT,
			'' + offset,
		)
		offset += usgsData.metadata.count
		if (!(usgsData.features instanceof Array)) {
			console.log('Failed Response', usgsData)
		}

		for (const entry of usgsData.features) {
			const quakeModel = new EarthquakeModel(entry)
			// tslint:disable-next-line:max-line-length
			csv += `${entry.geometry.coordinates[1]},${entry.geometry.coordinates[0]},${entry.geometry.coordinates[2]},${entry.properties.mag}\n`
			quakes.push(quakeModel)
		}
	}

	return {quakes, csv}
}

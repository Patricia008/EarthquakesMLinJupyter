import { coordinates } from '~/config/regionCoordinates'

export default class EarthquakeModel {

	properties: {
		mag: number,
		place: string,
		time: string,
		tsunami: number,
		title: string,
		magType: string,
	}
	geometry: {
		type: string,
		// [longitude, latitude, depth]
		coordinates: number[],
	}
	id: string
	visited: boolean

	constructor(data) {
		Object.assign(this, data)
		this.properties.time = new Date(data.properties.time).toISOString()
	}

	equals(target: EarthquakeModel) {

		// tslint:disable-next-line:no-unused-expression
		return this.properties.mag === target.properties.mag &&
			this.properties.place === target.properties.place &&
			this.properties.time === target.properties.time &&
			this.geometry.coordinates[0] === target.geometry.coordinates[0] &&
			this.geometry.coordinates[1] === target.geometry.coordinates[1] &&
			this.geometry.coordinates[2] === target.geometry.coordinates[2]
	}
}

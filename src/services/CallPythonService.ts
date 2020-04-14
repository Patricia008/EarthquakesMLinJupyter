import { exec } from 'child_process'

export function callJupyterForRadius(radius: string) {
	exec(`cd ./jupyter; inputFileName='quakes_radius${radius}.csv' runipy PredictMagnitude.ipynb`,
		(err, stdout, stderr) => {
			if (err) {
			console.error(err)
			} else {
				console.log(`stdout: ${stdout}`)
				console.log(`stderr: ${stderr}`)
			}
		})
}

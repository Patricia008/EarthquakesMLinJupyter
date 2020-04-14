# EarthquakesMLinJupyter
Jupyter notebook: Predict earthquake magnitude based on position and depth

## Jupyter notebook

### Usage

`cd ./jupyter`
`inputFileName='quakes_radius1500.csv' runipy PredictMagnitude.ipynb`

## Node

### Usage

run with
`npm start`
<br/>

Edit the desired starting point, start date and other params(radius, graph size) in src/config/parameterConfig.ts<br/>
If not already there, add the coordinates of the desired starting point in src/config/regionCoordinates.ts<br/>


### Debugging

for VSCode,<br/>
run
`tsc`
to generate the js files in the 'built' folder<br/>
then go to 'built/index.js' file and press F5<br/>
select Node.js from the dropdown<br/>

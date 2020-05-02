# EarthquakesMLinJupyter
Jupyter notebook: Predict earthquake magnitude based on position and depth

Given a fixed point(longitude and latitude), data is fetched from the USGS and exported to csv files. Then, a jupyter notebook is called with the files as input. In the python part, there are used five different machine learning algorithms with different configurations, trying to predict the magnitude of the target point: Random Forest Classifier, Multi Layer Perceptron without data scaling, Multi Layer Perceptron with data scaling, Logistic Regression and Support Vector Machines. This process is done for different radiuses around the target earthquake. Outputs from each approach is written to a file which is given as input to another notebook, used for plots. There, data is visualized in the form of graphs: Magnitude VS Radius for each of the algorithms and Magnitude VS Algorithm for each of the chosen radiuses.

## Node

### Usage

run with
`npm start`
<br/>

Edit the desired starting point, start date and other params(radius, graph size) in src/config/parameterConfig.ts<br/>
If not already there, add the coordinates of the desired starting point in src/config/regionCoordinates.ts<br/>
The program will generate csv files with earthquake data that are fed to jupyter notebook ML algorithms and outputed in predictions.csv <br/>
Map displays earthquakes used for the prediction of the magnitude with radius param = 5000 <br/>
To see another representation, change in url ?radius=5000 to ??radius=radiusWhatever <br/>
To see the plots, go to ./jupyter and run: <br/>
`jupyter notebook` <br/>
then open 'Plots.ipynb' and run it

### Debugging

for VSCode,<br/>
run
`tsc`
to generate the js files in the 'built' folder<br/>
then go to 'built/index.js' file and press F5<br/>
select Node.js from the dropdown<br/>


## Jupyter notebook

### Usage

`cd ./jupyter`
`inputFileName='quakes_radius1500.csv' runipy PredictMagnitude.ipynb`

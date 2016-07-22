/**
 * @ngdoc function
 * @name Google Annotation Chart
 * @author Yianni Ververis
 * @email yianni.ververis@qlik.com
 * @description
 * Google Annotation Chart as found
 * https://developers.google.com/chart/interactive/docs/gallery/annotationchart
 */

define( [
	"qlik", 
	"https://www.gstatic.com/charts/loader.js"
	], function ( qlik ) {
		"use strict";
		return {
			initialProperties: {
				qHyperCubeDef: {
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [{
						qWidth: 7,
						qHeight: 900
					}]
				}
			},
			definition: {
				type: "items",
				component: "accordion",
				items: {
					dimensions: {
						uses: "dimensions",
						min: 3, // Date, Annotation Title, Annotation Description
						max: 3
					},
					measures: {
						uses: "measures",
						min: 1, // For each line
						max: 4
					},
					sorting: {
						uses: "sorting"
					},
					settings : {
						uses : "settings",
						items: {
							Chart: {
								type: "items",
								label: "Settings",
								items: {
									displayAnnotations: {
										type: "boolean",
										component: "switch",
										label: "Display Annotations",
										ref: "vars.displayAnnotations",
										options: [{
											value: true,
											label: "On"
										}, {
											value: false,
											label: "Off"
										}],
										defaultValue: true
									},
									displayAnnotationsFilter: {
										type: "boolean",
										component: "switch",
										label: "Annotations Filter",
										ref: "vars.displayAnnotationsFilter",
										options: [{
											value: true,
											label: "On"
										}, {
											value: false,
											label: "Off"
										}],
										defaultValue: true
									},
									displayDateBarSeparator: {
										type: "boolean",
										component: "switch",
										label: "Bar Separator",
										ref: "vars.displayDateBarSeparator",
										options: [{
											value: true,
											label: "On"
										}, {
											value: false,
											label: "Off"
										}],
										defaultValue: true
									},
									displayZoomButtons: {
										type: "boolean",
										component: "switch",
										label: "Zoom Buttons",
										ref: "vars.displayZoomButtons",
										options: [{
											value: true,
											label: "On"
										}, {
											value: false,
											label: "Off"
										}],
										defaultValue: true
									},
									displayRangeSelector: {
										type: "boolean",
										component: "switch",
										label: "Range Selector",
										ref: "vars.displayRangeSelector",
										options: [{
											value: true,
											label: "On"
										}, {
											value: false,
											label: "Off"
										}],
										defaultValue: true
									},
									annotationWidth: {
										type: "number",
										expression: "none",
										label: "Annoation Panel Width",
										component: "slider",
										ref: "vars.annotationWidth",
										defaultValue: 25,
										min: 5,
										max: 80
									},
									headers: {
										type: "string",
										expression: "none",
										label: "Line Headers (In single quotes separated by comma)",
										defaultValue: "'Date', 'Line 1 Title','Annotation Title','Annotation Description','Line 2 Title','Line 3 Title','Line 4 Title'",
										ref: "vars.thickness"
									},
									colors: {
										type: "string",
										expression: "none",
										label: "Line Colors (HEX value separated by comma)",
										defaultValue: "#cc3c3c,#395878,#c88d8d,#6f92b5",
										ref: "vars.colors"
									},
									thickness: {
										type: "number",
										expression: "none",
										label: "Line Thickness",
										component: "slider",
										ref: "vars.thickness",
										defaultValue: 1,
										min: 1,
										max: 5
									},
								}
							}
						}
					}
				}
			},
			support: {
				snapshot: true,
				export: true,
				exportData: true
			},
			paint: function ($element,layout) {
				console.log(layout)
				// layout.vars = {};
				// console.log(layout.qHyperCube.qDataPages[0].qMatrix)
				var vars = {
					v: '1.0.1',
					id: layout.qInfo.qId,
					field: layout.qHyperCube.qDimensionInfo[0].qFallbackTitle,
					data: layout.qHyperCube.qDataPages[0].qMatrix,
					height: $element.height(),
					width: $element.width(),
					this: this,
					chart: null,
					// headers: ['Date', 'Trump','Annotation Title','Annotation Description','Clinton','Cruz','Sanders'],
					headers: (layout.vars.headers) ? layout.vars.headers.split(',') : ['Date', 'Line 1 Title','Annotation Title','Annotation Description','Line 2 Title','Line 3 Title','Line 4 Title'],
					options: {
						displayAnnotations: (layout.vars.displayAnnotations) ? true : false,
						colors: (layout.vars.colors) ? layout.vars.colors.split(',') : ['#cc3c3c','#395878','#c88d8d','#6f92b5'],
						displayAnnotationsFilter: (layout.vars.displayAnnotationsFilter) ? true : false,
						displayDateBarSeparator: (layout.vars.displayDateBarSeparator) ? true : false,
						displayZoomButtons: (layout.vars.displayZoomButtons) ? true : false,
						displayRangeSelector: (layout.vars.displayRangeSelector) ? true : false,
						thickness: (layout.vars.thickness) ? layout.vars.thickness : 1,
					},
				}
				console.log(vars)

				// Create the CSS for this object before drawing it
				vars.css = '\n\
					#' + vars.id + ' {\n\
						height: ' + vars.height + 'px; \n\
					}\n\
				';
				$("<style>").html(vars.css).appendTo("head");

				// Create the holder with the unique id
				vars.template = '\
					<div qv-extension class="google-annotation-chart" id="' + vars.id + '">\
					</div>\n\
				';
				$element.html(vars.template);
// console.log(google.visualization)
				// Start Creating the Google Annotation Chart
				if (typeof google.visualization === 'undefined') {
					google.charts.load('current', {'packages':['annotationchart']});
				}
				var table = [vars.headers];
				for (var i=0; i<vars.data.length; i++) {
					// eventType = (vars.data[i][1].qText!=='-') ? vars.data[i][1].qText : null;
					// event = (vars.data[i][2].qText!=='-') ? vars.data[i][2].qText : null;
					table.push([
						new Date(vars.data[i][0].qText), 
						vars.data[i][3].qNum, 
						(vars.data[i][1].qText!=='-') ? vars.data[i][1].qText : null, 
						(vars.data[i][2].qText!=='-') ? vars.data[i][2].qText : null, 
						vars.data[i][4].qNum, 
						vars.data[i][5].qNum, 
						vars.data[i][6].qNum]);
				}
				google.charts.setOnLoadCallback(drawChart);
				function drawChart() {
					var data = google.visualization.arrayToDataTable(table, false); // 'false' means that the first row contains labels, not data.
					vars.chart = new google.visualization.AnnotationChart(document.getElementById(vars.id));
					vars.chart.draw(data, vars.options);
					// me.chart.setVisibleChartRange(obj.zoomStart, obj.zoomEnd)                            
				}

				console.info('%c Google Annotation Chart ' + vars.v + ': ', 'color: red', '#' + vars.id + ' Loaded!');

				//needed for export
				return qlik.Promise.resolve();
			},
		};

	} );

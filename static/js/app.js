// Get the Samples endpoint
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the metadata from Samples JSON data 
function meta_data(sample){
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        //Fetch the sample metadata to match with id
        let results = metadata.filter(x => x.id == sample)
        let result = results[0]
        let table = d3.select("#sample-metadata")
        //reset the table data before populating selected Demographic Info
        table.html("")
        //populate the table data with the selected Demographic Info
        Object.entries(result).forEach(([key, value]) => {
            table.append("h6").text(`${key}: ${value}`)
        })
    })      
}

function plot_metadata(sample){
    d3.json(url).then((data) => {
        let sampledata = data.samples;
        let results = sampledata.filter(x => x.id == sample)
        let result = results[0]        
        let otu_ids = result.otu_ids
        // console.log(otu_ids);
        let sample_value = result.sample_values
        let otu_labels = result.otu_labels        
       
         // Bar Chart
         // Trace1 for the sample bubble chart
        let trace1 = {
            x: sample_value.slice(0, 10).reverse(),
            y: otu_ids.slice(0, 10).map(otu_ids => ` OTU ${otu_ids}`).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            name: "Demographic Info",
            type: "bar",
            orientation: "h"
        };
        // Data array
        let traceData = [trace1];
        // Apply a title to the layout
        let layout = {
            title: "Top Ten OTUs of " + sample,
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
              }
        };
        Plotly.newPlot("bar", traceData, layout);
  

        // Bar Chart
         // Trace1 for the sample bubble chart
         let trace2 = {
            x: otu_ids,
            y: sample_value,
            text: otu_labels,
            mode:"markers",
            marker: {
                size: sample_value,
                color: otu_ids,
                colorscale: "Viridis"
            }
        };
        // Data array
        let traceData1 = [trace2];
        // Apply a title to the layout
        let layout1 = {
            xaxis: { title: "OTU ID " + sample },

        };
        Plotly.newPlot("bubble", traceData1, layout1);


    })  
}


// Bonus - plot for the gauge chart 
function plot_gauge(sample) {
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let results = metadata.filter(x => x.id == sample)
        let wfreq = results[0]["wfreq"]
        console.log(wfreq)

        // Gauge chart 
        let trace3 = [
            {
                type: "indicator",
                mode: "gauge+number",
                value: wfreq,
                title: { text: "Belly Button Washing Frequency <br><i>Scrubs per Week</i>", font: { size: 20 } },
                gauge: {

                    axis: { range: [null, 9] },
                    steps: [
                        { range: [0, 1], color: '#009a60' },
                        { range: [1, 2], color: '#4aa84e' },
                        { range: [2, 3], color: '#92b73a' },
                        { range: [3, 4], color: '#c6bf22' },
                        { range: [4, 5], color: '#edbd02' },
                        { range: [5, 6], color: '#ffad00' },
                        { range: [6, 7], color: '#ff8c00' },
                        { range: [7, 8], color: '#fc6114' },
                        { range: [8, 9], color: '#f43021' },

                    ],

                }
            }
        ];

        let traceData2 = trace3

        let layout2 = {

            margin: { t: 55,
                      r: 25, 
                      l: 25,
                      b: 25 },


        };
        Plotly.newPlot('gauge', traceData2, layout2);


    });
}



// create a init function to display the data on loading the page
function init() {
    let selectedOption = d3.select("#selDataset")
    d3.json(url).then((data) => {
    let names = data.names
        names.forEach((sample) => {
            selectedOption.append("option").text(sample).property("value", sample)
        })
            let firstSample = names[0]
            meta_data(firstSample)

        })
}
init()
// create a function to update based on optionChanged event
function optionChanged(newSample) {
    meta_data(newSample)
    plot_metadata(newSample)
    plot_gauge(newSample)    
}

// Creating function for Data plotting (Bar, gauge, bubble)
// Read JSON (samples.json)
d3.json("samples.json").then(function (data) {
    console.log(data);

    //Define the variables for the samples
    var samples = data.samples;
    console.log(samples)

    var otuid = data.names[0];
    console.log(otuid);

    updateCharts(otuid);
});


function updateCharts(otuid) {

    d3.json("samples.json").then(function (data) {

        samples = data.samples.filter(s => s.id.toString() == otuid);
        metadata = data['metadata'];
        names = data['names'];

        //sampleValues = samples.filter(s => s['id'] == otuid)[0];
        sampleValues = samples[0].sample_values.slice(0, 10).reverse();
        console.log(sampleValues)
        metadataValues = metadata.filter(m => m['id'] == otuid)[0];

        wfreq = metadataValues['wfreq'];

        // get only top 10 otu ids for the plot OTU and reversing it. 
        var top_OTU = samples[0].otu_ids.slice(0, 10).reverse();
        console.log(top_OTU)

        // get the otu id's to the desired form for the plot
        var id_OTU = top_OTU.map(d => "OTU " + d);
        console.log(`OTU IDS: ${id_OTU}`)


        // get the top 10 labels for the plot
        var labels = samples[0].otu_labels.slice(0, 10);
        console.log(labels)

        //Setup of the horizontal bar chart
        // create trace variable for the horizontal bar plot
        var trace = {
            x: sampleValues,
            y: id_OTU,
            text: labels,
            marker: {
                color: "#8C9EFF"
            },
            type: "bar",
            orientation: "h",
        };

        // create data variable
        var data = [trace];

        // create layout variable to set plots layout
        var layout = {
            title: "Horizontal Bar Chart of the Top 10 OTU",
            yaxis: {
                tickmode: "linear",
            },
        };

        // create the bar plot
        Plotly.newPlot("bar", data, layout);

        //Setup of the bubble chart
        //Define variables for the otu_ids
        var sampleIds = samples[0].otu_ids;
        console.log(sampleIds)


        // create trace variable for the horizontal bar plot
        var trace1 = {
            x: sampleIds,
            y: sampleValues,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: sampleIds
            },
            text: labels

        };

        // set the layout for the bubble plot
        var layout_b = {
            title: "Bubble Chart of Belly Button Biodiversity",
            height: 600,
            width: 1000
        };

        // creating data variable 
        var data1 = [trace1];

        // create the bubble plot
        Plotly.newPlot("bubble", data1, layout_b);

        // The guage chart

        var data_gauge = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: parseFloat(wfreq),
                title: { text: 'Belly Button Washing Frequency' },
                type: "indicator",

                mode: "gauge+number",
                //delta: { reference: 380 },
                gauge: {
                    axis: { range: [null, 9] },
                    steps: [
                        { range: [0, 1], color: 'rgb(243, 229, 245)' },
                        { range: [1, 2], color: 'rgb(225, 190, 231)' },
                        { range: [2, 3], color: 'rgb(206, 147, 216)' },
                        { range: [3, 4], color: 'rgb(186, 104, 200)' },
                        { range: [4, 5], color: 'rgb(171, 71, 188)' },
                        { range: [5, 6], color: 'rgb(156, 39, 176)' },
                        { range: [6, 7], color: 'rgb(142, 36, 170)' },
                        { range: [7, 8], color: 'rgb(123, 31, 162)' },
                        { range: [8, 9], color: 'rgb(106, 27, 154)' },
                        { range: [9, 10], color: 'rgb(74, 20, 140)' }
                    ],

                }

            }
        ];

        var layout_gauge = {
            width: 700,
            height: 600,
            margin: { t: 0, b: 0 }
            //margin: { t: 20, b: 40, l: 100, r: 100 }
        };
        Plotly.newPlot("gauge", data_gauge, layout_gauge);
    });
}

// Display the sample metadata 
d3.json("samples.json").then(function (data) {
    console.log(data);

    //Define the variables for the samples
    var samples = data.samples;
    console.log(samples)

    var otuid = data.names[0];
    console.log(otuid);

    getDemoInfo(otuid);

});
function getDemoInfo(otuid) {

    d3.json("samples.json").then(function (data) {
        console.log(data);

        // get all metadata for an individual via filtering by selected id
        var metaResult = metadata.filter(meta => meta.id.toString() == otuid)[0];
        console.log(metaResult)

        // select demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");
        console.log(demographicInfo)


        // //need to empty the container each time this is called, otherwise the data will just be tacked on the end (append)
        d3.select("#sample-metadata").html("");

        // Put into html
        Object.entries(metaResult).forEach((key) => {
            demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");

        });
    });

}

// create the function for the change event
function optionChanged(otuid) {

    dropDown = d3.select('#selDataset').node();
    selected_otu = dropDown.value;
    updateCharts(selected_otu);
    getDemoInfo(selected_otu);


}

// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("samples.json").then((data) => {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function (name) {
            dropdown.append("option").text(name).property("value");
        });

    });
}

init();

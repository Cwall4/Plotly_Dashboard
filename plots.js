function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
  })

  console.log(940);

  // This is my attempt to have the page display ID 940's info on opening the page.
  // Currently simply feeding it the correct value, but I'd like to figure out how to return the value via code.
  optionChanged(940);
};

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    // 12.4.3: Skill Drill
    PANEL.html("");
    PANEL.append("h6").text("ID: " + result.id);
    PANEL.append("h6").text("ETHNICITY: " + result.ethnicity);
    PANEL.append("h6").text("GENDER: " + result.gender);
    PANEL.append("h6").text("AGE: " + result.age);
    PANEL.append("h6").text("LOCATION: " + result.location);
    PANEL.append("h6").text("BBTYPE: " + result.bbtype);
    PANEL.append("h6").text("WFREQ: " + result.wfreq);
  });
}

function buildCharts(volunteer) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == volunteer);
    var result = resultArray[0];
    // console.log(result);

    // Looks like species are already sorted by sample_values, descending order.
    // var sortedResult = result.sort((a,b) => b.sample_values - a.sample_values); 
    // var topTenResults = result.map(row => row.slice(0,10));

    var sampleValues = result.sample_values;
    var otuIDs = result.otu_ids;
    var otuLabels = result.otu_labels;

    // Trace for the species bar graph
    var traceBar = {
      x: sampleValues.slice(0,10).reverse(),
      y: otuIDs.slice(0,10).reverse().map(id => "OTU " + id), // Maps the ids to include the OTU at the start
      text: otuLabels.slice(0,10).reverse(),
      name: "Top Species",
      type: "bar",
      orientation: "h"
    };

    // Define the bar layout
    var layoutBar = {
      title: "Top 10 bacterial species",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      },
      xaxis: { title: "Sample Value" }
    };

    // Render the plot to the div tag with id "bar"
    Plotly.newPlot("bar", [traceBar], layoutBar);
    
    // Trace for the species bar graph
    var traceBubble = {
      x: otuIDs,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: otuIDs,
        size: sampleValues
      }
    };

    // Define the bubble layout
    var layoutBubble = {
      title: "Sample values of bacterial species",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      },
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Value"}
    };

    // Render the plot to the div tag with id "bubble"
    Plotly.newPlot("bubble", [traceBubble], layoutBubble);
  });
}

init();
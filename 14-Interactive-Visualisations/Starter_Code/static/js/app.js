// Define the URL for the JSON data
const dataUrl = "samples.json";

// Function to create the bar chart
function createBarChart(sampleID) {
    // Load the JSON data
    d3.json(dataUrl).then(data => {
        // Filter data for the selected sample
        const sampleData = data.samples.filter(sample => sample.id === sampleID)[0];

        // Extract necessary data for the bar chart
        const otuIds = sampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        const sampleValues = sampleData.sample_values.slice(0, 10);
        const otuLabels = sampleData.otu_labels.slice(0, 10);

        // Create the bar chart using Plotly
        const trace = {
            type: 'bar',
            x: sampleValues,
            y: otuIds,
            text: otuLabels,
            orientation: 'h'
        };

        const data = [trace];

        const layout = {
            title: 'Top 10 OTUs Found in Individual',
            xaxis: { title: 'Sample Values' },
            yaxis: { title: 'OTU IDs' }
        };

        Plotly.newPlot('bar', data, layout);
    });
}

// Function to create the bubble chart
function createBubbleChart(sampleID) {
    // Load the JSON data
    d3.json(dataUrl).then(data => {
        // Filter data for the selected sample
        const sampleData = data.samples.filter(sample => sample.id === sampleID)[0];

        // Extract necessary data for the bubble chart
        const otuIds = sampleData.otu_ids;
        const sampleValues = sampleData.sample_values;
        const otuLabels = sampleData.otu_labels;

        // Create the bubble chart using Plotly
        const trace = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: 'Viridis', // You can choose a different colorscale
                opacity: 0.5
            }
        };

        const data = [trace];

        const layout = {
            title: 'Bubble Chart for Sample',
            xaxis: { title: 'OTU IDs' },
            yaxis: { title: 'Sample Values' }
        };

        Plotly.newPlot('bubble', data, layout);
    });
}

// Function to populate the dropdown menu
function populateDropdown() {
    // Load the JSON data
    d3.json(dataUrl).then(data => {
        // Extract sample names from the data
        const sampleNames = data.names;

        // Populate the dropdown menu with sample names
        const dropdown = d3.select("#selDataset");
        sampleNames.forEach(sample => {
            dropdown.append("option").text(sample).property("value", sample);
        });

        // Call the createBarChart and createBubbleChart functions with the default sample
        const defaultSample = sampleNames[0];
        createBarChart(defaultSample);
        createBubbleChart(defaultSample);
        updateDemographicInfo(defaultSample);
    });
}

// Function to update demographic information
function updateDemographicInfo(sampleID) {
    // Load the JSON data
    d3.json(dataUrl).then(data => {
        // Filter data for the selected sample
        const sampleMetadata = data.metadata.filter(metadata => metadata.id === +sampleID)[0];
        const metadataPanel = d3.select("#sample-metadata");

        // Clear existing content
        metadataPanel.html("");

        // Iterate through key-value pairs and display them
        Object.entries(sampleMetadata).forEach(([key, value]) => {
            metadataPanel.append("p").text(`${key}: ${value}`);
        });
    });
}

// Function to handle dropdown selection change
function optionChanged(selectedSample) {
    createBarChart(selectedSample);
    createBubbleChart(selectedSample);
    updateDemographicInfo(selectedSample);
}

// Call the populateDropdown function to initialize the dropdown
populateDropdown();

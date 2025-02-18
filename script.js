// Set chart dimensions
const margin = { top: 50, right: 30, bottom: 50, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create SVG container for the main graph
const svg = d3.select("svg")
    .attr("width", 1000)
    .attr("height", 1000)
    .append("g")
    .attr("transform", `translate(${60},${margin.top})`);

// Tooltip for displaying information on hover
const tooltip = d3.select(".tooltip");

// Load both CSV files: Glucose and Food data
Promise.all([
    d3.csv("Glucose.csv"),
    d3.csv("Food.csv")
]).then(function([glucoseData, foodData]) {

    // Log column names to verify the correct columns
    console.log("Glucose Data Columns:", glucoseData.columns);
    console.log("Food Data Columns:", foodData.columns);

    // Process Glucose data (for the line graph)
    glucoseData.forEach(d => {
        d.Timestamp = new Date(d["Timestamp (YYYY-MM-DDThh:mm:ss)"]);
        d.Glucose = +d["Glucose Value (mg/dL)"] || 0;
    });

    // Process Food data (for the bar chart)
    foodData.forEach(d => {
        d.Timestamp = new Date(d["time_begin"]);
        d.Calories = +d["calorie"] || 0;
        d.Protein = +d["protein"] || 0;
        d.Carb = +d["total_carb"] || 0;
        d.Sugar = +d["sugar"] || 0;
    });

    // Filter data for February 14, 2020 only
    const startOfDay = new Date("2020-02-14T00:00:00");
    const endOfDay = new Date("2020-02-14T23:59:59");
    glucoseData = glucoseData.filter(d => d.Timestamp >= startOfDay && d.Timestamp <= endOfDay);
    foodData = foodData.filter(d => d.Timestamp >= startOfDay && d.Timestamp <= endOfDay);

    // If no data is found for the selected date
    if (glucoseData.length === 0) {
        console.log("No glucose data found for February 14, 2020.");
    }
    if (foodData.length === 0) {
        console.log("No food data found for February 14, 2020.");
    }


    // Exponential Smoothing Function for Glucose
    function exponentialSmoothing(data, alpha = 0.3) {
        let smoothed = [];
        let prev = data[0].Glucose;
        data.forEach(d => {
            prev = alpha * d.Glucose + (1 - alpha) * prev;
            smoothed.push({ Timestamp: d.Timestamp, Smoothed: prev });
        });
        return smoothed;
    }

    const smoothedData = exponentialSmoothing(glucoseData, 0.3);


    // Group data by hour and calculate the sum of calories for each hour using d3.groups and d3.rollups
    const caloriesByHour = d3.groups(foodData, d => d3.timeHour(d.Timestamp))
        .map(([key, values]) => ({
            key: key,
            value: d3.sum(values, d => d.Calories)  // Sum the calories for each group
        }));

    const proteinByHour = d3.groups(foodData, d => d3.timeHour(d.Timestamp))
    .map(([key, values]) => ({
        key: key,
        value: d3.sum(values, d => d.Protein)  // Sum the protein for each group
    }));

    const carbByHour = d3.groups(foodData, d => d3.timeHour(d.Timestamp))
    .map(([key, values]) => ({
        key: key,
        value: d3.sum(values, d => d.Carb)  // Sum the protein for each group
    }));

    const sugarByHour = d3.groups(foodData, d => d3.timeHour(d.Timestamp))
    .map(([key, values]) => ({
        key: key,
        value: d3.sum(values, d => d.Sugar)  // Sum the protein for each group
    }));

    // Define Scales for X (Time), Y (Glucose), and Y for Calories
    const xScale = d3.scaleTime()
        .domain([startOfDay, endOfDay]) // Time range from midnight to 23:59
        .range([0, width]);

        const yScaleGlucose = d3.scaleLinear()
        .domain([d3.min(glucoseData, d => d.Glucose) - 10, d3.max(glucoseData, d => d.Glucose) + 10])
        .range([height - 100, 0]);

    const yScaleCalories = d3.scaleLinear()
        .domain([0, d3.max(foodData, d => d.Calories) + 50]) // Adjust this to fit your calorie data
        .range([height - 100, 0]);

    const yScaleProtein = d3.scaleLinear()
        .domain([0, d3.max(foodData, d => d.Protein) + 50]) // Adjust this to fit your protein data
        .range([height - 100, 0]);


    const yScaleCarb = d3.scaleLinear()
        .domain([0, d3.max(foodData, d => d.Carb) + 50]) // Adjust this to fit your protein data
        .range([height - 100, 0]);

    const yScaleSugar = d3.scaleLinear()
        .domain([0, d3.max(foodData, d => d.Carb) + 50]) // Adjust this to fit your protein data
        .range([height - 100, 0]);

    // Define Axes
    const xAxis = d3.axisBottom(xScale).ticks(d3.timeHour.every(1)).tickFormat(d3.timeFormat("%H:%M"));
    const yAxisLeft = d3.axisLeft(yScaleGlucose); // For glucose (on the left side)

    svg.append("g").attr("transform", `translate(0,${height - 100})`).call(xAxis);
    svg.append("g").attr("transform", `translate(0,0)`).call(yAxisLeft); // Glucose on the left

    // Create the Y axis for calories and position it on the right, initially hidden
    const yAxisRightCalories = svg.append("g")
        .attr("transform", `translate(${width}, 0)`) // Move the Y axis to the right for calories
        .call(d3.axisRight(yScaleCalories))
        .style("display", "none"); // Initially hide the axis

    // Create the Y axis for protein and position it on the right, initially hidden
    const yAxisRightProtein = svg.append("g")
        .attr("transform", `translate(${width}, 0)`) // Move the Y axis to the right for protein (shift a bit more to the right)
        .call(d3.axisRight(yScaleProtein))
        .style("display", "none"); // Initially hide the axis

    // Create the Y axis for carb and position it on the right, initially hidden
    const yAxisRightCarb = svg.append("g")
        .attr("transform", `translate(${width}, 0)`) // Move the Y axis to the right for protein (shift a bit more to the right)
        .call(d3.axisRight(yScaleCarb))
        .style("display", "none"); // Initially hide the axis

     // Create the Y axis for carb and position it on the right, initially hidden
    const yAxisRightSugar = svg.append("g")
     .attr("transform", `translate(${width}, 0)`) // Move the Y axis to the right for protein (shift a bit more to the right)
     .call(d3.axisRight(yScaleSugar))
     .style("display", "none"); // Initially hide the axis

    // Line Generator for raw glucose data
    const line = d3.line()
        .x(d => xScale(d.Timestamp))
        .y(d => yScaleGlucose(d.Glucose));

    // Line Generator for smoothed glucose data
    const smoothedLine = d3.line()
        .x(d => xScale(d.Timestamp))
        .y(d => yScaleGlucose(d.Smoothed));

    // Draw Smoothed Glucose Line (WITHOUT POINTS)
    let smoothedPath = svg.append("path")
        .datum(smoothedData)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("d", smoothedLine);

    // Draw Raw Glucose Line (Initially Hidden)
    let rawPath = svg.append("path")
        .datum(glucoseData)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("class", "raw-glucose-line")
        .attr("d", line)
        .style("display", "none");

    // Draw Raw Glucose Points (Initially Hidden)
    let rawPoints = svg.selectAll(".raw-point")
        .data(glucoseData)
        .enter()
        .append("circle")
        .attr("class", "raw-point")
        .attr("cx", d => xScale(d.Timestamp))
        .attr("cy", d => yScaleGlucose(d.Glucose))
        .attr("r", 4)
        .attr("fill", "red")
        .style("display", "none")
        .on("mouseover", (event, d) => {
            tooltip.style("visibility", "visible")
                .html(`Time: ${d3.timeFormat("%H:%M")(d.Timestamp)}<br>Glucose: ${Math.round(d.Glucose)} mg/dL`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", () => tooltip.style("visibility", "hidden"));

    // Toggle Smoothed Glucose Line
    d3.select("#smoothedGlucose").on("change", function () {
        smoothedPath.style("display", this.checked ? "block" : "none");
    });

    // Toggle Raw Glucose Line & Points
    d3.select("#rawGlucose").on("change", function () {
        rawPath.style("display", this.checked ? "block" : "none");
        rawPoints.style("display", this.checked ? "block" : "none");
    });

    // Draw Bar Chart for Calories (sum of calories for each hour)
    let barCalorie = svg.selectAll(".calories-bar")
        .data(caloriesByHour)
        .enter()
        .append("rect")
        .attr("class", "calories-bar")
        .attr("x", d => xScale(d.key))  // Position bars on X axis based on hour
        .attr("y", d => yScaleCalories(d.value)) // Y position is based on the sum of calories for each hour
        .attr("width", 20)  // Width of each bar
        .attr("height", d => height - 100 - yScaleCalories(d.value)) // Height based on the sum of calories
        .attr("fill", "orange")
        .style("opacity", 0.7)  // Display bars in the chart
        .style("display", "none")
        .on("mouseover", (event, d) => {
            tooltip.style("visibility", "visible")
                .html(`Hour: ${d3.timeFormat("%H:%M")(d.key)}<br>Calories: ${d.value} Kcal`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", () => tooltip.style("visibility", "hidden"));

    // Draw Bar Chart for Protein (sum of protein for each hour)
    let barProtein = svg.selectAll(".protein-bar")
        .data(proteinByHour)
        .enter()
        .append("rect")
        .attr("class", "protein-bar")
        .attr("x", d => xScale(d.key))  // Position bars on X axis based on hour
        .attr("y", d => yScaleProtein(d.value)) // Y position is based on the sum of protein for each hour
        .attr("width", 20)  // Width of each bar
        .attr("height", d => height - 100 - yScaleProtein(d.value)) // Height based on the sum of protein
        .attr("fill", "green")
        .style("opacity", 0.7)  // Display bars in the chart
        .style("display", "none")
        .on("mouseover", (event, d) => {
            tooltip.style("visibility", "visible")
                .html(`Hour: ${d3.timeFormat("%H:%M")(d.key)}<br>Protein: ${d.value} g`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", () => tooltip.style("visibility", "hidden"));

    // Draw Bar Chart for Carb (sum of carb for each hour)
    let barCarb = svg.selectAll(".carb-bar")
        .data(carbByHour)
        .enter()
        .append("rect")
        .attr("class", "carb-bar")
        .attr("x", d => xScale(d.key))  // Position bars on X axis based on hour
        .attr("y", d => yScaleCarb(d.value)) // Y position is based on the sum of protein for each hour
        .attr("width", 20)  // Width of each bar
        .attr("height", d => height - 100 - yScaleCarb(d.value)) // Height based on the sum of protein
        .attr("fill", "green")
        .style("opacity", 0.7)  // Display bars in the chart
        .style("display", "none")
        .on("mouseover", (event, d) => {
            tooltip.style("visibility", "visible")
                .html(`Hour: ${d3.timeFormat("%H:%M")(d.key)}<br>Carb: ${d.value} g`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", () => tooltip.style("visibility", "hidden"));


    // Draw Bar Chart for Sugar (sum of sugar for each hour)
    let barSugar = svg.selectAll(".sugar-bar")
        .data(sugarByHour)
        .enter()
        .append("rect")
        .attr("class", "sugar-bar")
        .attr("x", d => xScale(d.key))  // Position bars on X axis based on hour
        .attr("y", d => yScaleSugar(d.value)) // Y position is based on the sum of protein for each hour
        .attr("width", 20)  // Width of each bar
        .attr("height", d => height - 100 - yScaleSugar(d.value)) // Height based on the sum of protein
        .attr("fill", "green")
        .style("opacity", 0.7)  // Display bars in the chart
        .style("display", "none")
        .on("mouseover", (event, d) => {
            tooltip.style("visibility", "visible")
                .html(`Hour: ${d3.timeFormat("%H:%M")(d.key)}<br>Sugar: ${d.value} g`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", () => tooltip.style("visibility", "hidden"));

    // Add Legends for Axes
    svg.append("text")
    .attr("transform", `translate(${width / 2}, ${height - 10})`)
    .style("text-anchor", "middle")
    .text("Time of Day");

    svg.append("text")
        .attr("transform", `translate(-40, ${height / 2}) rotate(-90)`)
        .style("text-anchor", "middle")
        .text("Glucose (mg/dL)");

    let legCalorie = svg.append("text")
        .attr("transform", `translate(${width + 40}, ${height / 2}) rotate(-90)`)
        .style("text-anchor", "middle")
        .text("Calories (Kcal)")
        .style("display", "none");

    let legProtein = svg.append("text")
        .attr("transform", `translate(${width + 40}, ${height / 2}) rotate(-90)`)
        .style("text-anchor", "middle")
        .text("Protein (g)")
        .style("display", "none");

    let legCarb = svg.append("text")
        .attr("transform", `translate(${width + 40}, ${height / 2}) rotate(-90)`)
        .style("text-anchor", "middle")
        .text("Carb (g)")
        .style("display", "none");

    let legSugar = svg.append("text")
        .attr("transform", `translate(${width + 40}, ${height / 2}) rotate(-90)`)
        .style("text-anchor", "middle")
        .text("Sugar (g)")
        .style("display", "none");

    // Toggle Bar Chart for Calories
    d3.select("#barCalorie").on("change", function () {
        barCalorie.style("display", this.checked ? "block" : "none");
        yAxisRightCalories.style("display", this.checked ? "block" : "none");
        legCalorie.style("display", this.checked ? "block" : "none");
    });

    // Toggle Bar Chart for Protein
    d3.select("#barProtein").on("change", function () {
        barProtein.style("display", this.checked ? "block" : "none");
        yAxisRightProtein.style("display", this.checked ? "block" : "none");
        legProtein.style("display", this.checked ? "block" : "none");
    });

    // Toggle Bar Chart for Carb
    d3.select("#barCarb").on("change", function () {
        barCarb.style("display", this.checked ? "block" : "none");
        yAxisRightCarb.style("display", this.checked ? "block" : "none");
        legCarb.style("display", this.checked ? "block" : "none");
    });

    // Toggle Bar Chart for Sugar
    d3.select("#barSugar").on("change", function () {
        barSugar.style("display", this.checked ? "block" : "none");
        yAxisRightSugar.style("display", this.checked ? "block" : "none");
        legSugar.style("display", this.checked ? "block" : "none");
    });

});

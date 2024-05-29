const width = 960;
const height = 600;

const svg = d3.select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const projection = d3.geoMercator()
  .scale(120)
  .translate([width / 2, height / 1.4]);

const path = d3.geoPath()
  .projection(projection);

const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

Promise.all([
  d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"),
  d3.csv("dogbreedmap.csv")
]).then(([worldData, breedData]) => {
  const countries = topojson.feature(worldData, worldData.objects.countries);

  svg.selectAll("path")
    .data(countries.features)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("d", path)
    .attr("fill", "#6CC291")

  svg.selectAll("circle")
    .data(breedData)
    .enter()
    .append("circle")
    .attr("class", "breed-circle")
    .attr("cx", d => projection([d.Longitude, d.Latitude])[0])
    .attr("cy", d => projection([d.Longitude, d.Latitude])[1])
    .attr("r", 6)
    .attr("fill", "#4D8FFD")
    .on("mouseover", (event, d) => {
      const mousePosition = d3.pointer(event, svg.node());
      const tooltipWidth = 200;
      const tooltipHeight = 150;

      const tooltipContent = `
        <div class="tooltip-content">
          <div class="tooltip-breed">${d.Breed}</div>
          <div class="tooltip-origin">Origin: ${d["Country of Origin"]}</div>
          <div class="tooltip-icon"><img src="breed_icons/${d.Breed.replace(/ /g, '_')}.png" alt="${d.Breed}" width="50" height="50"/></div>
        </div>
      `;

      tooltip.html(tooltipContent)
        .style("left", (mousePosition[0] - 30 - tooltipWidth) + "px")
        .style("top", (mousePosition[1] + 10) + "px")
        .style("width", tooltipWidth + "px")
        .style("height", tooltipHeight + "px")
        .transition()
        .duration(200)
        .style("opacity", 0.9);
    })
    .on("mousemove", (event) => {
      const mousePosition = d3.pointer(event, svg.node());
      tooltip
      .style("left", (mousePosition[0] + 10) + "px")
      .style("top", (mousePosition[1] + 20) + "px");
      })
    .on("mouseout", () => {
      tooltip.transition()
        .duration(200)
        .style("opacity", 0);
    });
});
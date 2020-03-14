import * as d3 from "d3"
import {
  teams,
  roundList,
  rankingByRound,
  teamRankingsPerRound,
} from "./ranking"


const teamColors = {
  "EHCB": "#D11216",
  "EVZ": "#CFBD72",
  "GSHC": "#820924",
  "HCAP": "#022E5F",
  "HCD": "#FFDD00",
  "HCFG": "#E9171E",
  "HCL": "#000000",
  "LHC": "#E40F29",
  "SCB": "#E30613",
  "SCL": "#FFD600",
  "SCRJ": "#03326D",
  "ZSC": "#0069B4",
}

const getAcronym = name => teams.find(t => t.name === name).acronym
const getLogoIdByName = d => getLogoId({acronym: getAcronym(d.name)})
const getLogoId = d => "logo-" + d.acronym

const getTeamColor = d => teamColors[getAcronym(d.team)]

const margin = {top: 10, right: 30, bottom: 30, left: 60},
  width = 1800 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom

const svg = d3.select("#ranking-root")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")

// Logo patterns
svg.append("defs")
  .selectAll("pattern")
  .data(teams)
  .enter()
  .append("pattern")
  .attr("id", getLogoId)
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", 40)
  .attr("height", 40)
  .append("image")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", 40)
  .attr("height", 40)
  .attr("xlink:href", d => require(`../images/logos/${d.acronym}.png`))
  .attr("preserveAspectRatio", "xMinYMin slice")

// Scales
const x = d3.scaleLinear()
  .domain([1, roundList.length])
  .range([ 0, width ])

const y = d3.scaleLinear()
  .domain([teams.length, 1])
  .range([ height, 0 ])

// Axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))

svg.append("g")
  .call(d3.axisLeft(y))

// Background pattern
svg.selectAll("rect.rank")
  .data(teams)
  .enter()
  .append("rect")
  .classed("rank", true)
  .attr("fill", (d, i) => i % 2 === 0 ? "none" : "#999")
  .attr("opacity", 0.1)
  .attr("x", 0)
  .attr("y", (d, i) => y(i))
  .attr("width", width)
  .attr("height", (d, i, nodes) => height / nodes.length)

svg.selectAll("rect.round")
  .data(roundList)
  .enter()
  .append("rect")
  .classed("round", true)
  .attr("fill", (d, i) => i % 2 === 0 ? "none" : "#777")
  .attr("opacity", 0.1)
  .attr("x", (d, i) => x(i))
  .attr("y", 0)
  .attr("width", (d, i) => width / roundList.length)
  .attr("height", height)


// Paths of teams
const teamPaths = svg.selectAll("path.team")
  .data(teamRankingsPerRound)
  .enter()
  .append("path")
  .classed("team", true)
  .attr("fill", "none")
  .attr("stroke", "#000")
  .attr("stroke-width", 4)
  .attr("d", d => {
      const line = d3.line()
        .x(function(d, i) { return x(i + 1) })
        .y(function(d) { return y(d + 1) })

      return line(d.rankings)
    }
  )
  .on("mouseover", teamPathMouseOver)
  .on("mouseleave", teamPathMouseLeave)

// Ranking numbers
const teamRanks = svg.selectAll("g.team-ranks")
  .data(teamRankingsPerRound)
  .enter()
  .append("g")
  .classed("team-ranks", true)
  .attr("opacity", 0)

teamRanks.each((d, teamIndex, nodes) => {
  const elemEnter = d3.select(nodes[teamIndex])
    .selectAll("circle.team-rank")
    .data(d.rankings)
    .enter()

  elemEnter.append("circle")
    .classed("team-rank", true)
    .attr("fill", "steelblue")
    .attr("r", 10)
    .attr("cx", (d, i) => x(i + 1))
    .attr("cy", (d, i) => y(d + 1))
    .attr("fill", getTeamColor(d))

  elemEnter.append("text")
    .classed("team-rank-text", true)
    .text(d => d + 1)
    .attr("x", (d, i) => x(i + 1))
    .attr("y", (d, i) => y(d + 1))
    .attr("transform", "translate(0, 4)")
})

// Team logos
svg.selectAll("circle.team-logo")
  .data(teamRankingsPerRound)
  .enter()
  .append("circle")
  .classed("team-logo", true)
  .attr("cx", -20)
  .attr("cy", (d) => y(d.rankings[0] + 1))
  .attr("r", 20)
  .attr("fill", (d) => `url(#${getLogoIdByName({name: d.team})})`)
  .on("mouseover", teamPathMouseOver)
  .on("mouseleave", teamPathMouseLeave)

function teamPathMouseOver(d, i) {
  teamPaths.each((d, teamIndex, nodes) => {
    d3.select(nodes[teamIndex])
      .attr("opacity", teamIndex === i ? 1 : 0.25)
  })

  teamRanks.each((d, teamIndex, nodes) => {
    d3.select(nodes[teamIndex])
      .attr("opacity", teamIndex === i ? 1 : 0)
  })
}

function teamPathMouseLeave() {
  teamPaths.each((d, teamIndex, nodes) => {
    d3.select(nodes[teamIndex])
      .attr("opacity", 1)
  })

  teamRanks.each((d, teamIndex, nodes) => {
    d3.select(nodes[teamIndex])
      .attr("opacity", 0)
  })
}

import {teams, gamesByRound} from "../data/games.json"
const roundList = []

for (let round in gamesByRound) {
  roundList[parseInt(round)] = gamesByRound[round].values
}

function getValuesOfTeam(team, rounds) {
  const teamData = {
    name: team,
    points: 0,
    goalsScored: 0,
    goalsReceived: 0,
  }

  return rounds.reduce((acc, round) => {
    const game = round.find(game => team === game.home || team === game.away)

    if (game) {
      const isHomeTeam = team === game.home
      const teamScore = isHomeTeam ? game.homeScore : game.awayScore
      const opponentScore = isHomeTeam ? game.awayScore : game.homeScore

      teamData.goalsScored += teamScore
      teamData.goalsReceived += opponentScore

      if (teamScore > opponentScore) {
        if (game.periods.length === 4) {
          teamData.points += 2
        } else {
          teamData.points += 3
        }
      } else {
        if (game.periods.length === 4) {
          teamData.points += 1
        }
      }
    }

    return acc
  }, teamData)
}

const goalDifference = t => t.goalsScored - t.goalsReceived

function sortRanking(teamA, teamB) {
  if (teamA.points > teamB.points) {
    return -1
  } else if (teamA.points < teamB.points) {
    return 1
  } else if (goalDifference(teamA) > goalDifference(teamB)) {
    return -1
  } else if (goalDifference(teamA) < goalDifference(teamB)) {
    return 1
  } else if (teamA.goalsScored > teamB.goalsScored) {
    return -1
  } else if (teamA.goalsScored < teamB.goalsScored) {
    return 1
  } else {
    return 0
  }
}

const rankingByRound = roundList.map((r, i) => {
  let ranking = teams.map(t => getValuesOfTeam(t.name, roundList.slice(0, i + 1)))
  ranking = ranking.sort(sortRanking)

  return ranking
})

const teamRankingsPerRound = teams.map(t => {
  return {
    team: t.name,
    rankings: rankingByRound.map(round => round.findIndex(ranking => ranking.name === t.name))
  }
})

export {
  teams,
  roundList,
  teamRankingsPerRound
}

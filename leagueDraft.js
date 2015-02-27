var rankMap = {
    0: {
        rank: "Slifer Red",
        elo: 1000
    },
    1: {
        rank: "Ra Yellow",
        elo: 1500
    },
    2: {
        rank: "Obelisk Blue",
        elo: 2000,
    },
    3: {
        rank: "Abandoned Dark",
        elo: 2500
    }
};
var dbTopic = "league.html",
    hPage = "/h22-",
    entries = [],
    matches = [],
    entry,
    lastCached = localStorage.lastCached,
    lastEdit = localStorage.lastEdit;

function calculateNewElo(opts) {
    if (!opts) {
        console.log('Argument not specified for `calculateNewElo(opts)`');
        return;
    }
    var previousWinnerElo = entries[opts.winner].elo,
        previousLoserElo = entries[opts.loser].elo,
        staticPointsGained = 15,
        staticPointsLost = 15,
        pointsGained,
        pointsLost,
        newWinnerElo,
        newLoserElo,
        rankDifference = entries[opts.winner].rank - entries[opts.loser].rank,
        winnerWLRatio = (entries[opts.winner].wins / (entries[opts.winner].wins + entries[opts.winner].losses)) * 100,
        loserWLRatio = (entries[opts.loser].wins / (entries[opts.loser].wins + entries[opts.loser].losses)) * 100,
        winnerWLString = winnerWLRatio.toFixed(1).replace(/\.0$/, '') + '%',
        loserWLString = loserWLRatio.toFixed(1).replace(/\.0$/, '') + '%',
        hardCapGainPercentage = 60,
        hardCapLossPercentage = 40;
    if (rankDifference > 0) {
        pointsGained = Math.floor(staticPointsGained / (rankDifference + (rankDifference * 0.1)));
        pointsLost = (rankDifference == 2) ? Math.floor(pointsGained / 2) : Math.ceil(pointsGained / 2);
    } else if (rankDifference < 0) {
        pointsGained = (rankDifference == -2) ? Math.round(staticPointsGained * 2) : Math.round(staticPointsGained * 1.5);
        pointsLost = pointsGained;
    } else if (rankDifference == 0) {
        pointsGained = staticPointsGained;
        pointsLost = staticPointsLost;
    }
    if (Math.round(winnerWLRatio) > hardCapGainPercentage) {
        pointsGained = pointsGained + 10;
    } else if (Math.round(winnerWLRatio) < hardCapLossPercentage) {
        pointsGained = pointsGained - 10;
    } else if (Math.round(winnerWLRatio) >= 50) {
        pointsGained = pointsGained + (Math.round(winnerWLRatio - 50));
    } else if (Math.round(winnerWLRatio) <= 50) {
        pointsGained = pointsGained - (Math.round(50 - winnerWLRatio));
    }
    if (Math.round(loserWLRatio) > hardCapGainPercentage) {
        pointsLost = pointsLost - 10;
    } else if (Math.round(loserWLRatio) < hardCapLossPercentage) {
        pointsLost = pointsLost + 10;
    } else if (Math.round(loserWLRatio) >= 50) {
        pointsLost = pointsLost - (Math.round(winnerWLRatio - 50));
    } else if (Math.round(loserWLRatio) <= 50) {
        pointsLost = pointsLost + (Math.round(50 - loserWLRatio));
    }
    newWinnerElo = previousWinnerElo + pointsGained;
    newLoserElo = previousLoserElo - pointsLost;
    entries[opts.winner].elo = newWinnerElo;
    entries[opts.loser].elo = newLoserElo;
    console.log(previousWinnerElo, previousLoserElo, staticPointsGained, staticPointsLost, pointsGained, pointsLost, newWinnerElo, newLoserElo, rankDifference, winnerWLRatio, loserWLRatio, winnerWLString, loserWLString);
}
$(function() {
    if (lastCached > lastEdit) {
        console.log("No modifications made to rankings.");
    } else {
        // localStorage.lastCached = Date.now();
        $.get(dbTopic, function(data, status, xhr) {
            if (xhr.status !== 200) {
                console.log('HTTP Request failed with Error Status of ' + xhr.status + ', please check your connection settings or connect your system administrator.');
            }
            data = $(data);
            entries = $.parseJSON(data[7].innerHTML);
            matches = $.parseJSON(data[9].innerHTML).matches;
            for (entry in entries) {
                entries[entry].elo = rankMap[entries[entry].rank].elo;
                entries[entry].wins = 0;
                entries[entry].losses = 0;
            }
            matches.forEach(function(v) {
                if (!v.winner || !v.loser) {
                    console.log('Invalid entry; winner or loser not given.');
                } else if (!(v.winner in entries)) {
                    console.log('Invalid entry for match "' + v.winner + '" versus "' + v.loser + '"; winner not registered in database.');
                } else if (!(v.loser in entries)) {
                    console.log('Invalid entry for match "' + v.winner + '" versus "' + v.loser + '"; loser not registered in database.');
                } else {
                    document.body.innerHTML += '<div class="textNotice">User "' + v.winner + '" won versus "' + v.loser + '"; calculated new Elo.</div>';
                    entries[v.winner].wins++;
                    entries[v.loser].losses++;
                    calculateNewElo({
                        winner: v.winner,
                        loser: v.loser
                    });
                }
            });
        });
    }
});

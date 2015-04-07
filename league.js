/* global $ */
function Map(o) {
    var p;
    if (!(this instanceof Map)) {
        return new Map(o);
    }
    for (p in o) {
        if (o.hasOwnProperty(p) && o.propertyIsEnumerable(p) && !(p in this)) {
            this[p] = o[p];
        }
    }
    return this;
}
Map.prototype.map = function(s) {
    return this[s] || this[s.toLowerCase()] || this[s.toUpperCase()] || null;
};
var rankMap = Map({
        0: {
            rank: "Slifer Red",
            elo: 500,
            rankID: 0
        },
        1: {
            rank: "Ra Yellow",
            elo: 750,
            rankID: 1
        },
        2: {
            rank: "Obelisk Blue",
            elo: 1000,
            rankID: 2
        },
        3: {
            rank: "Society of Light",
            elo: 1250,
            rankID: 3
        },
        "slifer": {
            rank: "Slifer Red",
            elo: 500,
            rankID: 0
        },
        "ra": {
            rank: "Ra Yellow",
            elo: 750,
            rankID: 1
        },
        "obelisk": {
            rank: "Obelisk Blue",
            elo: 1000,
            rankID: 2
        },
        "sol": {
            rank: "Society of Light",
            elo: 1250,
            rankID: 3
        },
        "slifer red": {
            rank: "Slifer Red",
            elo: 500,
            rankID: 0
        },
        "ra yellow": {
            rank: "Ra Yellow",
            elo: 750,
            rankID: 1
        },
        "obelisk blue": {
            rank: "Obelisk Blue",
            elo: 1000,
            rankID: 2
        },
        "society of light": {
            rank: "Society of Light",
            elo: 1250,
            rankID: 3
        }
    }),
    dbTopic = "/t41235-",
    entries = {},
    matches = [],
    entry,
    iter,
    sortArray = [];

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
        rankDifference = entries[opts.winner].rankID - entries[opts.loser].rankID,
        winnerWLRatio = (entries[opts.winner].wins / (entries[opts.winner].wins + entries[opts.winner].losses)) * 100,
        loserWLRatio = (entries[opts.loser].wins / (entries[opts.loser].wins + entries[opts.loser].losses)) * 100,
        winnerWLString = winnerWLRatio.toFixed(1).replace(/\.0$/, '') + '%',
        loserWLString = loserWLRatio.toFixed(1).replace(/\.0$/, '') + '%',
        hardCapGainPercentage = 60,
        hardCapLossPercentage = 40;
    entries[opts.winner].winLossHistory.push({
        status: 1,
        versus: opts.loser
    });
    entries[opts.loser].winLossHistory.push({
        status: 0,
        versus: opts.winner
    });
    if (rankDifference > 0) { // higher rank won vs lower rank 
        pointsGained = Math.floor(staticPointsGained / (rankDifference + (rankDifference * 0.1)));
        pointsLost = (rankDifference >= 2) ? Math.floor(pointsGained / rankDifference) : Math.ceil(pointsGained / 2);
        entries[opts.winner].lowerPlayed++;
        entries[opts.winner].lowerWon++;
        entries[opts.loser].higherPlayed++;
        entries[opts.loser].higherLost++;
    } else if (rankDifference < 0) { // lower rank won vs higher rank
        pointsGained = (rankDifference <= -2) ? Math.round(staticPointsGained * Math.abs(rankDifference)) : Math.round(staticPointsGained * 1.5);
        pointsLost = pointsGained;
        entries[opts.winner].higherPlayed++;
        entries[opts.winner].higherWon++;
        entries[opts.loser].lowerPlayed++;
        entries[opts.loser].lowerLost++;
    } else if (rankDifference === 0) { // same rank
        pointsGained = staticPointsGained;
        pointsLost = staticPointsLost;
        entries[opts.winner].equalPlayed++;
        entries[opts.winner].equalWon++;
        entries[opts.loser].equalPlayed++;
        entries[opts.loser].equalLost++;
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
    pointsGained = (pointsGained <= 0) ? 1 : pointsGained;
    if (Math.round(loserWLRatio) > hardCapGainPercentage) {
        pointsLost = pointsLost - 10;
    } else if (Math.round(loserWLRatio) < hardCapLossPercentage) {
        pointsLost = pointsLost + 10;
    } else if (Math.round(loserWLRatio) >= 50) {
        pointsLost = pointsLost - (Math.round(loserWLRatio - 50));
    } else if (Math.round(loserWLRatio) <= 50) {
        pointsLost = pointsLost + (Math.round(50 - loserWLRatio));
    }
    newWinnerElo = previousWinnerElo + pointsGained;
    newLoserElo = previousLoserElo - pointsLost;
    entries[opts.winner].elo = newWinnerElo;
    entries[opts.winner].winratio = winnerWLString;
    entries[opts.loser].elo = newLoserElo;
    entries[opts.loser].winratio = loserWLString;
    entries[opts.winner].eloDifference = newWinnerElo - rankMap.map(entries[opts.winner].rankID).elo;
    entries[opts.loser].eloDifference = newLoserElo - rankMap.map(entries[opts.loser].rankID).elo;
}

function createWinLossStreak(user) {
    if (!user.winLossHistory || user.winLossHistory.length === 0) {
        return null;
    }
    var index = 0,
        arrayLength = user.winLossHistory.length,
        returnObject = {
            wins: [],
            losses: []
        },
        count = 0,
        statusString, temp, previousTemp, samePlayed = {};
    for (index, arrayLength; index < arrayLength; index++) {
        temp = user.winLossHistory[index];
        previousTemp = user.winLossHistory[index - 1];
        if (samePlayed[temp.versus] === undefined) {
            samePlayed[temp.versus] = 1;
        } else {
            samePlayed[temp.versus]++;
        }
        if (index === 0) {
            count = 1;
            statusString = (temp.status === 1) ? "wins" : "losses";
            continue;
        }
        if (previousTemp && (temp.status === previousTemp.status)) {
            count++;
        } else {
            returnObject[statusString].push(count);
            count = 1;
            statusString = (temp.status === 1) ? "wins" : "losses";
        }
        if (index === arrayLength - 1) {
            returnObject[statusString].push(count);
        }
    }
    if (!returnObject.wins.length) {
        returnObject.wins = [0];
    }
    if (!returnObject.losses.length) {
        returnObject.losses = [0];
    }
    user.samePlayed = samePlayed;
    user.highestWinStreak = Math.max.apply({}, returnObject.wins);
    user.highestLossStreak = Math.max.apply({}, returnObject.losses);
    return user;
}

function makeTable(sourceArray) {
    var returnHTML = "";
    sourceArray.forEach(function(v, i) {
        returnHTML = returnHTML + '<tr class="rankingTable rank_' + (i + 1) + '"><td class="rankingTableUser">' + v.username + '</td><td class="rankingTableWins">' + v.wins + '</td><td class="rankingTableLosses">' + v.losses + '</td><td class="rankingTableElo">' + v.elo + '</td></tr>';
    });
    return returnHTML;
}

function sortAfter(sourceArray, sortString, ascDesc) {
    return sourceArray.sort(function(a, b) {
        if (sortString === "username") {
            return (ascDesc ? ((b.username[0].toLowerCase() < a.username[0].toLowerCase() ? 1 : -1)) : ((b.username[0].toLowerCase() < a.username[0].toLowerCase()) ? -1 : 1));
        } else {
            return (ascDesc ? b[sortString] - a[sortString] : a[sortString] - b[sortString]);
        }
    });
}

function adjustRank(user){
    var id = user.rankID;
    switch(id) {
            case 0: {
                if(user.elo > rankMap.map(1).elo) {
                    id = 1;
                }
                break;
            }
            case 1: {
                if(user.elo > rankMap.map(2).elo) {
                    id = 2;
                }
                if(user.elo < rankMap.map(0).elo) {
                    id = 0;
                }
                break;
            }
            case 2: {
                if(user.elo > rankMap.map(3).elo) {
                    id = 3;
                }
                if(user.elo < rankMap.map(1).elo) {
                    id = 1;
                }
                break;
            }
            case 3: {
                if(user.elo < rankMap.map(2).elo) {
                    id = 2;
                }
                break;
            }
            default: {
                console.log("No user specified to update.");
                break;
            }
    }
    user.rankID = id;
    return user;
}

$(function() {
    $.get(dbTopic, function(data, status, xhr) {
        if (xhr.status !== 200) {
            console.log('Error "' + status + '"\nHTTP Request failed with Error Status of ' + xhr.status + ', please check your connection settings or connect your system administrator.');
        }
        data = $(data);
        entries = $.parseJSON($('#entryTable td', data).html().replace(/<br>/gi, ''));
        matches = $.parseJSON($('#matchTable td', data).html().replace(/<br>/gi, '')).matches;
        for (entry in entries) {
            if (entries.hasOwnProperty(entry) && entries.propertyIsEnumerable(entry)) {
                entries[entry].username = entry;
                entries[entry].rankID = rankMap.map(entries[entry].rank).rankID;
                entries[entry].elo = rankMap.map(entries[entry].rank).elo;
                entries[entry].wins = 0;
                entries[entry].losses = 0;
                // data for statistics below
                entries[entry].gamesPlayed = 0;
                entries[entry].higherPlayed = 0;
                entries[entry].lowerPlayed = 0;
                entries[entry].equalPlayed = 0;
                entries[entry].higherWon = 0;
                entries[entry].lowerWon = 0;
                entries[entry].equalWon = 0;
                entries[entry].higherLost = 0;
                entries[entry].lowerLost = 0;
                entries[entry].equalLost = 0;
                entries[entry].eloDifference = 0;
                entries[entry].highestWinStreak = 0;
                entries[entry].highestLossStreak = 0;
                entries[entry].winLossHistory = [];
                // end of statistics
            }
        }
        matches.forEach(function(v) {
            if (!v.winner || !v.loser) {
                console.log('Invalid entry; winner or loser not given.');
            } else if (!(v.winner in entries)) {
                console.log('Invalid entry for match "' + v.winner + '" versus "' + v.loser + '"; winner not registered in database.');
            } else if (!(v.loser in entries)) {
                console.log('Invalid entry for match "' + v.winner + '" versus "' + v.loser + '"; loser not registered in database.');
            } else {
                entries[v.winner].wins++;
                entries[v.loser].losses++;
                entries[v.winner].gamesPlayed++;
                entries[v.loser].gamesPlayed++;
                calculateNewElo({
                    winner: v.winner,
                    loser: v.loser
                });
                // adjustRank(v.winner);
                // adjustRank(v.loser);
            }
        });
        for (iter in entries) {
            if (entries.hasOwnProperty(iter) && entries.propertyIsEnumerable(iter)) {
                createWinLossStreak(entries[iter]);
                sortArray.push(entries[iter]);
            }
        }
        $('#eloDisplay tbody').html(makeTable(sortAfter(sortArray, "elo", true)));
        $('#loading').css('display', 'none');
        $('#tableHead').css('display', 'block');
        /*$('div[class^="ranking"]').on('click', function(e) {
            if ($(this).hasClass('asc')) {
                $('#eloDisplay tbody').html(makeTable(sortAfter(sortArray, $(this).removeClass('asc').attr('class').split('ranking')[0], false)));
                $(this).addClass('desc');
            } else {
                $('#eloDisplay tbody').html(makeTable(sortAfter(sortArray, $(this).removeClass('desc').attr('class').split('ranking')[0], true)));
                $(this).addClass('asc');
            }
        });*/
    });
});

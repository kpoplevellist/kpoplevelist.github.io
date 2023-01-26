

var userData = []; //{name : username, point : point, records : [{rank, percent, link, hz}], verified : [rank]}
for (var i = 0; i < list.length; i++) {
    var rank = i+1;
    var entry = list[i];
    var isVerifier = false;
    for (var a = 0 ; a < entry.vids.length ; a++) {
        var record = entry.vids[a];
        var isLoot = false, islegit = true;
        for (var r = 0; r < userData.length; r++) {
            if (record.user.toUpperCase() == userData[r].name.toUpperCase()) {
                isLoot = true;
            }
        }
        for (var u = 0; u < ban_users.length ; u++) {
          if (ban_users[u].user.toUpperCase() == record.user.toUpperCase()) {
            islegit = false;
            const itemToFind = list[i].vids.find(function(item) {return item.user.toUpperCase() === ban_users[u].user.toUpperCase()});
            const idx = list[i].vids.indexOf(itemToFind);
            if (idx > -1) list[i].vids.splice(idx, 1)
          }
        }
        if (islegit) {
          if (!isLoot) {
            var userRecord = []; var verifyRecord = [];
            userRecord.push({rank : rank, percent : record.percent, link: record.link, hz: record.hz==null ? "144hz" : record.hz});
            userData.push({name: record.user, point: getPoint(rank, record.percent, entry.percentToQualify, record.hz), records : userRecord, verified : verifyRecord});
          } else {
            for (var b = 0 ; b < userData.length ; b++) {
                if (userData[b].name.toUpperCase() == record.user.toUpperCase()) {
                    var userRecord = userData[b].records;
                    userRecord.push({rank : rank, percent : record.percent, link: record.link, hz: record.hz==null ? "144hz" : record.hz});
                    userData[b].point = roundNumber(userData[b].point + getPoint(rank, record.percent, entry.percentToQualify, record.hz), 3);
                    userData[b].records = userRecord;
                }
            }
          }
        } else {
          a--;
        }
    }
}

for (var i = 0; i < list.length; i++) {
    for (var r = 0; r < userData.length; r++) {
        var verifier = "";
        if (list[i].author.split("[").length != 2) {
            verifier = list[i].author;
        } else { verifier = list[i].author.split("[")[1].replace("]", ""); }
        if (verifier.toUpperCase() == userData[r].name.toUpperCase()) {
            var userRecord = userData[r].verified;
            userRecord.push(i+1);
            userData[r].point = roundNumber(userData[r].point + getPoint(i+1, 100, list[i].percentToQualify, null), 3);
            userData[r].verified = userRecord;
        }
    }
}

userData.sort(function(a,b) {
    return b.point - a.point;
});


function getPoint(rank, percent, cutline, hz) {
  var hzpoint = 1.0;
  if (rank > 101) {
    var score = roundNumber(((percent - (cutline-1))/(100 - (cutline-1))), 3);
    if (percent != 100) {
      return roundNumber(score - (score/3), 3);
    } else {
      return score;
    }
  } else {
      var score = roundNumber(((3/(((rank-1) / 100) + 1.302775)) - 1.302775)*100*((percent - (cutline-1))/(100 - (cutline-1))), 3);
      if (percent != 100) {
        return roundNumber(score - (score/3), 3);
      } else {
        return score;
      }
  }
}

function roundNumber(num, scale) {
    if(!("" + num).includes("e")) {
      return +(Math.round(num + "e+" + scale)  + "e-" + scale);
    } else {
      var arr = ("" + num).split("e");
      var sig = ""
      if(+arr[1] + scale > 0) {
        sig = "+";
      }
    return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
    }
}


function getTrophy(rank) {
    var score = rank / userData.length * 100;
    var point = userData[rank-1].point;
    if (rank == 1) {
      return "top1_trophy.png";
    } else if (point >= 200) {
      return "gold_trophy.png";
    } else if (point >= 150) {
      return "silver_trophy.png";
    } else if (point >= 100) {
      return "cooper_trophy.png";
    } else if (point >= 60) {
      return "green_trophy.png";
    } else if (point >= 30) {
      return "aqua_trophy.png";
    } else if (point >= 10) {
      return "pink_trophy.png";
    } else {
      return "red_trophy.png";
    }
}


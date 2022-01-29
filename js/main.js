var cloud = 'https://music.pafworld.top/';
var br = 128000;
searchListInformation = [];
var music = [];
var userProfile
var musicID;
var bodyBox = document.getElementById('playerBoxIndex')
uuid = []
var player = new Plyr('#audio');
musicList = []
var dailySongs = []
var dailyPlayList = []
fetch(cloud + 'login/status?timetamp=' + (Number(new Date()))).then(r => r.json()).then(r => {
  if (r.data.account != null) {
    document.getElementById('HeadImg').src = r.data.profile.avatarUrl;
    document.getElementById('HeadInfoImg').src = r.data.profile.avatarUrl;
    document.getElementById('HeadInfoNickName').innerHTML = r.data.profile.nickname;
    userProfile = r.data.profile
    uuid = r.data.account.id;
    document.getElementById('loginButton').style.display = 'none';
    mySelfGui()
  } else {
    loginGui('请先登录')
    document.getElementById('logoutButton').style.display = 'none';
    document.getElementById('myButton').style.display = 'none'
  }
})

function mySelfGui() {
  document.getElementById('largerUserHeadImg').src = userProfile.avatarUrl
  document.getElementById('page-userNickName').innerHTML = userProfile.nickname
  fetch(cloud + 'user/subcount').then(r => r.json()).then(subcount => {
    fetch(cloud + 'user/playlist?uid=' + uuid).then(r => r.json()).then(playlist => {
      fetch(cloud + 'recommend/songs').then(r => r.json()).then(dailySongsPost => {
        dailySongs = dailySongsPost.data.dailySongs
        document.getElementById('row-myMusicEverDay').style.backgroundImage = 'url(' + dailySongs[0].al.picUrl + '?param=370y370)'
      })
      fetch(cloud + 'recommend/resource').then(r => r.json()).then(dailyPlayListPost => {
        dailyPlayList = dailyPlayListPost.recommend
        fetch(cloud + 'playlist/detail?id=' + dailyPlayList[0].id).then(r => r.json()).then(res => {
          document.getElementById('prf-row-myRader').style.backgroundImage = 'url(' + res.playlist.tracks[0].al.picUrl + '?param=200y200)'
          bodyBox.innerHTML = document.getElementById('myPrfIndex').innerHTML;
          document.getElementById('row-Mylove').onclick = function () {
            muListSelect(playlist.playlist[0].id, true)
          }
          document.getElementById('MylovePlayButton').onclick = function () {
            muListSelect(playlist.playlist[0].id, false)
          }
          document.getElementById('myRaderPlayButton').onclick = function () {
            muListSelect(dailyPlayList[0].id, false)
          }
          document.getElementById('row-myRader').onclick = function () {
            muListSelect(dailyPlayList[0].id, true)
          }
        })
      })
    })
  })
}
songsUrl = []

function funDailySongs(chageUI) {
  if (chageUI) {
    document.getElementById('playerBoxIndex').innerHTML = '<div class="prf-User-Top-Title"><img id="largerUserHeadImg" src="" alt="" srcset=""><h1 id="page-userNickName"></h1></div><div id="playlist-index-grid-row"></div>'
    document.getElementById('largerUserHeadImg').src = userProfile.avatarUrl
    document.getElementById('page-userNickName').innerHTML = '你好' + userProfile.nickname + '! 网易云音乐向您推荐:'
  }
  var artists = []
  var backlab = []
  songsUrl = []
  var Ids = []
  for (num = 0; num < dailySongs.length; num++) {
    Ids[num] = dailySongs[num].id
  }
  fetch(cloud + 'song/url?id=' + Ids).then(r => r.json()).then(res => {
    for (i in res.data) {
      res.data.forEach(function (item, index, array) {
        if (item.id == Ids[i]) {
          songsUrl[i] = item.url
        }
      })
    }
    for (num = 0; num < dailySongs.length; num++) {
      var m = []
      for (i in dailySongs[num].ar) {
        m[i] = dailySongs[num].ar[i].name + ' ';
      }
      artists[num] = m;
      backlab[num] = '<div class="grid-item-myloveLine grid-item-line"  onclick="searchListSec(' + num + ',' + '\'muLists\'' + ');"><img src="' + dailySongs[num].al.picUrl + '?param=42y42" alt="" height="100%" srcset=""><div><div class="grid-item-line-text"><div>' + dailySongs[num].name + '</div><a>' + artists[num] + '</a></div></div><div class="muListReson">' + dailySongs[num].reason + '</div></div>';
      if (num == dailySongs.length - 1) {
        if (chageUI) {
          document.getElementById("playlist-index-grid-row").innerHTML = ''
        }
        for (i in backlab) {
          if (chageUI) {
            document.getElementById("playlist-index-grid-row").innerHTML += backlab[i];
          } else {
            searchListSec(0, 'muLists');
          }
        }
      }
      muLists[num] = [dailySongs[num].id, dailySongs[num].al.picUrl, dailySongs[num].name, artists[num], dailySongs[num].al.name, dailySongs[num].al.id, songsUrl[num]]
    }
  })
}



function refresh() {
  setTimeout(() => {
    fetch(cloud + 'login/refresh')
  }, 120000);
}
refresh()

function loginButton() {
  let phone = document.getElementById('phone').value
  let password = document.getElementById('password').value
  gologin(phone, password)
}

function loginGui(title) {
  if (title == undefined) {
    title = '登录'
  }
  document.getElementById('playerBoxIndex').innerHTML = '<h1>(网易云音乐)' + title + '</h1><input id="phone" type="text" placeholder="请输入手机号"><br><input id="password" type="password" placeholder="请输入密码"><br><button id="loginButtom" class="whitebutton" onclick="loginButton()" style="height: 48px;">开始认证</button>'
}

function searchListSec(params, type) {
  if (type != undefined) {
    switch (type) {
      case 'music':
        searchListInformation = music
        break;
      case 'muLists':
        searchListInformation = muLists
    }
  }
  listNum = [params]
  setMusic(searchListInformation[params][0], searchListInformation[params][1], searchListInformation[params][2], searchListInformation[params][3], searchListInformation[params][4], searchListInformation[params][5], searchListInformation[params][6], searchListInformation[params][7])
}
if (audio) {
  if (!audio.loop) {
    audio.addEventListener('ended', function () {
      if (!audio.loop || searchListInformation.length == (listNum - 1)) {
        listNum++;
        let params = listNum;
        setMusic(searchListInformation[params][0], searchListInformation[params][1], searchListInformation[params][2], searchListInformation[params][3], searchListInformation[params][4], searchListInformation[params][5], searchListInformation[params][6], searchListInformation[params][7]);
      }
    }, false);
  }
}

function setMusic(id, imageUrl, title, singer, zjm, zjmid, musicUrl, oLRC) {
  player.pause();
  lineNo = 0
  oLRC = {
    ti: "",
    ar: "",
    al: "",
    by: "",
    offset: 0,
    ms: []
  };
  if (musicUrl == undefined) {
    listNum++;
    let params = listNum;
    setMusic(searchListInformation[params][0], searchListInformation[params][1], searchListInformation[params][2], searchListInformation[params][3], searchListInformation[params][4], searchListInformation[params][5], searchListInformation[params][6], searchListInformation[params][7]);
  }
  getMusicDate(id)
  musicID = id
  fetch(cloud + 'song/url?id=' + id)
  document.getElementById("lyric").innerHTML = '';
  document.getElementsByClassName('bg1')[0].style.backgroundImage = 'url(' + imageUrl + ')'
  document.getElementById('image1').src = document.getElementById('image2').src = document.getElementById('image3').src = imageUrl;
  document.title = 'BlurLyric-' + title + '-(' + singer + '_' + zjm + ')'
  document.getElementById('bgFlexItemLeftTitle').innerText = title;
  document.getElementById('bgFlexItemLeftSinger').innerText = singer;
  document.getElementById('bgFlexItemLeftzjm').innerText = zjm;
  document.getElementById('audio').src = musicUrl;
  setTimeout(() => {
    player.play();
  }, 100);
}

function kydone(e) {
  var evt = window.event || e;
  if (evt.keyCode == 13) {
    Search(document.getElementById('musicInput').value);
  }
}

function Search(text) {
  if (text == undefined) {} else {
    document.getElementById('playerBoxIndex').innerHTML = '<div class="row-index firstrow" > <h1>单曲结果</h1 > <div id="music-index-grid-row" class="grid-row-songs"></div > <div class="row-index" >  <h1>歌单</h1 >  <div id="musicList-index-grid-row" class="musicList-index-grid-row"></div > </div > </div > '
    fetch(cloud + 'search?limit=30&keywords=' + text).then(response => response.json()).then(data => {
      if (data === undefined) {} else {
        switch (data.code) {
          case 200:
            SearchChuLi(data.result.songs);
        }
      }
    })
    fetch(cloud + 'search?limit=30&type=1000&keywords=' + text).then(response => response.json()).then(data => {
      if (data === undefined) {} else {
        switch (data.code) {
          case 200:
            muList(data.result.playlists);
        }
      }
    })
  }
}

function SearchChuLi(songslab, row) {
  if (row == undefined) {
    row = document.getElementById("music-index-grid-row")
  }
  if (songslab != undefined) {
    row.innerHTML = '处理中...'
    var b = ''
    var i = 0
    row.innerHTML = '处理艺人名中'
    var artists = []
    for (; i <= songslab.length - 1; i++) {
      var m = []
      for (var n = 0; n <= songslab[i].artists.length - 1; n++) {
        m[n] = songslab[i].artists[n].name + ' '
      }
      artists.push(m);
    }
    let backlab = []
    row.innerHTML = '开始排序...'
    let musicIds = []
    let picUrl = []
    for (let i = 0; i <= songslab.length - 1; i++) {
      musicIds[i] = (songslab[i].id)
    }
    fetch(cloud + 'song/detail?ids=' + musicIds).then(response => response.json()).then(data => {
      for (let i = 0; i < data.songs.length; i++) {
        picUrl[i] = data.songs[i].al.picUrl;
        backlab[i] = '<div class="grid-item-line"  onclick="searchListSec(' + i + ',' + '\'music\'' + ');"><img src="' + picUrl[i] + '?param=42y42" alt="" height="100%" srcset=""><div class="grid-item-line-text"><div>' + songslab[i].name + '</div><a>' + artists[i] + '</a></div></div>';
        if (i == songslab.length - 1) {
          row.innerHTML = ''
          for (i in backlab) {
            row.innerHTML += backlab[i];
          }
        }
      }
      fetch(cloud + 'song/url?id=' + musicIds).then(response => response.json()).then(data => {
        for (let i = 0; i < musicIds.length; i++) {
          data.data.forEach(function (item, index, array) {
            if (item.id == musicIds[i]) {
              music[i] = [songslab[i].id, picUrl[i], songslab[i].name, artists[i], songslab[i].album.name, songslab[i].album.id, item.url]
            }
          })
        }
      })
    })
  }
}
muListInfo = {}

function muList(songslab) {
  let row = document.getElementById('musicList-index-grid-row');
  let html;
  muListindex = [];
  row.innerHTML = '处理中...';
  muListInfo = songslab
  for (let i = 0; i <= songslab.length - 1; i++) {
    musicList[i] = songslab[i];
    muListindex[i] = '<div class="grid-item" onclick="muListSelect(' + musicList[i].id + ', true)"><div class="grid-item-image"><img src="' + songslab[i].coverImgUrl + '?param=400y400" alt="" width="100%" srcset=""></div><h2> ' + songslab[i].name + '</h2><h3>' + songslab[i].description + '</h3></div>'
    if (i == songslab.length - 1) {
      document.getElementById("musicList-index-grid-row").innerHTML = []
      for (i in muListindex) {
        document.getElementById("musicList-index-grid-row").innerHTML += muListindex[i];
      }
    }
  }
}
muListMap = []
deletItem = []
muLists = []

function muListSelect(i, chageUI) {
  muListMap = []
  var artists = []
  deletItem = []
  picUrl = []
  var backlab = []
  let row = document.getElementById("playlist-index-grid-row")
  fetch(cloud + 'playlist/detail?id=' + i).then(r => r.json()).then(res => {
    if (chageUI) {
      document.getElementById('playerBoxIndex').innerHTML = '<div class="playlist-info"> <div class="playlist-img"> <img id="listImgUrl" width="100%" src="" alt=""> </div> <div class="playlist-info-text"> <div id="listTitle" class="playlist-info-title"></div> <div class="playlist-info-aritst"><a id="listAritst"></a> </div> <div id="listDescription" class="playlist-info-description"> </div> <div class="playlist-info-c"><button onclick="playMuList()">播放此歌单</button> </div> </div></div><div id="playlist-index-grid-row" >嘿嘿！我们的工作准备开展</div>';
      document.getElementById('listImgUrl').src = res.playlist.coverImgUrl
      document.getElementById('listTitle').innerHTML = res.playlist.name
      document.getElementById('listAritst').innerHTML = res.playlist.creator.nickname;
      document.getElementById('listDescription').innerHTML = res.playlist.description;
      let row = document.getElementById("playlist-index-grid-row")
      document.getElementById("playlist-index-grid-row").innerHTML = '别急别急我们正在找网易云菌要歌单'
    }
    fetch(cloud + 'playlist/detail?id=' + res.playlist.id).then(res => res.json()).then(res => {
      muListSelecttrack = res.playlist.trackIds;
      let muListSelecttrackIds = []
      for (num in muListSelecttrack) {
        muListSelecttrackIds[num] = muListSelecttrack[num].id
      }
      if (chageUI) {
        document.getElementById("playlist-index-grid-row").innerHTML = '拿到歌单了，正在努力收集歌单资料'
      }
      fetch(cloud + 'song/detail?ids=' + muListSelecttrackIds).then(response => response.json()).then(data => {
        if (chageUI) {
          document.getElementById("playlist-index-grid-row").innerHTML = '正在努力阅读要求，马上就能展示了'
        }
        for (let i = 0; i < data.songs.length; i++) {
          var m = []
          for (var n = 0; n <= data.songs[i].ar.length - 1; n++) {
            m[n] = data.songs[i].ar[n].name + ' ';
          }
          artists.push(m);
          if (chageUI) {
            document.getElementById("playlist-index-grid-row").innerHTML = '马上就能展示了'
          }
          backlab[i] = '<div class="grid-item-line"  onclick="searchListSec(' + i + ',' + '\'muLists\'' + ');"><img src="' + data.songs[i].al.picUrl + '?param=42y42" alt="" height="100%" srcset=""><div class="grid-item-line-text"><div>' + data.songs[i].name + '</div><a>' + artists[i] + '</a></div></div>';
          if (i == data.songs.length - 1) {
            if (chageUI) {
              document.getElementById("playlist-index-grid-row").innerHTML = ''
            }
            for (i in backlab) {
              if (chageUI) {
                document.getElementById("playlist-index-grid-row").innerHTML += backlab[i];
              }
            }
          }
        }
        fetch(cloud + 'song/url?id=' + muListSelecttrackIds).then(response => response.json()).then(data2 => {
          for (let i = 0; i < muListSelecttrackIds.length; i++) {
            data2.data.forEach(function (item, index, array) {
              if (item.id == muListSelecttrackIds[i]) {
                muLists[i] = [muListSelecttrackIds[i], data.songs[i].al.picUrl, data.songs[i].name, artists[i], data.songs[i].al.name, data.songs[i].al.id, item.url]
              }
            })
          }
          if (chageUI == false) {
            searchListSec(0, 'muLists');
          }
        })
      })
    })
  })
}

function playMuList() {
  searchListSec(0, 'muLists');
}

function createMessage(message, code, color) {
  if (code) {
    color = '--color:0,181,78'
  } else if (code == false) {
    color = '--color:222,50,42'
  } else if (code == undefined && color != undefined) {
    color = '--color:' + color
  } else if (code == undefined && color == undefined) {
    color = '--color:0,122,204'
  }
  let newDiv = document.createElement("div");
  newDiv.innerText = message
  newDiv.id = 'Js_NewMessage'
  newDiv.style = color
  document.body.insertBefore(newDiv, document.getElementById('playerBox'))
}

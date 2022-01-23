var cloud = 'http://127.0.0.1/';

var br = 128000; /*320000*/ ;
var searchListInformation = [];
var music = [];
var player = new Plyr('#audio');
musicList = []


function searchListSec(params, type) {
  if (type != undefined) {
    switch (type) {
      case 'music':
        searchListInformation = music
        break;
    }
  }
  listNum = [params]
  setMusic(searchListInformation[params][0], searchListInformation[params][1], searchListInformation[params][2], searchListInformation[params][3], searchListInformation[params][4], searchListInformation[params][5], searchListInformation[params][6], searchListInformation[params][7])
}

if (audio) {
  if (!audio.loop) {
    audio.addEventListener('ended', function () {
      console.log('播放完毕');
      if (!audio.loop) {
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
    ti: "", //歌曲名
    ar: "", //演唱者
    al: "", //专辑名
    by: "", //歌词制作人
    offset: 0, //时间补偿值，单位毫秒，用于调整歌词整体位置
    ms: [] //歌词数组{t:时间,c:歌词}
  };
  if (musicUrl == undefined) {
    listNum++;
    let params = listNum;
    setMusic(searchListInformation[params][0], searchListInformation[params][1], searchListInformation[params][2], searchListInformation[params][3], searchListInformation[params][4], searchListInformation[params][5], searchListInformation[params][6], searchListInformation[params][7]);
  }
  getMusicDate(id)
  document.getElementById("lyric").innerHTML = '';
  document.getElementsByClassName('bg1')[0].style.backgroundImage= 'url(' + imageUrl + ')'
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
    //回车事件
    Search(document.getElementById('musicInput').value);
  }
}

function Search(text) {
  if (text == undefined) {} else {
    document.getElementById('playerBoxIndex').innerHTML = '<div class="row-index firstrow" > <h1>单曲结果</h1 > <div id="music-index-grid-row" class="grid-row-songs"></div > <div class="row-index" >  <h1>歌单</h1 >  <div id="musicList-index-grid-row" class="musicList-index-grid-row"></div > </div > </div > '
    //搜索单曲
    fetch(cloud + 'search?limit=30&keywords=' + text).then(response => response.json()).then(data => {
      if (data === undefined) {} else {
        switch (data.code) {
          case 200:
            SearchChuLi(data.result.songs);
        }
      }
    })
    //搜索歌单
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
  row.innerHTML = '处理中...'
  var b = ''
  var artists = []
  let picUrl = []
  var i = 0
  row.innerHTML = '处理艺人名中'
  if (songslab != undefined) {

    for (; i <= songslab.length - 1; i++) {
      var m = []
      for (var n = 0; n <= songslab[i].artists.length - 1; n++) {
        m[n] = songslab[i].artists[n].name + ' '
      }
      artists.push(m);
    }
    let backlab = []
    searchListInformation = []
    row.innerHTML = '开始排序...'
    for (let i = 0; i <= songslab.length - 1; i++) {
      fetch(cloud + 'song/detail?ids=' + songslab[i].id)
        .then(response => response.json())
        .then(data => {
          picUrl[i] = data.songs[0].al.picUrl;
          backlab[i] = '<div class="grid-item-line"  onclick="searchListSec(' + i + ',' + '\'music\'' + ');"><img src="' + picUrl[i] + '?param=42y42" alt="" height="100%" srcset=""><div class="grid-item-line-text"><div>' + songslab[i].name + '</div><a>' + artists[i] + '</a></div></div>';
          fetch(cloud + 'song/url?id=' + songslab[i].id)
            .then(response => response.json())
            .then(response => {
              music[i] = [songslab[i].id, picUrl[i], songslab[i].name, artists[i], songslab[i].album.name, songslab[i].album.id, response.data[0].url]
              if (i == songslab.length - 1) {
                row.innerHTML = ''
                for (i in backlab) {
                  row.innerHTML += backlab[i];
                }
              }
            })

        })
      //console.log('音乐准备>'+document.getElementById('musicInput').value+'（'+(i + 1) + '/' + songslab.length + ')')
    }

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
    console.log(musicList[i])
    muListindex[i] = '<div class="grid-item" onclick="muListSelect(' + musicList[i].id + ')"><div class="grid-item-image"><img src="' + songslab[i].coverImgUrl + '?param=400y400" alt="" width="100%" srcset=""></div><h2> ' + songslab[i].name + '</h2><h3>' + songslab[i].description + '</h3></div>'
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

function muListSelect(i) {
  fetch(cloud + 'playlist/detail?id=' + i)
    .then(r => r.json())
    .then(res => {
      document.getElementById('playerBoxIndex').innerHTML = '<div class="playlist-info"> <div class="playlist-img"> <img id="listImgUrl" width="100%" src="" alt=""> </div> <div class="playlist-info-text"> <div id="listTitle" class="playlist-info-title"></div> <div class="playlist-info-aritst"><a id="listAritst"></a> </div> <div id="listDescription" class="playlist-info-description"> </div> <div class="playlist-info-c"><button class="">播放此歌单</button> </div> </div></div><div id="playlist-index-grid-row" >嘿嘿！我们的工作准备开展</div>';
      document.getElementById('listImgUrl').src = res.playlist.coverImgUrl
      document.getElementById('listTitle').innerHTML = res.playlist.name
      document.getElementById('listAritst').innerHTML = res.playlist.creator.nickname;
      document.getElementById('listDescription').innerHTML = res.playlist.description;
      muListMap = []
      deletItem = []
      document.getElementById("playlist-index-grid-row").innerHTML= '别急别急我们正在找网易云菌要歌单'
      fetch(cloud + 'playlist/detail?id=' + res.playlist.id)
        .then(res => res.json())
        .then(res => {
          muListSelecttrack = res.playlist.trackIds;
          for (let num = 0; num <= muListSelecttrack.length - 1; num++) {
            fetch(cloud + 'search?limit=1&keywords=' + muListSelecttrack[num].id)
              .then(response => response.json())
              .then(data => {
                document.getElementById("playlist-index-grid-row").innerHTML= '努力整理信息中'
                if (data.result != undefined) {
                  muListMap[num] = data.result.songs[0];
                  if (num == muListSelecttrack.length - 1) {
                    setTimeout(() => {

                      SearchChuLi2(document.getElementById("playlist-index-grid-row"))
                    }, 100);
                  }
                } else {
                  deletItem.push(num)

                }
              })

          }
        })
    })
}

function SearchChuLi2(row) {

  for (num in deletItem) {
    muListMap.splice(deletItem[num], 1)
  }
  row.innerHTML = '马上好'
  var b = ''
  var artists = []
  let picUrl = []

  row.innerHTML = '马上好'
  for (let i = 0; i < muListMap.length; i++) {
    var m = []
    for (var n = 0; n < muListMap[i].artists.length; n++) {
      m[n] = muListMap[i].artists[n].name + ' '
    }
    artists.push(m);
  }
  let backlab = []
  searchListInformation = []
  row.innerHTML = '等会，马上就好了...'
  for (let i = 0; i < muListMap.length; i++) {
    fetch(cloud + 'song/detail?ids=' + muListMap[i].id)
      .then(response => response.json())
      .then(data => {
        picUrl[i] = data.songs[0].al.picUrl;
        backlab[i] = '<div class="grid-item-line"  onclick="searchListSec(' + i + ',' + '\'music\'' + ');"><img src="' + picUrl[i] + '?param=42y42" alt="" height="100%" srcset=""><div class="grid-item-line-text"><div>' + muListMap[i].name + '</div><a>' + artists[i] + '</a></div></div>';
        fetch(cloud + 'song/url?id=' + muListMap[i].id)
          .then(response => response.json())
          .then(response => {
            music[i] = [muListMap[i].id, picUrl[i], muListMap[i].name, artists[i], muListMap[i].album.name, muListMap[i].album.id, response.data[0].url]
            if (i == muListMap.length - 2) {
              row.innerHTML = ''
              for (i in backlab) {
                row.innerHTML += backlab[i];
              }
            }
          })

      })
    //console.log('音乐准备>'+document.getElementById('musicInput').value+'（'+(i + 1) + '/' + muListMap.length + ')')
  }
}

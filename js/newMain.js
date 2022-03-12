/**
 * 配置区域
 */
var cloud = '../';
var searchListInformation = new Array();
var music = [];
var userProfile
var musicID;
var bodyBox = document.getElementById('playerBoxIndex')
uuid = []
var player = new Plyr('#audio');
musicList = []
listNum = 0
var dailySongs = []
var dailyPlayList = []


/**Br模块 */
function getFmBr(num) {
  if (num == 999000) {
    return '无损'
  } else if (num >= 1000) {
    let newNum = num / 1000
    return Math.floor(newNum) + "Kbps"
  } else {
    return num + "bps"
  }
}

function getBrInf() {
  br = localStorage.getItem('br')
  if (br == undefined) {
    setBr(999000)
  }
}
getBrInf()

function setBr(num) {

  if (num != undefined) {
    localStorage.setItem('br', num)
    br = num
    if (document.getElementById('brDisplay')) {
      document.getElementById('brDisplay').innerText = getFmBr(br)
    }
  }
}

function getBGtype() {
  switch (localStorage.getItem('bgSet')) {
    case '0':
      document.getElementsByClassName('topbar')[0].style = "backdop-filter: blur(8px);background-color:#ffffff70"
      document.getElementById('bg1').style = "filter: blur(10vw) brightness(0.45);display:block"
      return "使用模糊"
    case '1':
      document.getElementsByClassName('topbar')[0].style = "backdop-filter: blur(0);background-color:#fff"
      document.getElementById('bg1').style = "filter: brightness(0.40);display:block"
      return "显示 暗专辑封面"
    case '2':
      document.getElementsByClassName('topbar')[0].style = "backdop-filter: blur(0);background-color:#fff"
      document.getElementById('bg1').style = "display:none"
      return "无背景"
  }
  if (localStorage.getItem('bgSet') == undefined) {
    localStorage.setItem('bgSet', 0)
  }
}
getBGtype()

function setBGtype(num) {
  localStorage.setItem('bgSet', num);
  document.getElementById('bgTypeDisplay').innerText = getBGtype()
}
window.onload = function () {
  var userAgentInfo = navigator.userAgent;
  var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {

    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      createMessage('检测到您是手机用户，您是否需要全屏（点我即可）', 'fullScreen')
      break;
    }
  }
  return flag;
}
/**手机端导航栏隐藏 */
function hideAddressBar_android() {
  var self = document.getElementsByTagName('body')[0];
  if (self.requestFullscreen) {
    //html5新增的全屏方法
    document.getElementsByTagName('body')[0].requestFullscreen();
  } else if (document.getElementsByTagName('body')[0].mozRequestFullScreen) {
    //针对mozlia内核的hack
    document.getElementsByTagName('body')[0].mozRequestFullScreen();
  } else if (document.getElementsByTagName('body')[0].webkitRequestFullScreen) {
    //针对webkit内核的hack
    document.getElementsByTagName('body')[0].webkitRequestFullScreen();
  }
};





document.addEventListener("fullscreenchange", function (event) {
  if (document.fullscreenElement) {} else {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {

      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        createMessage('您刚才退出了全屏，点击再次全屏', 'fullScreen')
        break;
      }
    }
  }
});

/**
 * 主界面切换库
 */
async function setMainBox(link) {
  await fetch(link)
    .then(res => res.text())
    .then(res => {
      document.getElementById("playerBoxIndex").innerHTML = res
    })
}

/**
 * 信息弹出
 * message:信息 code:代码，分为true和false，可不填。color：填rgb色，可不填。
 */

function createMessage(message, code, color, theFunc) {

  let newDiv = document.createElement("div");
  if (code == true) {
    color = '--color:0,181,78'
  } else if (code == false) {
    color = '--color:222,50,42'
  } else if (code == undefined && color != undefined) {
    color = '--color:' + color
  } else if (code == undefined && color == undefined) {
    color = '--color:0,122,204'
  }
  if (code == "fullScreen") {
    newDiv.onclick = function () {
      hideAddressBar_android()
    }
    color = '--color:0,122,204';
  }
  newDiv.innerHTML = message
  newDiv.id = 'Js_NewMessage'
  newDiv.style = color
  document.body.insertBefore(newDiv, document.getElementById('playerBox'))
}

/**
 * 登录信息获取
 */

fetch(cloud + 'login/status?timetamp=' + (Number(new Date()))).then(r => r.json()).then(r => {
  if (r.data.account != null) {

    /**设置标题栏 */
    document.getElementById('HeadImg').src = r.data.profile.avatarUrl;
    document.getElementById('HeadInfoImg').src = r.data.profile.avatarUrl;
    document.getElementById('HeadInfoNickName').innerHTML = r.data.profile.nickname;

    /**临时保存数据 */
    userProfile = r.data.profile
    uuid = r.data.account.id;

    /**设置按钮 */
    document.getElementById('loginButton').style.display = 'none';

    /**临时储存每日推荐和私人雷达内容 */
    fetch(cloud + 'recommend/resource?timetamp=' + (Number(new Date()))).then(r => r.json()).then(dailyPlayListPost => {
      dailyPlayList = dailyPlayListPost.recommend
    })
    fetch(cloud + 'recommend/songs').then(r => r.json()).then(dailySongsPost => {
      dailySongs = dailySongsPost.data.dailySongs
    })

    /**签到 */
    fetch(cloud + 'daily_signin?type=0')
    fetch(cloud + 'daily_signin?type=1')

    /**开始跑个人页面 */
    setTimeout(() => {
      mySelfGui()
    }, 20);
  } else {

    /**要求登录 */
    loginGui('请先登录')
    document.getElementById('logoutButton').style.display = 'none';
    document.getElementById('myButton').style.display = 'none'
  }
})

/**登录界面调出 */
function loginGui(title) {
  if (title == undefined) {
    title = '登录'
  }
  setMainBox("../html/login.txt");
  document.getElementById('loginGuiTitle').innerHTML = title;
}

/**
 * 播放界面·和选歌界面切换
 */
var ud_new = false;

function ud() {
  if (ud_new == false) {
    document.getElementById('playerBox').style = 'transform: translate(0,100%) scale(0.50);opacity: 0.2;'
    document.getElementById('background').style.display = 'block'
    ud_new = true;
  } else {
    document.getElementById('playerBox').style = 'transform: translate(0,-25px) scale(1);opacity: 1;'
    setTimeout(() => {
      if (ud_new == false) {
        document.getElementById('background').style.display = 'none'
      }
    }, 500);
    ud_new = false;
  }
}
async function loginButton() {
  let phone = document.getElementById('phone').value
  let password = document.getElementById('password').value
  let url = 'login/cellphone?timestamp='
  let data = {
    phone: phone,
    password: password,
  }

  if (!phone || !password) {
    document.getElementById('loginButtom').innerHTML = '请填写完全信息'
    return false
  }

  let reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
  isOk = reg.test(password)
  if (isOk == true) {
    url = '/login?email=';
    data = {
      email: phone,
      password: password,
    }
  }

  postData(
      cloud + url + (Number(new Date())), data
    )
    .then(res => {
      if (res.code == 200) {
        document.getElementById('loginButtom').innerHTML = '登录成功, 即将刷新页面'
        setTimeout(() => {
          location.reload()
        }, 3000);
      } else if (res.code == 502) {
        document.getElementById('loginButtom').innerHTML = res.msg
      } else if (res.code == 400) {
        document.getElementById('loginButtom').innerHTML = '账号错误'
      }
    })
}

/**js数据申请工具 */
async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });
  return response.json();
}

async function mySelfGui() {
  document.getElementById("playerBoxIndex").innerHTML = "加载数据中..."
  fetch(cloud + 'user/playlist?uid=' + uuid + '&timetamp=' + (Number(new Date()))).then(r => r.json()).then(playlist => {


    fetch(cloud + 'playlist/detail?id=' + dailyPlayList[0].id + '&timetamp=' + (Number(new Date()))).then(r => r.json()).then(res => {
      if (document.getElementById("playerBoxIndex").innerHTML == "加载数据中...") {
        /**数据请求完毕，开始post界面 */
        setMainBox("../html/myPrf.txt")
          .then(
            function () {
              /**修改界面 */
              document.getElementById('prf-row-myRader').style.backgroundImage = 'url(' + res.playlist.tracks[0].al.picUrl + '?param=200y200)'
              document.getElementById('largerUserHeadImg').src = userProfile.avatarUrl
              document.getElementById('page-userNickName').innerHTML = userProfile.nickname
              document.getElementById('row-myMusicEverDay').style.backgroundImage = 'url(' + dailySongs[0].al.picUrl + '?param=370y370)'
              document.getElementById('row-Mylove').onclick = function () {
                muListSelect(playlist.playlist[0].id, true, true)
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
            }
          )
      }
    })

  })
}


function muListSelect(i, chageUI) {
  muListMap = []
  var artists = []
  deletItem = []
  picUrl = []
  var backlab = ''
  fetch(cloud + 'playlist/detail?id=' + i).then(r => r.json()).then(res => {
    if (chageUI) {
      document.getElementById('playerBoxIndex').innerHTML = '<div class="playlist-info"> <div class="playlist-img"> <img id="listImgUrl" width="100%" src="" alt=""> </div> <div class="playlist-info-text"> <div id="listTitle" class="playlist-info-title"></div> <div class="playlist-info-aritst"><a id="listAritst"></a> </div> <div id="listDescription" class="playlist-info-description"> </div> <div class="playlist-info-c"><button onclick="playMuList()">播放此歌单</button> </div> </div></div><div id="playlist-index-grid-row" >稍等</div>';
      document.getElementById('listImgUrl').src = res.playlist.coverImgUrl
      document.getElementById('listTitle').innerHTML = res.playlist.name
      document.getElementById('listAritst').innerHTML = res.playlist.creator.nickname;
      document.getElementById('listDescription').innerHTML = res.playlist.description;
      document.getElementById("playlist-index-grid-row").innerHTML = '加载中'
    }
    fetch(cloud + 'playlist/detail?id=' + res.playlist.id).then(res => res.json()).then(res => {
      muListSelecttrack = res.playlist.trackIds;
      let muListSelecttrackIds = []
      for (num in muListSelecttrack) {
        muListSelecttrackIds[num] = muListSelecttrack[num].id
      }
      fetch(cloud + 'song/detail?ids=' + muListSelecttrackIds).then(response => response.json()).then(data => {
        for (let i = 0; i < data.songs.length; i++) {
          var m = []
          for (var n = 0; n <= data.songs[i].ar.length - 1; n++) {
            m[n] = data.songs[i].ar[n].name + ' ';
          }
          artists.push(m);
          backlab += '<div class="grid-item-line"  onclick="searchListSec(' + i + ',' + '\'muLists\'' + ');"><img loading=“”lazy" src="' + data.songs[i].al.picUrl + '?param=42y42" alt="" height="100%" srcset=""><div class="grid-item-line-text"><div>' + data.songs[i].name + '</div><a>' + artists[i] + '</a></div></div>';
          if (i == data.songs.length - 1) {
            if (chageUI) {
              document.getElementById("playlist-index-grid-row").innerHTML = backlab;
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

/**
 * 歌曲信息缓存选择
 */
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
  if (usingPersonalFM == true) {
    document.getElementById('dislikeButton').style.display = 'none'
  }
  listNum = params


  if (searchListInformation[params + 1] != undefined) {
    document.getElementById('imgCache').src = searchListInformation[params + 1][1]
  }

  setMusic(searchListInformation[params][0], searchListInformation[params][1], searchListInformation[params][2], searchListInformation[params][3], searchListInformation[params][4])
}

/**
 * 音乐结束监听
 */
if (audio) {
  audio.addEventListener('ended', function () {
    if (audio.loop != true && audio.radom != true) {
      nextMusic()
    } else if (audio.radom == true) {
      listNum == Math.floor(Math.random() * searchListInformation.length);
      let params = listNum;
      setMusic(searchListInformation[params][0], searchListInformation[params][1], searchListInformation[params][2], searchListInformation[params][3], searchListInformation[params][4]);

    }
  })
}
/**
 * 音乐进度监听
 */
function status() {
  setTimeout(() => {
    document.getElementById('musicNowTime').innerText = formateTime(audio.currentTime)
    document.getElementById('musicFullTime').innerText = formateTime(audio.duration)
    status()
  }, 100);
}
status()

/**
 * 播放状态监听
 */
audioStatus = false;
audio.addEventListener("playing", function () {
  audioStatus = true;
  document.getElementById('playIcon').src = './image/pause.svg'
});
audio.addEventListener("pause", function () {
  audioStatus = false;
  document.getElementById('playIcon').src = './image/play.svg'
});

/**
 * 播放按钮
 */
function play() {
  if (audioStatus == true) {
    audio.pause();
  } else if (audio.readyState >= 2 && audioStatus == false) {
    player.play();
  } else if (audio.readyState < 2) {
    createMessage('操作失败<br>音频未装备', false)
  }
}

/**
 * 播放模式调节
 */
var musicPlayShot = 0

function setOneShot() {
  let icon = document.getElementById('ShotIcon')
  if (musicPlayShot == 0) {
    musicPlayShot++;
    audio.loop = true;
    icon.src = "./image/restore.svg"
  } else if (musicPlayShot == 1 && usingPersonalFM == false) {
    musicPlayShot++;
    audio.loop = false;
    audio.radom = true
    icon.src = "./image/random.svg"
  } else if (musicPlayShot == 2 || (musicPlayShot == 1 && usingPersonalFM == true)) {
    musicPlayShot = 0;
    audio.radom = false
    icon.src = "./image/loop.svg"
  }

}
var personalFMimformation = []
var usingPersonalFM = false

/**
 * 私人FM
 */
async function personalFM() {
  //清空
  music = []
  await fetch(cloud + 'personal_fm?' + (Number(new Date())))
    .then(r => r.json()).then(res => {
      document.getElementById('dislikeButton').style.display = 'block'

      personalFMImformation = res.data
      var artists = []
      for (let i = 0; i <= personalFMImformation.length - 1; i++) {
        var m = []
        for (var n = 0; n <= personalFMImformation[i].artists.length - 1; n++) {
          m[n] = personalFMImformation[i].artists[n].name + ' '
        }
        artists.push(m);
      }
      let musicIds = []
      for (let i = 0; i <= personalFMImformation.length - 1; i++) {
        musicIds[i] = (personalFMImformation[i].id)
      }
      fetch(cloud + 'song/detail?ids=' + musicIds).then(response => response.json()).then(data => {
        for (let i = 0; i < data.songs.length; i++) {
          if (usingPersonalFM == true) {
            
            searchListInformation.push([personalFMImformation[i].id, data.songs[i].al.picUrl, data.songs[i].name, artists[i], data.songs[i].al.name, data.songs[i].al.id, personalFMImformation[i].url])
            }
          music[i] = [personalFMImformation[i].id, data.songs[i].al.picUrl, data.songs[i].name, artists[i], data.songs[i].al.name, data.songs[i].al.id, personalFMImformation[i].url]
        }
        if (usingPersonalFM == false) {
          usingPersonalFM = true
          searchListSec(0, 'music');
        }
        usingPersonalFM = true
      })
    })
}
/**
 * 喜欢按钮
 * id: num
 */
function likeThis(id) {
  let funID
  if (id != undefined) {
    funID = id
  } else if (musicID != undefined) {
    funID = musicID
  }
  if (funID != undefined) {
    fetch(cloud + 'like?id=' + funID)
      .then(r => r.json()).then(res => {
        if (res.code == 200) {
          createMessage('操作成功', true)
        }
      })
  }
}


/**
 * 不喜欢按钮
 */
function dislikeThis() {

  if (musicID != undefined) {
    if (usingPersonalFM == true) {
      fetch(cloud + 'like?id=' + musicID + '&like=false')
        .then(r => r.json()).then(res => {
          if (res.code == 200) {
            createMessage('已将此曲移至垃圾桶, 将切换下一首', true)
            nextMusic()
          }
        })
    } else {

      fetch(cloud + 'like?id=' + musicID + '&like=false')
        .then(r => r.json()).then(res => {
          if (res.code == 200) {
            createMessage('操作成功, 在下一次打开我喜欢的时候刷新, 将切换下一首', true)
            nextMusic()
          }
        })
    }
  }
}

/**
 * 下一首音乐
 */
function nextMusic() {
  listNum++
  if (searchListInformation.length == listNum) {
    //播放到最后一首情况
    setMusic(searchListInformation[listNum][0], searchListInformation[listNum][1], searchListInformation[listNum][2], searchListInformation[listNum][3], searchListInformation[listNum][4]);
  } else if (searchListInformation.length != listNum) {
    //播放到平常的情况
    document.getElementById('imgCache').src = searchListInformation[listNum + 1][1]
    setMusic(searchListInformation[listNum][0], searchListInformation[listNum][1], searchListInformation[listNum][2], searchListInformation[listNum][3], searchListInformation[listNum][4]);
  } else if (searchListInformation.length + 1 == listNum) {
    //当歌单完全播放完毕的情况
    createMessage('操作失败<br>您的列表已经播放结束或是您没有选择任何音乐', true)
  }


  if (usingPersonalFM == true && searchListInformation[listNum + 3] == undefined) {
    personalFM()
  }


}

/**
 * 上一首音乐
 */
function beforeMusic() {
  if (listNum != 0 && searchListInformation.length != 0) {
    listNum--;
    let params = listNum;
    setMusic(searchListInformation[params][0], searchListInformation[params][1], searchListInformation[params][2], searchListInformation[params][3], searchListInformation[params][4]);
  }  else {
    createMessage('操作失败<br>您的列表已经播放结束或是您没有选择任何音乐', false)
  }
}

/**
 * 
 * @param {num} id 网易云音乐ID
 * @param {url} imageUrl 封面图片
 * @param {text} title 音乐标题
 * @param {text} singer 歌手
 * @param {text} zjm 专辑
 * @param {num} zjmid 专辑ID
 * @param {num} musicUrl 音乐链接（已费用）
 * @param {text} oLRC 歌词
 */

function setMusic(id, imageUrl, title, singer, zjm, otherBr) {
  console.log(br, otherBr);
  fetch(cloud + 'scrobble?id=' + musicID).then(res => console.log(res.json()))
  /**重置歌词数据 */
  lineNo = 0
  oLRC = {
    ti: "",
    ar: "",
    al: "",
    by: "",
    offset: 0,
    ms: []
  };
  getMusicDate(id)

  /**检测条件 */

  if (otherBr == undefined) {
    otherBr = br
  }
  if (usingPersonalFM) {
    document.getElementById('dislikeButton').style.display = 'block'
    if (document.getElementById('row-myMusicYoursRadio')) {
      document.getElementById('row-myMusicYoursRadio').style.backgroundImage = 'url(' + imageUrl + ')'
    }
  }

  musicID = id


  fetch(cloud + 'check/music?id=' + id + '&br=' + otherBr)
    .then(r => r.json())
    .then(theGet => {
      if (theGet.success == true) {

      } else {

        switch (otherBr) {
          case 999000:
            setMusic(id, imageUrl, title, singer, zjm, 320000)
            break;
          case 320000:
            setMusic(id, imageUrl, title, singer, zjm, 192000)
            break;
          case 192000:
            setMusic(id, imageUrl, title, singer, zjm, 128000)
            break;
          case 128000:
            createMessage('抱歉，《' + title + '》这首音乐无法获取资源，正在切换下一首', false)
            nextMusic()
            break;

        }
      }
    })
  fetch(cloud + 'song/url?id=' + id + '&br=' + otherBr)
    .then(r => r.json())
    .then(muPost => {
      document.getElementById('playerDisplayQuitly').innerText = getFmBr(muPost.data[0].br)
      console.log(cloud + 'song/url?id=' + id + '&br=' + otherBr, muPost);
      document.getElementById('audio').src = muPost.data[0].url;
      document.getElementsByClassName('bg1')[0].style.backgroundImage = 'url(' + imageUrl + ')'
      document.getElementById('image1').src = document.getElementById('image2').src = document.getElementById('image3').src = imageUrl;
      document.title = 'BlurLyric-' + title + '-(' + singer + '_' + zjm + ')'
      document.getElementById('bgFlexItemLeftTitle').innerText = title;
      document.getElementById('bgFlexItemLeftSinger').innerText = singer;
      document.getElementById('bgFlexItemLeftzjm').innerText = zjm;
      audio.addEventListener('loadeddata', function () {

        if (audio.readyState >= 2) {
          player.play();
        }

      });
    })


}

/**
 * 每日推荐引擎
 * @param {Boolean} chageUI 是否切换UI
 */
async function funDailySongs(chageUI) {
  if (chageUI) {
    document.getElementById('playerBoxIndex').innerHTML = '稍等'
  }

  var artists = []
  var backlab = []
  songsUrl = []
  var Ids = []
  for (num = 0; num < dailySongs.length; num++) {
    Ids[num] = dailySongs[num].id
  }
  for (num = 0; num < dailySongs.length; num++) {
    var m = []
    for (i in dailySongs[num].ar) {
      m[i] = dailySongs[num].ar[i].name + ' ';
    }
    artists[num] = m;
    backlab[num] = '<div class="grid-item-myloveLine grid-item-line"  onclick="searchListSec(' + num + ',' + '\'muLists\'' + ');"><img loading=“”lazy" src="' + dailySongs[num].al.picUrl + '?param=42y42" alt="" height="100%" srcset=""><div><div class="grid-item-line-text"><div>' + dailySongs[num].name + '</div><a>' + artists[num] + '</a></div></div><div class="muListRight"><div class="muListReason">' + dailySongs[num].reason + '</div><div class="muListButton"><div onclick="likeThis("' + dailySongs[num].id + '")"><img height="100%" src="./image/like.svg" alt="添加到 “我喜欢的” " srcset=""></div></div></div></div>';
    if (num == dailySongs.length - 1) {

      if (chageUI) {
        setMainBox('../html/dailySongs.txt').then(function () {
          document.getElementById('largerUserHeadImg').src = userProfile.avatarUrl
          document.getElementById('page-userNickName').innerHTML = '你好' + userProfile.nickname + '! 网易云音乐向您推荐:'
          document.getElementById('playlist-index-grid-row').innerHTML = ''
          for (i in backlab) {
            document.getElementById("playlist-index-grid-row").innerHTML += backlab[i];
          }
        })
      } else {
        searchListSec(0, 'muLists');
      }

    }
    muLists[num] = [dailySongs[num].id, dailySongs[num].al.picUrl, dailySongs[num].name, artists[num], dailySongs[num].al.name]
  }

}


/**
 * 搜索
 */
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




/**
 * 单曲处理
 */
function SearchChuLi(songslab, row) {
  if (row == undefined) {
    row = document.getElementById("music-index-grid-row")
  }
  if (songslab != undefined) {
    row.innerHTML = '处理中...'
    row.innerHTML = '处理艺人名中'
    var artists = []
    for (i = 0; i < songslab.length; i++) {
      var m = []
      for (var n = 0; n < songslab[i].artists.length; n++) {
        m[n] = songslab[i].artists[n].name + ' '
      }
      artists.push(m);
    }
    let backlab = []
    row.innerHTML = '开始排序...'
    let musicIds = []
    let picUrl = []
    for (let i = 0; i < songslab.length; i++) {
      musicIds[i] = (songslab[i].id)
    }
    fetch(cloud + 'song/detail?ids=' + musicIds).then(response => response.json()).then(data => {
      for (let i = 0; i < data.songs.length; i++) {
        picUrl[i] = data.songs[i].al.picUrl;
        backlab[i] = '<div class="grid-item-line"  onclick="usingPersonalFM = false;searchListSec(' + i + ',' + '\'music\'' + ')"><img loading=“”lazy" src="' + picUrl[i] + '?param=42y42" alt="" height="100%" srcset=""><div class="grid-item-line-text"><div>' + songslab[i].name + '</div><a>' + artists[i] + '</a></div><div class="muListRight"><div class="muListButton"><div onclick="likeThis("' + data.songs[i].id + '")"><img height="100%" src="./image/like.svg" alt="添加到 “我喜欢的” " srcset=""></div></div></div></div>';
        if (i == songslab.length - 1) {
          row.innerHTML = ''
          let e = ''
          for (i in backlab) {
            e += backlab[i];
          }
          row.innerHTML = e
        }
      }
      for (let i = 0; i < musicIds.length; i++) {

        music[i] = [songslab[i].id, picUrl[i], songslab[i].name, artists[i], songslab[i].album.name]


      }
    })

  }
}

/**
 * 歌单搜索结果展示
 */
muListInfo = {}

function muList(songslab) {
  let row = document.getElementById('musicList-index-grid-row');
  muListindex = [];
  row.innerHTML = '处理中...';
  muListInfo = songslab
  for (let i = 0; i <= songslab.length - 1; i++) {
    musicList[i] = songslab[i];
    muListindex[i] = '<div class="grid-item" onclick="muListSelect(' + musicList[i].id + ', true)"><div class="grid-item-image"><img loading=“”lazy" src="' + songslab[i].coverImgUrl + '?param=400y400" alt="" width="100%" srcset=""></div><h2> ' + songslab[i].name + '</h2><h3>' + songslab[i].description + '</h3></div>'
    if (i == songslab.length - 1) {
      document.getElementById("musicList-index-grid-row").innerHTML = []
      for (i in muListindex) {
        document.getElementById("musicList-index-grid-row").innerHTML += muListindex[i];
      }
    }
  }
}


/**
 * 加载歌单页面
 */

muListMap = []
deletItem = []
muLists = []


function muListSelect(i, chageUI, isMyLove) {
  muListMap = []
  if (isMyLove == true) {
    func = 'dislikeThis'
    funcsrc = '../image/dislike.svg'
  } else {
    func = 'likeThis'
    funcsrc = './image/like.svg'
  }
  var artists = []
  deletItem = []
  picUrl = []
  var backlab = ''
  fetch(cloud + 'playlist/detail?id=' + i).then(r => r.json()).then(res => {
    if (chageUI) {
      setMainBox('../html/playerList.txt').then(function () {
        document.getElementById('listImgUrl').src = res.playlist.coverImgUrl
        document.getElementById('listTitle').innerHTML = res.playlist.name
        document.getElementById('listAritst').innerHTML = res.playlist.creator.nickname;
        document.getElementById('listDescription').innerHTML = res.playlist.description;
      })
    }
    fetch(cloud + 'playlist/detail?id=' + res.playlist.id).then(res => res.json()).then(res => {
      muListSelecttrack = res.playlist.trackIds;
      let muListSelecttrackIds = []
      for (num in muListSelecttrack) {
        muListSelecttrackIds[num] = muListSelecttrack[num].id
      }

      fetch(cloud + 'song/detail?ids=' + muListSelecttrackIds).then(response => response.json()).then(data => {

        for (let i = 0; i < data.songs.length; i++) {
          var m = []
          for (var n = 0; n <= data.songs[i].ar.length - 1; n++) {
            m[n] = data.songs[i].ar[n].name + ' ';
          }
          artists.push(m);
          backlab += '<div class="grid-item-line"  onclick="searchListSec(' + i + ',' + '\'muLists\'' + ');usingPersonalFM = false"><img loading=“”lazy" src="' + data.songs[i].al.picUrl + '?param=48y48" alt="" height="100%" srcset=""><div class="grid-item-line-text"><div>' + data.songs[i].name + '</div><a>' + artists[i] + '</a></div><div class="muListRight"><div class="muListButton"><div onclick="' + func + '("' + data.songs[i].id + '")"><img height="100%" src="' + funcsrc + '" alt="添加到 “我喜欢的” " srcset=""></div></div></div></div>';
          if (i == data.songs.length - 1) {
            if (chageUI) {
              document.getElementById("playlist-index-grid-row").innerHTML = backlab;
            }

          }
        }
        for (let i = 0; i < muListSelecttrackIds.length; i++) {

          muLists[i] = [muListSelecttrackIds[i], data.songs[i].al.picUrl, data.songs[i].name, artists[i], data.songs[i].al.name]
        }

      })

    })
  })
}

function playMuList() {
  searchListSec(0, 'muLists');
  usingPersonalFM = false
}

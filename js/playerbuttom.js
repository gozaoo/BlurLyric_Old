infomation = []

function setMV(title, id, cr, type) {
  let url

  if (type == 0) {
    fetch(cloud + 'mv/url?id=' + id)
      .then(response => response.json())
      .then(res => {
        url = res.data.url
        console.log(url);
        new WinBox({
          title: title + ' ' + cr,
          width: '770px',
          height: '469px;',
          html: '<video class="MV" id="a' + id + '" src="' + url + '"></video>;',
          class: "my-theme",
        });
        const newPlayer = new Plyr(' #a' + id)
      })
  } else if (type == 1) {
    fetch(cloud + 'video/url?id=' + id)
      .then(response => response.json())
      .then(res => {
        url = res.urls[0].url
        new WinBox({
          title: title + ' ' + cr,
          width: '770px',
          height: '469px;',
          html: '<video id="a' + id + '" src="' + url + '"></video>',
          class: "my-theme",
        });
        const newPlayer = new Plyr(' #a' + id)
      })
  }
    
}


var audioStatus = "paused";

function play() {
  if (audioStatus) {
    audio.pause();
  } else if (audio.src != 'http://127.0.0.1:3000/' && audio.src != 'http://127.0.0.1:5500/') {
    console.log(audio.src)
    audio.play();
  }
}

function status() {
  audio.addEventListener("playing", function () {
    audioStatus = true;
  });
  audio.addEventListener("pause", function () {
    audioStatus = false;
  });
  setTimeout(() => {
    status()
  }, 50);
}
play()

var ud_new = true;

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
ud()


function HengxiangGundong(params) {
  params.onwheel = function (event) {
    if (ud_new == false) {
      //禁止事件默认行为（此处禁止鼠标滚轮行为关联到"屏幕滚动条上下移动"行为）  
      event.preventDefault();
      //设置鼠标滚轮滚动时屏幕滚动条的移动步长  
      var step = 200;
      if (event.deltaY < 0) {
        //向上滚动鼠标滚轮，屏幕滚动条左移  
        this.scrollLeft -= step;
      } else {
        //向下滚动鼠标滚轮，屏幕滚动条右移  
        this.scrollLeft += step;
      }
    }
  }
}
/**HengxiangGundong(document.getElementById('backlab_music'));
HengxiangGundong(document.getElementById('backlab_MV'));*/


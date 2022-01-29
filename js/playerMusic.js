lineNo = 0; //当前行
var lineNoTop;
LineNoIf();
TestGunDong();
var audio = document.getElementById("audio"); //播放器
var ul = document.getElementById("lyric"); //歌词容器列表


SetLineHeight()

function LineNoIf() {
  var templineNo
  for (var i = 0; i < oLRC.ms.length; i++) {
    if (oLRC.ms[i].t <= document.getElementById("audio").currentTime + 0.5) {
      templineNo = i + 1;
    }
  }
  if (templineNo != undefined) {
    lineNo = templineNo
  }
  t = setTimeout('LineNoIf()', 16);
}
var lis = ul.getElementsByTagName("li")

var displayLineNo = 0

function SetLineHeight() {
  //高亮行
  if (lineNo != displayLineNo) {
    if (lineNo > 0 && audioStatus) {
      lis[lineNo - 1].className = "lineHigh"; //高亮显示当前行
      if (!canGetBodyHeight) {
        document.getElementById('bgFlexItemLeftLyric').innerHTML = lis[lineNo - 1].innerHTML
      }
      for (var i = 0; i < oLRC.ms.length; i++) {
        if (i != lineNo - 1) {
          lis[i].removeAttribute("class")
        }
      }
    }
    displayLineNo = lineNo
  }
  t = setTimeout('SetLineHeight()', 16);
}
var bodyHeight
var topheight
var bodyWidth
canGetBodyHeight = true

function GetBodyHeight() {
  if (canGetBodyHeight) {
    bodyHeight = document.body.clientHeight
    bodyWidth = document.body.clientWidth
    setTimeout(() => {
      GetBodyHeight()
    }, 1000);
  } else {
    setTimeout(() => {
      bodyHeight = document.body.clientHeight
      bodyWidth = document.body.clientWidth
      GetBodyHeight()
    }, 1500);
  }
}
GetBodyHeight()

function TestGunDong() {
  if (bodyWidth >= 958 && audioStatus) {
    //获取一共要探高多少像素
    lineNoTop = 0
    for (let i = 0; i < lineNo; i++) {
      lineNoTop += lis[i].clientHeight + 30;

    }

    //计算居中后多少像素
    topheight = bodyHeight / 2 - lineNoTop;
    document.getElementById("lyric").style.transform = "translateY(" + topheight + "px)";

    canGetBodyHeight = true
  } else {
    canGetBodyHeight = false
  }
  t = setTimeout('TestGunDong()', 150);
}

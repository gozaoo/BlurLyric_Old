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
    if (oLRC.ms[i].t <= document.getElementById("audio").currentTime + 0.7) {
      templineNo = i + 1;
    }
  }
  if (templineNo != undefined) {
    lineNo = templineNo
  }
  t = setTimeout('LineNoIf()', 100);
}

function SetLineHeight() {

  let lis = ul.getElementsByTagName("li"); //歌词数组
  if (lineNo > 0 && audioStatus) {
    lis[lineNo - 1].className = "lineHigh"; //高亮显示当前行
    document.getElementById('bgFlexItemLeftLyric').innerHTML = lis[lineNo - 1].innerHTML
  }
  var a = 0
  var c
  for (var i = 0; i <= lineNo - 1; i++) {
    var b
    b = lis[i].clientHeight + 30
    a += b
    c = a
  }
  lineNoTop = c
  for (var i = 0; i < oLRC.ms.length; i++) {
    if (i != lineNo - 1) {
      lis[i].removeAttribute("class")
    }
    if (i != lineNo - 1 && !audioStatus) {
      lis[i].style.filter = 'blur(0px)'
    }
  }
  t = setTimeout('SetLineHeight()', 100);
}
var bodyHeight
var topheight
function TestGunDong() {
  if (document.body.clientWidth >= 958) {
  if (document.body.clientHeight != bodyHeight){
    bodyHeight = document.body.clientHeight 
  }
  topheight = document.body.clientHeight / 2 - lineNoTop;
  document.getElementById("lyric").style.transform = "translateY(" + topheight + "px)";
  
  }
t = setTimeout('TestGunDong()', 100);
}

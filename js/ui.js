
backAfterMain = true
var params = {
  left: 0,
  top: 0,
  currentX: 0,
  currentY: 0,
  flag: false
};
//获取相关CSS属性
var getCss = function (o, key) {
  return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key];
};

//拖拽的实现
var startDrag = function (bar, target, callback) {
  if (getCss(target, "top") !== "auto") {
    params.top = getCss(target, "top");
  }
  //o是移动对象
  bar.ontouchstart = function (event) {
    params.flag = true;
    
    console.log('awa');
  }
  bar.onmousedown = function (event) {
    params.flag = true;
    if (!event) {
      event = window.event;
      //防止IE文字选中
      bar.onselectstart = function () {
        return false;
      }
    }
    document.getElementById('playerBox').style.display = 'block'
  };
  document.ontouchend = function () {
    params.flag = false;
    document.getElementById('mouseDown').style = "backdrop-filter: blur(0px);background-color:rgba(105,105,105,1)"

    if (params.top < 100 || (params.top < bodyHeight - 100 && backAfterMain == true)) {
      target.style.top = "0px";
      params.top = "0";
      backAfterMain = false
      document.getElementsByClassName('bgFlex')[0].style.display = 'flex'
      document.getElementById('playerBox').style.display = 'none'
    } else if ((params.top > 100 && backAfterMain == false)) {
      params.top = bodyHeight - 30;
      target.style.top = bodyHeight - 30 + 'px'
      backAfterMain = true   
      setTimeout(() => {
        document.getElementsByClassName('bg1')[0].style.display = 'none'
        document.getElementsByClassName('bgFlex')[0].style.display = 'none';
      }, 500);
    }

  }
  document.onmouseup = function () {
    params.flag = false;
    if (params.top < 100 || (params.top < bodyHeight - 100 && backAfterMain == true)) {
      target.style.top = "0px";
      params.top = "0";
      backAfterMain = false
      document.getElementById('mouseDown').style = "backdrop-filter: blur(8px);background-color:rgba(0,0,0,0.08);";
      document.getElementsByClassName('bgFlex')[0].style.display = 'flex'
      
      setTimeout(() => {
        document.getElementsByClassName('bg1')[0].style.display = 'block'}, 500);

    } else if ((params.top > 100 && backAfterMain == false)) {
      params.top = bodyHeight - 30;
      target.style.top = bodyHeight - 30 + 'px'
      backAfterMain = true   
      document.getElementById('mouseDown').style = "backdrop-filter: blur(0px);background-color:rgba(105,105,105,1)"
      setTimeout(() => {
        document.getElementsByClassName('bg1')[0].style.display = 'none'
      document.getElementsByClassName('bgFlex')[0].style.display = 'none';
      }, 500);
    }

  }
  document.ontouchmove= function (event) {
		if (params.flag) {
				nowY = event.changedTouches[0].clientY;
				disY = nowY - params.currentY;
			target.style.top = disY + "px";
      params.top = disY
      
		}
	}
  document.onmousemove = function (event) {
    var e = event ? event : window.event;
    if (params.flag) {
        nowY = e.clientY;
        disY = nowY - params.currentY;
        target.style.top = parseInt(params.top)+ "px";
      params.top = disY
      if (event.preventDefault) {
        event.preventDefault();
      }

    }
  }

  params.top = bodyHeight - 30;
  target.style.top = bodyHeight - 30 + 'px'
};

startDrag(document.getElementById('mouseDown'), document.getElementById('background'))

document.getElementById('mouseDown').addEventListener("click", function () {
  target = document.getElementById('background');
  if (backAfterMain == true) {
    target.style.top = "0px";
    params.top = "0";
    backAfterMain = false
    document.getElementById('mouseDown').style = "backdrop-filter: blur(8px);background-color:rgba(0,0,0,0.08);";
    document.getElementsByClassName('bgFlex')[0].style.display = 'flex'

    setTimeout(() => {
      document.getElementsByClassName('bg1')[0].style.display = 'block'
    }, 500);

  } else if ((backAfterMain == false)) {
    params.top = bodyHeight - 30;
    target.style.top = bodyHeight - 30 + 'px'
    backAfterMain = true
    document.getElementById('mouseDown').style = "backdrop-filter: blur(0px);background-color:rgba(105,105,105,1)"
    setTimeout(() => {
      document.getElementsByClassName('bg1')[0].style.display = 'none'
      document.getElementsByClassName('bgFlex')[0].style.display = 'none';
    }, 500);
  }
})
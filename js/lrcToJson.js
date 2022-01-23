function getMusicDate(id){
    
    oLRC = {
    ti: "", //歌曲名
    ar: "", //演唱者
    al: "", //专辑名
    by: "", //歌词制作人
    offset: 0, //时间补偿值，单位毫秒，用于调整歌词整体位置
    ms: [] //歌词数组{t:时间,c:歌词}
};
    fetch(cloud+"lyric?id="+id)
    .then(response => response.json())
    .then(data => {
        createLrcObj(data.lrc.lyric);
    })
}

var oLRC = {
    ti: "", //歌曲名
    ar: "", //演唱者
    al: "", //专辑名
    by: "", //歌词制作人
    offset: 0, //时间补偿值，单位毫秒，用于调整歌词整体位置
    ms: [] //歌词数组{t:时间,c:歌词}
};

function createLrcObj(lrc) {
    var lrcs = lrc.split('\n');//用回车拆分成数组
    for(var i in lrcs) {//遍历歌词数组
    	lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, ""); //去除前后空格
        var t = lrcs[i].substring(lrcs[i].indexOf("[") + 1, lrcs[i].indexOf("]"));//取[]间的内容
        var s = t.split(":");//分离:前后文字
        if(isNaN(parseInt(s[0]))) { //不是数值
            for (var i in oLRC) {
                if (i != "ms" && i == s[0].toLowerCase()) {
                    oLRC[i] = s[1];
                }
            }
        }else { //是数值
            var arr = lrcs[i].match(/\[(\d+:.+?)\]/g);//提取时间字段，可能有多个
            var start = 0;
            for(var k in arr){
                start += arr[k].length; //计算歌词位置
            }
            var content = lrcs[i].substring(start);//获取歌词内容
            for (var k in arr){
                var t = arr[k].substring(1, arr[k].length-1);//取[]间的内容
                var s = t.split(":");//分离:前后文字
                oLRC.ms.push({//对象{t:时间,c:歌词}加入ms数组
                    t: (parseFloat(s[0])*60+parseFloat(s[1])).toFixed(3),
                    c: content
                });
            }
        }
    }
    oLRC.ms.sort(function (a, b) {//按时间顺序排序
        return a.t-b.t;
    });
    /*
    for(var i in oLRC){ //查看解析结果
        console.log(i,":",oLRC[i]);
    }*/
    
    showLRC();
}

function showLRC() {
    document.getElementById("lyric").innerHTML = '<li class="lrclab">loading</li><li class="lrclab">loading</li><li class="lrclab">loading</li><li class="lrclab">loading</li><li class="lrclab">loading</li><li class="lrclab">loading</li><li class="lrclab">loading</li>';
    let s="";
    for (let i = 0; i < oLRC.ms.length; i++) {//遍历ms数组，把歌词加入列表
        s+='<li class="lrclab" onclick="player.currentTime='+(oLRC.ms[i].t - 0.6)+'"> '+'<div>'+formateTime(oLRC.ms[i].t)+'</div>'+oLRC.ms[i].c+'</li>';
    }
    document.getElementById("lyric").innerHTML = s;
}


function formateTime(time) {
    const h = parseInt(time / 3600)
    const minute = parseInt(time / 60 % 60)
    const second = Math.ceil(time % 60)    

    const hours = h < 10 ? '0' + h : h
    const formatSecond = second > 59 ? 59 : second
    return `${hours > 0 ? `${hours}:` : ''}${minute < 10 ? '0' + minute : minute}:${formatSecond < 10 ? '0' + formatSecond : formatSecond}`
}

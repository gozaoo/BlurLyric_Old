function gologin(phone, password) {
  if (!phone || !password) {
    return '请填写您的手机号和密码'
  }
  login(phone,password)
}

async function login(phone,password) {
  var res
  postData(
    cloud + 'login/cellphone?timestamp=' + (Number(new Date())),
    {
    phone: phone,
    password: password,
  })
  .then (res => {
    console.log(res);
    res.data
    if(res.code == 200){
      document.getElementById('loginButtom').innerHTML = '登录成功, 即将刷新页面'
      setTimeout(() => {
        location.reload()
      }, 3000);
    } else if(res.code == 502){
      document.getElementById('loginButtom').innerHTML = res.msg
    }else if(res.code == 400){
      document.getElementById('loginButtom').innerHTML = '账号错误'
    }
  })

  
}

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
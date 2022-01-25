function gologin(phone, password) {
  if (!phone || !password) {
    return '请填写您的手机号和密码'
  }
  login(phone,password)
}

async function login(phone,password) {
  const res = await axios({
    url: cloud + `login/cellphone?timestamp=` + (Number(new Date())),
    method: 'post',
    data: {
      phone: phone,
      password: password,
    },
  })
  console.log(res);
  res.data
  if(res.data.code == 200){
    document.getElementById('loginButtom').innerHTML = '登录成功, 即将刷新页面'
    setTimeout(() => {
      location.reload()
    }, 3000);
  } else {
    document.getElementById('loginButtom').innerHTML = res.data.msg
  }
  
}

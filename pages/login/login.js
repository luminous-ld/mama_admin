var userLogin = new Vue({
    el: ".flexBox",
    data: {
        user: '',
        pwd: ''
    },
    methods: {
        login() {
            if(this.user == 'admin' && this.pwd == '123456') {
                layer.msg('登录成功！');
                sessionStorage.setItem('isLogin', 'yes');
                setTimeout(() => {
                    window.location.href = '../courseOperation/courseRecommend.html';
                }, 500);
            }else {
                layer.msg('用户名或密码错误！');
            }
        }
    },
})

$('input').keyup(function (event) {
    if (event.keyCode == 13) {
        userLogin.login();
    }
});
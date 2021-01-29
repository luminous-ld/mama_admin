layui.use('element', function () {})

window.addEventListener('load', function() {
    let login = sessionStorage.getItem('isLogin');
    if(login == null || login == 'no') {
        window.location.href = '../login/login.html';
    }
})

$('.logout').on('click', function() {
    layer.confirm('确认退出', function(index) {
        sessionStorage.setItem('isLogin', 'no');
        window.location.href = '../login/login.html';
        layer.close(index);
    })
})

$(document).ready(function () {

    $(".animsition").animsition({

        inClass: 'fade-in',
        outClass: 'fade-out',
        inDuration: 1500,
        outDuration: 800,
        linkElement: '.animsition-link',
        // e.g. linkElement   :   'a:not([target="_blank"]):not([href^=#])'
        loading: true,
        loadingParentElement: 'body', //animsition wrapper element
        loadingClass: 'animsition-loading',
        unSupportCss: ['animation-duration',
            '-webkit-animation-duration',
            '-o-animation-duration'
        ],
        //"unSupportCss" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
        //The default setting is to disable the "animsition" in a browser that does not support "animation-duration".

        overlay: false,

        overlayClass: 'animsition-overlay-slide',
        overlayParentElement: 'body'
    });
});
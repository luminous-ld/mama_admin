import {
    getRequest
} from '../../util.js'

let courseAll = []; // 所以供选择的课程
// 上个页面传入 type 和 id
let type = parseInt(getRequest().type);
let id = parseInt(getRequest().id);

var tableScene = new Vue({
    el: "#sceneEdit",
    data: {
        sceneDetail: [],
        type: type,
    },
    methods: {
        delRow(e) {
            console.log(e);
        },
        delPic(e) {
            console.log(e);
        },
        changePic(e) {
            console.log(e);


        }
    },
})

// 页面加载时
window.addEventListener('load', function () {
    console.log(getRequest());
    // 获取场景详情请求
    getSceneDetail(id, type);

    
    //选完文件后不自动上传
    layui.use('upload', function () {
        upload.render({
            elem: '#changeSpan',
            url: 'https://httpbin.org/post' //改成您自己的上传接口
            ,
            auto: false
            //,multiple: true
            ,
            bindAction: '#delSpan',
            done: function (res) {
                layer.msg('上传成功');
                console.log(res)
            }
        });
    })
    
})

//动态插入 selector 的 option
function insertSelectOption(form) {
    tableScene.$data.sceneDetail.forEach(item => {
        // console.log(item)
        var option = $('<option value="' + item.title + '">' + item.title + '</option>');
        $("select[name = 'courseName']").append(option);
    })

    form.render('select');
}

// 获取场景详情的请求
// id: 场景id  type: 场景类型 0-焦点图 1-课程模块 2-文案
function getSceneDetail(id, type) {
    $.ajax({
        url: "../scene/getSceneDetail" + type + id + ".json",
        dataType: "json",
        type: "get",
        success: res => {
            if (res.code == 0) {
                tableScene.$data.sceneDetail = JSON.parse(JSON.stringify(res.data));
            } else {
                console.log(res.msg);
            }
        },
        fail: res => {
            console.log(res.msg);
        }
    });
}
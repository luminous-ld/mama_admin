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
            console.log("row: " + e.path[2].dataset.rowindex);
            let rowIndex = e.path[2].dataset.rowindex;
        },
        delPic(e) {
            console.log("row: " + e.path[4].dataset.rowindex);
            let rowIndex = e.path[4].dataset.rowindex;
        },
        changePic(e) {
            console.log("row: " + e.path[5].dataset.rowindex);
            let rowIndex = e.path[5].dataset.rowindex - 1;
            console.log(e.target.files[0]);
            let file = e.target.files[0];
            previewPic(file, rowIndex);
        }
    },
    mounted() {

    },
})

// 页面加载时
window.addEventListener('load', function () {
    console.log(getRequest());
    // 获取场景详情请求
    getSceneDetail(id, type);




})

// 预览图片
function previewPic(file, row) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        tableScene.$data.sceneDetail[row].coverUrl = e.target.result;
    };
}


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
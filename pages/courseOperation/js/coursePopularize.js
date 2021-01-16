import {
    formatCreateTimeAndUpdateTime
} from '../../util.js';

// 焦点图表格 vue 实例
var tableFocusPic = new Vue({
    el: "#focusPic",
    data: {
        focusPicData: [],
    },
    methods: {
        edit(e) {
            editBtn(e, this.focusPicData);
        },
        upOrDown(status, e) {
            upOrDownBtn(status, e, this.focusPicData);
        },
    },
})

// 课程模块表格 vue 实例
var tableCourseModule = new Vue({
    el: "#courseModule",
    data: {
        courseData: [],
    },
    methods: {
        edit(e) {
            editBtn(e, this.courseData);
        },
        upOrDown(status, e) {
            upOrDownBtn(status, e, this.courseData);
        },
    },
})

// 获取场景列表请求
// type: 1-焦点图 2-课程模块  vue: 表格对象实例
function getData(type, vue) {
    $.ajax({
        url: "../scene/getSceneListByType" + type + ".json",
        dataType: "json",
        type: "get",
        success: res => {
            if (res.code == 0) {
                if (vue.$data.focusPicData) {
                    vue.$data.focusPicData = JSON.parse(JSON.stringify(res.data.onLine.concat(res.data.offLine)));
                    formatCreateTimeAndUpdateTime(vue.$data.focusPicData);
                    console.log(vue.$data.focusPicData);
                } else {
                    vue.$data.courseData = JSON.parse(JSON.stringify(res.data.onLine.concat(res.data.offLine)));
                    formatCreateTimeAndUpdateTime(vue.$data.courseData);
                    console.log(vue.$data.courseData);
                }
            } else {
                console.log(res.msg);
            }
        },
        fail: res => {
            console.log(res.msg);
        }
    });
}

// 编辑按钮触发的方法
// e: 事件handler  data: 按钮所在表格的数据
function editBtn(e, data) {
    let rowIndex = e.path[2].rowIndex
    let type = data[rowIndex - 1].sceneType;
    console.log("type: " + type);
    let id = data[rowIndex - 1].id;
    console.log("id: " + id);
    window.location.href = './sceneEdit.html?type=' + type + "&id=" + id;
}

// 上下线按钮触发的方法
// status: 场景类型 e: 事件handler  data: 按钮所在表格的数据
function upOrDownBtn(status, e, data) {
    let rowIndex = e.path[2].rowIndex
    console.log(rowIndex);
    let rowData = data[rowIndex - 1];
    // 判断状态
    if (status == 1) {
        // 下线操作
        down(rowData);
    } else {
        // 上线操作
        up(rowData);
    }
}

// 上线操作 data: 操作的那一行数据
function up(data) {
    layer.confirm('确认上线该场景吗？', {
            title: '上线提示',
        },
        function (index) {
            // TODO: 上线请求

            layer.close(index); // 关闭当前 layer 
        });
    console.log("上线了", data);
}

// 下线操作 data: 操作的那一行数据
function down(data) {
    layer.confirm('确认下线该场景吗？', {
            title: '下线提示',
        },
        function (index) {
            // TODO: 下线请求

            layer.close(index); // 关闭当前 layer 
        });
    console.log("下线了", data);
}

window.onload = function () {
    getData(1, tableFocusPic);
    getData(2, tableCourseModule);
}
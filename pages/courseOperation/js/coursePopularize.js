import {
    formatCreateTimeAndUpdateTime,
    serverUrl,
    upOrDownBtn,
    editBtn,
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
    created() {
        getData(1, this);
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
        upOrDown(status, index) {
            upOrDownBtn(status, index, this.courseData);
        },
    },
    created() {
        getData(2, this);
    },
})

// 获取场景列表请求
// type: 1-焦点图 2-课程模块  vue: 表格对象实例
function getData(type, vue) {
    $.ajax({
        url: serverUrl + "/scene/getSceneListByType",
        data: {
            type: type,
        },
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
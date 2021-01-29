import {
    formatCreateTimeAndUpdateTime,
    serverUrl,
    upOrDownBtn,
    editBtn,
} from '../../util.js';

// 文案场景表格 vue 实例
var tablePaper = new Vue({
    el: "#paper",
    data: {
        paperData: [],
    },
    methods: {
        edit(e) {
            editBtn(e, this.paperData);
        },
        upOrDown(status, index) {
            upOrDownBtn(status, index, this.paperData);
        },
    },
    created() {
        getData(3, this);
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
                    vue.$data.paperData = JSON.parse(JSON.stringify(res.data.onLine.concat(res.data.offLine)));
                    formatCreateTimeAndUpdateTime(vue.$data.paperData);
                    console.log(vue.$data.paperData);
            } else {
                console.log(res.msg);
            }
        },
        fail: res => {
            console.log(res.msg);
        }
    });
}
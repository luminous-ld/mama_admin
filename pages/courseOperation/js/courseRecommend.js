import {
    formatCreateTimeAndUpdateTime,
    serverUrl,
} from '../../util.js';

// 焦点图表格 vue 实例
var tableUserType = new Vue({
    el: "#userType",
    data: {
        userTypeData: [],
    },
    methods: {
        edit(e) {
            editBtn(e, this.userTypeData);
        },
        upOrDown(status, index) {
            upOrDownBtn(status, index, this.userTypeData);
        },
    },
    created() {
        getData();
    },
})

// 获取用户特征列表请求
function getData() {
    let load = layer.load(0);
    $.ajax({
        url: serverUrl + "/operation/getTypeList",
        dataType: "json",
        type: "get",
        success: res => {
            if (res.code == 0) {
                tableUserType.$data.userTypeData = JSON.parse(JSON.stringify(res.data));
                formatCreateTimeAndUpdateTime(tableUserType.$data.userTypeData);
                console.log(tableUserType.$data.userTypeData);
            } else {
                console.log(res.msg);
            }
        },
        fail: res => {
            console.log(res.msg);
        },
        complete: res => {
            layer.close(load);
            if (res.status == 500) {
                layer.msg('接口挂了，雨我无瓜！');
            }
        }
    });
}

// 编辑按钮触发的方法
// e: 事件handler  data: 按钮所在表格的数据
function editBtn(e, data) {
    let rowIndex = e.target.parentNode.parentNode.dataset.rowindex;
    let type = data[rowIndex - 1].type;
    console.log("type: " + type);
    window.location.href = './stepEdit.html?type=' + type;
}

// 上下线按钮触发的方法
// status: 场景类型 index: 按钮下标  data: 按钮所在表格的数据
function upOrDownBtn(status, index, data) {
    // 判断状态
    if (status == 1) {
        // 下线操作
        down(data[index]);
    } else {
        // 上线操作
        up(data[index]);
    }
}

// 上线操作 data: 操作的那一行数据
function up(data) {
    layer.confirm('确认上线该场景吗？', {
            title: '上线提示',
        },
        function (index) {
            // TODO: 上线请求
            upOrDownRequest(data);
            layer.close(index); // 关闭当前 layer 
        });
    console.log("上线了", data);
}
// 上下线请求
function upOrDownRequest(data) {
    let load = layer.load(0);
    $.ajax({
        url: serverUrl + "/operation/updateTypeStatus",
        dataType: "json",
        data: {
            type: data.type,
            // 上下线请求 status： 0-下线操作 1-上线操作
            status: data.status == 0 ? 1 : 0,
        },
        type: "get",
        success: res => {
            if (res.code == 0) {
                layer.msg("操作成功！");
                // 修改视图层
                data.status = data.status == 0 ? 1 : 0;
            } else {
                layer.alert(res.msg);
                console.log(res.msg);
            }
        },
        fail: res => {
            layer.alert(res.msg);
            console.log(res.msg);
        },
        complete: res => {
            layer.close(load);
            if (res.status == 500) {
                layer.msg('接口挂了，雨我无瓜！');
            }
        }
    })
}

// 下线操作 data: 操作的那一行数据
function down(data) {
    layer.confirm('确认下线该场景吗？', {
            title: '下线提示',
        },
        function (index) {
            // TODO: 下线请求
            upOrDownRequest(data);
            layer.close(index); // 关闭当前 layer 
        });
    console.log("下线了", data);
}
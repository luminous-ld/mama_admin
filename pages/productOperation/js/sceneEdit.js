import {
    getRequest,
    tableDrag,
    serverUrl,
    isEmpty,
    getChangedData,
} from '../../util.js'

let originData = []; // 场景原始数据
let originMap = new Map();

let finalList = []; // 用于接收最后发送请求的数据
// 上个页面传入 type 和 id
let type = parseInt(getRequest().type);
let id = parseInt(getRequest().id);

var tableScene = new Vue({
    el: "#sceneEdit",
    data: {
        sceneDetail: [],
        type: type,
        tableKey: 0,
    },
    methods: {
        delRow(rowIndex) {
            console.log("delete row: " + rowIndex);
            let that = this;
            layer.confirm('确认删除该行吗？', {
                    title: '删除提示',
                },
                function (index) {
                    // 如果删除的不是新增行, 对源数据Map做伪删除
                    if (that.$data.sceneDetail[rowIndex].id) {
                        let id = that.$data.sceneDetail[rowIndex].id;
                        let value = originMap.get(id);
                        value.status = 0;
                        originMap.set(id, value);
                    }
                    // 数组中删除该项
                    that.$data.sceneDetail.splice(rowIndex, 1);
                    // 更新 position 的值，并且置status为2
                    for (let i = rowIndex; i < that.$data.sceneDetail.length; i++) {
                        that.$data.sceneDetail[i].position = i + 1;
                        that.sceneDetail[i].status = 2;
                    }
                    layer.close(index); // 关闭当前 layer 
                });
        },
        addRow() {
            let newRow = {
                position: this.sceneDetail.length + 1,
                status: 1,
                file: '',
            };
            this.sceneDetail.push(newRow);
        },
        // 文案变化时
        dataChange(index) {
            this.sceneDetail[index].status = 2;
        },
        // 最后的确定
        sendRequest() {
            finalList = JSON.parse(JSON.stringify(getChangedData(this.sceneDetail, originMap)));
            let flag = true;
            finalList.forEach(item => {
                if (isEmpty(item.file)) {
                    flag = false;
                }
            })
            if (!flag) {
                layer.msg('文案不能为空！')
            } else {
                let load = layer.load(0);
                $.ajax({
                    url: serverUrl + "/content/file",
                    data: JSON.stringify({
                        sceneId: id,
                        data: finalList,
                    }),
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    type: "post",
                    success: res => {
                        if (res.code == 0) {
                            layer.confirm('修改成功', {
                                title: '修改提示',
                            },
                            function (index) {
                                window.location.href = './paperOperation.html';
                                layer.close(index); // 关闭当前 layer 
                            });
                        } else {
                            layer.alert('修改失败，请重试');
                            console.log(res.msg);
                        }
                    },
                    fail: res => {
                        layer.alert('修改失败，请重试');
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

        }
    },
    created() {
        getSceneDetail(id, type);
    },
    mounted() {
        tableDrag(this, '.sortable');

    },
    updated() {
        $('.sortable').sortable({
            cursor: "move",
            delay: 0,
            items: "tr", //只是tr可以拖动  
            opacity: 0.8, //拖动时，透明度为0.6  
            revert: true, //释放时，增加动画  
        });
        // $(".sortable").disableSelection();
    },
})


// 获取场景详情的请求
// id: 场景id  type: 场景类型 0-焦点图 1-课程模块 2-文案
function getSceneDetail(id, type) {
    let load = layer.load(0);
    $.ajax({
        url: serverUrl + "/scene/getSceneDetail",
        data: {
            type: type,
            id: id,
        },
        dataType: "json",
        type: "get",
        success: res => {
            if (res.code == 0) {
                tableScene.$data.sceneDetail = JSON.parse(JSON.stringify(res.data));
                originData = JSON.parse(JSON.stringify(res.data));
                originData.forEach(item => {
                    originMap.set(item.id, item);
                });
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
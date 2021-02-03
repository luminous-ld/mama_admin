import {
    getRequest,
    serverUrl,
    isEmpty,
    sortObjBy,
    tableDrag,
    getChangedData,
    netHeader,
} from '../../util.js'

let originData = []; // 场景原始数据
let originMap = new Map();

let finalList = []; // 用于接收最后发送请求的数据
// 上个页面传入 type 和 id
let type = parseInt(getRequest().type);
let id = parseInt(getRequest().id);
let ajaxUrl = '';
if (type == 2) {
    ajaxUrl = serverUrl + "/content/module";
} else if (type == 1) {
    ajaxUrl = serverUrl + "/content/focus";
}
var tableScene = new Vue({
    el: "#sceneEdit",
    data: {
        sceneDetail: [], // 场景动态数据
        courseAll: [], // 所有供选择的课程
        type: type,
        tableKey: 0,
    },
    methods: {
        // 删除行
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
                        that.$data.sceneDetail[i].status = 2;
                    }
                    layer.close(index); // 关闭当前 layer 
                });
        },
        // 换图片
        changePic(e, index) {
            console.log("change picture in row: " + index);
            this.sceneDetail[index].status = 2;
            let file = e.target.files[0];
            console.log(file);
            // 预览图片（没上传）
            previewPic(file, index, file.name);
        },
        // 增加行
        addRow() {
            let newRow = {};
            // 焦点图模块
            if (type == 1) {
                newRow = {
                    position: this.sceneDetail.length + 1,
                    courseId: null,
                    courseName: '',
                    coverUrl: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2109206826,900011711&fm=26&gp=0.jpg',
                    status: 1,
                    title: '',
                };
            } else { // 课程模块
                newRow = {
                    name: "",
                    position: this.sceneDetail.length + 1,
                    courseList: null,
                    status: 1,
                }
            }
            this.sceneDetail.push(newRow);
        },
        // 关闭选中课程tag
        closeTag(row, position) {
            let arr = this.sceneDetail[row - 1].courseList;
            console.log("row: " + row + ", position: " + position);
            console.log(arr[position - 1].name);
            if (arr[position - 1].id && this.sceneDetail[row - 1].id) {
                let id = this.sceneDetail[row - 1].id;
                let value = originMap.get(id);
                value.courseList.forEach(item => {
                    if (item.id == arr[position - 1].id) {
                        item.status = 0;
                    }
                });
                originMap.set(id, value);
            }
            this.sceneDetail[row - 1].status = 2;
            // 数组中删去选中 tag
            arr.splice(position - 1, 1);
            // 重新给 position 赋值
            arr.forEach((item, index) => {
                item.position = index + 1;
            });
            console.log(arr);
        },
        // select 课程值改变（课程模块）
        selectChange(e, index) {
            let name = e.target.value;
            let selectCourse = {};
            let flag = false;
            if (isEmpty(name)) return;
            // 获取选中课程名称的所有课程相关信息
            this.courseAll.forEach(item => {
                if (item.name == name) {
                    selectCourse = JSON.parse(JSON.stringify(item));
                }
            })
            if (isEmpty(selectCourse)) {
                layer.msg('课程不存在！');
                return;
            }
            if (this.sceneDetail[index].courseList == null) {
                this.sceneDetail[index].courseList = [];
            }
            let course = {
                courseId: selectCourse.id,
                name: selectCourse.name,
                position: this.sceneDetail[index].courseList.length + 1,
                status: 1,
            }
            // 如果是已选课程则不添加至 list
            this.sceneDetail[index].courseList.forEach(item => {
                if (item.name == course.name) {
                    flag = true;
                }
            })
            if (!flag) {
                this.sceneDetail[index].courseList.push(course);
                this.sceneDetail[index].status = 2;
            }
        },
        // 焦点图模块 课程选择改变
        courseChange(e, index) {
            let courseName = e.target.value;
            let selectCourse = {};
            this.courseAll.forEach(item => {
                if (item.name == courseName) {
                    selectCourse = JSON.parse(JSON.stringify(item));
                }
            })
            if (isEmpty(selectCourse)) {
                layer.msg('课程不存在！');
                return;
            }
            this.sceneDetail[index].title = selectCourse.name;
            this.sceneDetail[index].coverUrl = selectCourse.cover;
            this.sceneDetail[index].courseId = selectCourse.id;
            this.sceneDetail[index].status = 2;
        },
        dataChange(index) {
            this.sceneDetail[index].status = 2;
        },
        // 最后的确定
        sendRequest() {
            finalList = JSON.parse(JSON.stringify(getChangedData(this.sceneDetail, originMap)));
            console.log("finalList: ", finalList);
            let idFlag = true;
            let modFlag = true;
            if (type == 1) {
                finalList.forEach(item => {
                    if (item.courseId == null) {
                        idFlag = false;
                    }
                })
            } else if (type == 2) {
                finalList.forEach(item => {
                    if (item.name == "") {
                        modFlag = false;
                    }
                })
            }
            if (!idFlag) {
                layer.msg('课程不能为空！');
            } else if (!modFlag) {
                layer.msg('模块标题不能为空！');
            } else {
                let load = layer.load(0);
                $.ajax({
                    url: ajaxUrl,
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
                                window.location.href = './coursePopularize.html'
                                layer.close(index); // 关闭当前 layer 
                            });
                        } else if (res.code == 9001) {
                            layer.alert('您没有修改任何数据');
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
                        if(res.status == 500) {
                            layer.msg('接口挂了，雨我无瓜！');
                        }
                    }
                });
            }

        }
    },
    created() {
        getAllCourse();
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

// 上传图片并预览
function previewPic(file, row) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        let formdata = new FormData();
        formdata.append('file', file);
        let load = layer.load(0);
        uploadPic({
            formdata: formdata,
            doSuccess: res => {
                layer.close(load);
                layer.msg('上传成功');
                // console.log(res);
                tableScene.$data.sceneDetail[row].coverUrl = res;
            },
            doFail: res => {
                layer.close(load);
                if (res.msg.search('Maximum') !== -1) {
                    layer.msg('图片太大，上传失败');
                } else {
                    layer.msg('上传失败');
                }
            }
        });
    };
}

// 上传图片
function uploadPic({
    formdata,
    doSuccess,
    doFail
}) {
    $.ajax({
        url: "https://test.mama.sohu.com/v2/uploadImg",
        type: "POST",
        data: formdata,
        contentType: false, //必须
        processData: false, //必须
        success: res => {
            // console.log('success:', res);
            if (res.code == 200) {
                doSuccess(res.data);
            } else {
                doFail(res.msg);
            }
        },
        fail: res => {
            // console.log('fail: ', res);
            doFail(res)
        },
        complete: res => {
            console.log('complete: ', res);
            if (res.status == 400) {
                doFail(res.responseJSON);
            }
        }
    });
}


// 获取场景详情的请求
// id: 场景id  type: 场景类型 1-焦点图 2-课程模块 3-文案
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
            if(res.status == 500) {
                layer.msg('接口挂了，雨我无瓜！');
            }
        }
    });
}

// 获取所有课程的 list 的请求
function getAllCourse() {
    $.ajax({
        url: serverUrl + "/content/course",
        dataType: "json",
        type: "get",
        success: res => {
            if (res.code == 0) {
                tableScene.$data.courseAll = JSON.parse(JSON.stringify(res.data));
            } else {
                console.log(res.msg);
            }
        },
        fail: res => {
            console.log(res.msg);
        }
    })
}
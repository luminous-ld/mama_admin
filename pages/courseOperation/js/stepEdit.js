import {
    getRequest,
    serverUrl,
    isEmpty,
    getChangedData,
    netHeader,
} from '../../util.js'

let originData = []; // 场景原始数据
let originMap = new Map();

let finalList = []; // 用于接收最后发送请求的数据

// 上个页面传入 type 
let type = parseInt(getRequest().type);

// 阶段编辑列表
var tableStep = new Vue({
    el: "#stepEdit",
    data: {
        stepDetail: [], // 场景动态数据
        courseAll: [], // 所有供选择的课程
        type: type,
        step: 0, // 选中阶段在数组中的下标
        isShow: false,
        stepUpdateDetail: [] // 选中的编辑阶段，用于保存未修改前的数据
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
                    if (that.$data.stepDetail[rowIndex].id) {
                        let id = that.$data.stepDetail[rowIndex].id;
                        let value = originMap.get(id);
                        value.status = 0;
                        originMap.set(id, value);
                    }
                    // 数组中删除该项
                    that.$data.stepDetail.splice(rowIndex, 1);
                    // 更新 position 的值，并且置status为2
                    for (let i = rowIndex; i < that.$data.stepDetail.length; i++) {
                        that.$data.stepDetail[i].step = i + 1;
                        that.$data.stepDetail[i].status = 2;
                    }
                    layer.close(index); // 关闭当前 layer 
                });
        },
        // 增加行
        addRow() {
            let newRow = {
                "type": this.type,
                "step": this.stepDetail.length + 1,
                "startDay": "",
                "endDay": "",
                "recommendContent": "",
                "recommendList": null,
                "recommendCourse": null,
                "learningCourse": null,
                "status": 1
            }
            this.stepDetail.push(newRow);
        },
        // 增加推荐理由行
        addRecommend() {
            if (this.stepDetail[this.step].recommendList == null) {
                this.stepDetail[this.step].recommendList = [];
            }
            let newRow = {
                "title": "",
                "description": "",
                "position": this.stepDetail[this.step].recommendList.length + 1,
                "status": 1
            }
            this.stepDetail[this.step].status = 2;
            this.stepDetail[this.step].recommendList.push(newRow);
        },
        // 删除推荐理由行
        delRecommend() {
            let list = this.stepDetail[this.step].recommendList;
            if (isEmpty(list)) return;
            if (list[list.length - 1].id && this.stepDetail[this.step].id) {
                let id = this.stepDetail[this.step].id;
                let value = originMap.get(id);
                value.recommendList.forEach(item => {
                    if (item.id == list[list.length - 1].id) {
                        item.status = 0;
                    }
                });
                originMap.set(id, value);
            }
            this.stepDetail[this.step].status = 2;
            list.pop();
        },
        // 关闭推荐课程的选中课程tag
        closeRecom(position) {
            let arr = this.stepDetail[this.step].recommendCourse;
            console.log("position: " + position);
            console.log(arr[position - 1].courseName);
            if (arr[position - 1].id && this.stepDetail[this.step].id) {
                let id = this.stepDetail[this.step].id;
                let value = originMap.get(id);
                value.recommendCourse.forEach(item => {
                    if (item.id == arr[position - 1].id) {
                        item.status = 0;
                    }
                });
                originMap.set(id, value);
            }
            this.stepDetail[this.step].status = 2;
            // 数组中删去选中 tag
            arr.splice(position - 1, 1);
            // 重新给 position 赋值
            arr.forEach((item, index) => {
                item.position = index + 1;
            });
            console.log(arr);
        },
        // 关闭同阶段在学的选中课程tag
        closeLearn(position) {
            let arr = this.stepDetail[this.step].learningCourse;
            console.log("position: " + position);
            console.log(arr[position - 1].courseName);
            if (arr[position - 1].id && this.stepDetail[this.step].id) {
                let id = this.stepDetail[this.step].id;
                let value = originMap.get(id);
                value.learningCourse.forEach(item => {
                    if (item.id == arr[position - 1].id) {
                        item.status = 0;
                    }
                });
                originMap.set(id, value);
            }
            this.stepDetail[this.step].status = 2;
            // 数组中删去选中 tag
            arr.splice(position - 1, 1);
            // 重新给 position 赋值
            arr.forEach((item, index) => {
                item.position = index + 1;
            });
            console.log(arr);
        },
        // select 课程值改变
        selectChange(e) {
            console.log(e);
            let id = e.target.id; //  recipt 推荐课程  leaipt  同阶段在学
            let name = e.target.value; // 获取选中课程的名字
            let selectCourse = {}; // 用于接收选中课程的相关信息
            let flag = false; // 用于判断 tag 列表中是否已含有选中课程
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
            if (id == "recipt") {
                if (this.stepDetail[this.step].recommendCourse == null) {
                    this.stepDetail[this.step].recommendCourse = [];
                }
                // push 至tag列的课程对象
                let course = {
                    courseId: selectCourse.id,
                    courseName: selectCourse.name,
                    position: this.stepDetail[this.step].recommendCourse.length + 1,
                    courseStatus: selectCourse.status,
                    status: 1
                }
                // 如果是已选课程则不添加至 list
                this.stepDetail[this.step].recommendCourse.forEach(item => {
                    if (item.courseName == course.courseName) {
                        flag = true;
                    }
                })
                if (!flag && this.stepDetail[this.step].recommendCourse.length < 3) {
                    this.stepDetail[this.step].status = 2;
                    this.stepDetail[this.step].recommendCourse.push(course);
                } else if (this.stepDetail[this.step].recommendCourse.length >= 3) {
                    layer.tips('数量不能超过三个', '#recipt');
                }
            } else if (id == "leaipt") {
                if (this.stepDetail[this.step].learningCourse == null) {
                    this.stepDetail[this.step].learningCourse = [];
                }
                // push 至tag列的课程对象
                let course = {
                    courseId: selectCourse.id,
                    courseName: selectCourse.name,
                    position: this.stepDetail[this.step].learningCourse.length + 1,
                    courseStatus: selectCourse.status,
                    status: 1
                }
                // 如果是已选课程则不添加至 list
                this.stepDetail[this.step].learningCourse.forEach(item => {
                    if (item.courseName == course.courseName) {
                        flag = true;
                    }
                })
                if (!flag) {
                    this.stepDetail[this.step].status = 2;
                    this.stepDetail[this.step].learningCourse.push(course);
                }
            }
        },
        // 编辑阶段特征
        edit(index) {
            this.step = index;
            this.stepUpdateDetail = JSON.parse(JSON.stringify(this.stepDetail[index]));
            this.isShow = true;
            showMask(this.isShow);
            setTimeout(divDrag, 800);
        },
        // 弹出框取消按钮
        cancle() {
            this.isShow = false;
            showMask(this.isShow);
            // 将未修改前的数据重新覆盖修改后的数据
            this.stepDetail[this.step].status = 1;
            this.stepDetail[this.step] = JSON.parse(JSON.stringify(this.stepUpdateDetail));
        },
        // 弹出框确定按钮
        save() {
            this.isShow = false;
            showMask(this.isShow);
        },
        // 判断时间区间输入是否正确
        isStartRight(e) {
            let thisEnd = parseInt(this.stepDetail[this.step].endDay);
            let start = parseInt(e.target.value);
            this.stepDetail[this.step].status = 2;
            // 怀孕中
            if (type == 0) {
                if (this.step == 0) {
                    return;
                } else {
                    let end = Math.abs(parseInt(this.stepDetail[this.step - 1].endDay));
                    if (start > end) {
                        layer.tips('时间区间有交集', '.startDay', {
                            tips: [1, '#000000'] //还可配置颜色
                        });
                    } else if (start < thisEnd) {
                        layer.tips('应大于右边', '.startDay', {
                            tips: [1, '#000000'] //还可配置颜色
                        });
                    }
                }
            } else { // 已有宝宝
                if (this.step == 0) {
                    if (start > thisEnd) {
                        layer.tips('应小于右边', '.startDay', {
                            tips: [1, '#000000'] //还可配置颜色
                        });
                    }
                    return;
                } else {
                    let end = parseInt(this.stepDetail[this.step - 1].endDay);
                    if (start < end) {
                        layer.tips('时间区间有交集', '.startDay', {
                            tips: [1, '#000000'] //还可配置颜色
                        });
                    }
                }
            }
        },
        isEndRight(e) {
            let thisStart = parseInt(this.stepDetail[this.step].startDay);
            let end = parseInt(e.target.value);
            this.stepDetail[this.step].status = 2;
            // 怀孕中
            if (type == 0) {
                if (this.step == 0) {
                    let start = parseInt(this.stepDetail[this.step + 1].startDay);
                    if (end < start) {
                        layer.tips('时间区间有交集', '.endDay', {
                            tips: [1, '#000000'] //还可配置颜色
                        });
                    }
                } else if (this.step == this.stepDetail.length - 1) {
                    if (end > thisStart) {
                        layer.tips('应小于左边', '.endDay', {
                            tips: [1, '#000000'] //还可配置颜色
                        });
                    }
                } else {
                    let start = Math.abs(parseInt(this.stepDetail[this.step + 1].startDay));
                    if (end < start) {
                        layer.tips('时间区间有交集', '.endDay', {
                            tips: [1, '#000000'] //还可配置颜色
                        });
                    } else if (end > thisStart) {
                        layer.tips('应小于左边', '.endDay', {
                            tips: [1, '#000000'] //还可配置颜色
                        });
                    }
                }
            } else { // 已有宝宝
                if (this.step == this.stepDetail.length - 1) {
                    if (end < thisStart) {
                        layer.tips('应大于左边', '.endDay', {
                            tips: [1, '#000000'] //还可配置颜色
                        });
                    }
                } else if (this.step == 0) {
                    let start = parseInt(this.stepDetail[this.step + 1].startDay);
                    if (end > start) {
                        layer.tips('时间区间有交集', '.endDay', {
                            tips: [1, '#000000'] //还可配置颜色
                        });
                    }
                } else {
                    let start = parseInt(this.stepDetail[this.step + 1].endDay);
                    if (end < thisStart) {
                        layer.tips('应大于左边', '.endDay', {
                            tips: [1, '#000000'] //还可配置颜色
                        });
                    } else if (end > start) {
                        layer.tips('时间区间有交集', '.endDay', {
                            tips: [1, '#000000'] //还可配置颜色
                        });
                    }
                }
            }
        },
        // 各类输入框值变化，标志修改
        dataChange() {
            this.stepDetail[this.step].status = 2;
        },
        // 最后的确定
        sendRequest() {
            let stepFlag = true;
            let recFlag = true;
            finalList = JSON.parse(JSON.stringify(getChangedData(this.stepDetail, originMap)));

            finalList.forEach(item => {
                if (isEmpty(item.recommendContent)) {
                    recFlag = false;
                }
                if (isEmpty(item.startDay) || isEmpty(item.endDay)) {
                    stepFlag = false;
                }
            })
            // 怀孕中，把时间区间的值改回带 - 号
            if (type == 0) {
                finalList.forEach(item => {
                    item.startDay = '-' + item.startDay;
                    item.endDay = '-' + item.endDay;
                })
            }
            if (!stepFlag) {
                layer.msg('时间区间不能为空！');
            } else if (!recFlag) {
                layer.msg('推荐理由不能为空！');
            } else {
                let load = layer.load(0);
                $.ajax({
                    url: serverUrl + "/operation/updateStepList",
                    data: JSON.stringify({
                        type: type,
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
                                window.location.href = './courseRecommend.html'
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
                        if (res.status == 500) {
                            layer.msg('接口挂了，雨我无瓜！');
                        }
                    }
                });
            }

        }

    },
    created() {
        getAllCourse();
        getStepDetail(type);
    },
    mounted() {

    },
})


// 获取阶段详情列表的请求
// type: 特征值
function getStepDetail(type) {
    let load = layer.load(0);
    $.ajax({
        url: serverUrl + "/operation/getStepList",
        data: {
            type: type,
        },
        dataType: "json",
        type: "get",
        success: res => {
            if (res.code == 0) {
                tableStep.$data.stepDetail = JSON.parse(JSON.stringify(res.data));
                tableStep.$data.stepDetail.forEach(item => {
                    if (item.startDay && item.endDay) {
                        item.startDay = item.startDay.replace(/^\-+/, "");
                        item.endDay = item.endDay.replace(/^\-+/, "");
                    }
                })
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

// 获取所有课程的 list 的请求
function getAllCourse() {
    $.ajax({
        url: serverUrl + "/content/course",
        dataType: "json",
        type: "get",
        success: res => {
            if (res.code == 0) {
                tableStep.$data.courseAll = JSON.parse(JSON.stringify(res.data));
            } else {
                console.log(res.msg);
            }
        },
        fail: res => {
            console.log(res.msg);
        }
    })
}

// 比对 originData 和 stepDetail


// 弹出框背后的透明遮罩
function showMask(isShow) {
    let mask = document.querySelector('#mask');
    let sWidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
    let sHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

    if (isShow) {
        mask.style.height = sHeight + 'px';
        mask.style.width = sWidth + 'px';
    } else {
        mask.style.height = 0;
        mask.style.width = 0;
    }
}

// 弹出的编辑框 div 可拖拽
function divDrag() {
    //获取元素
    var dv = document.getElementById('stepUpdate');
    var x = 0;
    var y = 0;
    var l = 0;
    var t = 0;
    var dvx = 0;
    var dvy = 0;
    var dvxMax = 0;
    var dvyMax = 0;
    var isDown = false;
    //鼠标按下事件
    dv.addEventListener('mousedown', function (e) {
        //获取x坐标和y坐标
        x = e.clientX;
        y = e.clientY;
        dvx = dv.getBoundingClientRect().x;
        dvy = dv.getBoundingClientRect().y;
        dvxMax = dvx + dv.getBoundingClientRect().width;
        dvyMax = dvy + 40;
        // 鼠标移至顶部栏才触发拖拽
        if (x > dvx && x < dvxMax && y > dvy && y < dvyMax) {
            //获取左部和顶部的偏移量
            l = dv.offsetLeft;
            t = dv.offsetTop;
            //开关打开
            isDown = true;
            //设置样式  
            dv.style.cursor = 'move';
        }
    })
    //鼠标抬起事件
    dv.addEventListener('mouseup', function () {
        //开关关闭
        isDown = false;
        dv.style.cursor = 'default';
    })
    //鼠标移动
    window.addEventListener('mousemove', function (e) {
        if (isDown == false) {
            return;
        }
        //获取x和y
        var nx = e.clientX;
        var ny = e.clientY;
        //计算移动后的左偏移量和顶部的偏移量
        var nl = nx - (x - l);
        var nt = ny - (y - t);

        dv.style.left = nl + 'px';
        dv.style.top = nt + 'px';
    })
}
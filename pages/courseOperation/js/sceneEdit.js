let sceneData = []; // 场景数据
let changePic = []; // 用于接收替换图片按钮实例
let delPic = []; // 用于接收删除图片按钮实例
let courseAll = [] // 所以供选择的课程

// 页面加载时
window.addEventListener('load', function () {
    // 获取课程请求
    getAllCourse();
})

layui.use(["table", "element", "jquery", "form", "soulTable"], function () {
    var table = layui.table;
    var $ = layui.jquery;
    var form = layui.form;
    var soulTable = layui.soulTable;
    //渲染场景编辑数据表格
    table.render({
        elem: "#sceneEdit",
        // height: 312,
        url: "../coursePopu.json", //数据接口
        // page: true,
        cols: [
            [
                //表头
                {
                    type: "numbers",
                    title: "序号",
                    width: 100,
                },
                {
                    field: "coursename",
                    templet: "#selectCourse",
                    title: "课程",
                    minWidth: 120,
                },
                {
                    field: "title",
                    templet: "#popuTitle",
                    title: "推广标题",
                    minWidth: 150,
                },
                {
                    field: "imgUrl",
                    templet: "#courseImg",
                    title: "推广封面图",
                    minWidth: 120,
                },
                {
                    title: "操作",
                    minWidth: 100,
                    toolbar: "#operateBar",
                },
            ],
        ],
        // 表格渲染完后
        done: function (res, curr, count) {
            sceneData = res.data;
            console.log(sceneData);
            soulTable.render(this);
            // 填充select option
            insertSelectOption(form);
            // 获取图片上的所有按钮实例
            changePic = document.querySelectorAll('.changeSpan');
            delPic = document.querySelectorAll('.delSpan');
            // 给按钮添加点击事件监听
            addChangeEvent(changePic);
            addDelEvent(delPic);

        },
        // 监听拖拽事件
        rowDrag: {
            done: function (obj) {
                console.log(obj);
                // JSON.stringify把对象转成字符串， 再用JSON.parse把字符串转成新的对象
                obj.cache.forEach(item => {
                    delete item.LAY_TABLE_INDEX;
                })
                sceneData = JSON.parse(JSON.stringify(obj.cache));
                console.log(sceneData);
            }

        }
    });

    // 监听工具条
    table.on('tool(sceneEdit)', function (obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）
        if (layEvent === 'del') { // 删除
            console.log(data);
            layer.confirm('确认删除该行吗？', {
                    title: '提示',
                },
                function (index) {
                    sceneData.splice(sceneData.findIndex(e => e.id === data.id), 1);
                    // console.log(sceneData.splice(0, 1)); // 返回含删除的对象的数组
                    obj.del();
                    table.render(this);
                    layer.close(index); // 关闭当前 layer 
                });
        }
    });

    // 监听 select
    form.on('select', function (data) {
        let value = data.value; // 选中的值
        let row = $(data.elem).parent().parent().parent()[0].dataset.index; // 选中的行(从0开始)
        console.log(value);
        console.log(row);
        courseAll.forEach(item => {
            // console.log(item)
            if (item.coursename == value) {
                var tds = $('tbody tr')[row].childNodes;
                // 修改视图层
                tds[2].firstElementChild.children[0].placeholder = item.title; // 推广标题
                console.log(tds[3].firstElementChild.firstElementChild.firstElementChild.src);
                tds[3].firstElementChild.firstElementChild.firstElementChild.src = item.imgUrl; //推广封面图
            }
        });
    });
})

// 给所有替换图片按钮添加点击事件监听
function addChangeEvent(arr) {
    arr.forEach(item => {
        item.addEventListener('click', function (data) {
            let row = data.path[5].dataset.index; // 获取点击行数(从0开始)
            console.log(row);
        })
    })
}

// 给所有删除图片按钮添加替换按钮点击事件监听
function addDelEvent(arr) {
    arr.forEach(item => {
        item.addEventListener('click', function (data) {
            console.log(data.path[5].dataset.index); // 获取点击行数(从0开始)
            let row = data.path[5].dataset.index;
        })
    })
}

//动态插入 selector 的 option
function insertSelectOption(form) {
    courseAll.forEach(item => {
        // console.log(item)
        var option = $('<option value="' + item.coursename + '">' + item.coursename + '</option>');
        $("select[name = 'courseName']").append(option);
    })

    form.render('select');
}

// 可供选择的所有课程的请求
function getAllCourse() {
    $.ajax({
        url: "../courseAll.json",
        dataType: "json",
        type: "get",
        success: res => {
            if (res.code == 200) {
                courseAll = JSON.parse(JSON.stringify(res.data));
            } else {
                console.log(res.msg);
            }
        },
        fail: res => {
            console.log(res.msg);
        }
    });
}
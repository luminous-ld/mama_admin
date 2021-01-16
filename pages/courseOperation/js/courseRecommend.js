//JavaScript代码区域
layui.use(["table", "element"], function () {
    var table = layui.table;

    //渲染数据表格
    table.render({
        elem: "#focusPic",
        height: 312,
        url: "../demo.json", //数据接口
        // page: true,
        cols: [
            [
                //表头
                {
                    field: "id",
                    title: "场景id",
                    minWidth: 120,
                    sort: true,
                    align: "center",
                    fixed: "left",
                },
                {
                    field: "username",
                    title: "场景名称",
                    align: "center",
                    minWidth: 120,
                },
                {
                    field: "status",
                    title: "场景状态",
                    minWidth: 120,
                    align: "center",
                    sort: true,
                },
                {
                    field: "city",
                    title: "创建时间",
                    align: "center",
                    minWidth: 120,
                },
                {
                    field: "sign",
                    title: "更新时间",
                    align: "center",
                    minWidth: 120,
                },
                {
                    field: "operation",
                    title: "操作",
                    align: "center",
                    minWidth: 120,
                    toolbar: "#operateBar",
                },
            ],
        ],
    });
    table.render({
        elem: "#courseModule",
        height: 312,
        url: "../demo.json", //数据接口
        cols: [
            [
                //表头
                {
                    field: "id",
                    title: "场景id",
                    minWidth: 120,
                    sort: true,
                    align: "center",
                    fixed: "left",
                },
                {
                    field: "username",
                    title: "场景名称",
                    align: "center",
                    minWidth: 120,
                },
                {
                    field: "status",
                    title: "场景状态",
                    minWidth: 120,
                    align: "center",
                    sort: true,
                },
                {
                    field: "city",
                    title: "创建时间",
                    align: "center",
                    minWidth: 120,
                },
                {
                    field: "sign",
                    title: "更新时间",
                    align: "center",
                    minWidth: 120,
                },
                {
                    field: "operation",
                    title: "操作",
                    align: "center",
                    minWidth: 120,
                    toolbar: "#operateBar",
                },
            ],
        ],
        done: function (res, curr, count) {
            setAttr(res.data);
        }
    });
});

// 设置 不同场景状态 不同字段颜色 和 对应不同按钮
function setAttr(data) {
    for (let i = 0; i < data.length; i++) {
        let status = data[i].status; // 获取场景状态
        if (status == "已上线") {
            $("table tbody tr[data-index=" + i + "] " + "td[data-field='status']").attr({
                "style": "color: #3a9bfc"
            });
        } else if (status == "未上线") {
            let num = $("table").length;
            for (let j = 0; j < num; j++) {
                let $a = $("table tbody tr[data-index=" + i + "] " + "td[data-field='operation'] " + "div a");
                $a.eq(j * 2 + 1).attr({
                    "class": "layui-btn layui-btn-radius layui-btn-normal layui-btn-xs",
                    "lay-event": "up"
                });
                $a.eq(j * 2 + 1).text("上线");
            }
        }
    }
}

layui.config({
    base: '../../layui/ext/', // 模块目录
}).extend({
    soulTable: 'soulTable' // 模块别名
});
layui.config({
    base: '../../layui/lay/modules/',
}).extend({
    tag: 'tag',
}).use('tag', function () {
    var tag = layui.tag;
    tag.on('click(demo)', function (data) {
        console.log('点击');
        console.log(this); //当前Tag标签所在的原始DOM元素
        console.log(data.index); //得到当前Tag的所在下标
        console.log(data.elem); //得到当前的Tag大容器
    });

    tag.on('add(demo)', function (data) {
        console.log('新增');
        console.log(this); //当前Tag标签所在的原始DOM元素
        console.log(data.index); //得到当前Tag的所在下标
        console.log(data.elem); //得到当前的Tag大容器
        console.log(data.othis); //得到新增的DOM对象
        //return false; //返回false 取消新增操作； 同from表达提交事件。
    });

    tag.on('delete(demo)', function (data) {
        console.log('删除');
        console.log(this); //当前Tag标签所在的原始DOM元素
        console.log(data.index); //得到当前Tag的所在下标
        console.log(data.elem); //得到当前的Tag大容器
        //return false; //返回false 取消删除操作； 同from表达提交事件。
    });
})
layui.use('element', function () {})
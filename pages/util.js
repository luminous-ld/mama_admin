/** 
 * 时间戳格式化函数 
 * @param  {string} format    格式 
 * @param  {int}    timestamp 要格式化的时间 默认为当前时间 
 * @return {string}           格式化的时间字符串 
 */
export function formatTime(format, timestamp) {
  var a, jsdate = ((timestamp) ? new Date(timestamp) : new Date());
  var pad = function (n, c) {
    if ((n = n + "").length < c) {
      return new Array(++c - n.length).join("0") + n;
    } else {
      return n;
    }
  };
  var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var txt_ordin = {
    1: "st",
    2: "nd",
    3: "rd",
    21: "st",
    22: "nd",
    23: "rd",
    31: "st"
  };
  var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var f = {
    // Day 
    d: function () {
      return pad(f.j(), 2)
    },
    D: function () {
      return f.l().substr(0, 3)
    },
    j: function () {
      return jsdate.getDate()
    },
    l: function () {
      return txt_weekdays[f.w()]
    },
    N: function () {
      return f.w() + 1
    },
    S: function () {
      return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th'
    },
    w: function () {
      return jsdate.getDay()
    },
    z: function () {
      return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0
    },

    // Week 
    W: function () {
      var a = f.z(),
        b = 364 + f.L() - a;
      var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
      if (b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b) {
        return 1;
      } else {
        if (a <= 2 && nd >= 4 && a >= (6 - nd)) {
          nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
          return date("W", Math.round(nd2.getTime() / 1000));
        } else {
          return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
        }
      }
    },

    // Month 
    F: function () {
      return txt_months[f.n()]
    },
    m: function () {
      return pad(f.n(), 2)
    },
    M: function () {
      return f.F().substr(0, 3)
    },
    n: function () {
      return jsdate.getMonth() + 1
    },
    t: function () {
      var n;
      if ((n = jsdate.getMonth() + 1) == 2) {
        return 28 + f.L();
      } else {
        if (n & 1 && n < 8 || !(n & 1) && n > 7) {
          return 31;
        } else {
          return 30;
        }
      }
    },

    // Year 
    L: function () {
      var y = f.Y();
      return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0
    },
    //o not supported yet 
    Y: function () {
      return jsdate.getFullYear()
    },
    y: function () {
      return (jsdate.getFullYear() + "").slice(2)
    },

    // Time 
    a: function () {
      return jsdate.getHours() > 11 ? "pm" : "am"
    },
    A: function () {
      return f.a().toUpperCase()
    },
    B: function () {
      // peter paul koch: 
      var off = (jsdate.getTimezoneOffset() + 60) * 60;
      var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
      var beat = Math.floor(theSeconds / 86.4);
      if (beat > 1000) beat -= 1000;
      if (beat < 0) beat += 1000;
      if ((String(beat)).length == 1) beat = "00" + beat;
      if ((String(beat)).length == 2) beat = "0" + beat;
      return beat;
    },
    g: function () {
      return jsdate.getHours() % 12 || 12
    },
    G: function () {
      return jsdate.getHours()
    },
    h: function () {
      return pad(f.g(), 2)
    },
    H: function () {
      return pad(jsdate.getHours(), 2)
    },
    i: function () {
      return pad(jsdate.getMinutes(), 2)
    },
    s: function () {
      return pad(jsdate.getSeconds(), 2)
    },
    //u not supported yet 

    // Timezone 
    //e not supported yet 
    //I not supported yet 
    O: function () {
      var t = pad(Math.abs(jsdate.getTimezoneOffset() / 60 * 100), 4);
      if (jsdate.getTimezoneOffset() > 0) t = "-" + t;
      else t = "+" + t;
      return t;
    },
    P: function () {
      var O = f.O();
      return (O.substr(0, 3) + ":" + O.substr(3, 2))
    },
    //T not supported yet 
    //Z not supported yet 

    // Full Date/Time 
    c: function () {
      return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P()
    },
    //r not supported yet 
    U: function () {
      return Math.round(jsdate.getTime() / 1000)
    }
  };

  return format.toString().replace(/[\\]?([a-zA-Z])/g, function (t, s) {
    let ret;
    if (t != s) {
      // escaped 
      ret = s;
    } else if (f[s]) {
      // a date function exists 
      ret = f[s]();
    } else {
      // nothing special 
      ret = s;
    }
    return ret;
  });
}

// 将场景中的创建时间和更新时间的时间戳转换为格式时间
export function formatCreateTimeAndUpdateTime(arr) {
  arr.forEach(item => {
    item.createTime = formatTime('Y-m-d H:i:s', item.createTime);
    item.updateTime = formatTime('Y-m-d H:i:s', item.uptadeTime);
  })
}

// 返回含页面传递的参数的键值对对象
export function getRequest() {
  var url = location.search; //获取url中"?"符后的字串
  var theRequest = new Object(); //在这里插入代码片
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    var strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}

/**
 * 上下线操作
 * function: upOrDownBtn, up, down, upOrDownRequest
 * 只暴露 upOrDownBtn 方法
 * */
// 上下线按钮触发的方法
// status: 场景类型 index: 按钮下标  data: 按钮所在表格的数据
export function upOrDownBtn(status, index, data) {
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

// 上下线请求
function upOrDownRequest(data) {
  $.ajax({
    url: serverUrl + "/scene/updateSceneStatus",
    dataType: "json",
    data: {
      id: data.id,
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
    }
  })
}

// 编辑按钮触发的方法
// e: 事件handler  data: 按钮所在表格的数据
export function editBtn(e, data) {
  let rowIndex = e.target.parentNode.parentNode.dataset.rowindex;
  let type = data[rowIndex - 1].sceneType;
  console.log("type: " + type);
  let id = data[rowIndex - 1].id;
  console.log("id: " + id);
  window.location.href = './sceneEdit.html?type=' + type + "&id=" + id;
}

// 判断对象为空方法
export function isEmpty(obj) {
  if (typeof obj == "undefined" || obj == null || obj == "" || Object.keys(obj).length == 0 || obj.length == 0) {
    return true;
  } else {
    return false;
  }
}

// 比较两个对象
export function deepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let index = 0; index < keys1.length; index++) {
    const val1 = object1[keys1[index]];
    const val2 = object2[keys2[index]];
    const areObjects = isObject(val1) && isObject(val2);
    if (areObjects && !deepEqual(val1, val2) ||
      !areObjects && val1 !== val2) {
      return false;
    }
  }

  return true;
}

function isObject(object) {
  return object != null && typeof object === 'object';
}


// 对象数组排序
export function sortObjBy(arr, property) {
  return arr.sort(compare(property));
}

function compare(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  }
}

/**
 * 
 * @param {vue} vue  实例
 * @param {String} selector  class选择器
 */
export function tableDrag(vue, selector) {
  $(selector).sortable({
    cursor: "move",
    delay: 0,
    items: "tr", //只是tr可以拖动  
    opacity: 0.8, //拖动时，透明度为0.6  
    revert: true, //释放时，增加动画  
  });
  // $(selector).disableSelection();
  $(document).bind('sortupdate', '.selector', function (e, ui) {
    let oldRow = ui.item.context.dataset.rowindex;
    let newRow = ui.item.context.rowIndex;
    console.log("oldRow: " + oldRow); // 移动的行的position
    console.log("newRow: " + newRow); // 移动后的位置行的position
    // 往上移
    if (oldRow > newRow) {
      vue.$data.sceneDetail[oldRow - 1].position = newRow;
      vue.$data.sceneDetail[oldRow - 1].status = 2;
      for (let i = newRow - 1; i < oldRow - 1; i++) {
        vue.$data.sceneDetail[i].position++;
        vue.$data.sceneDetail[i].status = 2;
      }
      console.log(vue.$data.sceneDetail);
      sortObjBy(vue.$data.sceneDetail, 'position');
      vue.$data.tableKey++;
      // console.log(vue.$data.sceneDetail);
    } else {
      vue.$data.sceneDetail[oldRow - 1].position = newRow;
      vue.$data.sceneDetail[oldRow - 1].status = 2;
      for (let i = oldRow; i < newRow; i++) {
        vue.$data.sceneDetail[i].position--;
        vue.$data.sceneDetail[i].status = 2;
      }
      console.log(vue.$data.sceneDetail);
      sortObjBy(vue.$data.sceneDetail, 'position');
      vue.$data.tableKey++;
    }
  });
}

/**
 * 
 * @param {Array} uiList 场景控制ui的数据
 * @param {Map} originMap 场景原始数据Map
 */

export function getChangedData(uiList, originMap) {
  let deleteList = [];
  let addList = [];
  let editList = [];
  let editMap = new Map();
  let tempMap = new Map(); // 存 stepDetail 去掉新增项后的临时 Map
  // 找删除项
  originMap.forEach(value => {
    if (value.status == 0) {
      deleteList.push(value);
    }
  })
  console.log("delete: ", deleteList);
  // 找新增项
  uiList.forEach(item => {
    if (!item.hasOwnProperty('id')) {
      item.status = 1;
      addList.push(item);
    } else {
      tempMap.set(item.id, item);
    }
  })
  console.log("add: ", addList);
  // 找修改项
  tempMap.forEach((value, key) => {
    if (value.status == 2) {
      value.status = 1;
      editMap.set(key, value);
    }
  })
  // 对修改项的 subList 做操作
  editMap.forEach((value, key) => {
    let obj = originMap.get(key);
    // 遍历对象属性，如果属性值仍为数组，则加入伪删除项
    Object.keys(obj).forEach(item => {
      if (obj[item] instanceof Array) {
        obj[item].forEach(i => {
          if (i.status == 0) {
            value[item].push(i);
          }
        })
      }
    });
    editList.push(value);
  })
  for (let i in deleteList) {
    editList.push(deleteList[i]);
  }
  for (let j in addList) {
    editList.push(addList[j]);
  }
  console.log("edit: ", editList);
  return editList;
}


var isTest = true;
var serverUrl = '';
var netHeader = {};
if (isTest) {
  serverUrl = 'http://10.18.40.209:6019';
} else {
  serverUrl = 'zhengshidizhi';
}

export {
  serverUrl,
  netHeader
};
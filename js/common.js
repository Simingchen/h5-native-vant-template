// rem，375页面下 root字体 20px
		  
		  function fontSize() {
		    var W = window.innerWidth;
		    var htmlStyle = document.querySelector("html").style
		    if (W > 640) {
		      htmlStyle.fontSize = "28px";
		      htmlStyle.background = "#fff"
		    } else {
		      htmlStyle.fontSize = W / 18.75 + "px"
		    }
		  }
      fontSize();
		  window.onresize = function () {
		    fontSize()
		  };
// 全局变量 loading
Vue.prototype.loading = false

// 节流防抖
function throttle(fn, interval) { //节流
  var enterTime = 0; //触发的时间
  var gapTime = interval || 500; //间隔时间，如果interval不传，则默认300ms
  return function () {
    var context = this;
    var backTime = new Date(); //第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments[0]);
      enterTime = backTime; //赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.data = JSON.stringify([config.data])

  // 塞入token
  if (localStorage.Authorization) {
    config.headers.Authorization = localStorage.Authorization
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (res) {
  var response = res.data[0]
  // 自动刷新token
  if (res.headers && res.headers['Authorization']) {
    localStorage.Authorization = res.headers['Authorization']
  }
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

function fecth(url, data, callback, that) {
  that.loading = true
  axios.post('actions/' + url, data).then(function (response) {
    that.loading = false
    if (typeof response === 'string') {
      response = {
        Status: 201,
        Msg: '服务器返回有误'
      }
    }
    if (response.Status == '201') {
      that.$toast(response.Msg)
      return false
    }
    if (response.Status == '500') {
      that.$toast(response.Msg)
      return false
    }
    callback && callback.call(that, response);
  })
}
// 添加前缀 0
function format10(data) {
  if (isNaN(data)) return 0;
  if (data < 10) return '0' + data;
  return data
}

// 下载图片
function downloadImg(data) {
  var url = data;                            // 获取图片地址
  var a = document.createElement('a');          // 创建一个a节点插入的document
  var event = new MouseEvent('click')           // 模拟鼠标click点击事件
  a.download = '图片'                  // 设置a节点的download属性值
  a.href = url;                                 // 将图片的src赋值给a节点的href
  a.dispatchEvent(event)                        // 触发鼠标点击事件
}



// tabbar
Vue.component('tabBar', {
  props: {
    active: '',
  },
  data: function () {
    return {
      list: [
        {
          title: '首页',
          name: 'home',
          url: '/',
          inactive: 'templates/INTEGRAL/img/t1.png',
          active: 'templates/INTEGRAL/img/t11.png'
        },
        {
          title: '分类',
          name: 'sort',
          url: 'goodsList.html',
          inactive: 'templates/INTEGRAL/img/t2.png',
          active: 'templates/INTEGRAL/img/t21.png'
        },
        {
          title: '升级',
          name: 'update',
          url: 'update.html',
          inactive: 'templates/INTEGRAL/img/t3.png',
          active: 'templates/INTEGRAL/img/t31.png'
        },
        {
          title: '我的',
          name: 'me',
          url: 'member.html',
          inactive: 'templates/INTEGRAL/img/t4.png',
          active: 'templates/INTEGRAL/img/t41.png'
        },
      ]
    }
  },
  template:
    '<van-tabbar v-model="active" fixed placeholder :border="false" active-color="#fa78ac" inactive-color="#666">' +
    '<van-tabbar-item :name="item.name" :url="item.url" v-for="item in list">' +
    '{{item.title}}' +
    '<template #icon="props">' +
    '<img :src="props.active ? item.active : item.inactive" />' +
    '</template>' +
    '</van-tabbar-item>' +
    '</van-tabbar>'
});

// 商品组件
Vue.component('goodsCard', {
  props: {
    tit: '',
    src: '',
    price: '',
    count: '',
    time: ''
  },
  template:
    '<div class="goodsCard">' +
    '<img class="img" :src="src">' +
    '<div class="tit van-ellipsis">{{tit}}</div>' +
    '<div class="bot flex-row-center">' +
    '<div class="price flex-box">' +
    '<div class="m"></div>' +
    '{{price}}' +
    ' </div>' +
    '<div class="count">销量{{count}}</div>' +
    '</div>' +
    '<div class="time-line" v-if="time">' +
    '<div class="left-txt">距结束还剩</div>' +
    '<van-count-down :time="time">' +
    '<template v-slot="timeData">' +
    '<i>{{ format10(timeData.days) }}</i>天<i>{{ format10(timeData.hours) }}</i>时<i>{{ format10(timeData.minutes) }}</i>分<i>{{ format10(timeData.seconds) }}</i>秒' +
    '</template>' +
    '</van-count-down>' +
    '</div>' +
    '</div>'

});

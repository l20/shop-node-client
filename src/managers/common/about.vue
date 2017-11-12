<style scoped>
.about {
  margin: 10px 20px 0 30px;
  color: black;
}
</style>

<template>

  <div class="about">
      <vue-markdown># :one: 自述</vue-markdown>
      <vue-markdown>-------------------</vue-markdown>
      <vue-markdown>### 数码特卖，使用了Vue全家桶(Vue, vue-router, vuex, axios)、iView UI功能组件库（前端）和node，koa（后端）开发的电子商务平台Demo，其中iView是一套高效美观的 Vue2 UI 框架。主要适合大中型中后台产品，比如某产品的运营平台、数据监控平台、管理平台等，从工程配置、到样式布局，甚至后面规划的业务套件，是一整套的解决方案，十分适合快速开发。
      </vue-markdown>
      <vue-markdown>### 在此demo中，前端商品展示主要自己实现，使用了少部分的iview功能组件，后台管理大部分使用了iview的组件，如：</vue-markdown>
      <vue-markdown>### 后台管理的整体布局，物品列表，用户列表等组件使用了iview的表格组件和其他基本样式组件，其余为自主实现。</vue-markdown>
      <vue-markdown>### 目前主要实现的功能，用户邮件注册，邮件激活和登录。</vue-markdown>
      <vue-markdown>### 根据价格区段展示商品，根据价格高低展示商品；商品详情、评论、聊天；商品加入购物车；购物车物品、激活等消息提示；购物车结帐；收货地址增加删除和编辑；用户详情资料头像设置。</vue-markdown>
      <vue-markdown>### 后台商品增删改查，用户增删改查，管理员权限管理。</vue-markdown>
      <vue-markdown>### JWT登录验证、登录权限验证、后台管理登录错误次数限制。</vue-markdown>
      <vue-markdown>### 物品并发操作，消息队列数据同步。</vue-markdown>
      <vue-markdown># 当前为 :link: _[后台管理界面](/admin/about)_ ,可前往网站 :link: _[前台主页](/)_</vue-markdown>
      <vue-markdown>### 当前默认登录用户为超级管理员root用户，为最高权限用户。</vue-markdown>
      <vue-markdown>### 当前所有可测试的账户有：</vue-markdown>
      <vue-markdown>### 管理员用户</vue-markdown>
      <vue-markdown>### :bust_in_silhouette:标识为帐号，:eyes: 标识为密码</vue-markdown>
      <vue-markdown>### :bust_in_silhouette: root :eyes: admin123 ,权限值 60</vue-markdown>
      <vue-markdown>### :bust_in_silhouette: admin :eyes: admin123 ,权限值 10</vue-markdown>
      <vue-markdown>### :bust_in_silhouette: admin_1 :eyes: admin123 ,权限值 20</vue-markdown>
      <vue-markdown>### :bust_in_silhouette: admin_2 :eyes: admin123 ,权限值 30</vue-markdown>
      <vue-markdown>### :bust_in_silhouette: admin_5 :eyes: admin123 ,权限值 40</vue-markdown>
      <vue-markdown>### 普通用户</vue-markdown>
      <vue-markdown>### :bust_in_silhouette: zhngsan :eyes: admin123 ,权限值 0</vue-markdown>
      <vue-markdown>### :bust_in_silhouette: lisi :eyes: admin123 ,权限值 0</vue-markdown>
      <vue-markdown>### :bust_in_silhouette: wangwu :eyes: admin123 ,权限值 0</vue-markdown>
      <vue-markdown>### :bust_in_silhouette: zhaaoliu :eyes: admin123 ,权限值 0</vue-markdown>
      <vue-markdown>### 权限大于10的用户才能登录后台，后台根据管理员权限的高低渲染页面，提供可操作范围。</vue-markdown>
      
      <br/><br/>
      <vue-markdown># :two: 前端实现：</vue-markdown>
      <vue-markdown>-------------------</vue-markdown>
      <vue-markdown>## :smile: 前台展示</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 前台整体布局，自适应跨端响应式布局。</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 根据查询条件，获取后端数据商品展示。</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 用户注册、登录。</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 可根据商品价格区段向后台请求查询，根据当前价格区段进行商品价位排序。</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 商品加入购物车、移除购物车，前后端同步实现。</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 商品详情页，商品评论，加入购物车，web socket端对端聊天通信。</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 商品数量增减，订单生成，订单结帐。</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 收货地址添加、删除、修改。</vue-markdown>
      <vue-markdown>### </vue-markdown>
      <br/><br/>
      <vue-markdown>## :smile: 后台管理</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 首页Markdown</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 物品增加、删除、修改、编辑。</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 物品图片上传、删除。</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 物品分页查询。</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 根据权限限制管理员用户可操作范围。</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 根据权限值进行相应用户激活状态修改。</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 根据权限值分配当前用户可修改的用户（当前用户不能修改自己相关较为敏感的数据，和不可修改权限比自己高的用户）。</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 根据用户名称检索查用户列表。（权限越高可查询的用户字段越多）</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 根据用户权限值排序查询用户数据。</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 根据用用户注册日期排序查询用户数据。</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 根据日期获取器（iView DatePicker）分注册时段查询用户数据。</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 超级管理员（权限大于50的root用户）用户可编辑用户所有信息。</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 用户数据CSV表格导出。</vue-markdown>
      <vue-markdown>### :heavy_multiplication_x: 其他功能组件暂未开发。</vue-markdown>
      <br/><br/>
      <vue-markdown>## :gear: 完成情况</vue-markdown>
      <completed :front-func="frontFunc" style="height:550px;"></completed>
      <br/><br/>

      <vue-markdown># :three: 后端实现：</vue-markdown>
      <vue-markdown>-------------------</vue-markdown>
      <vue-markdown>### 后端接口遵循了REST ful API风格，请求url尽量避免出现动词，使用了`POST,DELETE,PUT,GET`请求代替了请求的动词。</vue-markdown>
      <vue-markdown>### 相应API使用了`status、message、error、success`等基本字段。</vue-markdown>
      <vue-markdown>## :gear: user接口</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 导航到主页: :electric_plug: ```/v1``` 请求方法: ```GET```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 注册接口: :electric_plug: ```/v1/user/signup``` 请求方法: ```POST```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 前台登录接口: :electric_plug: ```/v1/user/signin``` 请求方法: ```POST```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 用户邮件激活: :electric_plug: ```/v1/user/activation``` 请求方法: ```GET```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 再次发送激活邮件: :electric_plug: ```/v1/user/email/active``` 请求方法: ```POST```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 登录检查接口: :electric_plug: ```/v1/user/check_login``` 请求方法: ```GET```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 用户头像设置: :electric_plug: ```/v1/user/avatar``` 请求方法: ```POST```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 商品加入购物车: :electric_plug: ```/v1/user/cart``` 请求方法: ```POST```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 购物车移除商品: :electric_plug: ```/v1/user/cart``` 请求方法: ```DELETE```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 购物车货物选中: :electric_plug: ```/v1/user/check_all``` 请求方法: ```POST```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 支付接口: :electric_plug: ```/v1/user/pay_ment``` 请求方法: ```POST```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 添加收货地址: :electric_plug: ```/v1/user/address``` 请求方法: ```POST```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 删除收货地址: :electric_plug: ```/v1/user/address``` 请求方法: ```DELETE```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 编辑收货地址: :electric_plug: ```/v1/user/address``` 请求方法: ```PUT```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 设置默认收货地址: :electric_plug: ```/v1/user/address/default``` 请求方法: ```PUT```</vue-markdown>
      <vue-markdown>### </vue-markdown>
      <vue-markdown>## :gear: goods接口</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 获取多个物品: :electric_plug: `/v1/goods/list` 请求方法: ```GET```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 获取指定物品: :electric_plug: `/v1/goods/:productId` 请求方法: ```GET```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 搜索物品: :electric_plug: `/v1/goods/search` 请求方法: ```GET```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 聊天接口: :electric_plug: `/v1/goods/socket` 请求方法: ```GET```</vue-markdown>
      <vue-markdown>## :gear: comment接口</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 商品下增加一条评论、回复: :electric_plug: `/v1/comment` 请求方法: POST</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 商品下删除评论、回复: :electric_plug: `/v1/comment` 请求方法: ```DELETE```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 获取商品下的评论、回复列表: :electric_plug: `/v1/comment/list` 请求方法: ```GET```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 评论点赞、反对: :electric_plug: `/v1/comment/vote` 请求方法: POST</vue-markdown>
      <vue-markdown>## :gear: admin接口</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 后台登录: :electric_plug: `/v1/admin/signin` 请求方法: POST</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 后台添加商品: :electric_plug: `/v1/admin/goods` 请求方法: POST</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 后台编辑商品: :electric_plug: `/v1/admin/goods` 请求方法: ```PUT```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 后台删除商品: :electric_plug: `/v1/admin/goods` 请求方法: ```DELETE```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 后台上传商品图片: :electric_plug: `/v1/admin/goods/images` 请求方法: POST</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 后台删除商品图片: :electric_plug: `/v1/admin/goods/images` 请求方法: ```DELETE```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 后台获取多个用户信息: :electric_plug: `/v1/admin/user/list` 请求方法: ```GET```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 后台搜索用户信息: :electric_plug: `/v1/admin/user/search` 请求方法: ```GET```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 后台编辑用户信息: :electric_plug: `/v1/admin/user` 请求方法: ```PUT```</vue-markdown>
      <vue-markdown>### :heavy_check_mark: 后台删除一个用户信息: :electric_plug: `/v1/admin/user/:uId` 请求方法: ```DELETE``` ...</vue-markdown>
      <vue-markdown>### :heavy_check_mark: JWT登录验证。</vue-markdown>
      <vue-markdown>### 其他接口后续开发。</vue-markdown>

      <br/><br/>
      <vue-markdown>## :gear: 完成情况</vue-markdown>
      <completed :front-func="frontAdmFunc" style="height:1000px;"></completed>
      <br/><br/>
      <vue-markdown># :four: 目前使用技术</vue-markdown>
      <vue-markdown>-------------------</vue-markdown>
      <vue-markdown>## :smile: 前端</vue-markdown>
      <vue-markdown>### :wrench: 开发脚本、语言、技术：javascript(ES5, ES6, ES7)、HTML5、CSS、stylus、svg。</vue-markdown>
      <vue-markdown>### :wrench: 主要：:link: [Vue](https://cn.vuejs.org/)、:link: [vue-router](https://router.vuejs.org/)、:link: [vuex](https://vuex.vuejs.org/zh-cn/)、:link: [axios](https://github.com/axios/axios)。</vue-markdown>
      <vue-markdown>### :wrench: 后台UI：:link: [iView2.0](https://github.com/iview/iview)。</vue-markdown>
      <vue-markdown>### :wrench: 跨域代理：:link: [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)。</vue-markdown>
      <vue-markdown>### :wrench: 滚动条按需请求加载：:link: [vue-infinite-scroll](https://github.com/ElemeFE/vue-infinite-scroll)。</vue-markdown>
      <vue-markdown>### :wrench: 图片懒加载：:link: [vue-lazyload](https://github.com/hilongjw/vue-lazyload)。</vue-markdown>
      <vue-markdown>### :wrench: Markdown解析：:link: [VueMarkdown](https://github.com/miaolz123/vue-markdown)。</vue-markdown>
      <vue-markdown>### :wrench: HTML转Markdown：:link: [h2m](https://github.com/island205/h2m)。</vue-markdown>
      <vue-markdown>### :wrench: Markdown编辑器：:link: [MarkdownEditor](https://github.com/alecgorge/MarkdownEditor)&amp[mavon-editor](https://github.com/hinesboy/mavonEditor)&amp[Vue-SimpleMDE](https://github.com/F-loat/vue-simplemde)。</vue-markdown>
      <vue-markdown>### :wrench: 富文本编辑器：:link: [quillEditor](https://github.com/surmon-china/vue-quill-editor)。</vue-markdown>
      <vue-markdown>### :wrench: 图表统计：:link: [Echarts](http://echarts.baidu.com)&amp :link: [vue-echarts-v3](https://github.com/xlsdg/vue-echarts-v3)。</vue-markdown>
      <vue-markdown>### :wrench: 文件上传：:link: [使用iView自带的文件上传组件](https://www.iviewui.com/components/upload)。</vue-markdown>
      <vue-markdown>### :wrench: 函数工具库：:link: [lodash](https://lodash.com/)。</vue-markdown>
      <vue-markdown>### :wrench: 时间日期工具：:link: [moment.js](http://momentjs.cn/)。</vue-markdown>
      <vue-markdown>### :wrench: 点对点聊天通信：:link: [vue-socket.io](https://github.com/MetinSeylan/Vue-Socket.io)。</vue-markdown>
      <vue-markdown>### :wrench: 测试工具： :link: [mocha](https://github.com/mochajs/mocha)、:link: [supertest](https://github.com/visionmedia/supertest)、:link: [chai](https://github.com/chaijs/chai)。</vue-markdown>
      <vue-markdown>### :wrench: 打包构建工具： :link: [webpack](http://webpack.github.io/)。</vue-markdown>
      <br/><br/>
      <vue-markdown>## :smile: 后端</vue-markdown>
      <vue-markdown>### :wrench: 开发脚本、语言、技术：javascript/nodejs(ES5, ES6, ES7)。</vue-markdown>
      <vue-markdown>### :wrench: node框架：:link: [koa2](http://koajs.com/)。</vue-markdown>
      <vue-markdown>### :wrench: 数据库：:link: [mongodb](https://www.mongodb.com/) + :link: [mongoose](http://www.nodeclass.com/api/mongoose.html)。</vue-markdown>
      <vue-markdown>### :wrench: 缓存数据库：:link: [redis](https://redis.io/) + :link: [ioredis](https://github.com/luin/ioredis)。</vue-markdown>
      <vue-markdown>### :wrench: 路由：:link: [koa-router](https://github.com/alexmingoia/koa-router)。</vue-markdown>
      <vue-markdown>### :wrench: session：:link: [koa-session2](https://github.com/Secbone/koa-session2)。</vue-markdown>
      <vue-markdown>### :wrench: 静态服务：:link: [koa-static]()。</vue-markdown>
      <vue-markdown>### :wrench: 模板引擎：:link: [ejs](http://koajs.com/)、:link: [pug/jade](http://koajs.com/)。</vue-markdown>
      <vue-markdown>### :wrench: 加密工具：:link: [bcrypt](https://github.com/kelektiv/node.bcrypt.js)。</vue-markdown>
      <vue-markdown>### :wrench: 调试工具：:link: [debug](http://koajs.com/)。</vue-markdown>
      <vue-markdown>### :wrench: 跨域工具：:link: [koa2-cors](https://github.com/zadzbw/koa2-cors)。</vue-markdown>
      <vue-markdown>### :wrench: 日志处理：:link: [log4js](https://github.com/log4js-node/log4js-node)、[morgan](https://github.com/expressjs/morgan)。</vue-markdown>
      <vue-markdown>### :wrench: websocket： :link: [socket.io](https://github.com/socketio/socket.io)。</vue-markdown>
      <vue-markdown>### :wrench: 登录验证： :link: [node json web token(JWT)](https://github.com/auth0/node-jsonwebtoken)。</vue-markdown>
      <vue-markdown>### :wrench: 邮件注册： :link: [nodemailer](https://github.com/nodemailer/nodemailer)。</vue-markdown>
      <vue-markdown>### :wrench: 测试工具： :link: [mocha](https://github.com/mochajs/mocha)、:link: [supertest](https://github.com/visionmedia/supertest)、:link: [chai](https://github.com/chaijs/chai)。</vue-markdown>
      <br/><br/>
      <vue-markdown># :five: 后续展望</vue-markdown>
      <vue-markdown>-------------------</vue-markdown>      
      <vue-markdown>后续打算继续完成、完善以上功能之后再在此基础上完成实现以下功能：</vue-markdown>      
      <vue-markdown>:rocket: 单点登录(SSO)</vue-markdown>      
      <vue-markdown>:rocket: 服务端渲染(SSR)</vue-markdown>      
      <vue-markdown>:rocket: 第三方oauth授权登录（微信，QQ，微薄授权登录？。。）</vue-markdown>      
      <vue-markdown>再后续...</vue-markdown>      
      <vue-markdown>:rocket: 小程序版前端</vue-markdown>      
      <vue-markdown>:rocket: PWA版前端</vue-markdown>      
      <vue-markdown>:rocket: react native app版前端</vue-markdown>      
      <vue-markdown>...</vue-markdown>      
  </div>

</template>

<script>
import VueMarkdown from "vue-markdown";
import completed from "../page/completed";
export default {
  data() {
    return {};
  },
  computed: {
    frontFunc() {
      let data = [
        { name: "登录组件", value: 95 },
        { name: "注册组件", value: 95 },
        { name: "首页物品组件", value: 100 },
        { name: "购物车组件", value: 100 },
        { name: "用户评论组件", value: 100 },
        { name: "用户详情组件", value: 50 },
        { name: "设置头像组件", value: 100 },
        { name: "用户地址组件", value: 98 },
        { name: "订单编辑组件", value: 100 },
        { name: "订单支付组件", value: 100 },
        { name: "商品详情组件", value: 100 },
        { name: "用户聊天组件", value: 80 },
        { name: "物品添加组件", value: 100 },
        { name: "物品列表组件", value: 100 },
        { name: "用户列表组件", value: 95 },
        { name: "用户添加组件", value: 1 },
        { name: "订单管理组件", value: 1 },
        { name: "评论管理组件", value: 1 },
        { name: "订单信息组件", value: 1 },
        { name: "待做任务组件", value: 1 },
        { name: "后台当前用户组件", value: 1 },
        { name: "后台系统设置组件", value: 1 },
      ];
      data.forEach(item => {
          Object.assign(item, {itemStyle: {normal: {}}});
          item.itemStyle.normal.color = "#" + Math.floor(Math.random() * 0xffffff).toString(16);
      });
      return data;
    },
    frontAdmFunc() {
      let data = [
        { name: "登录", value: 98 },
        { name: "注册", value: 98 },
        { name: "邮件激活", value: 100 },
        { name: "首页物品组件", value: 100 },
        { name: "再发送激活邮件", value: 100 },
        { name: "登录检查", value: 100 },
        { name: "头像设置", value: 98 },
        { name: "加入购物车", value: 100 },
        { name: "购物车移除", value: 100 },
        { name: "购物车选中", value: 100 },
        { name: "添加地址", value: 100 },
        { name: "删除地址", value: 100 },
        { name: "编辑地址", value: 100 },
        { name: "设置地址", value: 100 },
        { name: "获取物品列表", value: 100 },
        { name: "获取指定物品", value: 100 },
        { name: "搜索物品", value: 100 },
        { name: "聊天接口", value: 95 },
        { name: "评论、回复", value: 100 },
        { name: "删除评论", value: 100 },
        { name: "获取评论", value: 100 },
        { name: "点赞、反对", value: 100 },
        { name: "后台登录", value: 100 },
        { name: "添加商品", value: 100 },
        { name: "编辑商品", value: 100 },
        { name: "删除商品", value: 100 },
        { name: "上传商品图片", value: 100 },
        { name: "删除商品图片", value: 100 },
        { name: "获取多个用户", value: 100 },
        { name: "搜索用户", value: 100 },
        { name: "编辑用户", value: 1 },
        { name: "添加用户", value: 1 },
        { name: "删除用户", value: 100 },
        { name: "获取多个用户", value: 100 },
        { name: "JWT登录验证", value: 100 },
        { name: "登录错误次数限制", value: 100 },
        { name: "订单删除", value: 1 },
        { name: "订单修改", value: 1 },
        { name: "评论删除", value: 1 },
        { name: "评论修改", value: 1 },
        { name: "订单信息提示", value: 1 },
        { name: "消息通知提示", value: 1 },
        { name: "任务进度提示", value: 1 },
      ];
      data.forEach(item => {
          Object.assign(item, {itemStyle: {normal: {}}});
          item.itemStyle.normal.color = "#" + Math.floor(Math.random() * 0xffffff).toString(16);
      });
      return data;
    }
  },
  components: {
    VueMarkdown,
    completed
  }
};
</script>

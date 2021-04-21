# 移动端H5 gulp

基于 gulp 优化创建项目的步骤以及 sass + rem适配 + 热更新,移动端常见兼容处理等等

### yarn

一直使用NPM，尝试了下yarn效果如何（好像快了） 
```
yarn install 
yarn add gulp -D 
yarn add node-sass -D --registry https://registry.npm.taobao.org/
```

### 启动项目

```
yarn OR yarn install 

```
初始化
```
yarn run init

```

开发模式
```
yarn run dev --your Project Name
```


项目打包
```
yarn build
```

<!-- √ -->
目录
- [ √ 默认MR模板](#template)
- [ √ Autoprefixer](#autoprefixer)
- [ √ Sass/Less 全局样式](#sassLess)
- [ √ JS ES6 CSS 转换压缩](#mini)
- [ √ 热更新 ](#hotUpdate)
- [ √ build js css img压缩](#)
- [ 增加 git commit 规范 ](#commit)
- [ rem 适配方案](#)
- [ scss mixin](#)
- [ 配置 proxy 跨域](#)
<!-- - [ 添加 IE 兼容 ](#ie) -->
<!-- ### <span id="template">✅ 默认MR模板 </span> -->
<!-- - [√ 添加 IE 兼容 ](#ie) -->
<!-- - [√ Eslint+Pettier 统一开发规范 ](#pettier) -->


### <span id="template">✅ 默认MR模板 </span>

<code>yarn init</code> 初始化生成移动端模板

<!-- 模板目录结构 -->
<!-- ```
├── template
│   ├── css
│   │   ├── index.scss               
│   │   ├── mixin.scss               # 全局mixin
│   │   └── common.scss           # 全局通用样式
│   ├── js
│   │   ├── index.js               
│   │   └── utils.js               
│   ├── index.html           
``` -->

### <span id="autoprefixer">✅ Autoprefixer </span>
 
安装 <code>gulp-autoprefixer</code> 将project的css都进行样式补全。

<code>yarn add gulp-autoprefixer -D</code> 

```
 src(basePath.project+'**/*.css')
    .pipe(autoFixer({
      cascade: false,//是否美化属性值 格式化
      remove:true//是否去掉不必要（过时）的前缀
    }))  
```

### <span id="sassLess">✅ Sass/Less 全局样式 </span>

安装gulp-sass 和 gulp-less 进行转换。

<code>yarn add gulp-sass -D </code> 如无意外正常报错（资料显示node-sass文件无法下载，可能需要fq），试试淘宝镜像。
<code>yarn add gulp -D --registry https://registry.npm.taobao.org/</code>

### <span id="mini">✅ 代码及静态资源压缩 </span>

安装gulp-imagemin进行压缩图片。

<code>yarn add gulp-imagemin -D </code> 

```
src(dist+'**/images/*')  
  .pipe(imagemin({
    optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
    progressive: true
  }))
```

每一次打包都压缩图片，会出现图片没有修改的时候也进行压缩处理，比较耗时。

安装gulp-cache进行缓存，如果文件没有修改则不会重复压缩。

<code>yarn add gulp-cache -D </code> 

```
src(dist+'**/images/*')  
  .pipe(imagemin({
    optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
    progressive: true
  }))
```

### <span id="hotUpdate">✅ 热更新 </span>

使用 watch 进行文件改动的监视输出到dist，监测到dist文件改动，使用browserSync.reload，进行浏览器刷新

### <span id="commit">✅ git commit 规范 </span>
```type(必须)

用于说明git commit的类别，只允许使用下面的标识。

feat：新功能（feature）。

fix：修复bug，可以是QA发现的BUG，也可以是研发自己发现的BUG。

style：格式（不影响代码运行的变动）。

refactor：重构（即不是新增功能，也不是修改bug的代码变动）。

perf：优化相关，比如提升性能、体验。

docs: 修改说明文档，README.md

test：增加测试。

chore：构建过程或辅助工具的变动。

revert：回滚到上一个版本。

scope(可选，没有使用框架暂不需要)

scope用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同。

subject(必须)

subject是commit目的的简短描述，不超过50个字符。```
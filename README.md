# 移动端H5 gulp

基于 gulp 优化创建项目的步骤以及 sass + rem适配 + 热更新,移动端常见兼容处理等等

### yarn

一直使用NPM，尝试了下yarn效果如何（好像快了） 
yarn install 
yarn add gulp -D 
yarn add node-sass -D --registry https://registry.npm.taobao.org/

### 启动项目

```
yarn OR yarn install 
```
<!-- √ -->
目录
- [ √ 默认MR模板](#template)
- [ √ Autoprefixer](#)
- [ √ Sass/Less 全局样式](#sassLess)
- [ rem 适配方案](#)
- [ √ JS ES6 CSS 转换压缩](#mini)
- [ 配置 proxy 跨域](#)
- [ √ 热更新 ](#hotUpdate)
- [ √ build js css img压缩](#)
- [ ... ](#)
<!-- - [ 添加 IE 兼容 ](#ie) -->
<!-- ### <span id="template">✅ 默认MR模板 </span> -->
<!-- - [√ 添加 IE 兼容 ](#ie) -->
<!-- - [√ Eslint+Pettier 统一开发规范 ](#pettier) -->


### <span id="template">✅ 默认MR模板 </span>

<code>yarn init projectName</code> 初始化生成移动端模板

模板目录结构
```
├── template
│   ├── css
│   │   ├── index.scss               # 全局通用样式
│   │   ├── mixin.scss               # 全局mixin
│   │   └── variables.scss           # 全局变量
│   ├── js
│   │   ├── index.js               
│   │   ├── utils.js               
│   │   └── jquery.js
│   ├── index.html           
```

### <span id="hotUpdate">✅ Autoprefixer </span>

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

<code>yarn add gulp-sass -D </code> 如无意外正常报错（资料显示node-sass文件无法下载，可能需要fq），试试其他镜像。
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

每一次打包都压缩图片，会出现图片没有修改，但是也进行压缩处理，比较耗时。

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
const {src,dest,series,parallel,watch} = require("gulp");
const del = require("del");//delete file
const plugins = require('gulp-load-plugins')();//gulp plugins
const concat = require('gulp-concat');//Connection file
const babel = require('gulp-babel');//es6 => es5
const sass = require('gulp-sass');//sass => css
const less = require('gulp-less');//less => css
const cleanCSS = require('gulp-clean-css');// minifiy css
const autoFixer = require('gulp-autoprefixer');// autoprefixer css
const gulpif = require('gulp-if') // 条件判断
const uglify = require('gulp-uglify') // js压缩
const htmlmin = require('gulp-htmlmin') // html压缩
const imagemin = require('gulp-imagemin') // 图片压缩
const cache = require('gulp-cache');//cahche 

const rename = require('gulp-rename');
const minimist = require('minimist');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

const argv = minimist(process.argv.slice(2));
const path = argv.name != undefined ? argv.name:"";//gulp init --  newProject
const dist = 'dist/';
const basePath = {
  build:'build/',// build path
  project:'project/',//project path
  projectName:dist+path,
  template:{
    defalut:'template/H5'
  }//template path
}
let env = 'dev'//default env
function set_env(type) {
    env = process.env.NODE_ENV = type || 'dev';
}

// live server
function browser(){
  return browserSync.init({
    server: {
        baseDir: projectName,
        directory: true,
    },
    port: 3031
  });//在task中，操作完成时，必须要通过cb()或者return的方式来告知gulp此任务已完成
}

//hot update 
function filesWatch(cb){
  watch(basePath.project+'**/*.html').on('change',htmlHandler); 
  watch(basePath.project+'**/*.scss').on('change',sassHandler);
  watch(basePath.project+'**/*.less').on('change',lessHandler);
  watch(basePath.project+'**/*.js').on('change', babelHandler); 
  watch(basePath.project+'**/*.css').on('change', function(){
    cssHandler(cb);
  }); 
  watch([dist+'**/*']).on('change', reload); 
  cb();
}
 

//HTML
function htmlHandler(){
  return src(basePath.project+'**/*.html')  
    .pipe(dest(dist)); 
}

//JS
function babelHandler(){
  return src(basePath.project+'**/*.js')  
    .pipe(babel())
    .pipe(dest(dist)); 
}

//CSS
function cssHandler(){
  del([projectName+"/css"]);
  return src(basePath.project+'**/*.css')
    .pipe(autoFixer({
      cascade: false,//是否美化属性值 格式化
      remove:true//是否去掉不必要（过时）的前缀
    }))  
    .pipe(dest(dist)); 

}

// SASS
function sassHandler(){
  return src(basePath.project+'**/*.scss')  
    .pipe(sass().on('error', sass.logError))
    .pipe(dest(basePath.project)); 
}
function lessHandler(){
  return src(basePath.project+'**/*.less')  
    .pipe(less())
    .pipe(dest(basePath.project)); 
}

function miniJs(){
  return src(dist+'**/*.js')  
    .pipe(uglify({
      mangle:true, //是否修改变量名
			compress:true,//是否完全压缩
    }))
    .pipe(dest(basePath.build)); 
}

function miniCss(){
  return src(dist+'**/*.css')  
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(dest(basePath.build)); 
}
function miniImages(){
  return src(dist+'**/images/*')  
  .pipe(cache(imagemin({
    optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
    progressive: true
  })))
  .pipe(dest(basePath.build)); 
}

// init project
function init(cb) {
  del([basePath.project + path])
  src( basePath.template+'**/*')
    .pipe(dest(basePath.project + path));
  cb();
};

//npm run dev --name TestProject
function devHanlder() {
  set_env('dev');
  return src(basePath.project + path + '**/*')
    .pipe(dest(dist));
}

function buildHanlder() {
  set_env('build');
  return src(dist+"**/*.html")
    .pipe(dest(basePath.build))
}
//Test Fun

function delDist() {
  return  del([dist]);
}
function delBuild() {
  return  del([basePath.build]);
}


function setEnv(cb) {
  set_env('Test');
  cb();
}
//Test Fun
function consoleLog(cb) {
  console.log(env)
  cb();
}
//series 顺序
//parallel 并行
exports.init = series(init,browser,filesWatch);
exports.dev = series(delDist,devHanlder,htmlHandler,sassHandler,babelHandler,cssHandler,filesWatch,browser);
exports.build = series(delBuild,buildHanlder,miniImages,miniCss,miniJs);
exports.default = browser;
exports.consoleLog = series(setEnv,consoleLog);
exports.cc = consoleLog
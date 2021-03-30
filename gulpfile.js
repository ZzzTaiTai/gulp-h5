const {src,dest,series,watch} = require("gulp");
const del = require("del");//delete file
const plugins = require('gulp-load-plugins')();//gulp plugins
const concat = require('gulp-concat');//Connection file
const babel = require('gulp-babel');//es6 => es5
const sass = require('gulp-sass');//sass => css
const cssmin = require('gulp-clean-css');// minifiy css
const autoFixer = require('gulp-autoprefixer');// minifiy css
const gulpif = require('gulp-if') // 条件判断
const uglify = require('gulp-uglify') // js压缩
const htmlmin = require('gulp-htmlmin') // html压缩
const imagemin = require('gulp-imagemin') // 图片压缩

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
  template:'template/'//template path
}
let env = 'dev'//default env
function set_env(type) {
    env = process.env.NODE_ENV = type || 'dev';
}

// live server
function browser(cb){
  browserSync.init({
    server: {
        baseDir: dist+path,
        // baseDir: './',
        directory: true,
    },
    port: 3031
  });
  cb();//在task中，操作完成时，必须要通过cb()或者return的方式来告知gulp此任务已完成
}

//hot update 
function filesWatch(cb){
  watch(basePath.project+'**/*.html').on('change',htmlHandler); 
  watch(basePath.project+'**/*.scss').on('change',sassHandler);
  watch(basePath.project+'**/*.js').on('change', babelHandler); 
  watch(basePath.project+'**/*.css').on('change', function(){
    autoFixer();
    cssHandler(cb);
  }); 
  watch([dist+'**/*']).on('change', reload); 
  cb();
}


//HTML
function htmlHandler(cb){
  src(basePath.project+'**/*.html')  
    .pipe(dest(dist)); 
  cb();
}

//JS
function babelHandler(cb){
  src(basePath.project+'**/*.js')  
    .pipe(babel())
    .pipe(dest(dist)); 
  cb();
}

//CSS
function cssHandler(cb){
  src(basePath.project+'**/*.css')  
    .pipe(dest(dist)); 
  cb();
}

// SASS
function sassHandler(cb){
  src(basePath.project+'**/*.scss')  
    .pipe(sass().on('error', sass.logError))
    .pipe(dest(dist)); 
  cb();
}

// init project
function init(cb) {
  del([basePath.project + path])
  src( basePath.template+'**/*')
  .pipe(dest(basePath.project + path));
  cb();
};

//npm run dev --name TestProject
function devHanlder(cb) {
  set_env('dev');
  del([dist + path]);
  src(basePath.project + path + '**/*')
  .pipe(dest(dist));
  cb();
}

function bulid(cb) {
  set_env('bulid');
  del(basePath.bulid);
  src(dist + path)
  .pipe(dest(basePath.bulid))
  cb();
}

function delDist(cb) {
  del([dist]);
  dest(dist)
  cb();
}
//series 顺序
//parallel 并行
exports.babelInit = babelHandler;
exports.init = series(init,browser,filesWatch);
exports.dev = series(devHanlder,htmlHandler,sassHandler,babelHandler,cssHandler,filesWatch,browser);
exports.bulid = bulid;
exports.default = browser;
exports.delDist = delDist;
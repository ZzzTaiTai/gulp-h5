const {src,dest,series,watch} = require("gulp");
const del = require("del");//delete file
const plugins = require('gulp-load-plugins')();//gulp plugins
const concat = require('gulp-concat');//Connection file
const babel = require('gulp-babel');//es6 => es5
const sass = require('gulp-sass');
/**
* options {String or Object or Function} 这里以{Object}为例
* {
* 	dirname: "js",		文件路径
* 	basename: "main",	文件名
* 	prefix: "",		文件名前缀
* 	suffix: ".min",	文件名后缀
* 	extname: ".js"		文件扩展名
* }
*/
const rename = require('gulp-rename');
const minimist = require('minimist');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

var buildBasePath = 'build/';//构建输出的目录
var projectBasePath = 'project/';//构建输出的目录
const argv = minimist(process.argv.slice(2));
const path = argv.name != undefined ? argv.name:"";//gulp init --name newProject
const dist = 'dist';
const basePath = {
  cssDist:"dist/css",
  cssDev:"dev/css",
  jsDist: dist + '/js',
  jsDev: 'dev/js',
  imgDist: dist + '/images',
}

// live server
function browser(cb){
  browserSync.init({
    server: {
        baseDir: 'project/'+path,
        directory: true,
    },
    port: 3031
  });
  filesWatch();
  cb();
}

//hot update
function filesWatch(){
  // watch('project/**/*.js').on('change',sassHandler);
  watch('project/**/*.scss').on('change',sassHandler);
  watch(['project/**/*.html','project/**/*.css','project/**/*.js']).on('change', reload); 
  
}

//ES5 

function babelHandler(cb){
  src('project/**/*.js')  
    .pipe(babel())
    .pipe(dest(basePath.jsDist)); 

  cb();
}

// SCSS
function sassHandler(){
  src('project/**/*.scss')  
    .pipe(sass().on('error', sass.logError))
    .pipe(dest("project/")); 
}

// init project
function init(cb) {
  del([projectBasePath + path])
  src('template/**/*')
  .pipe(dest(projectBasePath + path));
  cb();
};

exports.babelInit = babelHandler;
exports.init = series(init,browser);
exports.default = browser;
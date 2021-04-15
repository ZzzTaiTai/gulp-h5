const {src,dest,series,parallel,watch} = require("gulp");
const del = require("del");//delete file
const clean = require('gulp-clean') // clean file
const rename = require('gulp-rename') // rename file
const plugins = require('gulp-load-plugins')();//gulp plugins
const concat = require('gulp-concat');//Connection file
const babel = require('gulp-babel');//es6 => es5
const sass = require('gulp-sass');//sass => css
const less = require('gulp-less');//less => css
const cleanCSS = require('gulp-clean-css');// minifiy css
const autoFixer = require('gulp-autoprefixer');// autoprefixer css
const uglify = require('gulp-uglify') // js mini
const htmlmin = require('gulp-htmlmin') // html mini
const imagemin = require('gulp-imagemin') // image mini
const cache = require('gulp-cache');//cahche 
const rev = require('gulp-rev-dxb');
const revCollector = require('gulp-rev-collector-dxb'); 
const gulpif = require('gulp-if') 

const minimist = require('minimist');//cmd 
const browserSync = require('browser-sync');
const reload = browserSync.reload;

const argv = minimist(process.argv.slice(2));
const path = argv.name != undefined ? argv.name:"";//gulp init --  newProject
const template = argv.temp != undefined ? argv.temp:template.defalut;
const dist = 'dist/';
const basePath = {
  build:'build/',// build path
  project:'project/',//project path
  distJs:dist+'js',
  distCss:dist+'css',
  distImg:dist+'images',
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
        baseDir: dist + path,
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
    .pipe(gulpif(env === 'build',uglify({
      mangle:true, //change variable name
			compress:true,
    })))
    .pipe(dest(dist));
}

//CSS
function cssHandler(){
  del([basePath.projectName+"/css"]);
  return src(basePath.project+'**/*.css')
    .pipe(autoFixer({
      cascade: false,//是否美化属性值 格式化
      remove:true//是否去掉不必要（过时）的前缀
    }))
    .pipe(gulpif(env === 'build',cleanCSS({compatibility: 'ie8'})))  
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
    .pipe(less().on('error', less.logError))
    .pipe(dest(basePath.project)); 
}

function miniImages(){
  return src(dist+'**/images/*')  
  .pipe(cache(imagemin({
    optimizationLevel: 5, //  defalut：3  min-max：0-7 level
    progressive: true
  })))
  .pipe(dest(basePath.distImg)); 
}

function fileRev(){
  return src(['dist/**/**/*.css', 'dist/**/**/*.js'])
  .pipe(rename({dirname: ''}))
  .pipe(rev())
  .pipe(rev.manifest({
      path: 'rev-manifest.json',
      merge: true
  }))
  .pipe(dest('./'));
}

function addVersion(){
  src(['rev-manifest.json', basePath.build+'/**/*.html'])
  .pipe(revCollector())   // 根据.json文件 执行文件内js/css名的替换
  .pipe(dest(basePath.build));
  return src('rev-manifest.json')
    .pipe(clean())

}

// init project
function init() {
  return src( template +'/**/*')
    .pipe(dest(basePath.project + path));
};

//npm run dev --name TestProject
function devHanlder() {
  set_env('dev');
  return src(basePath.project + path + '**/*')
    .pipe(dest(dist));
}

function buildHanlder() {
  set_env('build');
  return src(dist+path+"/**/*")
    .pipe(dest(basePath.build))
}
//Test Fun

function delDist() {
  return src(dist)
    .pipe(clean());
}

//parallel async
exports.init = series(init,devHanlder,htmlHandler,sassHandler,babelHandler,cssHandler,filesWatch,browser);
exports.dev = series(delDist,htmlHandler,sassHandler,babelHandler,cssHandler,filesWatch,browser);
exports.build = series(buildHanlder,htmlHandler,sassHandler,babelHandler,cssHandler,miniImages,fileRev,addVersion);
exports.default = browser;
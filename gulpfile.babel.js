import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
const $ =  gulpLoadPlugins();

gulp.task('js', () => {
  // 不匹配lib文件夹下所有文件
  return gulp.src(['app/Public/js/**/*.js'])
/*/!*    .pipe($.uglify({
      //preserveComments:'license',
      //mangle:true,//类型：Boolean 默认：true 是否修改变量名
      mangle: { except: ['require', 'exports', 'module', '$'] }, //排除混淆关键字
      compress: false, //类型：Boolean 默认：true 是否完全压缩
    }))*!/
    .pipe(gulp.dest('dist/Public/js/'));*/
});

gulp.task('sass', () => {
  return gulp.src(['app/Public/sass/**/*.scss'])
    .pipe($.sass())
  .pipe(gulp.dest('dist/Public/css/'));
});



 // 重新加载
const reload = browserSync.reload;
gulp.task('serve', ['sass'], () => {
  // http://www.browsersync.cn/docs/options/
  browserSync({
    notify:false,//不显示在浏览器中的任何通知。
    port:800,//端口
    host:'10.100.1.157',
    browser:["firefox"/*, "firefox"*/], // 在chrome、firefix下打开该站点
    server: {
      baseDir:['dist/','app/'],// 应用程序目录
      index:'index.html',// 在应用程序目录中指定打开特定的文件
      routes: {
      }
    }
  })
  // 每当修改以下文件夹下的文件时就会刷新浏览器;
  gulp.watch('app/**/*.scss', ['sass']);
  gulp.watch('app/**/*.js', ['js']);

  gulp.watch([
    'app/**/*.*'
  ]).on('change', reload);
});

gulp.task('server',['serve'],() => {});
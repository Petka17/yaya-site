var gulp            = require('gulp');
var jade            = require('gulp-pug');
var prettify        = require('gulp-prettify');
var postcss         = require('gulp-postcss');
var autoprefixer    = require('autoprefixer');
var path            = require('path');
var iconfont        = require('gulp-iconfont');
var iconfontCss     = require('gulp-iconfont-css');
var sass            = require('gulp-sass');
var del             = require('del');
// var mainBowerFiles  = require('main-bower-files');
var uglify          = require('gulp-uglify');
var concat          = require('gulp-concat');
var filter          = require('gulp-filter');

var config = {
    paths: [
        // images
        'src/img/**/*',
        '!src/i/sprite/**/*',
        // js
        'src/js/**/*',
        // fonts
        'src/fonts/**/*',
        // other
        'src/robots.txt'
    ]
};


gulp.task('build:copy', function (callback) {
    gulp.src(config.paths, {base: 'src'})
        .pipe(gulp.dest('template-page'))
        .on('finish', callback);
});

// gulp.task('build:jade', function () {
//     gulp.src([
//         'src/jade/*.pug',
//         '!src/jade/include',
//         '!src/jade/include/**/*'
//     ])
//         .pipe(jade())
//         .pipe(prettify({
//             unformatted: ['pre', 'code', 'br', 'strong', 'i', 'b', 'span', 'mark']
//         }))
//         .on('error', function(error) {
//             console.log(error);
//             this.emit('end');
//         })
//         .pipe(gulp.dest('./template-page'));
// });


gulp.task('build:css', function () {
    var processors = [
        autoprefixer({browsers: ['last 5 versions',  '> 0.5%']}),
        require('precss')({ /* options */ })
    ];

    return gulp.src('./src/scss/*.scss')
        .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gulp.dest('./template-page/css'));
});

gulp.task('build:iconfont', function (cb) {

    var fontName = 'mid';

    gulp.src('src/icons/*.svg')
        .pipe(iconfontCss({
            fontName: fontName,
            path: 'src/libs/font-template.scss',
            targetPath: '../styles/blocks/general/icons.scss',
            fontPath: '../fonts/',
            cssClass: 'ic'
        }))
        .pipe(iconfont({
            fontName: fontName,
            formats: ['ttf', 'eot', 'woff', 'woff2'],
            normalize: true,
            autohint: false,
            prependUnicode: true,
            fontHeight: 692
        }))
        .pipe(gulp.dest('./src/fonts/'))
        .on("finish", cb);
});

var filterByExtension = function(extension){
    return filter(function(file){
        return file.path.match(new RegExp('.' + extension + '$'));
    });
};

// gulp.task('main-bower-files', function(){
//     var mainFiles = mainBowerFiles();
//
//     if(!mainFiles.length){
//         // No main files found. Skipping....
//         return;
//     }
//
//     var jsFilter = filterByExtension('js');
//
//     return gulp.src(mainFiles)
//         .pipe(jsFilter)
//         .pipe(concat('vendor-bower.min.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest('./build/js'));
// });

gulp.task('plugins', function(){

    var jsFilter = filterByExtension('js');

    return gulp.src('src/plugins/**/*.js')
        .pipe(jsFilter)
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./template-page/js'));
});

gulp.task('html', function () {
	return gulp.src('src/*.html')
		.pipe(gulp.dest('./template-page'));
});

gulp.task('keepme', function () {
	return gulp.src('src/*.keepme')
		.pipe(gulp.dest('./template-page'));
});

gulp.task('clean', function (callback) {
    del(['template-page/**/*']).then(function () {
        callback();
    });
});



gulp.task('build', ['clean', 'build:iconfont'], function () {
    gulp.run('html');
    gulp.run('keepme');
    gulp.run('build:css');
    // gulp.run('build:jade');
    gulp.run('build:copy');
    gulp.run('plugins');
});

gulp.task('watch', ['build'], function () {
    gulp.watch(['src/*.html'], ['html']);
    gulp.watch(['src/scss/**/*.scss'], ['build:css']);
    // gulp.watch(['src/jade/**/*.pug'], ['build:jade']);
    gulp.watch(config.paths, ['build:copy']);
});

gulp.task('default', [
    'build'
]);

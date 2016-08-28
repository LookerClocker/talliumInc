'use strict';

let 	del         = require('del'),
	gulp        = require('gulp'),
	sass        = require('gulp-sass'),
	bable       = require('gulp-babel'),
	browserSync = require('browser-sync'),
	imagemin    = require('gulp-imagemin'),
	pngquant    = require('imagemin-pngquant');

gulp.task('sass', ()=> {
	return gulp.src('app/sass/**/*.sass')
		.pipe(sass())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', ()=> {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	})
});

gulp.task('clean', ()=> {
	return del.sync('public');
});

gulp.task('img', ()=>{
	return gulp.src('app/img/**/*')
	.pipe(imagemin({
			interlaced: true,
			progressive:true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
	.pipe(gulp.dest('public/img'));
});

gulp.task('bable-compile', ()=>{
	return gulp.src('app/js**/*')
	.pipe(bable({
			presets: ['es2015']
		}))
	.pipe(gulp.dest('public/js'))
});

gulp.task('watch', ['browser-sync', 'sass'], ()=> {
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'img', 'bable-compile', 'sass'], ()=> {
	let buildCss,
		buildJson,
		buildHtml;

	buildCss = gulp.src('app/css/main.css')
		.pipe(gulp.dest('public/css'));

	buildJson = gulp.src('app/**/*.json')
		.pipe(gulp.dest('public'));

	buildHtml = gulp.src('app/*.html')
		.pipe(gulp.dest('public'));
});
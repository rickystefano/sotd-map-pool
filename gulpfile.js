/**
 * Name		: gulfile.js
 * Author	: Dominikus Ricky Stefano Simadinata
 * Date		: 29-05-2019
 */

// general packages.
var gulp = require("gulp"),
	rename = require("gulp-rename"),
	remember = require("gulp-remember"),
	cache = require("gulp-cached"),
	notify = require("gulp-notify"),
	plumber = require("gulp-plumber");

// sass node packages.
var sass = require("gulp-sass"),
	prefixer = require("gulp-autoprefixer"),
	cleanCSS = require("gulp-clean-css");

// javascript node packes.
var concat = require("gulp-concat"),
	jshint = require("gulp-jshint"),
	amdOptimize = require("amd-optimize"),
	uglify = require("gulp-uglify");
	
// paths
var path = {
	sass: {
		src: "res/sass/**/**.scss",
		dest: "pub/assets/css"
	},
	script: {
		src: "res/script/**/**.js",
		dest: "pub/assets/js"
	}
};

// compile sass
gulp.task('sass', function() {

	gulp.src(path.sass.src)
		.pipe(plumber({
			errorHandler: function(err) {
				notify.onError({
					title: "Sass error",
					message: "Error: <%= error.message %>",
					sound: "Bottle"
				})(err);
				this.emit("end");
			}
		}))
		.pipe(sass())
		.pipe(cleanCSS())
		.pipe(gulp.dest(path.sass.dest))
		.pipe(notify({
			message: "Sass compiled!",
			onLast: true
		}));

});


// compile javascript
gulp.task('script', function() {

	gulp.src(path.script.src)
		.pipe(plumber({
			errorHandler: function(err) {
				notify.onError({
					title: "Script error",
					message: "Error: <%= error.message %>",
					sound: "Bottle"
				})(err);
				this.emit("end");
			}
		}))
		.pipe(cache("scripts"))
		.pipe(jshint())
		.pipe(jshint.reporter("default"))
		.pipe(amdOptimize("app",
			{
				name: "app",
				configFile: "./res/script/app.js",
				baseUrl: "./res/script"
			}
		))
		.pipe(remember("scripts"))
		.pipe(concat("app.js"))
		.pipe(uglify())
		.pipe(gulp.dest(path.script.dest))
		.pipe(notify({
			message: "Script compiled!",
			onLast: true
		}));
	
});

// watch the script and sass files
gulp.task("watch", function() {
	gulp.watch(path.sass.src, ["sass"]);
	gulp.watch(path.script.src, ["script"]);
});

gulp.task('default', ['sass', 'watch', 'script']);
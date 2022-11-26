import gulp from 'gulp';
import concat from 'gulp-concat';
import minify from 'gulp-minify';
import uglify from 'gulp-uglifycss';
import webp from 'gulp-webp';
import shell from 'gulp-shell';
import git from 'gulp-git';
import bump from 'gulp-bump';
import filter from 'gulp-filter';
import tagVersion from 'gulp-tag-version';

/* Build */

gulp.task('scripts', () => {
    return gulp
      .src([
        "./assets/js/lib/jquery.js",
        "./assets/js/lib/bootstrap.js",
        "./assets/js/lib/handlebars.js",
        "./assets/js/lib/sortable.js",
        "./assets/js/index.js"
      ])
      .pipe(concat("release.min.js"))
      .pipe(gulp.dest("./public/build/"));
});

gulp.task('minify', () => {
    return gulp.src('./public/build/release.min.js')
    .pipe(minify({
        ext:{
            min:'.js'
        },
        noSource: true
    }))
    .pipe(gulp.dest('./public/build/'))
});

gulp.task('styles', () => {
    return gulp
        .src([
            "./assets/css/bootstrap.css",
            "./assets/css/fonts.css",
            "./assets/css/normalize.css",
            "./assets/css/style.css",
            "./assets/css/responsive.css",
            "./assets/css/support.css"
        ])
        .pipe(concat('release.min.css'))
        .pipe(gulp.dest('./public/build/'));
});

gulp.task('uglify', function () {
    return gulp.src('./public/build/release.min.css')
    .pipe(uglify({
        "maxLineLen": 80,
        "uglyComments": true
    }))
    .pipe(gulp.dest('./public/build/'));
});

gulp.task('build', gulp.series('scripts','minify','styles','uglify'));

/* End of Build */
/* Imaages */

gulp.task('webp', () => {
    return gulp.src('./images/*')
    .pipe(webp())
    .pipe(gulp.dest('build/images/'))
});

gulp.task('images', gulp.series('webp'));

/* End of Images */
/* Git */

gulp.task('pull', (callback) => {
    git.pull('origin', 'main', (err) => {
        if (err) throw err;
    });
    callback();
});

gulp.task('add', () => {
    return gulp.src('.')
    .pipe(git.add());
});

gulp.task('commit', () => {
    return gulp.src('.')
      .pipe(git.commit('Update repo from gulp'));
});

gulp.task('push', (callback) => {
    git.push('origin', (err) => {
        if (err) throw err;
    });
    callback();
});

gulp.task('tags', (callback) => {
    git.push('main', { args: ' --tags' }, (err) => {
        if (err) throw err;
    });
    callback();
});

gulp.task('git', gulp.series('add','commit','tags','push'));

/* End of Git */
/* Bump */

/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp patch     # makes v0.1.0 → v0.1.1
 *     gulp minor     # makes v0.1.1 → v0.2.0
 *     gulp major     # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */
 
 function inc(importance) 
 {
    return gulp.src(['./public/data/version.json'])
        .pipe(bump({type: importance}))
        .pipe(gulp.dest('./public/data'))
        .pipe(git.commit('bumps package version'))
        .pipe(filter('package.json'))
        .pipe(tagVersion());
}
 
gulp.task('patch', function() { return inc('patch'); })
gulp.task('minor', function() { return inc('minor'); })
gulp.task('major', function() { return inc('major'); })

gulp.task('tag', shell.task('git push --tags'));

/* End of Bump */
/* Watch */

gulp.task("watch", () => {
    gulp.watch(['./public/css','./public/js'], gulp.series('scripts','minify','styles','uglify'));
});

/* End of Watch */
/* Continous Integration / Countinous Delivery (cicd) */

gulp.task('tests', shell.task('npm test'));
gulp.task('deploy', gulp.series('tests','build','patch','tag','git'));

/* End of Continous Integration / Countinous Delivery (cicd) */
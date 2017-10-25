/*
(C) Copyright Nuxeo Corp. (http://nuxeo.com/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

// Include Gulp & tools we'll use
var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var size = require('gulp-size');

// If needed run:
// npm install --save-dev gulp-load-plugins
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
//var reload = browserSync.reload;
var path = require('path');
var debug = require('gulp-debug');

var DIST = 'target/classes/web/nuxeo.war/ui';

var dist = function(subpath) {
    return !subpath ? DIST : path.join(DIST, subpath);
};

gulp.task('default', function() {
    // place code for your default task here
});

// Clean output directory
gulp.task('clean', function() {
    return del(['.tmp']);
});

// Build production files
gulp.task('build', ['clean'], function(cb) {
    runSequence(
        'vulcanize',
        'strip',
        cb);
});


// Vulcanize granular configuration
gulp.task('vulcanize', function() {
    return gulp.src(dist('webui-customization-elements.html'))
        .pipe($.vulcanize({
            stripComments: true,
            inlineCss: true,
            inlineScripts: true,
            stripExcludes: [dist('bower_components/polymer/polymer.html'),
                dist('bower_components/paper-toast/paper-toast.html')
            ]
        }))
        //.pipe($.minifyInline())
        .pipe(debug({test: 'Foobar'}))
        .pipe(gulp.dest(dist()))
        .pipe($.size({title: 'vulcanize'}));
});

// Strip unnecessary stuff
gulp.task('strip', function() {
    return del([
        dist('bower_components/**'),
        dist('custom-elements/**')
    ]);
});
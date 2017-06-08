var gulp = require('gulp'),
	jshint = require('gulp-jshint');

var gulplog = require('gulp-util').log,
	serverRoot = './',
	serverPort = 8888,
	serverBind = '0.0.0.0',
	serverUri = 'http://localhost:' + serverPort,
	open,
	browser;


gulp.task ('jshint', function(){
	gulp.src('./src/scripts/Script.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('server', function(done) {
	var midlleware = require('connect')()
		.use(require('morgan')('dev'))
		.use(require('compression')())
		.use(require('serve-static')(serverRoot)),
	httpServer = require('http').createServer(midlleware);

	httpServer
		.listen(serverPort, serverBind)
		.on('close', done)
		.on('listening', function() {
			gulplog('Web server started on ' + serverUri + '.');
			if(open) {
				require('open')(serverUri, browser);
			}
		})
		.on('error', function(err) {
			gulplog(err);
		});
});


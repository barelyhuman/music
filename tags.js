
(function(tagger) {
  if (typeof define === 'function' && define.amd) {
    define(function(require, exports, module) { tagger(require('riot'), require, exports, module)})
  } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    tagger(require('riot'), require, exports, module)
  } else {
    tagger(window.riot)
  }
})(function(riot, require, exports, module) {
var axios = require('axios');

riot.tag2('index', '<track-list tracks="{this.tracks}" click="{this.setSource}"></track-list> <track-control trackname="{this.trackname}" audio="{this.audioSrc}"></track-control>', '', '', function(opts) {


	{

	}

	var self = this;

	{

	}

	axios.get('https://alienblogger.github.io/musico-api/tracks/tracks.json').then(function(res){
		self.tracks = res.data;
		self.update();
	});

	{

	}

	this.setSource = function(track){
		if(!track.target){
			this.audioSrc=track.url;
			this.trackname=track.name;
		}
	}.bind(this)

});
riot.tag2('track-control', '<audio id="audio"></audio> <div class="player"> <div class="album-details"> {opts.trackname||⁗Select a track...⁗} </div> <div class="player-controls"> <div class="seek-bar"> <div>{this.playedTime || ⁗00.00⁗}</div> <div class="seek"> <div id="progress"></div> </div> <div>{this.totalDuration || ⁗00.00⁗}</div> </div> <div class="player-buttons"> <div><i class="typcn typcn-media-rewind"></i></div> <div style="font-size:40px" onclick="{togglePlay}"><i class="{this.playing?\'typcn typcn-media-pause-outline active-btn\':\'typcn typcn-media-play-outline\'}"></i></div> <div><i class="typcn typcn-media-fast-forward"></i></div> </div> <div class="volume-bar"></div> </div> </div>', '', 'class="track-control"', function(opts) {


	var self = this;

	this.on("mount",function(){
		this.audio = document.getElementById('audio');
		this.progress = document.getElementById('progress');
	});

	this.on('update',function(){
		if(opts.audio && opts.audio !== this.audio.src){
			this.audio.src=opts.audio;
			this.playing = true;
			this.audio.play();
		}

		this.audio.onloadedmetadata = function(){
			self.totalDuration = secsToTime(this.duration);
			self.seekposition = 10;
			self.update();
		}

		this.audio.onplaying=function(){
			self.playing = true;
		}

		this.audio.ontimeupdate = function(){
			self.playedTime = secsToTime(this.currentTime);
			self.progress.style.width = (this.currentTime/this.duration)*100+"%";
			self.update();
		}

		this.audio.onpause=function(){
			self.playing = false;
		}

	});

	this.play=function(){
		this.audio.currentTime = this.seekTime || 0;
		this.audio.play();
		this.playing = true;
	}

	this.pause=function(){
		this.audio.pause();
		this.seekTime = this.audio.currentTime;
		this.playing = false;
	}

	this.togglePlay=function(){
		!this.playing?this.play():this.pause();
	}

	function secsToTime(secs) {
		var date = new Date(null);
		date.setSeconds(secs);
		var result = date.toISOString().substr(11, 8);
		return result;
	}

});
riot.tag2('track-list', '<div class="list-container" each="{item in opts.tracks}"> <div data-url="{item.source}" data-track="{item.name}" class="list-item" onclick="{changeTrack}">{item.name}</div> </div>', '', '', function(opts) {

	this.changeTrack = function(e){
		var track ={};
		track.name=e.target.dataset.track;
		track.url=e.target.dataset.url;
		return opts.click(track);
	}

});});
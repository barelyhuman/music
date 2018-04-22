
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

riot.tag2('index', '<div class="scroll-container"><track-list tracks="{this.tracks}" click="{this.setSource}"></track-list></div> <track-control prevtrack="{this.prevTrack}" nexttrack="{this.nextTrack}" trackname="{this.trackname}" audio="{this.audioSrc}"></track-control>', '', '', function(opts) {


	var self = this;
	console.log(window.location.href);
	var API = window.location.href.replace('/orion','/musico-api')
	console.log(API);

	axios.get(API+'tracks/tracks.json').then(function(res){
		self.tracks = res.data;
		self.update();
	});

	this.nextTrack = function(){
		var len = this.tracks.length-1;
		if(this.playIndex<len){
			this.setSource(this.playIndex+1)
		}
		else{
			this.setSource(0)
		}
		return;
	}.bind(this)

	this.prevTrack = function(){
		var len = this.tracks.length-1;
		if(this.playIndex<=0){
			this.setSource(len)
		}
		else{
			this.setSource(this.playIndex-1)
		}
		return;
	}.bind(this)

	this.setSource = function(playIndex){
		var track = this.tracks[playIndex];
		if(track){
			this.audioSrc=API.replace('musico-api','')+"/"+track.source;
			this.trackname=track.name;
			this.playIndex = playIndex;
		}
		return;
	}.bind(this)

});
riot.tag2('track-control', '<audio id="audio"></audio> <div class="player"> <div class="album-details"> {opts.trackname||⁗Select a track...⁗} </div> <div class="player-controls"> <div class="seek-bar"> <div class="timestamp">{this.playedTime || ⁗00.00⁗}</div> <div class="seek"> <div id="progress"></div> </div> <div class="timestamp">{this.totalDuration || ⁗00.00⁗}</div> </div> <div class="player-buttons"> <div onclick="{prevTrack}"><i class="typcn typcn-media-rewind"></i></div> <div style="font-size:40px" onclick="{togglePlay}"><i class="{this.playing?\'typcn typcn-media-pause-outline active-btn\':\'typcn typcn-media-play-outline\'}"></i></div> <div onclick="{nextTrack}"><i class="typcn typcn-media-fast-forward"></i></div> </div> <div class="volume-bar"></div> </div> </div>', '', 'class="track-control"', function(opts) {


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

		this.audio.onended = function(){
			self.nextTrack();
			self.audio.src=opts.audio;
		}

	});

	this.nextTrack = function(){
		return opts.nexttrack();
	}

	this.prevTrack = function(){
		return opts.prevtrack()
	}

	this.play=function(){
		if(!opts.audio){
			return;
		}
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
		var result = date.toISOString().substr(14, 5);
		return result;
	}

});
riot.tag2('track-list', '<div class="list-container" each="{item,index in opts.tracks}"> <div class="list-item" onclick="{()=>changeTrack(index)}"> <div>{item.name}</div> <div class="secondary-text">{item.artist}</div> </div> </div>', '', '', function(opts) {

	this.changeTrack = function(index){
		return opts.click(index);
	}

});});

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

riot.tag2('index', '<div class="player-container flex-col"> <div class="tabs"> <div class="tab-item hover-btn cursor-pointer" onclick="{showSearchTab}"><i class="typcn typcn-zoom font-25"></i></div> <div class="tab-item hover-btn cursor-pointer" onclick="{showPlayerTab}"><i class="typcn typcn-notes font-25"></i></div> </div> <div class="search-tab tab-content" show="{tabs.search}"> <searchbar updatedatalist="{this.updateDataList}"></searchbar> <div class="scroll-container max-height-210-px"> <track-list class="full-width" tracks="{this.searchedTracks}" click="{this.addToTrackList}"></track-list> </div> </div> <div class="player-tab tab-content flex" show="{tabs.player}"> <div class="scroll-container"> <track-list tracks="{this.tracks}" click="{this.setSource}"></track-list> </div> <track-control prevtrack="{this.prevTrack}" nexttrack="{this.nextTrack}" trackname="{this.trackname}" durationfromdb="{this.trackDuration}" audio="{this.audioSrc}"></track-control> </div> </div>', '', '', function(opts) {


	const API = "https://orion-server.herokuapp.com/api"
	this.tabs = {
		player:true,
		search:false
	}

	this.updateDataList = function(dataList){
		this.searchedTracks = dataList;
		this.update();
	}.bind(this)

	this.addToTrackList = function(playIndex){
		if(!this.tracks || !this.tracks.length){
			this.tracks = [];
		}
		this.tracks.push(this.searchedTracks[playIndex]);

		this.update();
		if(this.tracks.length === 1){
			this.setSource(0);
		}
	}.bind(this)

	this.showTab = function(tabKey){
		Object.keys(this.tabs).forEach(key=>{
			this.tabs[key]=false;
		});

		this.tabs[tabKey]=true;
	}.bind(this)

	this.showSearchTab = function(){
		this.showTab('search');
	}.bind(this)

	this.showPlayerTab = function(){
		this.showTab('player');
	}.bind(this)

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
			this.audioSrc=API+'/play?audioId='+track.videoId;
			this.trackname=track.title;
			this.playIndex = playIndex;
			this.trackDuration = track.duration.seconds
			this.update();
		}
		return;
	}.bind(this)

});
var axios = require('axios');
var debounce = require('lodash/fp/debounce');

riot.tag2('searchbar', '<input type="text" onkeyup="{apiCall}" onchange="{apiCall}" placeholder="Search Here"> <div> </div>', '', '', function(opts) {

    const API = 'https://orion-server.herokuapp.com/api';

    this.searchTermChanged = function(event){

        if(!event.target.value){
            opts.updatedatalist([]);
        }

        if(event.target.value.length<3){
            return;
        }

        const url = API+'/search?searchTerm='+event.target.value

        axios.get(url)
        .then(data=>{
            opts.updatedatalist(data.data)
        })

    }.bind(this)

    this.apiCall = debounce(250)(this.searchTermChanged)

});
riot.tag2('track-control', '<audio id="audio" autoplay></audio> <div class="player"> <div class="album-details"> {opts.trackname || ⁗Select a track...⁗} </div> <div class="player-controls"> <div class="seek-bar"> <div class="timestamp">{this.playedTime || ⁗00.00.00⁗}</div> <div class="seek"> <div id="progress"></div> </div> <div class="timestamp">{this.totalDuration || ⁗00.00.00⁗}</div> </div> <div class="player-buttons"> <div onclick="{prevTrack}"><i class="typcn typcn-media-rewind"></i></div> <div style="font-size:40px" onclick="{togglePlay}"><i class="{this.playing?\'typcn typcn-media-pause-outline active-btn\':\'typcn typcn-media-play-outline\'}"></i></div> <div onclick="{nextTrack}"><i class="typcn typcn-media-fast-forward"></i></div> </div> <div class="volume-bar"></div> </div> </div>', '', 'class="track-control"', function(opts) {

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
			let durationToUse = 0;
			if(!isNaN(this.duration)){
				if(this.duration>opts.durationfromdb){
					durationToUse = opts.durationfromdb;
				}else{
					durationToUse = this.duration;
				}
			}

			self.totalDurationInSecs = durationToUse;
			self.totalDuration = secsToTime(durationToUse);
			self.update();
		}

		this.audio.onerror = function(){
			const {code,message}=self.audio.error;
			console.log(code+":"+message);
		}

		this.audio.onplaying=function(){
			self.playing = true;
		}

		this.audio.ontimeupdate = function(){
			self.playedTime = secsToTime(this.currentTime);
			self.progress.style.width = (this.currentTime/self.totalDurationInSecs)*100+"%";
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
		var result = date.toISOString().substr(11, 8);
		return result;
	}

});
riot.tag2('track-list', '<div class="list-container"> <div class="list-item" each="{item,index in opts.tracks}" onclick="{()=>changeTrack(index)}"> <div class="primary-item-text">{item.title}</div> <div class="secondary-text">{item.author.name}</div> </div> </div>', '', '', function(opts) {

	this.changeTrack = function(index){
		return opts.click(index);
	}

});});
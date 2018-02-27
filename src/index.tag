var axios = require('axios');

<index>
	<track-list tracks={this.tracks} click={this.setSource}></track-list>
	<track-control prevtrack={this.prevTrack} nexttrack={this.nextTrack} trackname={this.trackname} audio={this.audioSrc}></track-control>


	{
		//variables
	}

	var self = this;	
	var API = "https://aliezsid.github.io/musico-api"

	{
		//life-cycle handlers
	}

	axios.get(API+'/tracks/tracks.json').then(function(res){
		self.tracks = res.data;
		self.update();
	});

	{
		//app handlers
	}
	
	nextTrack(){
		var len = this.tracks.length-1;
		if(this.playIndex<len){
			this.setSource(this.playIndex+1)	
		}
		else{
			this.setSource(0)	
		}
		return;
	}

	prevTrack(){
		var len = this.tracks.length-1;
		if(this.playIndex<=0){
			this.setSource(len)	
		}
		else{
			this.setSource(this.playIndex-1)	
		}
		return;
	}

	setSource(playIndex){
		var track = this.tracks[playIndex];
		if(track){
			this.audioSrc=API.replace('musico-api','')+"/"+track.source;
			this.trackname=track.name;	
			this.playIndex = playIndex;		
		}
		return;
	}
	
</index>
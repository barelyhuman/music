var axios = require('axios');

<index>
	<div class="scroll-container"><track-list tracks={this.tracks} click={this.setSource}></track-list></div>
	<track-control prevtrack={this.prevTrack} nexttrack={this.nextTrack} trackname={this.trackname} audio={this.audioSrc}></track-control>

	<script>	

	
		//variables
	

	var self = this;	
	console.log(window.location.href);
	var API = window.location.href.replace('/orion','/musico-api')
	console.log(API);

	
		//life-cycle handlers
	

	axios.get(API+'tracks/tracks.json').then(function(res){
		self.tracks = res.data;
		self.update();
	});

	
		//app handlers
	
	
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
	
	</script>
	
</index>
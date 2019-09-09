var axios = require('axios');

<index>
	<searchbar updatedatalist={this.updateDataList}></searchbar>
	<div class="player-container">
		<div class="scroll-container"><track-list tracks={this.tracks} click={this.setSource}></track-list></div>
	<track-control prevtrack={this.prevTrack} nexttrack={this.nextTrack} trackname={this.trackname} durationfromdb={this.trackDuration} audio={this.audioSrc}></track-control>
	</div>

	<script>	

	
	//variables
	const API = 'https://orion-server.herokuapp.com/api'
		//app handlers
	
	updateDataList(dataList){
		this.tracks = dataList;
		this.update();
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
			this.audioSrc=API+'/play?audioId='+track.videoId;
			this.trackname=track.title;	
			this.playIndex = playIndex;		
			console.log(track);
			this.trackDuration = track.duration.seconds
			this.update();
		}
		return;
	}
	
	</script>
	
</index>
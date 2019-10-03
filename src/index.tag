var axios = require('axios');

<index>
	<div class="player-container flex-col">
		<div class="tabs">
			<div class="tab-item hover-btn cursor-pointer" onclick={showSearchTab}><i class="typcn typcn-zoom font-25"></i></div>
			<div class="tab-item hover-btn cursor-pointer" onclick={showPlayerTab}><i class="typcn typcn-notes font-25"></i></div>
		</div>
		<div class="search-tab tab-content" show={tabs.search}>	
		<searchbar updatedatalist={this.updateDataList}></searchbar>
		<div class="scroll-container max-height-210-px">
		<track-list class="full-width" tracks={this.searchedTracks} click={this.addToTrackList}></track-list>
		</div>
		</div>
		<div class="player-tab tab-content flex" show={tabs.player}>
		<div class="scroll-container">
			<track-list tracks={this.tracks} click={this.setSource}></track-list>
		</div>
		<track-control prevtrack={this.prevTrack} nexttrack={this.nextTrack} trackname={this.trackname} durationfromdb={this.trackDuration} audio={this.audioSrc}></track-control>
		</div>
	</div>

	<script>	

	
	//variables
	const API = "https://orion-server.herokuapp.com/api"
	this.tabs = {
		player:true,
		search:false
	}

	//app handlers
	
	updateDataList(dataList){
		this.searchedTracks = dataList;
		this.update();
	}

	addToTrackList(playIndex){
		if(!this.tracks || !this.tracks.length){
			this.tracks = [];
		}
		this.tracks.push(this.searchedTracks[playIndex]);

		this.update();
		if(this.tracks.length === 1){
			this.setSource(0);
		}
	}

	showTab(tabKey){
		Object.keys(this.tabs).forEach(key=>{
			this.tabs[key]=false;
		});

		this.tabs[tabKey]=true;
	}

	showSearchTab(){
		this.showTab('search');
	}

	showPlayerTab(){
		this.showTab('player');
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
			this.trackDuration = track.duration.seconds
			this.update();
		}
		return;
	}
	
	</script>
	
</index>
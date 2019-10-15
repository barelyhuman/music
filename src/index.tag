var axios = require('axios');
var Toastify = require('toastify-js');

<index>
	<div class="player-container flex-col">
		<div class="tabs">
			<div class="tab-item cursor-pointer" onclick={showSearchTab}><i class="typcn typcn-zoom font-25"></i></div>
			<div class="tab-item cursor-pointer" onclick={showPlayerTab}><i class="typcn typcn-notes font-25"></i></div>
		</div>
		<div class="search-tab tab-content" show={tabs.search}>	
		<searchbar updatedatalist={this.updateDataList}></searchbar>
		<div class="scroll-container max-height-210-px mobile-max-height-80vh">
		<selection-list class="full-width" tracks={this.searchedTracks} click={this.addToTrackList}></selection-list>
		</div>
		</div>
		<div class="player-tab tab-content flex" show={tabs.player}>
		<div class="scroll-container mobile-max-height-45vh">
			<track-list tracks={this.tracks} click={this.setSource} removetrack={this.removeTrackClick} placeholder="Search tracks to add them here"></track-list>
		</div>
		<track-control prevtrack={this.prevTrack} playindex={this.playIndex} nexttrack={this.nextTrack} trackname={this.trackname} durationfromdb={this.trackDuration} audio={this.audioSrc}></track-control>
		</div>
	</div>

	<script>	

	
	//variables
	const API = "https://orion-server.herokuapp.com/api"
	
	this.tabs = {
		player:true,
		search:false
	}

	this.tracks = [];

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

		Toastify({
  			text: "Added to Track List",			
			backgroundColor:"#000",
			gravity:"bottom",
			position:"right",
			className:"toast-class"
		}).showToast();


		this.update();
		this.updateTrackList();
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
			this.trackDuration = track.duration.seconds
		}else if (playIndex === -1 ){
			this.audioSrc = '';
			this.trackname = 'Add a track...';
			this.trackDuration = 0
			
		}

		this.playIndex = playIndex;
		document.title = this.trackname;
		this.update();
		this.updateTrackList();
		return;
	}

	removeTrackClick(removalIndex){
		this.tracks = this.tracks.filter((item,index)=>removalIndex!==index);
	
		if(removalIndex === this.playIndex){
			this.nextTrack();
		}
		if(!this.tracks.length){
			this.setSource(-1);
		}

	}


	updateTrackList(){
		window.localStorage.setItem('tracks',JSON.stringify(this.tracks));
	}

	readTrackList(){
		const tracks = JSON.parse(window.localStorage.getItem('tracks'));

		if(tracks){
			this.tracks = tracks;
			this.update();
		}
	}

	this.readTrackList()
	
	</script>
	
</index>
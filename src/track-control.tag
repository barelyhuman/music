<track-control class="track-control">

	<audio id="audio" autoplay></audio>
	<div class="player">
		<div class="album-details">
		{opts.trackname || "Add a track..." }
		</div>
		<div class="player-controls">
			<div class="seek-bar">
				<div class="timestamp">{ this.playedTime || "00.00.00"}</div>
				<div class="seek">
					<div id="progress"></div>
				</div>
				<div class="timestamp">{ this.totalDuration || "00.00.00"}</div>
			</div>
			<div class="player-buttons"> 
				<div onclick={prevTrack}><i class="typcn typcn-media-rewind"></i></div>
				<div style="font-size:40px" onclick={togglePlay}><i class={this.playing?'typcn typcn-media-pause-outline active-btn':'typcn typcn-media-play-outline'}></i></div>
				<div onclick={nextTrack}><i class="typcn typcn-media-fast-forward"></i></div>
			</div>
			<div class="volume-bar"></div>
		</div>
	</div>

<script>

		var self = this;

	this.on("mount",function(){
		this.audio = document.getElementById('audio');
		this.progress = document.getElementById('progress');
	});

	this.on('update',function(){
		if(opts.audio && opts.audio !== this.audio.src){		
			this.audio.src=opts.audio;
			this.playing = true;
			this.audio.load();
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
			self.audio.play();
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
			self.update();
			self.audio.load();
			self.audio.play();
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

</script>



</track-control>
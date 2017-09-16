<track-control class="track-control">

	<audio id="audio"></audio>
	<div class="player">
		<div class="album-details">
		{opts.trackname||"Select a track..." }
		</div>
		<div class="player-controls">
			<div class="seek-bar">
				<div>{ this.playedTime || "00.00"}</div>
				<div class="seek">
					<div id="progress"></div>
				</div>
				<div>{ this.totalDuration || "00.00"}</div>
			</div>
			<div class="player-buttons"> 
				<div><i class="typcn typcn-media-rewind"></i></div>
				<div style="font-size:40px" onclick={togglePlay}><i class={this.playing?'typcn typcn-media-pause-outline active-btn':'typcn typcn-media-play-outline'}></i></div>
				<div><i class="typcn typcn-media-fast-forward"></i></div>
			</div>
			<div class="volume-bar"></div>
		</div>
	</div>


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

</track-control>
var axios = require('axios');

<index>
	<track-list tracks={this.tracks} click={this.setSource}></track-list>
	<track-control trackname={this.trackname} audio={this.audioSrc}></track-control>


	{
		//variables
	}

	var self = this;	

	{
		//life-cycle handlers
	}

	axios.get('https://alienblogger.github.io/musico-api/tracks/tracks.json').then(function(res){
		self.tracks = res.data;
		self.update();
	});

	{
		//app handlers
	}

	setSource(track){
		if(!track.target){
			this.audioSrc=track.url;
			this.trackname=track.name;	
		}	
	}
	
</index>
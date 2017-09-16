<track-list>
	<div class="list-container" each={item in opts.tracks} >
		<div data-url={item.source} data-track={item.name} class="list-item" onclick={changeTrack} >{item.name}</div>
	</div>

	this.changeTrack = function(e){
		var track ={};
		track.name=e.target.dataset.track;
		track.url=e.target.dataset.url;
		return opts.click(track);		
	}


</track-list>
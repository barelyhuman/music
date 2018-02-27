<track-list>
	<div class="list-container" each={item,index in opts.tracks} >
		<div class="list-item" onclick={()=>changeTrack(index)} >
			<div>{item.name}</div>
			<div class="secondary-text">{item.artist}</div>
		</div>
	</div>

	this.changeTrack = function(index){
		return opts.click(index);		
	}


</track-list>
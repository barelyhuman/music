<selection-list>
	<div class="list-container" >
		<div class="list-item placeholder" if={showPlaceholder()} >
			<div class="primary-item-text">{opts.placeholder}</div>
		</div>
		<div class="list-item" each={item,index in opts.tracks} onclick={()=>changeTrack(index)} >
			<div class="primary-item-text">{item.title}</div>
			<div class="secondary-text">{item.author.name}</div>
		</div>
	</div>

	this.changeTrack = function(index){
		return opts.click(index);		
	}

	this.showPlaceholder = function(){
		return (!opts.tracks || !opts.tracks.length) && opts.placeholder; 
	}


</selection-list>
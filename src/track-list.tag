<track-list>
	<div class="list-container" >
		<div class="list-item placeholder" if={showPlaceholder()} >
			<div class="primary-item-text">{opts.placeholder}</div>
		</div>
		<div class="list-item" each={item,index in opts.tracks} onclick={()=>changeTrack(index)} >
			<div class="primary-item-text">{item.title}</div>
			<div class="secondary-text">
			{item.author.name}
				<span class="margin-left-sm danger-text font-size-14-px" onclick={removeTrack}>
					<small>Remove Track</small>
				</span>
			</div>
		</div>
	</div>

	this.changeTrack = function(index){
		return opts.click(index);		
	}

	this.removeTrack = function(e){
		e.stopPropagation();
		return opts.removetrack(e.item.index);
	}

	this.showPlaceholder = function(){
		return (!opts.tracks || !opts.tracks.length) && opts.placeholder; 
	}


</track-list>
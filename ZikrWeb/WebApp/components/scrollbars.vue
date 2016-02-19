<template>
	<div class="scrollbars" @mouseover="showScroll">
		<div class="content" @wheel="scroll($event)" :style="{ 'transform': 'translate3d(0, '+step+'px, 0)' }">
			<slot></slot>
		</div>
		<div class="bar-wrap">
			<div class="bar" v-show="!hideScroll" :style="{'height': ''+scrollHeight+'%', 'top': ''+scrollOffset+'%'}"></div>
		</div>
	</div>
</template>
<script>
	export default {
	  data: function(){
	  	return {
	  		step: 0,
	  		scrollHeight: 0,
	  		scrollOffset: 0
	  	}
	  },
	  props: {
	  	scrollSteps: {
	  		default: 50
	  	}
	  },
	  methods: {
	  	scroll: function(e){
	  		// First ScrollBar
	  		this.scrollOffset = Math.floor(this.step/this.$el.children[0].clientHeight*100*-1);

	  		// Second Content Scrolling
	  		if(e.deltaY >= 0){
	  			// If Scrolling Up
	  			this.step = this.step - this.scrollSteps; // Scroll Content
	  			// Chack If Reached To Bottom
	  			if(this.step <= (this.$el.children[0].clientHeight-this.$el.clientHeight)*-1){
	  				this.step = (this.$el.children[0].clientHeight-this.$el.clientHeight)*-1;
	  			}	  			
	  		}else{
	  			// If Scrolling Down
	  			this.step = this.step + this.scrollSteps;
	  			// Chack If Reached To Top
	  			if(this.step >= 0){
	  				this.step = 0;
	  			}
	  		}
	  	}, 
	  	showScroll: function(){
	  		this.scrollHeight = this.$el.clientHeight/this.$el.children[0].clientHeight*100;
	  	}
	  }
	}
</script>
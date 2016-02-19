<template>
	<div class="search-box">
		<input type="text" placeholder="Search" v-model="searchBoxName">
	</div>
</template>
<script>
	export default {
		props: ['searchBoxName']
	}
</script>
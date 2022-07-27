<script>
export default{
	props: {
		categoryTitle: String
	}
}
</script>

<template>
	<div class="px-2 py-1 my-1">
		<input type="checkbox" :id="categoryTitle" :value="categoryTitle" v-model="visibleCategories" class="mr-2">
		<label :for="categoryTitle">{{ categoryTitle }}</label>
	</div>
</template>
<script>
import { CalendarIcon } from '@heroicons/vue/solid'

export default {
  components: { CalendarIcon },
  props: {
	title: String,
	dateTime: String,
	category: String
  }
}
</script>

<template>
	<a href="#" class="flex flex-row justify-between py-2 px-4 text-gray-200 hover:bg-gray-800 my-1 rounded-lg cursor-pointer w-96">
		<div class="flex flex-row-reverse gap-2">
			<h3 class="font-regular">{{ title }}</h3>
			<h4>{{ category }}</h4>
		</div>
		<div class="flex items-center text-gray-300 text-sm">
			<CalendarIcon class="h-4 w-4 mr-2"/>
			<div>{{ dateTime }}</div>
		</div>
	</a>
</template>
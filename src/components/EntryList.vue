<script>
import Entry from './Entry.vue'
import Badge from './Badge.vue'
import { CalendarIcon } from '@heroicons/vue/solid'

export default {
  	components: {
    CalendarIcon,
    Entry,
    Badge
},
	props: {
		title: String,
		entries: Array
	}
}
</script>

<template>
	<div v-if="entries.length > 0">
		<div class="flex flex-row justify-between items-center mx-4 [@supports(backdrop-filter:blur(0))]:mx-0 [@supports(backdrop-filter:blur(0))]:px-4 sm:text-lg font-medium font-sans-rounded text-gray-100 sticky top-0 [@supports(backdrop-filter:blur(0))]:bg-gray-900/30 bg-gray-900/70 -mt-2 pt-2 -mb-1 pb-1 [@supports(backdrop-filter:blur(0))]:border-b-0 border-b border-gray-800 backdrop-blur-sm">
			<h2 class="uppercase">{{ title }}</h2>
			<Badge :count="entries.length"/>
		</div>
		<div v-for="entry in entries">
			<Entry :title="entry.title" :category="entry.lva" :date-time="entry.date"/>
		</div>
	</div>
</template>
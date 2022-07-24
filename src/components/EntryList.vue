<script>
import Entry from './Entry.vue'
import { CalendarIcon } from '@heroicons/vue/solid'

export default {
  	components: {
		CalendarIcon,
		Entry
	},
	props: {
		title: String,
		entries: Array
	}
}
</script>

<template>
	<div v-if="entries.length > 0">
		<h2 class="mx-4 text-lg font-medium font-sans-rounded uppercase text-gray-100 sticky top-0 bg-gray-900/60 -mt-2 pt-2 -mb-1 pb-1 border-b border-gray-800">{{ title }} ({{ entries.length }})</h2>
		<div v-for="entry in entries">
			<Entry :title="entry.title" :category="entry.lva" :date-time="entry.date"/>
		</div>
	</div>
</template>
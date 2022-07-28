<script>
import { CalendarIcon } from '@heroicons/vue/solid'

export default {
	components: { CalendarIcon },
	props: {
		title: String,
		dateTime: Date,
		category: String
	},
	methods: {
        weekDay(date) {
            const weekday = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
            return weekday[date.getDay()];
        },
	}
}
</script>

<template>
	<a href="#" class="flex flex-row justify-between py-2 px-4 text-gray-200 hover:bg-gray-800 my-1 rounded-lg cursor-pointer w-full gap-4">
		<div class="flex flex-row-reverse gap-2 sm:gap-4 grow text-sm sm:text-base">
			<h3 class="flex-1 line-clamp-1">{{ title }}</h3>
			<h4 class="text-gray-300">{{ category }}</h4>
		</div>
		<div class="flex items-center text-gray-300 text-sm shrink-0">
			<CalendarIcon class="h-4 w-4 mr-2 hidden sm:inline"/>
			<div>
				<span class="hidden sm:inline">{{ weekDay(dateTime) }}&nbsp;</span>
				<span class="sm:hidden">{{ dateTime.toLocaleDateString("de-AT", {dateStyle: "short"}) }}&nbsp;</span>
				<span class="hidden sm:inline">{{ dateTime.toLocaleDateString("de-AT", {dateStyle: "medium"}) }} · </span>
				<span class="sm:hidden">{{ dateTime.toLocaleString("de-DE", {"timeStyle": "short"}) }}</span>
				<span class="hidden sm:inline">{{ dateTime.toLocaleString("de-DE", {"timeStyle": "medium"}) }}</span>
			</div>
		</div>
	</a>
</template>
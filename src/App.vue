<script>
import Entry from './components/Entry.vue'
import { SparklesIcon } from '@heroicons/vue/outline'
import { CalendarIcon } from '@heroicons/vue/solid'

export default {
	components: {
		'SparklesIcon': SparklesIcon,
		'Entry': Entry },
    data() {
        return {
			categories: new Set(),
			visibleCategories: new Set(),
			datedSections: {
				today: [],
				currentWeek: [],
				nextWeek: []
			},
            entries: [
                {
                    date: new Date(2022, 8, 22, 16),
                    title: "Entry A",
                    lva: "AGD"
                },
                {
                    date: new Date(2022, 5, 22, 16),
                    title: "Entry B",
                    lva: "FMO"
                },
                {
                    date: new Date(2022, 9, 23, 20),
                    title: "Entry C",
                    lva: "FMO"
                },
                {
                    date: new Date(2022, 10, 22, 16),
                    title: "Entry D",
                    lva: "ADM"
                },
				{
					date: new Date(),
					title: "new Date() - 1",
					lva: "OOM"
				},
				{
					date: new Date(),
					title: "new Date() - 2",
					lva: "OOM"
				}
            ],
            entriesAdvanced: [
                {
                    date: new Date(2022, 6, 18, 20),
                    title: "TUWEL-Tests",
                    tissCode: "186866",
                    exam: false,
                    lvaName: "AGD",
                    url: "https://tuwel.tuwien.ac.at",
                    semester: "2022S"
                },
                {
                    date: new Date(2022, 8, 22, 16),
                    title: "2. Termin",
                    tissCode: "185A06",
                    exam: false,
                    lvaName: "AGD",
                    url: "https://tiss.tuwien.ac.at",
                    semester: "2022S"
                },
                {
                    date: new Date(2022, 8, 22, 16),
                    title: "2. Termin",
                    tissCode: "185A06",
                    exam: false,
                    lvaName: "AGD",
                    url: "https://tiss.tuwien.ac.at",
                    semester: "2022S"
                },
                {
                    date: new Date(2022, 8, 22, 16),
                    title: "2. Termin",
                    tissCode: "185A06",
                    exam: false,
                    lvaName: "AGD",
                    url: "https://tiss.tuwien.ac.at",
                    semester: "2022S"
                }
            ],
        };
    },
	computed: {
		VisibleEntriesNew() {
			let categories = this.visibleCategories;

			return this.entries.filter(entry => categories.has(entry.lva));
		},
		visibleEntries() {
			let arr = new Array();

			for(let i = 0; i < this.entries.length; i++) {
				if(this.visibleCategories.has(this.entries[i].lva)) {
					arr.push(this.entries[i]);
				}
			}

			return arr;
		},
		VisibleEntriesToday() {
			console.log(this.VisibleEntries);

			return this.VisibleEntries.filter(entry => {
				let entryDate = entry.date.setUTCHours(0, 0, 0, 0);
				let currentDate = new Date();
				currentDate = currentDate.setUTCHours(0, 0, 0, 0);

				console.log(entryDate);
				console.log(currentDate);


				return entryDate === currentDate;
			});
		}
	},
    methods: {
        getDay(datePar) {
            const weekday = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
            return weekday[datePar.getDay()];
        },
        dateToString(datePar) {
            const weekday = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
            let day = weekday[datePar.getDay()];
            return day + " " + datePar.toLocaleDateString("de-AT") + " · " + datePar.toLocaleTimeString("de-AT");
        },
		categoryContained(lvaToSearch) {
			for(let i = 0; i < visibleCategories.length; i++) {
				if(lvaToSearch === visibleCategories[i]) {
					return true;
				}
			}

			return false;
		},
		toggleCategory(lva) {
			if(this.visibleCategories.has(lva)) {
				this.visibleCategories.delete(lva);
			} else {
				this.visibleCategories.add(lva);
			}
		},
		daysTillNextSunday(date) {
			switch(this.getDay(date)) {

			}
		}
    },
	mounted() {
		this.entries.sort((a, b) => {
			return a.date - b.date;
		});

		this.entries = this.entries.filter((entry) => (entry.date >= new Date()));

		for(let i = 0; i < this.entries.length; i++) {
			this.visibleCategories.add(this.entries[i].lva);
			this.categories.add(this.entries[i].lva);
		}
	}
}
</script>

<template>
	<div class="w-full h-full bg-gray-900">
		<main class="min-h-screen text-gray-100 mx-auto py-2 max-w-fit flex flex-row gap-8">
			<aside>
				<div class="sticky top-2">
					<!-- <div v-for="category in categories">
						<button @click="toggleCategory(category)">Toggle {{ category }}</button>
						<br>
					</div> -->
					<div v-for="category in categories">
						<input type="checkbox" :id="category" :value="category" v-model="visibleCategories" class="mr-2">
						<label :for="category">{{ category }}</label>
					</div>
				</div>
			</aside>
			<section v-if="visibleEntries.length > 0" class="flex flex-col gap-2">
				<div>
					<h2 class="mx-4 text-lg font-medium font-sans-rounded uppercase text-gray-100 sticky top-0 bg-gray-900/80 backdrop-blur-md -mt-2 pt-2 -mb-1 pb-1 border-b border-gray-800">Heute</h2>
					<div v-for="entry in visibleEntriesToday">
						<Entry :title="entry.title" :category="entry.lva" :date-time="dateToString(entry.date)"/>
					</div>
				</div>
				<div>
					<h2 class="mx-4 text-lg font-medium font-sans-rounded uppercase text-gray-100 sticky top-0 bg-gray-900/80 backdrop-blur-md -mt-2 pt-2 -mb-1 pb-1 border-b border-gray-800">Diese Woche</h2>
					<div v-for="entry in visibleEntries">
						<Entry :title="entry.title" :category="entry.lva" :date-time="dateToString(entry.date)"/>
					</div>
				</div>
				<div>
					<h2 class="mx-4 text-lg font-medium font-sans-rounded uppercase text-gray-100 sticky top-0 bg-gray-900/80 backdrop-blur-md -mt-2 pt-2 -mb-1 pb-1 border-b border-gray-800">Nächste Woche</h2>
					<div v-for="entry in visibleEntries">
						<Entry :title="entry.title" :category="entry.lva" :date-time="dateToString(entry.date)"/>
					</div>
				</div>
				<div>
					<h2 class="mx-4 text-lg font-medium font-sans-rounded uppercase text-gray-100 sticky top-0 bg-gray-900/80 backdrop-blur-md -mt-2 pt-2 -mb-1 pb-1 border-b border-gray-800">Übernächste Woche</h2>
					<div v-for="entry in visibleEntries">
						<Entry :title="entry.title" :category="entry.lva" :date-time="dateToString(entry.date)"/>
					</div>
				</div>
				<div>
					<h2 class="mx-4 text-lg font-medium font-sans-rounded uppercase text-gray-100 sticky top-0 bg-gray-900/80 backdrop-blur-md -mt-2 pt-2 -mb-1 pb-1 border-b border-gray-800">Später</h2>
					<div v-for="entry in visibleEntries">
						<Entry :title="entry.title" :category="entry.lva" :date-time="dateToString(entry.date)"/>
					</div>
					<div v-for="entry in visibleEntries">
						<Entry :title="entry.title" :category="entry.lva" :date-time="dateToString(entry.date)"/>
					</div>
					<div v-for="entry in visibleEntries">
						<Entry :title="entry.title" :category="entry.lva" :date-time="dateToString(entry.date)"/>
					</div>
				</div>
			</section>
			<section v-else class="h-fit flex flex-row text-gray-300 items-center content-start">
				<SparklesIcon class="h-4 w-4 mr-2"/>
				<h2>Keine Einträge im Kalender</h2>
			</section>
		</main>
	</div>
</template>
<script>
import EntryList from './components/EntryList.vue'
import { SparklesIcon } from '@heroicons/vue/outline'
import externalEntries from './assets/testDates.json'

export default {
	components: {
		SparklesIcon,
		EntryList,
	},
    data() {
        return {
			categories: new Set(),
			visibleCategories: new Set(),
			toggleSidebar: false,
			entries: externalEntries,
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
		VisibleEntries() {
			let arr = new Array();

			for(let i = 0; i < this.entries.length; i++) {
				if(this.visibleCategories.has(this.entries[i].lva)) {
					arr.push(this.entries[i]);
				}
			}

			return arr;
		},
		VisibleEntriesToday() {
			return this.VisibleEntries.filter(entry => {
				let entryDate = entry.date;
				let currentDate = new Date();

				return entryDate.toLocaleDateString() === currentDate.toLocaleDateString();
			});
		},
		VisibleEntriesTomorrow() {
			return this.VisibleEntries.filter(entry => {
				let entryDate = new Date(entry.date.getTime());
				entryDate = new Date(entryDate.setHours(0, 0, 0, 0));

				let tomorrowDate = new Date();
				tomorrowDate = new Date(tomorrowDate.setHours(0, 0, 0, 0));
				tomorrowDate.setDate(tomorrowDate.getDate() + 1);

				return entryDate.toLocaleDateString() === tomorrowDate.toLocaleDateString();
			});
		},
		VisibleEntriesThisWeek() {
			// Calculate todays date
			let today = new Date();
			today.setHours(0, 0, 0, 0);

			// Calculate the date of the day after tomorrow (because the entries of today and tomorrow must be ignored)
			let dayAfterTomorrow = new Date(today.getTime());
			dayAfterTomorrow = new Date(dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2));
			
			// Calculate which day in the week it is; (6 - weekDay) calculates the days till next sunday
			// 0 = Monday ... 6 = Sunday
			const weekDay = today.getDay() != 0 ? today.getDay() - 1 : 6;
			
			let nextSunday = new Date(today.getTime());
			nextSunday.setDate(today.getDate() + (6 - weekDay));
			nextSunday.setHours(23, 59, 59, 999);

			// console.log(today);
			// console.log(dayAfterTomorrow);
			// console.log(nextSunday);

			let boundingDays = [new Date(dayAfterTomorrow.getTime()), new Date(nextSunday.getTime())];

			// No days left in current week (already considered without entries of today and tomorrow), return empty array
			if(dayAfterTomorrow.getTime() > nextSunday.getTime()) {
				return new Array();
			}

			return this.VisibleEntries.filter(entry => (entry.date.getTime() >= boundingDays[0].getTime()) && (entry.date.getTime() <= boundingDays[1].getTime()));
		},
		VisibleEntriesNextWeek() {
			// Calculate todays date
			let today = new Date();
			today.setHours(0, 0, 0, 0);

			// Calculate the date of the day after tomorrow (because the entries of today and tomorrow must be ignored)
			let dayAfterTomorrow = new Date(today.getTime());
			dayAfterTomorrow = new Date(dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2));
			
			// Calculate which day in the week it is; (6 - weekDay) calculates the days till next sunday
			// 0 = Monday ... 6 = Sunday
			const weekDay = today.getDay() != 0 ? today.getDay() - 1 : 6;
			
			let nextSunday = new Date(today.getTime());
			nextSunday.setDate(today.getDate() + (6 - weekDay));
			nextSunday.setHours(23, 59, 59, 999);

			let nextNextSunday = new Date(nextSunday.getTime());
			nextNextSunday.setDate(nextSunday.getDate() + 7);

			let boundingDays = [new Date(), new Date(nextNextSunday.getTime())];
			// console.log("today");
			// console.log(today);
			// console.log("dayAfterTomorrow");
			// console.log(dayAfterTomorrow);
			// console.log("nextSunday");
			// console.log(nextSunday);
			// console.log("nextNextSunday");
			// console.log(nextNextSunday);

			if(dayAfterTomorrow.getTime() > nextSunday.getTime()) {
				// console.log("Entry if");
				boundingDays[0] = new Date(dayAfterTomorrow.getTime());
			} else {
				// console.log("Entry else");
				boundingDays[0] = new Date(nextSunday.getTime());
			}

			return this.VisibleEntries.filter(entry => (entry.date.getTime() >= boundingDays[0].getTime()) && (entry.date.getTime() <= boundingDays[1].getTime()));
		},
		VisibleEntriesRemaining() {
			// Calculate todays date
			let today = new Date();
			today.setHours(0, 0, 0, 0);

			// Calculate the date of the day after tomorrow (because the entries of today and tomorrow must be ignored)
			let dayAfterTomorrow = new Date(today.getTime());
			dayAfterTomorrow = new Date(dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2));
			
			// Calculate which day in the week it is; (6 - weekDay) calculates the days till next sunday
			// 0 = Monday ... 6 = Sunday
			const weekDay = today.getDay() != 0 ? today.getDay() - 1 : 6;
			
			let nextMonday = new Date(today.getTime());
			nextMonday.setDate(today.getDate() + (6 - weekDay) + 1);
			nextMonday.setHours(0, 0, 0, 0);

			let boundingDays = [new Date(nextMonday.getTime()), new Date()];
			boundingDays[0].setDate(nextMonday.getDate() + 7);
			
			// console.log(boundingDays[0]);

			return this.VisibleEntries.filter(entry => (entry.date.getTime() >= boundingDays[0].getTime()));
		}
	},
    methods: {
        getDay(datePar) {
            const weekday = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
            return weekday[datePar.getDay()];
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
		},
		convertDateTime(dateTime){
			let arr = dateTime.split(" ");
			
			let date = arr[0].split(".");
			let dd = date[0];
			let mm = date[1]-1;
			let yyyy = date[2];
			
			let time = arr[1].split(":");
			let h = time[0]; 
			let m = time[1];
			let s = parseInt(time[2]); //get rid of that 00.0;
			
			return new Date(yyyy,mm,dd,h,m,s);
		}
	},
	mounted() {
		for(let i = 0; i < this.entries.length; i++) {
			this.entries[i].date = this.convertDateTime(this.entries[i].date);
		}

		this.entries.sort((a, b) => {
			return a.date - b.date;
		});
		
		this.entries = this.entries.filter((entry) => (entry.date >= new Date()));

		for(let i = 0; i < this.entries.length; i++) {
			this.visibleCategories.add(this.entries[i].lva);
			this.categories.add(this.entries[i].lva);
		}

		this.categories.sort((a, b) => {
			if (a > b) {
				return -1;
			}
			if (b > a) {
				return 1;
			}
			return 0;
		});
	}
}
</script>

<template>
	<div class="w-full h-full bg-gray-900 px-2">
		<main class="min-h-screen text-gray-100 mx-auto py-2 max-w-screen-sm flex flex-row gap-4">
			<aside class="shrink-0 hidden sm:block">
				<div class="sticky top-2">
					<!-- <div v-for="category in categories">
						<button @click="toggleCategory(category)">Toggle {{ category }}</button>
						<br>
					</div> -->
					<div v-for="category in categories">
						<div class="px-2 py-1 my-1">
							<input type="checkbox" :id="category" :value="category" v-model="visibleCategories" class="mr-2">
							<label :for="category">{{ category }}</label>
						</div>
					</div>
				</div>
			</aside>
			<aside class="shrink-0 sm:hidden bg-gray-700 absolute">
				<div class="sticky top-2">
					<!-- <div v-for="category in categories">
						<button @click="toggleCategory(category)">Toggle {{ category }}</button>
						<br>
					</div> -->
					<div v-for="category in categories">
						<div class="px-2 py-1 my-1">
							<input type="checkbox" :id="category" :value="category" v-model="visibleCategories" class="mr-2">
							<label :for="category">{{ category }}</label>
						</div>
					</div>
				</div>
			</aside>
			<section v-if="VisibleEntries.length > 0" class="flex flex-col gap-2 w-full">
				<EntryList title="Heute" :entries="VisibleEntriesToday"/>
				<EntryList title="Morgen" :entries="VisibleEntriesTomorrow"/>
				<EntryList title="Diese Woche" :entries="VisibleEntriesThisWeek"/>
				<EntryList title="Nächste Woche" :entries="VisibleEntriesNextWeek"/>
				<EntryList title="Später" :entries="VisibleEntriesRemaining"/>
			</section>
			<section v-else class="h-fit flex flex-row text-gray-300 items-center content-start">
				<SparklesIcon class="h-4 w-4 mr-2"/>
				<h2>Keine Einträge im Kalender</h2>
			</section>
		</main>
	</div>
</template>
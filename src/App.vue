<script>
import EntryList from './components/entries/EntryList.vue'
import { SparklesIcon } from '@heroicons/vue/solid'
import { CogIcon } from '@heroicons/vue/solid'
import { FilterIcon } from '@heroicons/vue/solid'
import externalEntries from './assets/testDates.json'
import { XIcon } from '@heroicons/vue/outline'
import EntryList1 from './components/entries/EntryList.vue'

export default {
	components: {
    SparklesIcon,
    EntryList,
	CogIcon,
    FilterIcon,
    XIcon,
    EntryList1
},
    data() {
        return {
			categories: new Set(),
			visibleCategories: new Set(),
			sidebarToggled: false,
			groupingRules: {
				default: [
					{
						property: "today",
						title: "Heute",
						visible: true,
						end: undefined
					},
					{
						property: "tomorrow",
						title: "Morgen",
						visible: true,
						end: undefined
					},
					{
						property: "thisWeek",
						title: "Diese Woche",
						visible: true,
						end: undefined
					},
					{
						property: "nextWeek",
						title: "Diese Woche",
						visible: true,
						end: undefined
					},
					{
						property: "remaining",
						title: "Später",
						visible: true,
						end: undefined
					}
				],
				loaded: []
			},
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
		presetDays() {
			// Today midnight:
			let today = new Date();
			today = new Date(today.setHours(23, 59, 59, 999));

			const weekDay = today.getDay() != 0 ? today.getDay() - 1 : 6;
			
			// Tomorrow midnight:
			let tomorrow = new Date(today.getTime());
			tomorrow.setDate(tomorrow.getDate() + 1);

			// This week's sunday:
			let nextSunday = new Date(today.getTime());
			nextSunday.setDate(today.getDate() + (6 - weekDay));
			nextSunday.setHours(23, 59, 59, 999);

			// Next week's sunday:
			let nextNextSunday = new Date(nextSunday.getTime());
			nextNextSunday.setDate(nextNextSunday.getDate() + 7);

			return {
				today: today,
				tomorrow: tomorrow,
				thisWeek: nextSunday,
				nextWeek: nextNextSunday,
				remaining: new Date(8640000000000000),
				weekday: weekDay
			}
		},
		VisibleEntries() {
			return this.entries.filter(entry => this.visibleCategories.has(entry.lva));
		},
		VisibleEntriesOld() {
			let arr = new Array();

			for(let i = 0; i < this.entries.length; i++) {
				if(this.visibleCategories.has(this.entries[i].lva)) {
					arr.push(this.entries[i]);
				}
			}

			return arr;
		},
		VisibleEntriesGroups() {
			let visibleEntries = this.VisibleEntries;
			let outputObject = new Array();
			let currentRule;


			for(let i = 0; i < this.groupingRules.loaded.length; i++) {
				currentRule = this.groupingRules.loaded[i];

				outputObject.push({
					property: currentRule.property,
					title: currentRule.title,
					entries: new Array()
				})

				if(currentRule.visible) {
					outputObject[i].entries = visibleEntries.filter(entry => {
						return entry.date.getTime() <= currentRule.end.getTime();
					});
					visibleEntries = visibleEntries.filter(entry => entry.date.getTime() > currentRule.end.getTime());
				}
			}
			return outputObject;
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
	watch: {
		sidebarToggled() {
			document.body.classList.toggle("overflow-hidden");
			console.log("toggled");
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
		// Convert string dateTime into Javascript Date()
		for(let i = 0; i < this.entries.length; i++) {
			this.entries[i].date = this.convertDateTime(this.entries[i].date);
		}

		// Sort entries by date ascending
		this.entries.sort((a, b) => {
			return a.date - b.date;
		});
		
		// Remove entries where the deadline is earlier than the current date
		this.entries = this.entries.filter((entry) => (entry.date >= new Date()));

		// Extract the categories from the active entries (sorted before)
		for(let i = 0; i < this.entries.length; i++) {
			this.visibleCategories.add(this.entries[i].lva);
			this.categories.add(this.entries[i].lva);
		}

		//######################################
		// Load presets from localStorage; CAUTION: May be undefined!
		const LOCAL_STORAGE_KEY = 'appDisplaySettings';
		let loadedSettings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
		let defaultRule, storedRule;
		let newLoadedSettings = new Object;

		if(loadedSettings === null) {
			loadedSettings = new Array();
		}

		for(let i = 0; i < this.groupingRules.default.length; i++) {
			this.groupingRules.default[i].end = this.presetDays[this.groupingRules.default[i].property];
			defaultRule = this.groupingRules.default[i];

			this.groupingRules.loaded[i] = defaultRule;

			if(loadedSettings[defaultRule.property] != undefined) {
				// Found item in localStorage
				this.groupingRules.loaded[i].visible = loadedSettings[defaultRule.property];
			}
			storedRule = this.groupingRules.loaded[i];

			newLoadedSettings[storedRule.property] = storedRule.visible;
		}
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newLoadedSettings));
		//######################################

		// this.categories.sort((a, b) => {
		// 	if (a > b) {
		// 		return -1;
		// 	}
		// 	if (b > a) {
		// 		return 1;
		// 	}
		// 	return 0;
		// });
	}
}
</script>

<template>
	<div id="testtest">

	</div>

	<div v-show="sidebarToggled" class="w-full sm:w-0 h-full sm:h-0 absolute top-0 left-0 z-[5] sm:hidden" @click="sidebarToggled = false"></div>
	<aside v-show="sidebarToggled" class="z-10 fixed bottom-0 left-0 flex flex-col max-h-[75%] w-full p-4 bg-gray-800 text-gray-100 rounded-t-xl">
		<button class="z-[15] absolute top-4 right-4 p-1" @click="sidebarToggled = false">
			<XIcon class="h-6 w-6 text-gray-400"/>
		</button>
		<div class="flex-grow overflow-scroll w-full">
			<div class="flex flex-col columns-2">
				<div v-for="category in categories">
					<div class="px-2 py-1 w-full inline-flex flex-row items-center">
						<input type="checkbox" :id="category" :value="category" v-model="visibleCategories" class="mr-2 accent-sky-600">
						<label :for="category" class="inline-block flex-grow">{{ category }}</label>
					</div>
				</div>
			</div>
		</div>
	</aside>
	
	<div class="w-full h-full bg-gray-900 px-2" :class="{ 'brightness-50 sm:brightness-100': sidebarToggled }">
		<main class="min-h-screen text-gray-100 mx-auto max-w-screen-sm flex flex-row gap-4">
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
			<div class="flex flex-col gap-2 w-full">
				<section v-if="VisibleEntries.length > 0" class="flex-grow sm:flex-grow-0">
					<div v-for="visibleEntryGroup in VisibleEntriesGroups">
						<EntryList :title="visibleEntryGroup.title" :entries="visibleEntryGroup.entries"/>
					</div>
				</section>
				<section v-else class="flex-grow sm:flex-grow-0 inline-flex flex-row text-gray-300 items-center justify-center py-2">
					<SparklesIcon class="h-4 w-4 mr-2"/>
					<h2>Keine Einträge im Kalender</h2>
				</section>
				<div class="flex flex-row pb-4 px-4 mr-10 sm:mr-0 sm:justify-end">
					<button @click="sidebarToggled = true" class="flex-0 z-[5] fixed right-6 bottom-4 rounded-md bg-sky-200 p-1 sm:hidden">
						<FilterIcon class="h-8 w-8 text-sky-800"/>
					</button>
					<button class="flex-grow sm:flex-grow-0 inline-flex items-center justify-center rounded-md bg-blue-900 text-blue-200 p-1 sm:p-2 h-10 mr-4 sm:mr-0 sm:px-4 sm:mb-2 -mt-4">
						<CogIcon class="h-4 w-4 mr-2"/>
						<span>Einstellungen</span>
					</button>
				</div>
			</div>
		</main>
	</div>
</template>
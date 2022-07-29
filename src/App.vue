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
			settingsToggled: false,
			groupingRules: {
				default: [
					{
						property: "today",
						title: "Heute",
						visible: true,
						start: undefined,
						end: undefined
					},
					{
						property: "tomorrow",
						title: "Morgen",
						visible: true,
						start: undefined,
						end: undefined
					},
					{
						property: "thisWeek",
						title: "Diese Woche",
						visible: true,
						start: undefined,
						end: undefined
					},
					{
						property: "nextWeek",
						title: "Nächste Woche",
						visible: true,
						start: undefined,
						end: undefined
					},
					{
						property: "remaining",
						title: "Sonstige",
						visible: true,
						start: undefined,
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

			// Yesterday midnight:
			let yesterday = new Date(today.getTime());
			yesterday.setDate(yesterday.getDate() - 1);

			// This week's sunday:
			let nextSunday = new Date(today.getTime());
			nextSunday.setDate(today.getDate() + (6 - weekDay));
			nextSunday.setHours(23, 59, 59, 999);

			// Next week's sunday:
			let nextNextSunday = new Date(nextSunday.getTime());
			nextNextSunday.setDate(nextNextSunday.getDate() + 7);

			return {
				today: {
					start: yesterday,
					end: today
				},
				tomorrow: {
					start: today,
					end: tomorrow,
				},
				thisWeek: {
					start: yesterday,
					end: nextSunday
				},
				nextWeek: {
					start: nextSunday,
					end: nextNextSunday
				},
				remaining: {
					start: new Date(-8640000000000000),
					end: new Date(8640000000000000)
				}
			}
		},
		VisibleEntries() {
			return this.entries.filter(entry => this.visibleCategories.has(entry.lva));
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
						return (entry.date.getTime() > currentRule.start.getTime()) && (entry.date.getTime() <= currentRule.end.getTime());
					});
					visibleEntries = visibleEntries.filter(entry => !((entry.date.getTime() > currentRule.start.getTime()) && (entry.date.getTime() <= currentRule.end.getTime())));
				}
			}
			return outputObject;
		}
	},
	watch: {
		sidebarToggled() {
			document.body.classList.toggle("overflow-hidden");
		},
		settingsToggled() {
			document.body.classList.toggle("overflow-hidden");
		},
		'groupingRules.loaded': {
			handler(newValue) {
				console.log("rules fired");
				console.log(newValue);

				// for(let i = 0; i < this.groupingRules.loaded)

				const LOCAL_STORAGE_KEY = 'appDisplaySettings';
				// localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.groupingRules.));
			},
			deep: true
		}
	},
    methods: {
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
			this.groupingRules.default[i].start = this.presetDays[this.groupingRules.default[i].property].start;
			this.groupingRules.default[i].end = this.presetDays[this.groupingRules.default[i].property].end;
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

		// Sort categories lexicographically
		const sortedArr = Array.from(this.categories).sort();
		this.categories = new Set(sortedArr);
	}
}
</script>

<template>
	<div v-show="sidebarToggled || settingsToggled" class="fixed w-screen sm:w-0 h-screen sm:h-0 top-0 left-0 z-[5] backdrop-saturate-50 sm:hidden" @click="sidebarToggled = false, settingsToggled = false"></div>
	<div class="flex flex-row sm:hidden">
		<aside v-show="sidebarToggled" class="flex-grow z-10 fixed bottom-4 left-4 right-4 flex flex-col max-h-[75%] p-4 bg-gray-800 text-gray-100 rounded-xl">
			<div>
				<h2 class="text-center font-medium uppercase pb-1">Filtern</h2>
				<button class="z-[15] absolute top-3 right-4 p-1" @click="sidebarToggled = false">
					<XIcon class="h-6 w-6 text-gray-400"/>
				</button>
			</div>
			<div class="flex-grow overflow-scroll w-full">
				<div class="flex flex-col px-2 gap-2">
					<div v-for="category in categories">
						<div class="w-full inline-flex flex-row items-center">
							<input type="checkbox" :id="category" :value="category" v-model="visibleCategories" class="mr-2 accent-sky-600">
							<label :for="category" class="inline-block flex-grow text-gray-300">{{ category }}</label>
						</div>
					</div>
				</div>
			</div>
		</aside>
		<aside v-show="settingsToggled" class="flex-grow z-10 fixed bottom-4 left-4 right-4 flex flex-col max-h-[75%] p-4 bg-gray-800 text-gray-100 rounded-xl">
			<div>
				<h2 class="text-center font-medium uppercase pb-1">Einstellungen</h2>
				<button class="z-[15] absolute top-3 right-4 p-1" @click="settingsToggled = false">
					<XIcon class="h-6 w-6 text-gray-400"/>
				</button>
			</div>
			<div class="flex-grow overflow-scroll w-full">
				<div class="flex flex-col px-2 gap-2">
					<div v-for="category in categories">
						<div class="w-full inline-flex flex-row items-center">
							<input type="checkbox" :id="category" :value="category" v-model="visibleCategories" class="mr-2 accent-sky-600">
							<label :for="category" class="inline-block flex-grow text-gray-300">{{ category }}</label>
						</div>
					</div>
				</div>
			</div>
		</aside>
	</div>
	
	<div class="w-full h-full bg-gray-900 px-2" :class="{ 'brightness-50 sm:brightness-100': sidebarToggled || settingsToggled }">
		<main class="min-h-screen text-gray-100 mx-auto max-w-screen-sm flex flex-row gap-4">
			<aside class="shrink-0 hidden sm:block">
				<div class="sticky top-2">
					<div v-for="category in categories">
						<div class="px-2 py-1 my-1">
							<input type="checkbox" :id="category" :value="category" v-model="visibleCategories" class="mr-2 accent-sky-600">
							<label :for="category">{{ category }}</label>
						</div>
					</div>
				</div>
			</aside>
			<div class="flex flex-col gap-2 w-full">
				<section v-if="VisibleEntries.length > 0" class="flex-grow sm:flex-grow-0 pt-2">
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
					<button @click="settingsToggled = true" class="flex-grow sm:flex-grow-0 inline-flex items-center justify-center rounded-md bg-blue-900 text-blue-200 p-1 sm:p-2 h-10 mr-4 sm:mr-0 sm:px-4 sm:mb-2 -mt-4">
						<CogIcon class="h-4 w-4 mr-2"/>
						<span>Einstellungen</span>
					</button>
				</div>
			</div>
		</main>
	</div>
</template>
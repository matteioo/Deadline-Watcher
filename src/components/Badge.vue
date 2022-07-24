<script>

export default {
	props: {
		count: Number
	}
}
</script>

<template>
	<div class="h-fit px-2 py-1 rounded-full text-sm leading-none text-center bg-sky-800 text-sky-200">
		{{ count }}
	</div>
</template>
<script lang="ts">
	import StatsUi from "$features/stats/components/stats-ui.svelte";

	let mode: 'GENERAL' | 'VINE' = $state('GENERAL');
</script>

<StatsUi {mode}/>
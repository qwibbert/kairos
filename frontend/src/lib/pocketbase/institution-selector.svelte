<script lang="ts">

	import i18next from 'i18next';
	import { client } from '.';

	let { selected_institution = $bindable() }: { selected_institution: string | undefined } =
		$props();

	const institutions_promise = client.collection('institutions').getFullList();
</script>

{#await institutions_promise}
	<select class="select">
		<option disabled selected>{i18next.t('vines:loading_institutions')}</option>
	</select>
{:then institutions}
	<select bind:value={selected_institution} class="select">
		{#each institutions as institution (institution.id)}
			<option value={institution.id}>{institution.name} ({institution.country})</option>
		{/each}
	</select>
{:catch}
	<select class="select select-error">
		<option disabled selected>{i18next.t('vines:error_institutions_fetch')}</option>
	</select>
{/await}

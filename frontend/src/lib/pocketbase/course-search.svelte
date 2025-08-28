<script lang="ts">
	import type { ListResult } from 'pocketbase';
	import { _ } from 'svelte-i18n';
	import { get } from 'svelte/store';

	import { client } from '.';
	import type { CoursesResponse } from './pocketbase-types';

	interface Props {
		courses_result: ListResult<CoursesResponse> | 'ERROR' | undefined;
		loading_results: boolean;
		institution: string | undefined;
		page?: number;
		page_count?: number;
		item_count?: number;
	}

	let {
		courses_result = $bindable(),
		loading_results = $bindable(),
		institution,
		page = $bindable(),
		page_count = $bindable(),
		item_count = $bindable(),
	}: Props = $props();
	let search_string: string = $state('');

	async function run_search() {
		loading_results = true;

		courses_result = await client
			.collection('courses')
			.getList(page, 5, {
				filter: client.filter(
					'(title ~ {:search} || course_code ~ {:search} || instructor ~ {:search}) && institution = {:institution}',
					{ search: search_string, institution },
				),
			})
			.catch(() => 'ERROR');

		if (courses_result != 'ERROR') {
			page_count = courses_result.totalPages;
			item_count = courses_result.totalItems;
		}

		loading_results = false;
	}

	$effect(() => {
		if (page && search_string) {
			run_search();
		}
	});
</script>

<input
	type="text"
	disabled={!institution}
	class="input"
	placeholder={get(_)('search_course')}
	bind:value={search_string}
	onchange={run_search}
/>

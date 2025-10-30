<script lang="ts">
	import i18next from 'i18next';
	import BookText from 'lucide-svelte/icons/book-text';
	import Check from 'lucide-svelte/icons/check';
	import Import from 'lucide-svelte/icons/import';
	import type { ListResult } from 'pocketbase';

	import CourseSearch from '$lib/pocketbase/course-search.svelte';
	import InstitutionSelector from '$lib/pocketbase/institution-selector.svelte';
	import type { CoursesResponse } from '$lib/pocketbase/pocketbase-types';

	import { get_app_state } from '$lib/context';
	import { db } from '../../../db/db';
	import { VineType } from '../../../db/vines/define';

	const app_state = get_app_state();

	interface Props {
		isOpen: boolean;
		close: () => {};
		parent_id: string | undefined;
	}
	const {
		// provided by <Modals />
		isOpen,
		close,
		parent_id,
	}: Props = $props();

	let dialog_el: HTMLDialogElement | null = $state(null);

	$effect(() => {
		if (dialog_el && isOpen && !dialog_el.open) {
			dialog_el.showModal();
		} else if (dialog_el && !isOpen && dialog_el.open) {
			dialog_el.requestClose();
		}
	});

	let courses_result: ListResult<CoursesResponse> | 'ERROR' | undefined = $state(undefined);
	let loading_results = $state(false);
	let page: number = $state(1);
	let page_count: number = $state(1);
	let item_count: number = $state(0);

	let selected_institution: string | undefined = $state(undefined);

	async function import_course(course: CoursesResponse) {
		const query = parent_id
			? await db.vines.find({ selector: { parent_id: { $eq: parent_id } } }).exec()
			: await db.vines.find({ selector: { parent_id: { $exists: false } } }).exec();
		const length = query.length;

		await db.vines.add_vine({
			type: VineType.Course,
			title: course.title,
			parent_id: parent_id ?? '',
			public: true,
			course_id: course.id,
			course_title: course.title,
			course_code: course.course_code,
			course_weight: course.weight,
			course_instructor: course.instructor,
			session_aim: 0,
		});

		close();
	}
</script>

<dialog
	bind:this={dialog_el}
	class="modal"
	id="import-course"
	onclose={(e) => {
		e.preventDefault();
		close();
	}}
>
	<div class="modal-box h-[70dvh]">
		<div class="flex flex-row justify-between items-center w-full">
			<h3 class="text-lg font-bold self-baseline">{i18next.t("vines:import_course")}</h3>
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost">✕</button>
			</form>
		</div>
		<div class="flex flex-col items-center gap-2 w-full h-[90%]">
			<div class="flex flex-row gap-2">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">{i18next.t('vines:institution')}</legend>
					<InstitutionSelector bind:selected_institution />
				</fieldset>
				<fieldset class="fieldset">
					<legend class="fieldset-legend">{i18next.t('common:search')}</legend>
					<CourseSearch
						bind:courses_result
						bind:loading_results
						institution={selected_institution}
						bind:page
						bind:item_count
						bind:page_count
					/>
				</fieldset>
			</div>
			<div
				class="bg-base-100 rounded-box shadow-md flex flex-col w-[90%] h-full gap-2 items-center overflow-auto"
			>
				{#if courses_result && courses_result != 'ERROR'}
					<ul class="list w-full">
						<li class="p-4 pb-2 text-xs opacity-60 tracking-wide">
							Courses {item_count > 0 ? `(${item_count} results)` : ''}
						</li>
						{#each courses_result?.items as course (course.id)}
							<li
								class="list-row"
								id={course.title == 'Inleiding tot het programmeren' ? 'tour-course' : ''}
							>
								<div>
									<BookText class="size-[1.2em]" />
								</div>
								<div>
									<div>{course.title}</div>
									<div class="text-xs uppercase font-semibold opacity-60">
										{course.course_code}
										{course.instructor}
									</div>
								</div>
								{#if app_state.vines?.findIndex((vine) => vine.course_id == course.id) == -1}
									<button
										class="btn btn-square btn-ghost"
										onclick={async () => await import_course(course)}
										><Import class="size-[1.2em]" /></button
									>
								{:else}
									<button class="btn btn-square btn-success">
										<Check class="size-[1.2em]" />
									</button>
								{/if}
							</li>
						{:else}
							No results
						{/each}
					</ul>
					{#if page_count > 1}
						<div class="join mb-[5%]">
							<button class="join-item btn" disabled={page == 1} onclick={() => page--}>«</button>
							<button class="join-item btn">{i18next.t('common:page')} {page}</button>
							<button class="join-item btn" disabled={page == page_count} onclick={() => page++}
								>»</button
							>
						</div>
					{/if}
				{:else if courses_result == 'ERROR'}
					{i18next.t('vines:error_course_fetch')}
				{:else}
					<div class="flex flex-col gap-2 my-auto items-center">
						<BookText class="size-[5em] stroke-base-content" />
						<span class="text-xl text-base-content">{i18next.t('common:type_for_results')}</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
</dialog>

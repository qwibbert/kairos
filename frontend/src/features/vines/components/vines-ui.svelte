<script lang="ts">
	import VinesIcon from '$components/ui/vines-icon.svelte';
	import VineStatsModal from '$features/stats/components/vine-stats-modal.svelte';
	import i18next from 'i18next';
	import BookText from 'lucide-svelte/icons/book-text';
	import ChartLine from 'lucide-svelte/icons/chart-line';
	import Check from 'lucide-svelte/icons/check';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import Folder from 'lucide-svelte/icons/folder';
	import FolderUp from 'lucide-svelte/icons/folder-up';
	import Home from 'lucide-svelte/icons/home';
	import Pencil from 'lucide-svelte/icons/pencil';
	import Plus from 'lucide-svelte/icons/plus';
	import SquareCheck from 'lucide-svelte/icons/square-check';
	import Trash from 'lucide-svelte/icons/trash';

	import { alert_dialog } from '$lib/components/alerts.svelte';
	import { get_app_state } from '$lib/context';

	import { db } from '../../../db/db';
	import { PomoType, SessionStatus } from '../../../db/sessions/define.svelte';
	import type { VinesSortBy } from '../../../db/settings/define';
	import {
		VineStatus,
		type VineTreeItem,
		VineType,
		type VinesDocument,
	} from '../../../db/vines/define';
	import { build_vine_subtree, get_parent_nodes_from_flat_list } from '../db';
	import ImportCourseModal from './import-course-modal.svelte';
	import VineSelectModal from './vine-select-modal.svelte';

	const app_state = get_app_state();
	let active_vine: VinesDocument | null = $derived(
		app_state.vines?.find((vine) => vine.status == VineStatus.Active) ?? null,
	);
	let parent_override: string | undefined = $state(undefined);
	let parent_vine: string | undefined = $derived.by(() => {
		if (parent_override) {
			return parent_override;
		} else {
			return active_vine?.parent_id;
		}
	});
	let page = $state(1);
	let vine_editing = $state<VinesDocument | null>(null);
	let vine_moving = $state<VinesDocument | null>(null);
	let new_vine_input = $state<HTMLInputElement | null>(null);
	let vine_title_input_value = $state('');
	let vine_type_selector_value = $state<'TASK' | 'COURSE'>('TASK');
	let vine_stats_modal = $state<HTMLDialogElement | undefined>();
	let import_course_modal = $state<HTMLDialogElement | undefined>();
	let vine_select_modal = $state<HTMLDialogElement | undefined>();
	let vine_to_view = $state<VinesDocument | undefined>();
	let add_vine_details: HTMLDetailsElement | undefined = $state(undefined);
	let vines_sort_by: VinesSortBy = $derived(
		(app_state.settings?.vines_sort_by as VinesSortBy | undefined) ?? 'LAST_USED_DESC',
	);

	let search_string = $state('');

	let vines_list_state = $derived(
		app_state.vines
			? await build_vine_subtree(app_state.vines, parent_vine, vines_sort_by, search_string)
			: [],
	);

	$effect(() => {
		if (new_vine_input && vine_editing) {
			new_vine_input.focus();
		}
	});

	async function action_update_vine(vine: VinesDocument) {
		await db.vines.update_vine(vine.id, {
			title: vine_title_input_value == '' ? 'Nieuwe taak' : vine_title_input_value,
		});
		vine_editing = null;
		vine_title_input_value = '';
	}

	async function action_add_vine(resolved_parent_vine: string | undefined) {
		const vine = await db.vines.add_vine({
			title: i18next.t('vines:new_vine'),
			status: VineStatus.InActive,
			public: true,
			session_aim: 0,
			type: VineType.Task,
			parent_id: resolved_parent_vine,
		});

		// Make last vine editable
		vine_editing = vine;

		add_vine_details!.open = false;
	}
</script>

<VineStatsModal bind:vine={vine_to_view} bind:vine_stats_modal />
<ImportCourseModal bind:import_course_modal vines={app_state.vines} parent_id={parent_vine} />

<VineSelectModal
	on_select={async (vine) => {
		if (vine && vine_moving) {
			await db.vines.update_vine(vine_moving.id, { parent_id: vine });
		} else {
			await db.vines.update_vine(vine_moving?.id, { parent_id: undefined });
		}

		vine_select_modal?.close();
	}}
	bind:vine_select_modal
	bind:vine_moving
/>

{#snippet vine_list_item(vine: VineTreeItem)}
	<div class="flex flex-row items-center gap-2">
		{#if vine.children && vine.children.length > 0}
			<Folder class="size-[1.5em]" />
		{:else}
			<input
				type="checkbox"
				checked={vine.status == VineStatus.Active}
				onchange={async (e) => {
					if (app_state.session) {
						if (app_state.session.status != SessionStatus.Inactive) {
							alert_dialog({
								id: crypto.randomUUID(),
								header: 'Change Vine',
								text: 'Changing vine will create a new session, are you sure you want to continue?',
								type: 'INFO',
								dismissable: false,
								actions: new Map([
									['Cancel', async () => {}],
									[
										'Change vine',
										async () => {
											await db.vines.update_vine(vine.id, {
												status: (e.target as HTMLInputElement)?.checked
													? VineStatus.Active
													: VineStatus.InActive,
											});

											app_state.session = await app_state.session?.skip(
												app_state.session.pomo_type as PomoType,
											);
										},
									],
								]),
							});
						} else {
							const checked = (e.target as HTMLInputElement)?.checked;

							app_state.session = await app_state.session.incrementalUpdate({
								$set: {
									vine_id: checked ? vine.id : undefined,
									vine_title: checked ? vine.title : undefined,
									vine_course: checked ? vine.course_id : undefined,
									vine_type: checked ? vine.type : undefined,
								},
							});
						}
					}
					await db.vines.get_vine(vine.id).then(
						async (v) =>
							await v?.incrementalUpdate({
								$set: {
									status: VineStatus.Active,
								},
							}),
					);
				}}
				class="checkbox"
			/>
		{/if}
	</div>
	<div class="flex flex-col w-full items-center gap-2">
		{#if vine_editing?.id == vine.id}
			<input
				bind:this={new_vine_input}
				type="text"
				class="input input-bordered input-sm flex-1 ml-2"
				bind:value={vine_title_input_value}
			/>
		{:else if vine.children && vine.children.length > 0}
			<button
				onclick={() => {
					if (parent_override) {
						parent_override = undefined;
					}

					parent_override = vine.id;
					page = 1;
				}}
				class=" link text-base-content">{vine.title}</button
			>
		{:else}
			<p>{vine.title}</p>
		{/if}
		{#if vine.type == VineType.Course}
			<div class="flex flex-row">
				<span class="badge badge-soft badge-primary">{vine.course_code}</span>
			</div>
		{/if}
	</div>
	<div class="join bg-base-300 rounded-box">
		{#if vine_editing?.id == vine.id}
			<button
				class="btn btn-square btn-sm md:btn-md btn-ghost join-item"
				onclick={() => action_update_vine(vine)}><Check class="size-[1.2em]" /></button
			>
		{:else}
			<button
				class="btn btn-square btn-sm md:btn-md btn-ghost join-item"
				onclick={() => {
					vine_title_input_value = vine.title;
					vine_type_selector_value = vine.type;
					vine_editing = vine;
				}}><Pencil class="size-[1.2em]" /></button
			>
		{/if}
		<button
			class="btn btn-square btn-sm md:btn-md btn-ghost join-item"
			onclick={async () => {
				vine_moving= vine;
				vine_select_modal?.showModal();
			}}><FolderUp class="size-[1.2em]" /></button
		>
		<button
			class="btn btn-square btn-sm md:btn-md btn-ghost join-item"
			onclick={async () => await db.vines.delete_vine(vine.id)}
			><Trash class="size-[1.2em]" /></button
		>
	</div>
{/snippet}

{#await parent_vine then resolved_parent_vine}
	<div class="mt-5 flex flex-row justify-center md:join w-full">
		<details bind:this={add_vine_details} class="dropdown hidden md:block" id="tour-5-box">
			<summary class="btn btn-soft join-item" id="tour-5-button"
				><ChevronDown class="size-[1.2em]" /> {i18next.t('common:add')}</summary
			>
			<ul class="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
				<li>
					<a onclick={async () => await action_add_vine(resolved_parent_vine)}
						><SquareCheck class="size-[1.2em]" /> {i18next.t('vines:add_task')}</a
					>
				</li>
				<li>
					<a
						id="tour-5-course"
						onclick={() => {
							import_course_modal?.showModal();
							add_vine_details!.open = false;
						}}><BookText class="size-[1.2em]" /> {i18next.t('vines:add_course')}</a
					>
				</li>
			</ul>
		</details>
		<button
			class="btn btn-soft join-item"
			onclick={async () => {
				if (parent_vine) {
					vine_to_view = await db.vines.get_vine(parent_vine ?? '');
				} else {
					vine_to_view = undefined;
				}

				vine_stats_modal?.showModal();
			}}><ChartLine class="size-[1.2em]" />{i18next.t('statistics:statistics')}</button
		>
	</div>

	<div class="flex flex-row gap-2 my-5 justify-center">
		<input placeholder="Zoek hier naar een vine" class="input" bind:value={search_string} />
		<select
			class="select"
			bind:value={vines_sort_by}
			onchange={async (e) =>
				await app_state.settings?.modify_setting(
					'vines_sort_by',
					(e.target as HTMLSelectElement).value,
				)}
		>
			<option value="LAST_USED_DESC">Last used</option>
			<option value="LAST_USED_ASC">First used</option>
			<option value="CREATION_DESC">Newest</option>
			<option value="CREATION_ASC">Oldest</option>
			<option value="NAME_DESC">Name (descending)</option>
			<option value="NAME_ASC">Name (ascending)</option>
		</select>
	</div>

	<div class="rounded-box bg-base-200 shadow-md">
		{#if parent_vine}
			{@const parents = get_parent_nodes_from_flat_list(
				app_state.vines ?? ([] as VinesDocument[]),
				parent_vine,
			)}

			<div class="breadcrumbs text-sm self-start">
				<ul>
					<li>
						<button
							class="btn btn-link text-base-content"
							onclick={() => {
								vine_to_view = undefined;
								parent_vine = undefined;
								page = 1;
							}}><Home class="size-[1em]" />{i18next.t('vines:vines')}</button
						>
					</li>
					{#each parents as parent (parent.id)}
						<li>
							<button
								class="btn btn-link text-base-content flex items-center"
								onclick={() => {
									vine_to_view = parent;
									parent_override = parent.id;
									page = 1;
								}}>{parent.title}</button
							>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
		<ul
			aria-label="Vine List"
			class="list w-full max-h-[calc(0.8*80dvh)] overflow-y-auto"
			id="vines-container"
		>
			{#each vines_list_state as vine (vine.id)}
				{#if vine.children && vine.children?.length > 0}
					<li class="list-row flex items-center justify-between w-full" aria-label={vine.title}>
						{@render vine_list_item(vine)}
					</li>
				{:else}
					<li class="list-row flex items-center justify-between w-full" aria-label={vine.title}>
						{@render vine_list_item(vine)}
					</li>
				{/if}
			{:else}
				<div class="h-full flex flex-col justify-around items-center gap-2 my-[5dvh]">
					<VinesIcon styles={['size-[5em]']} />
					<p class="text-lg font-bold">
						{i18next.t('vines:no_vines_found')}
					</p>
				</div>
			{/each}
		</ul>
	</div>
	<div class="fab mb-[10dvh] md:hidden" id="tour-5-fab">
		<!-- a focusable div with tabindex is necessary to work on all browsers. role="button" is necessary for accessibility -->
		<div tabindex="0" role="button" class="btn btn-lg btn-circle btn-success"><Plus /></div>

		<!-- buttons that show up when FAB is open -->
		<div>
			{i18next.t('vines:add_task')}
			<button
				class="btn btn-lg btn-circle"
				onclick={async () => await action_add_vine(resolved_parent_vine)}><SquareCheck /></button
			>
		</div>
		<div>
			{i18next.t('vines:add_course')}
			<button
				class="btn btn-lg btn-circle"
				onclick={() => {
					import_course_modal?.showModal();
					add_vine_details!.open = false;
				}}><BookText /></button
			>
		</div>
	</div>
{/await}

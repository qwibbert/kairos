<script lang="ts">
	import { db } from '$db/db';
	import { PomoType, SessionStatus } from '$db/sessions/define.svelte';
	import type { VinesSortBy } from '$db/settings/define';
	import { type VineTreeItem, VineType, type VinesDocument } from '$db/vines/define';
	import i18next from 'i18next';
	import BookText from 'lucide-svelte/icons/book-text';
	import Check from 'lucide-svelte/icons/check';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import Folder from 'lucide-svelte/icons/folder';
	import FolderUp from 'lucide-svelte/icons/folder-up';
	import Home from 'lucide-svelte/icons/home';
	import Pencil from 'lucide-svelte/icons/pencil';
	import Plus from 'lucide-svelte/icons/plus';
	import SquareCheck from 'lucide-svelte/icons/square-check';
	import Trash from 'lucide-svelte/icons/trash';
	import { Settings } from 'src/settings/settings.svelte';
	import { modals } from 'svelte-modals';

	import Alert from '$lib/components/alert.svelte';
	import VinesIcon from '$lib/components/ui/vines-icon.svelte';
	import { get_app_state } from '$lib/context';
	import { push_toast } from '$lib/toasts';

	import { VineError } from '../errors';
	import { Vine } from '../vine';
	import { VineTreeNode } from '../vine-tree.svelte';
	import ImportCourseModal from './import-course-modal.svelte';
	import VineSelectModal from './vine-select-modal.svelte';

	const app_state = get_app_state();

	const parent_vine = $derived(app_state.vine_tree.getParentNode());

	const parents = $derived.by(async () => {
		const ancestors = await parent_vine?.getParents();

		if (ancestors instanceof VineError) {
			return;
		}

		return [...(ancestors ?? []), parent_vine];
	});

	let vine_editing = $state<VineTreeNode | null>(null);
	let vine_moving = $state<VineTreeNode | null>(null);
	let new_vine_input = $state<HTMLInputElement | null>(null);
	let vine_title_input_value = $state('');

	let add_vine_details: HTMLDetailsElement | undefined = $state(undefined);
	let vines_sort_by: VinesSortBy = $derived(
		(app_state.settings?.vines_sort_by as VinesSortBy | undefined) ?? 'LAST_USED_DESC',
	);

	let search_string = $state('');

	$effect(() => {
		if (new_vine_input && vine_editing) {
			new_vine_input.focus();
		}
	});

	async function action_update_vine(node: VineTreeNode) {
		const res = await node.update({
			title: vine_title_input_value == '' ? 'Nieuwe taak' : vine_title_input_value,
		});

		if (res instanceof VineError) {
			// TODO: error handling
		}

		vine_editing = null;
		vine_title_input_value = '';
	}

	async function action_add_vine() {
		let parent_node = app_state.vine_tree.getParentNode();

		const vine = await Vine.createVine({
			title: i18next.t('vines:new_vine'),
			public: true,
			session_aim: 0,
			type: VineType.Task,
			parent_id: parent_node ? parent_node.getDocProp('id') : '',
		});

		if (vine instanceof VineError) {
			// TODO: error handling
			return;
		}

		// Make last vine editable
		vine_editing = new VineTreeNode(vine);

		add_vine_details!.open = false;
	}

	async function action_remove_vine(node: VineTreeNode) {
		let res = await node.delete();

		if (res instanceof VineError) {
			// TODO: error handling
			return;
		}
	}
</script>

{#snippet vine_list_item(node: VineTreeNode)}
	{@const children = node.getChildren()}
	<div class="flex flex-row items-center gap-2">
		{#if children.length > 0}
			<Folder class="size-[1.5em]" />
		{:else}
			<input
				type="checkbox"
				checked={node.getDocProp('id') == app_state.active_vine?.getDocProp('id')}
				onchange={async (e) => {
					if (app_state.session) {
						if (app_state.session.status != SessionStatus.Inactive) {
							await modals.open(Alert as any, {
								type: 'INFO',
								header: i18next.t('vines:vine_change'),
								text: i18next.t('vines:vine_change_active_session'),
								dismissable: false,
								actions: new Map([
									[i18next.t('common:cancel'), async () => {}],
									[
										i18next.t('vines:vine_change'),
										async () => {
											app_state.session =
												(await app_state.session?.skip(app_state.session.pomo_type as PomoType)) ??
												null;

											if (node.getDocProp('id') == app_state.active_vine?.getDocProp('id')) {
												if (app_state.session) {
													app_state.session = await app_state.session.incrementalUpdate({
														$set: {
															vine_id: undefined,
															vine_title: undefined,
															vine_course: undefined,
															vine_type: undefined,
															updated_at: new Date().toISOString().replace('T', ' '),
														},
													});

													app_state.active_vine = null;
												}
											} else {
												if (app_state.session) {
													app_state.session = await app_state.session.incrementalUpdate({
														$set: {
															vine_id: node.getDocProp('id'),
															vine_title: node.getDocProp('title'),
															vine_course: node.getDocProp('course_id'),
															vine_type: node.getDocProp('type'),
															updated_at: new Date().toISOString().replace('T', ' '),
														},
													});

													app_state.active_vine = node;
												}
											}
										},
									],
								]),
							});
						} else {
							const checked = (e.target as HTMLInputElement)?.checked;

							if (node.getDocProp('id') == app_state.active_vine?.getDocProp('id')) {
								app_state.session = await app_state.session.incrementalUpdate({
									$set: {
										vine_id: undefined,
										vine_title: undefined,
										vine_course: undefined,
										vine_type: undefined,
										updated_at: new Date().toISOString().replace('T', ' '),
									},
								});

								app_state.active_vine = null;
							} else {
								app_state.session = await app_state.session.incrementalUpdate({
									$set: {
										vine_id: checked ? node.getDocProp('id') : undefined,
										vine_title: checked ? node.getDocProp('title') : undefined,
										vine_course: checked ? node.getDocProp('course_id') : undefined,
										vine_type: checked ? node.getDocProp('type') : undefined,
										updated_at: new Date().toISOString().replace('T', ' '),
									},
								});

								app_state.active_vine = node;
							}
						}

						modals.close();
					}

					app_state.selected_vine = node;
				}}
				class="checkbox"
			/>
		{/if}
	</div>
	<div class="flex flex-col w-full items-center gap-2">
		{#if vine_editing?.getDocProp('id') == node.getDocProp('id')}
			<input
				bind:this={new_vine_input}
				type="text"
				class="input input-bordered input-sm flex-1 ml-2"
				bind:value={vine_title_input_value}
			/>
		{:else if children.length > 0}
			<button
				onclick={() => {
					app_state.vine_tree.setParentNode(node);
				}}
				class="link text-base-content">{node.getDocProp('title')}</button
			>
		{:else}
			<p>{node.getDocProp('title')}</p>
		{/if}
		{#if node.getDocProp('type') == VineType.Course}
			<div class="flex flex-row">
				<span class="badge badge-soft badge-primary">{node.getDocProp('course_code')}</span>
			</div>
		{/if}
	</div>
	<div class="join bg-base-300 rounded-box">
		{#if vine_editing?.getDocProp('id') == node.getDocProp('id')}
			<button
				class="btn btn-square btn-sm md:btn-md btn-ghost join-item"
				onclick={() => action_update_vine(node)}><Check class="size-[1.2em]" /></button
			>
		{:else}
			<button
				class="btn btn-square btn-sm md:btn-md btn-ghost join-item"
				onclick={() => {
					vine_title_input_value = node.getDocProp('title');
					vine_editing = node;
				}}><Pencil class="size-[1.2em]" /></button
			>
		{/if}
		<button
			class="btn btn-square btn-sm md:btn-md btn-ghost join-item"
			onclick={async () => {
				vine_moving = node;

				const selected_vine = (await modals.open(VineSelectModal as any, {
					vine_moving,
				})) as VineTreeNode | null;

				const selected_vine_parents = await selected_vine?.getParents();

				if (selected_vine_parents instanceof VineError) {
					// TODO: error handling
					return;
				}

				if (selected_vine && vine_moving) {
					if (
						vine_moving.getDocProp('id') == selected_vine?.getDocProp('id') ||
						(vine_moving.getDocProp('type') == VineType.Course &&
							(selected_vine.getDocProp('type') == VineType.Course ||
								selected_vine_parents?.find((p) => p.getDocProp('type') == VineType.Course)))
					) {
						push_toast('error', {
							type: 'headed',
							header: i18next.t('vines:err_invalid_move'),
							text:
								node.getDocProp('id') == vine_moving?.getDocProp('id')
									? i18next.t('vines:err_vine_in_vine')
									: vine_moving?.getDocProp('type') == VineType.Course &&
										  node.getDocProp('type') == VineType.Course
										? i18next.t('vines:err_course_in_course')
										: '',
						});
					} else {
						const res = await vine_moving.update({ parent_id: selected_vine.getDocProp('id') });

						if (res instanceof VineError) {
							// TODO: error handling
							return;
						}
					}
				} else {
					const res = await vine_moving.update({ parent_id: undefined });

					if (res instanceof VineError) {
						// TODO: error handling
						return;
					}
				}
			}}><FolderUp class="size-[1.2em]" /></button
		>
		<button
			class="btn btn-square btn-sm md:btn-md btn-ghost join-item"
			onclick={() => action_remove_vine(node)}><Trash class="size-[1.2em]" /></button
		>
	</div>
{/snippet}

<div class="mt-5 flex flex-row justify-center md:join w-full">
	<details bind:this={add_vine_details} class="dropdown hidden md:block" id="tour-5-box">
		<summary class="btn btn-soft join-item" id="tour-5-button"
			><ChevronDown class="size-[1.2em]" /> {i18next.t('common:add')}</summary
		>
		<ul class="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
			<li>
				<button onclick={async () => await action_add_vine()}
					><SquareCheck class="size-[1.2em]" /> {i18next.t('vines:add_task')}</button
				>
			</li>
			<li>
				<button
					id="tour-5-course"
					class={[parent_vine?.getDocProp('type') == VineType.Course ? 'hidden' : '']}
					onclick={async () => {
						modals.open(ImportCourseModal as any, { parent: parent_vine });
						add_vine_details!.open = false;
					}}><BookText class="size-[1.2em]" /> {i18next.t('vines:add_course')}</button
				>
			</li>
		</ul>
	</details>
</div>

<div class="flex flex-row gap-2 my-5 justify-center">
	<input placeholder="Zoek hier naar een vine" class="input" bind:value={search_string} />
	<select
		class="select"
		bind:value={vines_sort_by}
		onchange={async (e) =>
			await Settings.writeSetting('vines_sort_by', (e.target as HTMLSelectElement).value)}
	>
		<option value="LAST_USED_DESC">{i18next.t('vines:last_used')}</option>
		<option value="LAST_USED_ASC">{i18next.t('vines:first_used')}</option>
		<option value="CREATION_DESC">{i18next.t('vines:newest')}</option>
		<option value="CREATION_ASC">{i18next.t('vines:oldest')}</option>
		<option value="NAME_DESC">{i18next.t('vines:name_desc')}</option>
		<option value="NAME_ASC">{i18next.t('vines:name_asc')}</option>
	</select>
</div>

<div class="rounded-box bg-base-200 shadow-md">
	{#if parent_vine}
		{#await parents then parents}
			<div class="breadcrumbs text-sm self-start">
				<ul>
					<li>
						<button
							class="btn btn-link text-base-content"
							onclick={() => {
								app_state.vine_tree.setParentNode(null);
							}}><Home class="size-[1em]" />{i18next.t('vines:vines')}</button
						>
					</li>
					{#each parents as parent (parent?.getDocProp('id'))}
						<li>
							<button
								class="btn btn-link text-base-content flex items-center"
								disabled={parent?.getDocProp('id') == parent_vine.getDocProp('id')}
								onclick={() => {
									app_state.vine_tree.setParentNode(parent);
								}}>{parent?.getDocProp('title')}</button
							>
						</li>
					{/each}
				</ul>
			</div>
		{/await}
	{/if}
	<ul
		aria-label="Vine List"
		class="list w-full max-h-[calc(0.8*80dvh)] overflow-y-auto"
		id="vines-container"
	>
		{#each app_state.vine_tree.getNodesAtLevel() as vine (vine.getDocProp('id'))}
			<li
				class="list-row flex items-center justify-between w-full"
				aria-label={vine.getDocProp('title')}
			>
				{@render vine_list_item(vine)}
			</li>
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
		<button class="btn btn-lg btn-circle" onclick={async () => await action_add_vine()}
			><SquareCheck /></button
		>
	</div>
	<div>
		{i18next.t('vines:add_course')}
		<button
			class="btn btn-lg btn-circle"
			onclick={() => {
				modals.open(ImportCourseModal as any, { parent: parent_vine });
				add_vine_details!.open = false;
			}}><BookText /></button
		>
	</div>
</div>

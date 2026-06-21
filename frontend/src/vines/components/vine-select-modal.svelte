<script lang="ts">
	import type { VinesSortBy } from '$db/settings/define';
	import { VineType, type VinesDocument } from '$db/vines/define';
	import i18next from 'i18next';
	import Check from 'lucide-svelte/icons/check';
	import FolderDown from 'lucide-svelte/icons/folder-down';
	import FolderSymlink from 'lucide-svelte/icons/folder-symlink';
	import Home from 'lucide-svelte/icons/home';
	import { Settings } from 'src/settings/settings.svelte';

	import VinesIcon from '$lib/components/ui/vines-icon.svelte';
	import { get_app_state } from '$lib/context';

	import { VineError } from '../errors';
	import type { VineTreeNode } from '../vine-tree.svelte';

	interface Props {
		isOpen: boolean;
		close: (selected_vine: VineTreeNode | null) => {};
		vine_moving: VinesDocument | null;
	}
	const {
		// provided by <Modals />
		isOpen,
		close,
		vine_moving = $bindable(),
	}: Props = $props();

	let dialog_el: HTMLDialogElement | null = $state(null);

	let search_string = $state('');

	$effect(() => {
		if (dialog_el && isOpen && !dialog_el.open) {
			dialog_el.showModal();
		} else if (dialog_el && !isOpen && dialog_el.open) {
			dialog_el.requestClose();
		}
	});

	const app_state = get_app_state();

	const parent_vine = $derived(app_state.vine_tree.getParentNode());
	const parents = $derived.by(async () => {
		const ancestors = await parent_vine?.getParents();

		if (ancestors instanceof VineError) {
			return;
		}

		return [...(ancestors ?? []), parent_vine];
	});

	let vines_sort_by: VinesSortBy = $derived(
		(app_state.settings?.vines_sort_by as VinesSortBy | undefined) ?? 'LAST_USED_DESC',
	);
</script>

<dialog
	bind:this={dialog_el}
	class="modal"
	id="vines"
	onclose={(e) => {
		e.preventDefault();
		close(null);
	}}
>
	<div class="modal-box max-h-[90dvh]">
		<div class="flex flex-row justify-between items-center w-full">
			<h3 class="text-lg font-bold self-baseline">
				{vine_moving ? i18next.t('vines:move_vine') : i18next.t('vines:select_vine')}
				{vine_moving?.title}
			</h3>

			<button class="btn btn-sm btn-circle btn-ghost" onclick={() => close(null)}>✕</button>
		</div>

		{#snippet vine_list_item(node: VineTreeNode)}
			{@const children = node.getChildren()}
			<div
				class={['flex flex-row items-center gap-2', 'lg:tooltip lg:tooltip-right']}
				data-tip={node.getDocProp('id') == vine_moving?.id
					? i18next.t('vines:err_vine_in_vine')
					: vine_moving?.type == VineType.Course && node.getDocProp('type') == VineType.Course
						? i18next.t('vines:err_course_in_course')
						: i18next.t('vines:move_into')}
			>
				<button
					disabled={node.getDocProp('id') == vine_moving?.id ||
						(vine_moving?.type == VineType.Course && node.getDocProp('type') == VineType.Course)}
					class="btn"
					onclick={() => {
						close(node);
					}}
				>
					{#if vine_moving}
						<FolderSymlink class="size-[1.5em]" />
					{:else}<Check class="size-[1.5em]" />{/if}
				</button>
			</div>
			<div class="flex flex-col w-full items-center gap-2">
				{#if children.length > 0}
					<button
						onclick={() => app_state.vine_tree.setParentNode(node)}
						class=" link text-base-content">{node.getDocProp('title')}</button
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
		{/snippet}

		<div class="mt-5 flex flex-row justify-center md:join w-full">
			{#if vine_moving}
				<button
					class="btn"
					onclick={() => {
						close(parent_vine);
					}}><FolderDown class="size-[1.2em]" /> {i18next.t('vines:place_here')}</button
				>
			{/if}
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
	</div>
</dialog>

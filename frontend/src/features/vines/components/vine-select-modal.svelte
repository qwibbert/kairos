<script lang="ts">
	import VinesIcon from '$components/ui/vines-icon.svelte';
	import i18next from 'i18next';
	import FolderDown from 'lucide-svelte/icons/folder-down';
	import FolderSymlink from 'lucide-svelte/icons/folder-symlink';
	import Home from 'lucide-svelte/icons/home';

	import { get_app_state } from '$lib/context';

	import type { VinesSortBy } from '../../../db/settings/define';
	import { type VineTreeItem, VineType, type VinesDocument } from '../../../db/vines/define';
	import { build_vine_subtree, get_parent_nodes_from_flat_list } from '../db';

	let {
		on_select,
		vine_moving = $bindable(),
		vine_select_modal = $bindable()
	}: {
		on_select?: (vine: string | null) => Promise<void>;
		vine_moving: VinesDocument | null;
		vine_select_modal: HTMLDialogElement | undefined;
	} = $props();

	const app_state = get_app_state();
	let parent_override: string | undefined = $state(undefined);
	let parent_vine: string | undefined = $derived.by(() => {
		if (parent_override) {
			return parent_override;
		}
	});
	let page = $state(1);
	let vine_to_view = $state<VinesDocument | undefined>();
	let vines_sort_by: VinesSortBy = $derived(
		(app_state.settings?.vines_sort_by as VinesSortBy | undefined) ?? 'LAST_USED_DESC',
	);

	let search_string = $state('');

	let vines_list_state = $derived(
		app_state.vines
			? await build_vine_subtree(app_state.vines, parent_vine, vines_sort_by, search_string)
			: [],
	);

</script>

<dialog bind:this={vine_select_modal} class="modal" id="vines">
	<div class="modal-box max-h-[90dvh]">
		<div class="flex flex-row justify-between items-center w-full">
			<h3 class="text-lg font-bold self-baseline">Verplaats {vine_moving?.title}</h3>
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost">✕</button>
			</form>
		</div>

		{#snippet vine_list_item(vine: VineTreeItem)}
			<div class="flex flex-row items-center gap-2">
				<button
					disabled={vine.id == vine_moving?.id}
					class="btn"
					onclick={() => (on_select ? on_select(vine.id) : {})}
				>
					<FolderSymlink class="size-[1.5em]" />
				</button>
			</div>
			<div class="flex flex-col w-full items-center gap-2">
				{#if vine.children && vine.children.length > 0}
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
		{/snippet}

		{#await parent_vine then resolved_parent_vine}
			<div class="mt-5 flex flex-row justify-center md:join w-full">
				<button
					class="btn"
					onclick={() => {
						on_select ? on_select(resolved_parent_vine ?? null) : {};
					}}><FolderDown class="size-[1.2em]" /> Place Here</button
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
		{/await}
	</div>
</dialog>

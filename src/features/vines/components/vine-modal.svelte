<script lang="ts">
    import ChartLine from "lucide-svelte/icons/chart-line";
    import Check from "lucide-svelte/icons/check";
    import CirclePlus from "lucide-svelte/icons/circle-plus";
    import Folder from "lucide-svelte/icons/folder";
    import Home from "lucide-svelte/icons/home";
    import ListPlus from "lucide-svelte/icons/list-plus";
    import Pencil from "lucide-svelte/icons/pencil";
    import Trash from "lucide-svelte/icons/trash";

    import VinesIcon from "$components/ui/vines-icon.svelte";
    import VineStatsModal from "$features/stats/components/vine-stats-modal.svelte";
    import { getContext } from "svelte";
    import { dndzone } from "svelte-dnd-action";
    import type { Vine } from "../../../db/appdb";
    import {
        add_vine,
        archive_vine,
        get_vine,
        update_vine,
    } from "../../../db/vines";
    import * as m from "../../../paraglide/messages";
    import { build_vine_subtree, get_parent_nodes_from_flat_list } from "../db";
    import { VineStatus, VineType, type VineTreeItem } from "../types";

    interface Props {
        vineselector_modal?: HTMLDialogElement;
        vines?: Vine[];
    }

    let { vineselector_modal = $bindable(), vines }: Props = $props();

    const session = getContext("session");

    let active_vine = $derived(
        vines?.find((vine) => session()?.vine_id == vine.id),
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
    let vines_list_state = $state<VineTreeItem[]>([]);
    let paginated_vines = $state<VineTreeItem[]>([]);

    let pages_count = $derived.by(() => {
        if (!vines_list_state) return;

        const length = vines_list_state.length;

        if (length > 5) {
            return Math.ceil(length / 5);
        } else {
            return 1;
        }
    });

    let vine_editing = $state<string | null>(null);

    let new_vine_input = $state<HTMLInputElement | null>(null);
    let vine_title_input_value = $state("");
    let vine_type_selector_value = $state<"TASK" | "COURSE">("TASK");

    $effect(() => {
        if (new_vine_input && vine_editing) {
            new_vine_input.focus();
        }
    });

    $effect(() => {
        if (vines) {
            vines_list_state = build_vine_subtree(vines, parent_vine).toSorted(
                (a, b) => a.position - b.position,
            );
        }
    });

    $effect(() => {
        const length = vines_list_state.length;

        if (length > 5) {
            const start = (page - 1) * 5;
            const end = start + 5;
            paginated_vines = vines_list_state.slice(start, end);
        } else {
            paginated_vines = vines_list_state;
        }
    });
    let vine_stats_modal = $state<HTMLDialogElement | undefined>();
    let vine_to_view = $state<Vine | undefined>();

    function handleDndConsider(e) {
        const id: string = e.detail.info.id;

        if (e.detail.items.length != paginated_vines.length) {
            return;
        }

        paginated_vines = e.detail.items;
    }

    async function handleDndFinalize(e) {
        const id: string = e.detail.info.id;

        if (e.detail.info.trigger == "droppedIntoAnother") {
            return;
        }

        const new_position =
            (page - 1) * 5 +
            (e.detail.items as VineTreeItem[]).findIndex(
                (item) => item.id == id,
            );

        update_vine(id, { position: new_position });
    }

    async function handleZonePageDownFinalize(e) {
        const id: string = e.detail.info.id;

        const new_position = (page - 1) * 5 - 1;

        update_vine(id, { position: new_position });
    }

    async function handleZonePageUpFinalize(e) {
        const id: string = e.detail.info.id;

        let new_position = page * 5;

        update_vine(id, { position: new_position + 1 });
    }

    async function handleChangeParentFinalize(e, parent_id: string) {
        console.log(e);
        const id: string = e.detail.info.id;

        update_vine(id, { parent_id });
    }

    async function action_update_vine(vine: Vine) {
        await update_vine(vine.id, {
            title:
                vine_title_input_value == ""
                    ? "Nieuwe taak"
                    : vine_title_input_value,
        });
        vine_editing = null;
        vine_title_input_value = "";
    }
</script>

<VineStatsModal bind:vine={vine_to_view} bind:vine_stats_modal />

{#snippet vine_list_item(vine: VineTreeItem)}
    <div class="flex flex-row items-center gap-2">
        {#if vine.children && vine.children.length > 0}
            <Folder class="size-[1.5em]" />
        {:else}
            <input
                type="checkbox"
                checked={vine.status == VineStatus.Active}
                onchange={async (e) => {
                    await update_vine(vine.id, {
                        status: (e.target as HTMLInputElement)?.checked
                            ? VineStatus.Active
                            : VineStatus.InActive,
                    });
                }}
                class="checkbox"
            />
        {/if}
    </div>

    {#if vine_editing == vine.id}
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
            class="btn btn-link text-base-content">{vine.title}</button
        >
    {:else}
        <p>{vine.title}</p>
    {/if}
    <div class="join bg-base-300 rounded-box">
        {#if vine_editing == vine.id}
            <button
                class="btn btn-square btn-sm md:btn-md btn-ghost join-item"
                onclick={() => action_update_vine(vine)}
                ><Check class="size-[1.2em]" /></button
            >
        {:else}
            <button
                class="btn btn-square btn-sm md:btn-md btn-ghost join-item"
                onclick={() => {
                    vine_title_input_value = vine.title;
                    vine_type_selector_value = vine.type;
                    vine_editing = vine.id;
                }}><Pencil class="size-[1.2em]" /></button
            >
        {/if}
        <button
            class="btn btn-square btn-sm md:btn-md btn-ghost join-item"
            onclick={async () => {
                const child_vine = await add_vine(
                    undefined,
                    vine.type,
                    undefined,
                    vine.id,
                );

                // Jump to the child vine page after adding a vine
                if (parent_override) {
                    parent_override = undefined;
                }

                parent_override = vine.id;

                page = pages_count ?? 1;

                // Make child vine editable
                vine_editing = child_vine;
            }}><ListPlus class="size-[1.2em]" /></button
        >
        <button
            class="btn btn-square btn-sm md:btn-md btn-ghost join-item"
            onclick={() => {
                vine_to_view = vine;
                vine_stats_modal?.showModal();
            }}><ChartLine class="size-[1.2em]" /></button
        >
        <button
            class="btn btn-square btn-sm md:btn-md btn-ghost join-item"
            onclick={async () => await archive_vine(vine.id)}
            ><Trash class="size-[1.2em]" /></button
        >
    </div>
{/snippet}

{#await parent_vine then resolved_parent_vine}
    <dialog bind:this={vineselector_modal} class="modal">
        <div class="modal-box max-h-[90dvh]">
            <div class="flex flex-row justify-between items-center w-full">
                <h3 class="text-lg font-bold self-baseline">Taken</h3>
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost">✕</button>
                </form>
            </div>

            <div class="my-5 flex flex-row justify-center join w-full">
                <button
                    class="btn btn-soft join-item"
                    onclick={async () => {
                        const vine = await add_vine(
                            undefined,
                            VineType.Task,
                            undefined,
                            resolved_parent_vine ?? "",
                        );

                        // Jump to the last page after adding a vine
                        page = pages_count ?? 1;

                        // Make last vine editable
                        vine_editing = vine;
                    }}><CirclePlus class="size-[1.2em]" /> {m.add()}</button
                >
                <button
                    class="btn btn-soft join-item"
                    onclick={async () => {
                        if (parent_vine) {
                            vine_to_view = await get_vine(parent_vine ?? "");
                        } else {
                            vine_to_view = undefined;
                        }

                        vine_stats_modal?.showModal();
                    }}><ChartLine class="size-[1.2em]" />Vine Stats</button
                >
            </div>

            <div
                class="rounded-box bg-base-200 shadow-md w-full flex flex-col items-center"
            >
                {#if parent_vine}
                    {@const parents = get_parent_nodes_from_flat_list(
                        vines ?? ([] as Vine[]),
                        parent_vine,
                    )}

                    <div class="breadcrumbs text-sm self-start">
                        <ul>
                            <li
                                use:dndzone={{
                                    items: [],
                                    dropTargetClasses: [
                                        "border-4",
                                        "border-primary",
                                        "animate-pulse",
                                    ],
                                    dropTargetStyle: {},
                                    centreDraggedOnCursor: true,
                                }}
                                onfinalize={(e) =>
                                    handleChangeParentFinalize(e, "")}
                            >
                                <button
                                    class="btn btn-link text-base-content"
                                    onclick={() => {
                                        parent_vine = undefined;
                                        page = 1;
                                    }}
                                    ><Home
                                        class="size-[1em]"
                                    />{m.vines()}</button
                                >
                            </li>
                            {#each parents as parent (parent.id)}
                                <li
                                    use:dndzone={{
                                        items: [],
                                        type: page.toString(),
                                        dropTargetClasses: [
                                            "border-4",
                                            "border-primary",
                                            "animate-pulse",
                                        ],
                                        dropTargetStyle: {},
                                        centreDraggedOnCursor: true,
                                    }}
                                    onfinalize={(e) =>
                                        handleChangeParentFinalize(
                                            e,
                                            parent.id,
                                        )}
                                >
                                    <button
                                        class="btn btn-link text-base-content flex items-center"
                                        onclick={() => {
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
                    use:dndzone={{
                        items: paginated_vines,
                        dropTargetStyle: {},
                        centreDraggedOnCursor: true,
                        dragDisabled: paginated_vines.length == 0,
                    }}
                    aria-label={"Vine List"}
                    onconsider={handleDndConsider}
                    onfinalize={handleDndFinalize}
                    class="list w-full"
                >
                    {#each paginated_vines as vine (vine.id)}
                        {#if vine.children && vine.children?.length > 0}
                            <li
                                use:dndzone={{
                                    items: vine.children,
                                    dropTargetClasses: [
                                        "border-4",
                                        "border-primary",
                                        "animate-pulse",
                                    ],
                                    dropTargetStyle: {},
                                    centreDraggedOnCursor: true,
                                }}
                                onfinalize={(e) =>
                                    handleChangeParentFinalize(e, vine.id)}
                                class="list-row flex items-center justify-between w-full"
                                aria-label={vine.title}
                            >
                                {@render vine_list_item(vine)}
                            </li>
                        {:else}
                            <li
                                class="list-row flex items-center justify-between w-full"
                                aria-label={vine.title}
                            >
                                {@render vine_list_item(vine)}
                            </li>
                        {/if}
                    {:else}
                        <div
                            class="h-full flex flex-col justify-around items-center gap-2 my-[5dvh]"
                        >
                            <VinesIcon styles={["size-[5em]"]} />
                            <p class="text-lg font-bold">
                                {m.no_vines_found()}
                            </p>
                        </div>
                    {/each}
                </ul>

                {#if pages_count && pages_count > 1}
                    <div class="join my-5">
                        <button
                            use:dndzone={{
                                items: [],
                                dragDisabled: page <= 1,
                                dropFromOthersDisabled: page <= 1,
                                centreDraggedOnCursor: true,
                                dropTargetClasses: [
                                    "border-4",
                                    "border-primary",
                                    "animate-pulse",
                                ],
                                dropTargetStyle: {},
                            }}
                            onfinalize={handleZonePageDownFinalize}
                            class="join-item btn"
                            onclick={() => (page -= 1)}
                            disabled={page <= 1}>«</button
                        >
                        <button class="join-item btn">{m.page()} {page}</button>
                        <button
                            use:dndzone={{
                                items: [],
                                dragDisabled: page == pages_count,
                                dropFromOthersDisabled: page == pages_count,
                                dropTargetClasses: [
                                    "border-4",
                                    "border-primary",
                                    "animate-pulse",
                                ],
                                centreDraggedOnCursor: true,
                                dropTargetStyle: {},
                            }}
                            onfinalize={handleZonePageUpFinalize}
                            class="join-item btn"
                            onclick={() => (page += 1)}
                            disabled={page == pages_count}>»</button
                        >
                    </div>
                {/if}
            </div>
        </div>
    </dialog>
{/await}

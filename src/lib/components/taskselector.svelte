<script lang="ts">
    import ChevronDown from "lucide-svelte/icons/chevron-down";
    import CirclePlus from "lucide-svelte/icons/circle-plus";
    import Home from "lucide-svelte/icons/home";
    import ListPlus from "lucide-svelte/icons/list-plus";
    import Pencil from "lucide-svelte/icons/pencil";
    import SquareCheck from "lucide-svelte/icons/square-check";
    import Trash from "lucide-svelte/icons/trash";

    import { onMount } from "svelte";
    import type { Session } from "../../state/session.svelte";
    import {
        add_task,
        delete_task,
        get_parents,
        get_task,
        get_task_list,
        restore_local_tasks,
        type TaskListItem,
        TaskStatus,
        update_task
    } from "../../state/tasks.svelte";

    interface Props {
        taskselector_modal?: HTMLDialogElement;
        session?: Session;
    }

    let { taskselector_modal = $bindable(), session }: Props = $props();

    onMount(() => {
        restore_local_tasks();
    });

    let parent_task: string | undefined = $derived(session?.task_id && session.task_id != "NO_TASK" ? get_task(session.task_id)?.parent_id : undefined);
    let page = $state(1);
    let tasks_list = $derived(get_task_list(parent_task));
    let paginated_tasks = $derived.by(() => {
        if (!tasks_list) return [];

        const length = tasks_list.length;

        if (length > 5) {
            const start = (page - 1) * 5;
            const end = start + 5;
            return tasks_list.slice(start, end)
        } else {
            return tasks_list;
        }
    });

    let pages_count = $derived.by(() => {
        if (!tasks_list) return;

        const length = tasks_list.length;

        if (length > 5) {
            return Math.ceil(length / 5);
        } else {
            return 1;
        }
    });

    let task_editing = $state<string | null>(null);

    let new_task_input = $state<HTMLInputElement | null>(null);

    $effect(() => {
        if (new_task_input && task_editing) {
            new_task_input.focus();
        }
    });
</script>

{#snippet task_list_item(task: TaskListItem)}
    <li class="list-row flex items-center justify-between w-full">
        {#if task.children && task.children.length > 0}
            <ChevronDown class="size-[1.2em]" />
        {:else}
            <input
                type="checkbox"
                checked={task.status == TaskStatus.InProgress}
                onchange={(e) => {
                    update_task(task.id, {
                        status: (e.target as HTMLInputElement)?.checked
                            ? TaskStatus.InProgress
                            : TaskStatus.Todo,
                    });
                }}
                class="checkbox"
            />
        {/if}

        {#if task_editing == task.id}
            <input
                bind:this={new_task_input}
                type="text"
                class="input input-bordered input-sm flex-1 ml-2"
                value={task.title}
                onchange={(e) => {
                    const value = (e.target as HTMLInputElement)?.value;

                    update_task(task.id, {
                        title: value == "" ? "Nieuwe taak" : value,
                    });

                    task_editing = null;
                }}
                onblur={() => {
                    task_editing = null;
                }}
            />
        {:else if task.children && task.children.length > 0}
            <button
                onclick={() => {
                    parent_task = task.id;
                    page = 1;
                }}
                class="btn btn-link text-base-content">{task.title}</button
            >
        {:else}
            <p>{task.title}</p>
        {/if}
        <div class="join bg-base-300 rounded-box">
            <button
                class="btn btn-square btn-ghost join-item"
                onclick={() => {
                    task_editing = task.id;
                }}><Pencil class="size-[1.2em]" /></button
            >
            <button
                class="btn btn-square btn-ghost join-item"
                onclick={() => {
                    const child_task = add_task(undefined, undefined, task.id);

                    // Jump to the child task page after adding a task
                    parent_task = task.id;
                    page = pages_count ?? 1;

                    // Make child task editable
                    task_editing = child_task.id;
                }}><ListPlus class="size-[1.2em]" /></button
            >
            <button
                class="btn btn-square btn-ghost join-item"
                onclick={() => delete_task(task.id)}
                ><Trash class="size-[1.2em]" /></button
            >
        </div>
    </li>
{/snippet}

<dialog bind:this={taskselector_modal} class="modal">
    <div class="modal-box flex flex-col items-center">
        <form method="dialog">
            <button
                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >✕</button
            >
        </form>
        <h3 class="text-lg font-bold self-baseline">Taken</h3>
        <button
            class="btn btn-primary btn-wide my-5"
            onclick={() => {
                const task = add_task(undefined, undefined, parent_task);

                // Jump to the last page after adding a task
                page = pages_count ?? 1;

                // Make last task editable
                task_editing = task.id;
            }}><CirclePlus class="size-[1.2em]" /> Toevoegen</button
        >

        <div
            class="rounded-box bg-base-200 shadow-md w-full flex flex-col items-center"
        >
            {#if parent_task}
                {@const parents = get_parents(tasks_list[0]?.id ?? parent_task)}
                <div class="breadcrumbs text-sm self-start">
                    <ul>
                        <li>
                            <button
                                class="btn btn-link text-base-content"
                                onclick={() => {
                                    parent_task = undefined;
                                    page = 1;
                                }}><Home class="size-[1em]"/>Taken</button
                            >
                        </li>
                        {#each parents as parent (parent.id)}
                            <li>
                                <button
                                    class="btn btn-link text-base-content flex items-center"
                                    onclick={() => {
                                        parent_task = parent.id;
                                        page = 1;
                                    }}>{parent.title}</button
                                >
                            </li>
                        {/each}
                    </ul>
                </div>
            {/if}
            <ul class="list w-full">
                {#each paginated_tasks as task (task.id)}
                    {@render task_list_item(task)}
                {:else}
                    <div
                        class="flex flex-col h-[30vh] items-center justify-center gap-2"
                    >
                        <SquareCheck class="size-[10em]" />
                        <p class="text-lg font-bold">Geen taken gevonden</p>
                    </div>
                {/each}
            </ul>

            {#if pages_count && pages_count > 1}
                <div class="join">
                    <button
                        class="join-item btn"
                        onclick={() => (page -= 1)}
                        disabled={page <= 1}>«</button
                    >
                    <button class="join-item btn">Page {page}</button>
                    <button
                        class="join-item btn"
                        onclick={() => (page += 1)}
                        disabled={page == pages_count}>»</button
                    >
                </div>
            {/if}
        </div>
    </div>
</dialog>

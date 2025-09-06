import type { SessionDocument } from "../../../db/sessions/define.svelte";
import type { VineID, VinesDocument } from "../../../db/vines/define";

type PieChartData = { name: string; value: number }[];

export function vines_pie_chart(
    vine_id: VineID | undefined,
    entries: SessionDocument[],
    vine_map: Map<string, VinesDocument>,
    children_map: Map<string, VinesDocument[]>,
): PieChartData {
    const data: PieChartData = [];
    const parent_vine = vine_map.get(vine_id ?? '');

    for (const entry of entries) {
        // Only include children of the specified vine if vine_id is provided
        if (vine_id && !children_map.get(vine_id)?.find(child => child.id == entry?.vine_id)) {
            continue;
        }

        const entry_vine = vine_map.get(entry.vine_id ?? '');
        const entry_parent_vine = vine_map.get(entry_vine?.parent_id ?? '');

        // Determine the label for this pie slice
        let slice_name: string = '';
        if (vine_id || !entry_parent_vine) {
            slice_name = entry_vine?.title ?? '';
        } else {
            slice_name = entry_parent_vine?.title ?? '';
        }

        // Find if this slice already exists
        const data_index = data.findIndex((dataEntry) => dataEntry.name === slice_name);

        if (data_index === -1) {
            // Calculate elapsed time for all child tasks
            const children = children_map.get(entry?.vine_id ?? '');
            let children_elapsed_time = 0;

            if (children) {
                for (const child_id of children) {
                    const child = vine_map.get(child_id);

                    if (child) {
                        const entries_with_child = entries.filter((e) => e.vine_id == child.id);

                        for (const child_entry of entries_with_child) {
                            children_elapsed_time += child_entry.get_time_elapsed();
                        }
                    }
                }
            }

            data.push({
                name: slice_name,
                value: children_elapsed_time + entry.get_time_elapsed(),
            });
        } else {
            // Aggregate time if slice already exists
            data[data_index] = {
                ...data[data_index],
                value: data[data_index].value + entry.get_time_elapsed(),
            };
        }
    }

    // No data was found, we need to distribute the pie chart evenly
    if (data.length == 0) {
        if (parent_vine) {
            for (const child_id of children_map.get(parent_vine.id) ?? []) {
                const child = vine_map.get(child_id);

                data.push({
                    name: child?.title ?? 'Unknown Task',
                    value: 0,
                });
            }
        } else {
            for (const parentless_vine of vine_map
                .values()
                .filter((entry) => (entry.parent_id ? false : true))) {
                data.push({
                    name: parentless_vine.title,
                    value: 0,
                });
            }
        }
    }

    return data;
}

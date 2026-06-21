import type { SessionDocument } from '$db/sessions/define.svelte';
import type { VineID, VinesDocument } from '$db/vines/define';
import type { VineTree } from 'src/vines/vine-tree.svelte';

type PieChartData = { name: string; value: number }[];

export function vines_pie_chart(
	focus_vine_id: string | undefined,
	entries: SessionDocument[],
	vine_tree: VineTree,
): PieChartData {
	const data: PieChartData = [];
	const focus_vine = focus_vine_id ? vine_tree.findVine(focus_vine_id) : null;

	for (const entry of entries) {
		const entry_vine = entry.vine_id ? vine_tree.findVine(entry.vine_id) : null;
		const entry_vine_parent_id = entry_vine?.getDocProp('parent_id') ?? null;
		const entry_vine_parent = entry_vine_parent_id
			? vine_tree.findVine(entry_vine_parent_id)
			: null;
		const entry_vine_children = entry_vine ? entry_vine.getChildren() : [];

		// Only include children of the specified vine if vine_id is provided
		if (
			focus_vine_id &&
			!entry_vine_children?.find((child) => child.getDocProp('id') == entry?.vine_id)
		) {
			continue;
		}

		// Determine the label for this pie slice
		let slice_name: string = '';
		if (focus_vine_id || !entry_vine_parent) {
			slice_name = entry_vine?.getDocProp('title') ?? '';
		} else {
			slice_name = entry_vine_parent?.getDocProp('title') ?? '';
		}

		// Find if this slice already exists
		const data_index = data.findIndex((dataEntry) => dataEntry.name === slice_name);

		if (data_index === -1) {
			// Calculate elapsed time for all child tasks
			let children_elapsed_time = 0;

			if (entry_vine_children) {
				for (const child of entry_vine_children) {
					const entries_with_child = entries.filter((e) => e.vine_id == child.getDocProp('id'));

					for (const child_entry of entries_with_child) {
						children_elapsed_time += child_entry.get_time_elapsed();
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
		if (focus_vine_id) {
			for (const child of focus_vine?.getChildren() ?? []) {
				data.push({
					name: child?.getDocProp('title') ?? 'Unknown Task',
					value: 0,
				});
			}
		} else {
			for (const root of vine_tree
				.getRoots()
				.values()
				.filter((root) => (root.getDocProp('parent_id') ? false : true))) {
				data.push({
					name: root.getDocProp('title'),
					value: 0,
				});
			}
		}
	}

	return data;
}

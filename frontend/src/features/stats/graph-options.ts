import type { EChartsOption } from 'echarts';
import { DateTime } from 'luxon';

import type { LegendOption, TooltipOption, XAXisOption, YAXisOption } from 'echarts/types/dist/shared';
import i18next from 'i18next';
import type { SeriesType, SourceType } from './graphs/histogram';

export const tooltip_formatter = (params: Array<object>, mode: 'WEEKS' | 'MONTHS' = 'WEEKS') => {

	let htmlString = '';
	if (params.length > 1) {
		if (mode == 'WEEKS') {
			htmlString += `<div><strong>${params[0].axisValue}</strong></div>`;
		} else if (mode == 'MONTHS') {
			htmlString += `<div><strong>${DateTime.fromISO(params[0].axisValue).toLocaleString({ month: 'long', year: 'numeric' })}</strong></div>`;
		}
	}

	let total_time = 0;

	params.forEach((param: any) => {
		const focusTime = param.value[param.encode.y[0]];

		if (focusTime) {
			total_time += focusTime;
		}

		if (focusTime === undefined) return;
		if (param.dimensionNames[param.seriesIndex + 1] == undefined) return;

		if (focusTime < 1) {
			htmlString += `
                                <div class="flex justify-between gap-2">
                        <span>${param.marker} ${param.seriesName}</span> <span class="font-bold">${Math.floor(
													focusTime * 60,
												)} min</span>
                                </div>
                            `;
			return;
		} else {
			htmlString += `
                                <div>
                                   ${param.marker} ${param.dimensionNames[param.seriesIndex + 1]}: ${Math.floor(
																			focusTime,
																		)} h ${Math.floor((focusTime % 1) * 60)} min
                                </div>
                            `;
		}
	});

	if (Number.isNaN(total_time)) {
		return htmlString;
	}
	if (total_time < 1) {
		htmlString += `<div class="flex justify-between gap-2"><span>Totale tijd</span> <span class="font-bold">${Math.floor(total_time * 60)} min</span></div>`;
	} else {
		htmlString += `<div class="flex justify-between gap-2"><span>Totale tijd</span> <span class="font-bold">${Math.floor(
			total_time,
		)} h ${Math.floor((total_time % 1) * 60)} min</span></div>`;
	}
	return htmlString;
};

export const day_options = {
	color: [] as string[],
	legend: {
		padding: [0, 0, 0, 0],
		type: 'scroll',
		textStyle: {
			color: '#333' as string,
		},
	} as LegendOption,
	datazoom: [],
	xAxis: {
		type: 'category',
		name: i18next.t('statistics:date'),
		nameLocation: 'middle',
		nameGap: 30,
		axisTick: {
			interval: 0,
		},
		axisLabel: {
			interval: 0,
			formatter: (value: string) =>
				DateTime.fromISO(value).toLocaleString({
					day: '2-digit',
					weekday: 'short',
				}),
		}, // Remove year from date
		axisLine: {
			lineStyle: {
				color: '#333' as string,
			},
		},
	} as XAXisOption,
	dataset: {
		source: [] as SourceType,
	},
	yAxis: {
		type: 'value',
		name: i18next.t('statistics:focus_time_hours'),
		nameLocation: 'end',
		nameTextStyle: {
			padding: [0, 0, 0, 30],
			color: '',
		},
		minInterval: 0.5,
		nameGap: 30,
		axisLabel: {
			formatter: '{value} h',
			margin: 2,
			showMinLabel: false,
			textStyle: {
				color: '#333' as string,
			},
		},
		min: 0,
		axisLine: {
			lineStyle: {
				color: '#333' as string,
			},
		},
		splitLine: {
			lineStyle: {
				color: '#333' as string,
			},
		},
	} as YAXisOption,
	series: [] as SeriesType,
	tooltip: {
		trigger: 'axis',
		confine: true,
		backgroundColor: '',
		formatter: (params) => tooltip_formatter(params, "WEEKS"),
		borderColor: '',
		textStyle: {
			color: '',
		},
	} as TooltipOption,
};

export const year_options = {
	...day_options,
	xAxis: {
		...day_options.xAxis,
		axisLabel: {
			interval: 0,
			formatter: (value: string) =>
				DateTime.fromISO(value).toLocaleString({
					month: 'short',
				}),
		},
	}as XAXisOption,
	tooltip: {
		...day_options.tooltip,
		formatter: (params) => tooltip_formatter(params, 'MONTHS'),
	} as TooltipOption,
};

export const vine_day_options = day_options;
export const vine_year_options = year_options;

export const vine_pie_options = {
	tooltip: {
		trigger: 'item',
	},
	series: [
		{
			type: 'pie',
			data: [],
			label: {},
			radius: '50%',
			tooltip: {
				formatter: (data) => {
					const value = data.value;

					if (value >= 3600) {
						return `<div class="flex gap-2 items-center"><span>${data.marker} ${data.name}</span> <span class="font-bold">${Math.floor(value / 3600)} h ${Math.floor((value % 3600) / 60)}</span></div>`;
					} else {
						return `<div class="flex gap-2 items-center">${data.marker} ${data.name}</span> <span class="font-bold">${Math.floor(value / 60)} min</span></div>`;
					}
				},
			},
		},
	],
} as EChartsOption;

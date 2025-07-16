import { m } from "$lib/paraglide/messages";
import { DateTime } from "luxon";
import type { LegendType, SeriesType, SourceType } from "./data";


export const tooltip_formatter = (params: Array<object>, mode: 'WEEKS' | 'MONTHS' = 'WEEKS') => {
    let htmlString = "";
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
        total_time += focusTime;

        if (focusTime === undefined) return;
        if (param.dimensionNames[param.seriesIndex + 1] == undefined) return;

        if (focusTime < 1) {
            htmlString += `
                                <div>
                        ${param.marker} ${param.dimensionNames[param.seriesIndex + 1]}: ${Math.floor(
                focusTime * 60,
            )} min
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
        htmlString += `<div><strong>Totale tijd: ${Math.floor(
            total_time * 60,
        )} min</strong></div>`;
    } else {
        htmlString += `<div><strong>Totale tijd: ${Math.floor(
            total_time,
        )} h ${Math.floor((total_time % 1) * 60)} min</strong></div>`;
    }
    return htmlString;
};

export const day_options = {
    color: [] as string[],
    legend: {
        padding: [0, 0, 0, 0],
        type: "scroll",
        data: [] as LegendType,
        textStyle: {
            color: '#333' as string
        }
    },
    datazoom: [],
    xAxis: {
        type: "category",
        name: m.date(),
        nameLocation: "middle",
        nameGap: 30,
        axisTick: {
            interval: 0
        },
        axisLabel: {
            interval: 0,
            formatter: (value: string) =>
                DateTime.fromISO(value).toLocaleString({
                    day: "2-digit",
                    weekday: "short",
                }),
        }, // Remove year from date
        axisLine: {
            lineStyle: {
                color: '#333' as string
            },
        }
    },
    dataset: {
        source: [] as SourceType,
    },
    yAxis: {
        type: "value",
        name: m.focus_time_hours(),
        nameLocation: "end",
        nameTextStyle: {
            padding: [0, 0, 0, 30],
            color: ''
        },
        minInterval: 0.5,
        nameGap: 30,
        axisLabel: {
            formatter: "{value} h",
            margin: 2,
            showMinLabel: false,
            textStyle: {
                color: '#333' as string
            },
        },
        min: 0,
        axisLine: {
            lineStyle: {
                color: '#333' as string
            },
        },
        splitLine: {
            lineStyle: {
                color: '#333' as string
            },
        }
    },
    series: [] as SeriesType,
    tooltip: {
        trigger: 'axis',
        confine: true,
        formatter: tooltip_formatter,
        backgroundColor: '',
        borderColor: '',
        textStyle: {
            color: ''
        }
    }
};

export const year_options = {
    ...day_options,
    xAxis: {
        ...day_options.xAxis,
        axisLabel: {
            interval: 0,
            formatter: (value: string) =>
                DateTime.fromISO(value).toLocaleString({
                    month: "short"
                }),
        },
    },
    tooltip: {
        ...day_options.tooltip,
        formatter: (params) => tooltip_formatter(params, "MONTHS")
    }
};

export const vine_day_options = day_options;
export const vine_year_options = year_options;
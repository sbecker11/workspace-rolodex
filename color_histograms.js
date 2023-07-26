import { Chart } from './node_modules/chart/chart.js';

export function plotChipHistograms(colorChips) {
    let r_values = colorChips.map(chip => parseInt(chip.r));
    let g_values = colorChips.map(chip => parseInt(chip.g));
    let b_values = colorChips.map(chip => parseInt(chip.b));

    let data = {
        labels: Array.from({length: colorChips.length}, (_, i) => i + 1),
        datasets: [
            {
                label: 'Red Values',
                data: r_values,
                backgroundColor: 'rgba(255, 0, 0, 0.5)'
            },
            {
                label: 'Green Values',
                data: g_values,
                backgroundColor: 'rgba(0, 255, 0, 0.5)'
            },
            {
                label: 'Blue Values',
                data: b_values,
                backgroundColor: 'rgba(0, 0, 255, 0.5)'
            }
        ]
    };

    let ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Color Chip Index'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Color Value'
                    }
                }
            }
        }
    });
}

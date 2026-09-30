import type { Passage } from '../../types'

export const sciencePassages: Passage[] = [
  {
    id: 'science-p1',
    title: 'Experiment: Sunlight Exposure and Plant Growth',
    text: `A student wanted to test how daily sunlight exposure affects the growth of bean seedlings. Three groups of ten identical seedlings were planted in the same soil and watered equally. Group A received 4 hours of direct sunlight per day, Group B received 8 hours, and Group C received 12 hours. All other conditions were held constant. Average plant height (in centimeters) was recorded after 2 weeks.`,
    table: {
      headers: ['Group', 'Sunlight (hrs/day)', 'Avg. Height Day 7 (cm)', 'Avg. Height Day 14 (cm)'],
      rows: [
        ['A', '4', '5.1', '9.8'],
        ['B', '8', '7.4', '15.2'],
        ['C', '12', '7.6', '15.6'],
      ],
    },
  },
  {
    id: 'science-p2',
    title: 'Experiment: Temperature and Enzyme Reaction Rate',
    text: `Researchers measured how temperature affects the activity of a digestive enzyme by mixing a fixed amount of enzyme with a substrate solution at five different temperatures. They recorded the rate of product formation (in micromoles per minute) at each temperature. The enzyme is known to begin losing its structural shape (denaturing) above 45°C.`,
    table: {
      headers: ['Temperature (°C)', 'Reaction Rate (µmol/min)'],
      rows: [
        ['10', '1.2'],
        ['20', '3.5'],
        ['30', '6.8'],
        ['40', '9.1'],
        ['50', '2.3'],
      ],
    },
  },
  {
    id: 'science-p3',
    title: 'Study: Water Salinity and Fish Species Diversity',
    text: `A team of marine biologists surveyed four coastal sites with differing salinity levels (measured in parts per thousand, ppt) and recorded the number of distinct fish species observed at each site over a one-month period.`,
    table: {
      headers: ['Site', 'Salinity (ppt)', 'Species Observed'],
      rows: [
        ['1', '5', '6'],
        ['2', '15', '14'],
        ['3', '25', '21'],
        ['4', '35', '11'],
      ],
    },
  },
]

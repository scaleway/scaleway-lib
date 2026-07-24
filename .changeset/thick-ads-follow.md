---
"@scaleway/use-i18n": minor
---

new `formatDuration` function

Basic usage
`formatDuration(3605) => 1 hour 5 seconds`
Clock format output
`formatDuration(3605, 'clock') => 01:00:05`
With date-fns formatDuration options
`formatDuration(3605, { zero: true, format: ['days', 'hours', 'minutes', 'seconds']}) => 0 days 1 hour 0 minutes 5 seconds`

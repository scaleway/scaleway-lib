export function isModifiedEvent(event: React.MouseEvent<HTMLAnchorElement>) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

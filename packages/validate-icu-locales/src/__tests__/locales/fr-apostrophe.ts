export default {
  // an apostrophe directly before '{' escapes the placeholder: {count} never renders
  'articles.selected': "l'{count} articles sélectionnés",
  // a doubled apostrophe renders one apostrophe and keeps {count} a live placeholder
  'articles.validDoubled': "l''{count} articles sélectionnés",
} as const

export function mountNotebookXLRuntime() {
  // Keep existing behavior untouched by loading the current app implementation.
  return import('../../app.js');
}

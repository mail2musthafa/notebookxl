import { mountNotebookXLRuntime } from '../runtime/app-runtime.js';

export function registerNotebookXLModules() {
  // FastAPI-like layering idea: entry -> module registry -> runtime mount
  mountNotebookXLRuntime();
}

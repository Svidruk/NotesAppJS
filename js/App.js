import {
  renderNotesTable,
  renderSummaryTable,
  renderArchivedNotesDropdown,
} from "./render.js";
import { initializeEventHandlers } from "./eventHandlers.js";

renderNotesTable();
renderSummaryTable();
renderArchivedNotesDropdown();
initializeEventHandlers();

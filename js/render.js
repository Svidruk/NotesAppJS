import { extractDates } from "./utils.js";
import { Categories } from "./constants.js";
import { notesData } from "./NotesData.js";

const archivedNotesDropdownBody = document.getElementById(
  "archivedNotesTableBody"
);
const summaryTableBody = document.getElementById("summaryTableBody");
const notesTableBody = document.getElementById("notesTableBody");

function renderNoteRow(note, index) {
  const row = document.createElement("tr");
  row.innerHTML = `
      <td class="column-0">
        <img class="icon" src="images/${note.category}.png" alt="${
    note.category
  }">
      </td >
      <td class="column-1">${note.category}</td>
      <td class="column-2">${note.name}</td>
      <td class="column-3">${note.content}</td>
      <td class="column-4">${extractDates(note.content).join(", ")}</td>
      <td class="column-5">${note.createdAt}</td>
      <td class="column-6">
      ${
        note.isArchived
          ? `<button class="button" data-index="${index}" data-action="archive">
          <img class="action-icon" src="images/archive.png" alt="Unarchive">
          </button>`
          : `
          <button class="button" data-index="${index}" data-action="edit">
          <img class="action-icon" src="images/edit.png" alt="Edit">
          </button>
          <button class="button" data-index="${index}" data-action="archive">
          <img class="action-icon" src="images/archive.png" alt="Archive">
          </button>
          `
      }
        <button class="button" data-index="${index}" data-action="remove">
        <img class="action-icon" src="images/remove.png" alt="Archive">
        </button>
      </td>
    `;
  return row;
}

export function renderNotesTable() {
  notesTableBody.innerHTML = "";
  for (let i = 0; i < notesData.length; i++) {
    const note = notesData[i];
    if (!note.isArchived) {
      const row = renderNoteRow(note, i);
      notesTableBody.appendChild(row);
    }
  }
}

export function getNotesCountByCategory(category) {
  return notesData.reduce(
    (count, note) => {
      if (note.category === category) {
        count[note.isArchived ? "archived" : "active"]++;
      }
      return count;
    },
    { active: 0, archived: 0 }
  );
}

export function renderSummaryTable() {
  summaryTableBody.innerHTML = "";
  for (const category of Object.values(Categories)) {
    const categoryNotesCount = getNotesCountByCategory(category);
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="icon-column">
                <img class="icon" src="images/${category}.png" alt="${category}">
                ${category}
            </td>
            <td>${categoryNotesCount.active}</td>
            <td>${categoryNotesCount.archived}</td>
        `;
    summaryTableBody.appendChild(row);
  }
}

export function renderArchivedNotesDropdown() {
  archivedNotesDropdownBody.innerHTML = "";
  for (let i = 0; i < notesData.length; i++) {
    const note = notesData[i];
    if (note.isArchived) {
      const row = renderNoteRow(note, i);
      archivedNotesDropdownBody.appendChild(row);
    }
  }
}

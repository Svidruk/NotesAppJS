import { extractDates } from "./utils.js";
import { Categories } from "./constants.js";
import { notesData } from "./NotesData.js";

const noteContentInput = document.getElementById("noteContent");
const noteCategorySelect = document.getElementById("noteCategory");
const notesTableBody = document.getElementById("notesTableBody");
const summaryTableBody = document.getElementById("summaryTableBody");
const archivedNotesDropdownBody = document.getElementById(
  "archivedNotesTableBody"
);
const archivedNotesDropdown = document.getElementById("archivedNotesDropdown");
const modal = document.getElementById("noteModal");
const showArchivedButton = document.querySelector(".showArchivedButton");
const createNoteButton = document.querySelector(".createNoteButton");
const closeModalButton = document.querySelector(".close");

var editingNoteId = null;

function renderNoteRow(note, index) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td class="column-0">
      <img class="icon" src="images/${note.category}.png" alt="${
    note.category
  }">
    </td >
    <td class="column-1">${note.category}</td>
    <td class="column-2">${note.content}</td>
    <td class="column-3">${extractDates(note.content).join(", ")}</td>
    <td class="column-4">${note.createdAt}</td>
    <td class="column-5">
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

function renderNotesTable() {
  notesTableBody.innerHTML = "";

  for (let i = 0; i < notesData.length; i++) {
    const note = notesData[i];
    if (!note.isArchived) {
      const row = renderNoteRow(note, i);
      notesTableBody.appendChild(row);
    }
  }
}

function resetModalForm() {
  noteContentInput.value = "";
  noteCategorySelect.value = Categories.Task;
}

function getNotesCountByCategory(category) {
  const count = {
    active: 0,
    archived: 0,
  };

  for (const note of notesData) {
    if (note.category === category) {
      if (note.isArchived) {
        count.archived++;
      } else {
        count.active++;
      }
    }
  }

  return count;
}

function renderSummaryTable() {
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

createNoteButton.addEventListener("click", () => {
  modal.style.display = "block";
  editingNoteId = null;
  resetModalForm();
});

function editNote(index) {
  modal.style.display = "block";
  editingNoteId = index;
  noteContentInput.value = notesData[index].content;
  noteCategorySelect.value = notesData[index].category;
}

function handleNoteInput(event) {
  event.preventDefault();
  if (editingNoteId === null) {
    const content = noteContentInput.value;
    const category = noteCategorySelect.value;
    const dates = extractDates(content);
    const newNote = {
      category,
      content,
      dates,
      createdAt: new Date().toLocaleDateString(),
      isArchived: false,
    };
    notesData.push(newNote);
  } else {
    if (noteContentInput.value !== null && noteContentInput.value !== "") {
      notesData[editingNoteId].content = noteContentInput.value;
      notesData[editingNoteId].category = noteCategorySelect.value;
      notesData[editingNoteId].dates = extractDates(noteContentInput.value);
    }
  }
  modal.style.display = "none";
  renderNotesTable();
  renderSummaryTable();
  resetModalForm();
}

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
    resetModalForm();
  }
});

closeModalButton.addEventListener("click", () => {
  modal.style.display = "none";
  resetModalForm();
});

function toggleArchiveNote(index) {
  notesData[index].isArchived = !notesData[index].isArchived;
  renderNotesTable();
  renderSummaryTable();
  renderArchivedNotesDropdown();
}

function removeArchiveNote(index) {
  notesData.splice(index, 1);
  renderNotesTable();
  renderSummaryTable();
  renderArchivedNotesDropdown();
}

document
  .getElementById("addNoteForm")
  .addEventListener("submit", handleNoteInput);

document.addEventListener("click", (event) => {
  const target = event.target;
  if (target.tagName === "BUTTON" && target.dataset.action) {
    const index = parseInt(target.dataset.index, 10);
    const action = target.dataset.action;
    try {
      if (action === "edit") {
        editNote(index);
      } else if (action === "archive") {
        toggleArchiveNote(index);
      } else if (action === "remove") {
        removeArchiveNote(index);
      }
    } catch (error) {
      console.error("Error performing action:", error);
    }
  }
});

function renderArchivedNotesDropdown() {
  archivedNotesDropdownBody.innerHTML = "";
  for (let i = 0; i < notesData.length; i++) {
    const note = notesData[i];
    if (note.isArchived) {
      const row = renderNoteRow(note, i);
      archivedNotesDropdownBody.appendChild(row);
    }
  }
}

function showArchivedNotesDropdown() {
  if (archivedNotesDropdown.style.display === "none") {
    archivedNotesDropdown.style.removeProperty("display");
  } else {
    archivedNotesDropdown.style.display = "none";
  }
}

showArchivedButton.addEventListener("click", showArchivedNotesDropdown);
renderNotesTable();
renderSummaryTable();

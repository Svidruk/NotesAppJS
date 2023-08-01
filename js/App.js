import { extractDates } from "./utils.js";
import { Categories } from "./constants.js";
import { notesData } from "./NotesData.js";

const noteContentInput = document.getElementById("noteContent");
const noteCategorySelect = document.getElementById("noteCategory");
const notesTableBody = document.getElementById("notesTableBody");
const summaryTableBody = document.getElementById("summaryTableBody");
const showArchivedButton = document.getElementById("showArchivedButton");
const archivedNotesDropdownBody = document.getElementById(
  "archivedNotesTableBody"
);
const archivedNotesDropdown = document.getElementById("archivedNotesDropdown");

function renderNoteRow(note, index) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td class="icon-column">
      <img class="icon" src="images/${note.category}.png" alt="${
    note.category
  }">
      ${note.category}
    </td>
    <td>${note.content}</td>
    <td>${extractDates(note.content).join(", ")}</td>
    <td>${note.createdAt}</td>
    <td>
      <button class="button" data-index="${index}" data-action="edit">
      <img class="button-icon" src="images/edit.png" alt="Edit">
      </button>
      <button class="button" data-index="${index}" data-action="archive">
      <img class="button-icon" src="images/archive.png" alt="Archive">
      </button>
      <button class="button" data-index="${index}" data-action="remove">
      <img class="button-icon" src="images/remove.png" alt="Archive">
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

function addNote(event) {
  event.preventDefault();

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
  renderNotesTable();
  renderSummaryTable();

  noteContentInput.value = "";
  noteCategorySelect.value = Categories.Task;
}

function editNote(index) {
  const newContent = prompt("Enter new content:", notesData[index].content);
  if (newContent !== null && newContent !== "") {
    notesData[index].content = newContent;
    notesData[index].dates = extractDates(newContent);
    renderNotesTable();
  }
}

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

document.getElementById("addNoteForm").addEventListener("submit", addNote);

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
        removeArchiveNote;
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
    renderArchivedNotesDropdown();
  } else {
    archivedNotesDropdown.style.display = "none";
  }
}

showArchivedButton.addEventListener("click", showArchivedNotesDropdown);
renderNotesTable();
renderSummaryTable();

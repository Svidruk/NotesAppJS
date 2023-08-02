import {
  renderNotesTable,
  renderSummaryTable,
  renderArchivedNotesDropdown,
} from "./render.js";
import { extractDates } from "./utils.js";
import { notesData } from "./NotesData.js";
import { Categories } from "./constants.js";

export function initializeEventHandlers() {
  const noteContentInput = document.getElementById("noteContent");
  const noteCategorySelect = document.getElementById("noteCategory");
  const noteNameInput = document.getElementById("noteName");
  const showArchivedButton = document.querySelector(".showArchivedButton");
  const createNoteButton = document.querySelector(".createNoteButton");
  const editNoteButton = document.getElementById("editNoteButton");
  const addNoteButton = document.getElementById("addNoteButton");
  const modal = document.getElementById("noteModal");
  const closeModalButton = document.querySelector(".close");
  const archivedNotesDropdown = document.getElementById(
    "archivedNotesDropdown"
  );

  createNoteButton.addEventListener("click", () => {
    resetModalForm();
    addNoteButton.style.display = "block";
    editNoteButton.style.display = "none";
    modal.style.display = "block";
  });

  function resetModalForm() {
    noteNameInput.value = "";
    noteContentInput.value = "";
    noteCategorySelect.value = Categories.Task;
  }

  function showEditModal(index) {
    addNoteButton.style.display = " none";
    editNoteButton.style.display = "block";
    modal.style.display = "block";
    editNoteButton.setAttribute("data-index", index);
    noteNameInput.value = notesData[index].name;
    noteContentInput.value = notesData[index].content;
    noteCategorySelect.value = notesData[index].category;
  }

  editNoteButton.addEventListener("click", editNoteInput);

  function addNoteInput(event) {
    event.preventDefault();
    const name = noteNameInput.value;
    const content = noteContentInput.value;
    const category = noteCategorySelect.value;
    const dates = extractDates(content);
    const newNote = {
      category,
      name,
      content,
      dates,
      createdAt: new Date().toLocaleDateString(),
      isArchived: false,
    };
    notesData.push(newNote);
    modal.style.display = "none";
    renderNotesTable();
    renderSummaryTable();
    resetModalForm();
  }

  function editNoteInput(event) {
    event.preventDefault();
    let index = event.target.dataset.index;
    try {
      console.log(index);
      notesData[index].name = noteNameInput.value;
      notesData[index].content = noteContentInput.value;
      notesData[index].category = noteCategorySelect.value;
      notesData[index].dates = extractDates(noteContentInput.value);
      renderNotesTable();
      renderSummaryTable();
      resetModalForm();
      modal.style.display = "none";
    } catch (error) {
      console.error("Error editing note:", error);
    }
  }

  window.addEventListener("dblclick", (event) => {
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
    renderArchivedNotesDropdown();
  }

  function showArchivedNotesDropdown() {
    if (archivedNotesDropdown.style.display === "none") {
      archivedNotesDropdown.style.removeProperty("display");
    } else {
      archivedNotesDropdown.style.display = "none";
    }
  }

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target.tagName === "BUTTON" && target.dataset.action) {
      const index = parseInt(target.dataset.index, 10);
      const action = target.dataset.action;
      try {
        if (action === "edit") {
          showEditModal(index);
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
  showArchivedButton.addEventListener("click", showArchivedNotesDropdown);
  addNoteButton.addEventListener("click", addNoteInput);
}

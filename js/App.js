import { notesData } from "./NotesData";

const noteInput = document.getElementById("noteInput");
const dateInput = document.getElementById("dateInput");
const categoryInput = document.getElementById("categoryInput");
const addButton = document.getElementById("addButton");
const notesList = document.getElementById("notesList");

function getCurrentDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString("en-US");
  const time = now.toLocaleTimeString("en-US", { hour12: false });
  return `${date} ${time}`;
}

function createNoteElement(text, date, category) {
  const noteItem = document.createElement("li");
  noteItem.className = "note";
  noteItem.innerHTML = `
      <div class="note-item">${text}</div>
      <div class="note-item">${category}</div>
      <div class="note-item">${getCurrentDateTime()}</div>
      <div class="note-item">${text}</div>
      <div class="note-item">${date}</div>
  `;
  return noteItem;
}

function addNoteToList(noteElement) {
  notesList.appendChild(noteElement);
}

document.addEventListener("DOMContentLoaded", function () {
  notesData.forEach((note) => {
    addNoteToList(note.text, note.date, note.category);
  });

  addButton.addEventListener("click", function () {
    const noteText = noteInput.value.trim();
    const date = dateInput.value;
    const category = categoryInput.value;

    if (noteText !== "") {
      const noteElement = createNoteElement(noteText, date, category);
      addNoteToList(noteElement);
      noteInput.value = "";
      dateInput.value = "";
      categoryInput.value = "";
    }
  });
});

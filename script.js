// 🔥 Конфигурация Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDVl5kDmJnhKxxayNrfieRJ4W0oAGFWIGM",
    authDomain: "notes-app-2d26e.firebaseapp.com",
    databaseURL: "https://notes-app-2d26e-default-rtdb.firebaseio.com",
    projectId: "notes-app-2d26e",
    storageBucket: "notes-app-2d26e.appspot.com",
    messagingSenderId: "237083753552",
    appId: "1:237083753552:web:041cea721cf41147e42555"
};

// 🔥 Инициализируем Firebase (ИМЕННО ТАК!)
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🔹 DOM-элементы
const noteInput = document.getElementById("noteInput");
const addNoteButton = document.getElementById("addNoteButton");
const clearNotesButton = document.getElementById("clearNotesButton");
const notesList = document.getElementById("notesList");

// ✅ Проверяем, загружается ли Firebase
console.log("🔥 Firebase загружен:", firebase);

// 📌 Функция отображения всех заметок
function displayAll() {
    notesList.innerHTML = "";

    // Загружаем заметки из Firebase
    db.ref("notes").on("value", (snapshot) => {
        notesList.innerHTML = ""; // Очищаем список перед обновлением

        snapshot.forEach((childSnapshot) => {
            let noteData = childSnapshot.val();
            let noteKey = childSnapshot.key;

            let li = document.createElement("li");
            li.textContent = noteData.text;

            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Удалить";

            let changeButton = document.createElement("button");
            changeButton.textContent = "Редактировать";

            // 📌 Удаление заметки
            deleteButton.addEventListener("click", () => {
                db.ref("notes/" + noteKey).remove();
            });

            // 📌 Редактирование заметки
            changeButton.addEventListener("click", () => {
                li.innerHTML = "";

                let editInput = document.createElement("input");
                editInput.value = noteData.text;

                let saveButton = document.createElement("button");
                saveButton.textContent = "Сохранить";

                let cancelButton = document.createElement("button");
                cancelButton.textContent = "Отмена";

                saveButton.addEventListener("click", () => {
                    let newText = editInput.value.trim();

                    if (newText === "") {
                        alert("Введите текст");
                        return;
                    }

                    db.ref("notes/" + noteKey).update({ text: newText });

                    displayAll();
                });

                cancelButton.addEventListener("click", () => {
                    displayAll();
                });

                li.appendChild(editInput);
                li.appendChild(saveButton);
                li.appendChild(cancelButton);
            });

            li.appendChild(deleteButton);
            li.appendChild(changeButton);
            notesList.appendChild(li);
        });
    });
}

// 📌 Добавление новой заметки
addNoteButton.addEventListener("click", () => {
    let textInput = noteInput.value.trim();

    if (textInput === "") {
        alert("Введите текст");
        return;
    }

    db.ref("notes").push({ text: textInput, timestamp: Date.now() });

    noteInput.value = "";
});

// 📌 Очистка всех заметок
clearNotesButton.addEventListener("click", () => {
    db.ref("notes").remove();
});

// 🚀 Загружаем заметки при запуске
displayAll();

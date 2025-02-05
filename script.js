// 🔹 Подключение Firebase (ЗАМЕНИ НА СВОИ ДАННЫЕ!)
const firebaseConfig = {
    apiKey: "ТВОЙ_API_КЛЮЧ",
    authDomain: "ТВОЙ_ПРОЕКТ.firebaseapp.com",
    databaseURL: "https://ТВОЙ_ПРОЕКТ.firebaseio.com",
    projectId: "ТВОЙ_ПРОЕКТ",
    storageBucket: "ТВОЙ_ПРОЕКТ.appspot.com",
    messagingSenderId: "ТВОЙ_ID",
    appId: "ТВОЙ_APP_ID"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🔹 Функция отображения всех заметок
function displayAll() {
    notesList.innerHTML = "";

    // ⬇️ Изменено: теперь загружаем заметки из Firebase
    db.ref("notes").on("value", (snapshot) => {
        notesList.innerHTML = ""; // Очищаем список перед обновлением

        snapshot.forEach((childSnapshot) => {
            let noteData = childSnapshot.val(); // Получаем данные заметки
            let noteKey = childSnapshot.key; // Уникальный ключ заметки

            let li = document.createElement("li");
            li.textContent = noteData.text; // ⬅️ Ранее использовался localStorage

            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Удалить";

            let changeButton = document.createElement("button");
            changeButton.textContent = "Редактировать";

            // ⬇️ Изменено: теперь удаляем заметку из Firebase
            deleteButton.addEventListener("click", () => {
                db.ref("notes/" + noteKey).remove();
            });

            // ⬇️ Изменено: теперь редактируем заметку в Firebase
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

                    db.ref("notes/" + noteKey).update({ text: newText }); // ⬅️ Обновляем в Firebase

                    displayAll(); // Обновляем список
                });

                cancelButton.addEventListener("click", () => {
                    displayAll(); // Отменяем редактирование
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

// ⬇️ Изменено: теперь добавляем заметки в Firebase
addNoteButton.addEventListener("click", () => {
    let textInput = noteInput.value.trim();

    if (textInput === "") {
        alert("Введите текст");
        return;
    }

    db.ref("notes").push({ // ⬅️ Теперь сохраняем в Firebase
        text: textInput,
        timestamp: Date.now()
    });

    noteInput.value = "";
});

// ⬇️ Изменено: теперь очищаем все заметки в Firebase
clearNotesButton.addEventListener("click", () => {
    db.ref("notes").remove(); // Удаляем все данные из базы
});

// Загружаем заметки при запуске (Firebase теперь основной источник данных)
displayAll();

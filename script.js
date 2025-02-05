
        const noteInput = document.getElementById("noteInput");
        const addNoteButton = document.getElementById("addNoteButton");
        const clearNotesButton = document.getElementById("clearNotesButton");
        const notesList = document.getElementById("notesList");

        let list = JSON.parse(localStorage.getItem("list")) || [];

        function displayAll() {
            notesList.innerHTML = "";

            list.forEach((note, index) => {
                let li = document.createElement("li");
                li.textContent = note;

                let deleteButton = document.createElement("button");
                deleteButton.textContent = "Удалить";

                let changeButton = document.createElement("button");
                changeButton.textContent = "Редактировать";


                deleteButton.addEventListener("click", () => {
                    list.splice(index, 1);
                    localStorage.setItem("list", JSON.stringify(list));
                    displayAll();
                });


                changeButton.addEventListener("click", () => {
                    
                    li.innerHTML = "";

                    let editInput  = document.createElement("input");
                    editInput .value = note;

                    let saveButton = document.createElement("button");
                    saveButton.textContent = "Сохранить"

                    let cancelButton = document.createElement("button");
                    cancelButton.textContent = "Отмена";



                    saveButton.addEventListener("click", () => {
                        let newMessage = editInput .value.trim();

                        if (newMessage === "") {
                            alert("Введите текст");
                            return;
                        }

                        list[index] = newMessage;

                        localStorage.setItem("list", JSON.stringify(list));

                        displayAll();

                        
                    })

                    cancelButton.addEventListener("click", () => {
                        displayAll(); // Просто обновляем, чтобы вернуться к старому виду
                    });

                                        
                    li.appendChild (editInput);
                    li.appendChild (saveButton);
                    li.appendChild(cancelButton);

                })


                li.appendChild(deleteButton);
                li.appendChild(changeButton)
                notesList.appendChild(li);
            });
        }

        displayAll();

        addNoteButton.addEventListener("click", () => {
            let textInput = noteInput.value.trim();

            if (textInput === "") {
                alert("Введите текст");
                return;
            }

            list.push(textInput);
            localStorage.setItem("list", JSON.stringify(list));

            noteInput.value = "";
            displayAll();
        });

        clearNotesButton.addEventListener("click", () => {
            localStorage.removeItem("list");
            list = [];
            noteInput.value = "";
            displayAll();
        });

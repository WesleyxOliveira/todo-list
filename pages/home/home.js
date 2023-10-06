let todoForm = document.querySelector('#todo-form');
let todoInput = document.querySelector('#todo-input');
let tasksContainer = document.querySelector('.tasks-container');

let todoContainer = document.querySelector('.todo-container');
let editContainer = document.querySelector('.edit-container');
let editInput = document.querySelector('#edit-input');
let updateTask = document.querySelector('#update-task');
var user = null;

function clearScreen() {
    let allTasksOnScreen = document.querySelectorAll('.task');

    allTasksOnScreen.forEach(taskOnscreen => {
        taskOnscreen.remove();
    })
}

db.collection('tasks').onSnapshot(() => {
    getAllTasks();
});

function getAllTasks() {
    clearScreen();
    user = auth.currentUser.uid;

    db.collection('tasks').doc(user).get()
        .then(doc => {
            let arr = doc.data().arr;

            addTasksToScreen(arr);
        })
}

function generateRandomId() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';

    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * caracteres.length);
        id += caracteres.charAt(randomIndex);
    }

    return id;
}


function saveTasks(inputValue) {
    const user = auth.currentUser.uid;

    db.collection('tasks').doc(user).set({
        arr: firebase.firestore.FieldValue.arrayUnion({ taskTitle: inputValue, status: '', id: generateRandomId() }),
    }, { merge: true }
    ).then(() => {
        //Success
    }).catch(error => {
        console.log(error.message);
    })
}

function addTasksToScreen(arr) {
    arr.forEach(taskValue => {

        const task = document.createElement('div');
        task.classList.add('task');
        task.id = taskValue.id;
        if (taskValue.status) {
            task.classList.add(taskValue.status);
        }

        const todoTitle = document.createElement('h3');
        todoTitle.innerHTML = taskValue.taskTitle;
        task.appendChild(todoTitle);

        const checkBtn = document.createElement('button');
        checkBtn.id = 'done';
        checkBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        task.appendChild(checkBtn);

        const editBtn = document.createElement('button');
        editBtn.id = 'edit';
        editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
        task.appendChild(editBtn);

        const removeBtn = document.createElement('button');
        removeBtn.id = 'remove';
        removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        task.appendChild(removeBtn);

        tasksContainer.appendChild(task)
    })
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputValue = todoInput.value;

    if (inputValue) {
        saveTasks(inputValue);
    } else {
        alert('Preencha os campos abaixo e tente novamente');
    }

    todoInput.value = '';
    todoInput.focus();
});

//Ações dos botões done, edit e delete
document.addEventListener('click', (e) => {

    const targetEl = e.target;
    const parentEl = targetEl.closest('div');
    let taskTitle;

    function checkStatus(snapshot) {
        let arr = snapshot.arr;

        arr.forEach(element => {
            if (element.id == parentEl.id) {
                if (element.status == 'done') {
                    element.status = '';
                } else {
                    element.status = 'done';
                }
            }
        })        
        updateDb(snapshot);
    }

    // Pegando o objeto no db para atualizar o status
    function getStatusDb() {
        db.collection('tasks').doc(user).get()
            .then((snapshot) => {
                checkStatus(snapshot.data());
            })
            .catch((error) => {
                console.log(`${error}: ${error.message}`);
            })
    }

    //Atualizando o objeto da tarefa no db
    function updateDb(doc) {
        db.collection('tasks').doc(user).update(doc)
            .then(() => {
                console.log('Tarefa atualizada com sucesso!');
            })
            .catch((error) => {
                console.log(`${error}: ${error.message}`);
            })
    }

    if (targetEl.id == 'done') {
        parentEl.classList.toggle('done');

        getStatusDb();
        
        // let doc = checkStatus(getTasks(), parentEl.id);

        // updateDb(doc);
    }

    function deleteTaskOnDb(snapshot, parentElId) {
        for (let i = 0; i < snapshot.arr.length; i++) {
            if (snapshot.arr[i].id == parentEl.id) {
                snapshot.arr.splice(i, 1);
            }
        }
        return snapshot;
    }

    if (targetEl.id == 'remove') {
        db.collection('tasks').doc(user).get()
            .then((snapshot) => {
                let deletedTask = deleteTaskOnDb(snapshot.data(), parentEl.id)

                db.collection('tasks').doc(user).update(deletedTask)
                    .then(() => {
                        console.log('Deletado com sucesso!');
                    })
                    .catch(error => {
                        console.log(error);
                    })
            })
        parentEl.remove();
    }

    if (targetEl.id == 'edit') {

        if (parentEl && parentEl.querySelector('h3')) {
            taskTitle = parentEl.querySelector('h3').innerText;

            todoContainer.style.display = 'none';

            editContainer.style.display = 'block';

            editInput.value = taskTitle;
            editInput.focus();
        }

        currentTask = parentEl;

        function updateTaskDb(snapshot, currentTask, editInput) {
            snapshot.arr.forEach(element => {
                if (element.id == currentTask.id) {
                    element.taskTitle = editInput.value;
                }
            })

            return snapshot;
        }

        updateTask.addEventListener('click', (e) => {
            e.preventDefault();

            db.collection('tasks').doc(user).get()
                .then(snapshot => {
                    let updatedTask = updateTaskDb(snapshot.data(), currentTask, editInput);

                    db.collection('tasks').doc(user).update(updatedTask)
                        .then(() => {
                            console.log('Tarefa atualizado com sucesso!');
                        })
                        .catch(error => {
                            console.log(`${error}: ${error.message}`);
                        })
                })

            currentTask.querySelector('h3').innerText = editInput.value;

            todoContainer.style.display = 'block';

            editContainer.style.display = 'none';

            todoInput.focus();
        })
    }
})

function logout() {
    firebase.auth().signOut();
    window.location.href = '../../index.html';
}

function hideEdit(e) {
    e.preventDefault();

    editContainer.style.display = 'none';
    todoContainer.style.display = 'block';
}
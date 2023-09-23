let todoForm = document.querySelector('#todo-form');
let todoInput = document.querySelector('#todo-input');
let tasksContainer = document.querySelector('.tasks-container');

let todoContainer = document.querySelector('.todo-container');
let editContainer = document.querySelector('.edit-container');
let editInput = document.querySelector('#edit-input');
let updateTask = document.querySelector('#update-task');

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
    let user = auth.currentUser.uid;

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
        task.classList.add(taskValue.status)
        task.id = taskValue.id;

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




document.addEventListener('click', (e) => {

    const targetEl = e.target;
    const parentEl = targetEl.closest('div');
    let taskTitle;

    if (targetEl.id == 'done') {
        parentEl.classList.toggle('done');

        let id = parentEl.id
        console.log(id);

        db.collection('tasks').where('id', '==', id).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                console.log(doc);
            })
        })
    }

    if (targetEl.id == 'remove') {
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

        updateTask.addEventListener('click', (e) => {
            e.preventDefault();

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
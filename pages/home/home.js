let todoForm = document.querySelector('#todo-form');
let todoInput = document.querySelector('#todo-input');
let tasksContainer = document.querySelector('.tasks-container');

let todoContainer = document.querySelector('.todo-container');
let editContainer = document.querySelector('.edit-container');
let editInput = document.querySelector('#edit-input');
let updateTask = document.querySelector('#update-task');
let currentTask;

auth.onAuthStateChanged((user) => {
    if (user) {
        findTasks(user);
    }
})

function findTasks(user) {
    db.collection('tasks').doc(user.uid).get().then((snapshot) => {
        let arr = snapshot.data().arr;

        arr.forEach(element => {
            saveTodo(element);
        });
    })
}

function logout() {
    firebase.auth().signOut();
    window.location.href = '../../index.html';
}

function saveTodo(inputValue) {
    const user = auth.currentUser.uid;
    let taskValue = null;

    if(typeof inputValue == 'object') {
        taskValue = inputValue.taskTitle;
    } else {
        taskValue = inputValue;
    }   

    db.collection('tasks').doc(user).set({
        arr: firebase.firestore.FieldValue.arrayUnion({taskTitle: taskValue, status: ''}),
    }, {merge: true}
    ).then(() => {
        //resolvido
    }).catch(error => {
        console.log(error);
    })

    const task = document.createElement('div');
    task.classList.add('task');

    const todoTitle = document.createElement('h3');
    todoTitle.innerHTML = taskValue;
    task.appendChild(todoTitle);

    const checkBtn = document.createElement('button');
    checkBtn.id = 'done';
    checkBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    task.appendChild(checkBtn);
    checkBtn.addEventListener('click', (e) => {
        let targetEl = e.target;
        let parentEl = targetEl.closest('div');

        parentEl.classList.toggle('done');

        //Parei aqui, falta fazer um toggle na proprieda status no firebase  
        
    })

    const editBtn = document.createElement('button');
    editBtn.id = 'edit';
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    task.appendChild(editBtn);

    const removeBtn = document.createElement('button');
    removeBtn.id = 'remove';
    removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    task.appendChild(removeBtn);

    tasksContainer.appendChild(task)
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputValue = todoInput.value;

    if (inputValue) {
        saveTodo(inputValue);
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

    // if (targetEl.id == 'done') {
    //     parentEl.classList.toggle('done');
    // }

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

function hideEdit(e) {
    e.preventDefault();

    editContainer.style.display = 'none';
    todoContainer.style.display = 'block';
}
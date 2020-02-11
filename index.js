function addTask() {
    const task = createTask();
    document.querySelector('#container-main').appendChild(task);
}

function createTask() {
    const task = document.createElement('div');
    task.setAttribute('contenteditable', true);
    task.setAttribute('tabindex', '0');

    task.addEventListener('mousedown', mouseDown);
    task.addEventListener("onkeydown", onInput);
    task.addEventListener("focus", event => {
        selected2 = event.currentTarget
    }, true);

    task.addEventListener("blur", event => {
        selected2 = null;
    }, true);

    task.classList.add('Task');
    task.innerHTML = `
        <h3> Task </h3>
        <span> Some useful text </span>
    `
    return task;
}

function addTaskListeners(task) {
    task.addEventListener('mousedown', mouseDown);
    task.addEventListener("onkeydown", onInput);
    task.addEventListener("focus", event => {
        selected2 = event.currentTarget
    }, true);

    task.addEventListener("blur", event => {
        selected2 = null;
    }, true);
}

function startCommandMode() {
    window.__task__cmd__on = true;
}

function stopCommandMode() {
    window.__task__cmd__on = false;
}

function onInput(event) {
    event.preventDefault();

    if (!event.metaKey) {
        return;
    }
}

function deleteTask(task) {
    document.querySelector('#container-main').removeChild(task);
}

function makeDraggable(element) {
    element.addEventListener('mousedown', mouseDown);
}

function mouseDown(event) {
    selected = event.currentTarget;
    offset = [
        selected.offsetLeft - event.clientX,
        selected.offsetTop - event.clientY
    ];
}

function mouseUp() {
    selected = null;
}

function mouseMove(event) {
    event.preventDefault();
    event.stopPropagation();
    if (selected) {
        selected.style.left = ((event.clientX + offset[0])) + 'px';
        selected.style.top = ((event.clientY + offset[1])) + 'px';
    }
}

var mousePosition;
var offset = [0, 0];
var div;
var isDown = false;

let selected = null;
let selected2 = null;


document.addEventListener('mouseup', mouseUp, true);

document.addEventListener('mousemove', mouseMove, true);

window.onbeforeunload = function (event) {
    localStorage.setItem('task.status', document.querySelector('#container-main').innerHTML);
};

document.addEventListener("keydown", function (event) {
    if (event.keyCode == 27 && window.__task__cmd__on) {
        event.preventDefault();
        stopCommandMode();
    }

    if ((event.ctrlKey || event.metaKey) && event.key == 'p') {
        event.preventDefault();
        return startCommandMode();
    }

    if ((event.ctrlKey || event.metaKey) && event.key == 'n') {
        event.preventDefault();
        addTask();
        return;
    }

    if (!selected2) {
        return;
    }

    if (event.ctrlKey && event.key == 'd') {
        event.preventDefault();
        deleteTask(selected2);
        return;
    }

    if (event.metaKey) {
        switch (event.key) {
            case 'd':
                deleteTask(selected2);
                event.preventDefault();
            case '1':
                selected2.style.borderBottom = '8px solid limegreen';
                event.preventDefault();
                break;
            case '2':
                selected2.style.borderBottom = '8px solid orange';
                event.preventDefault();
                break;
            case '3':
                selected2.style.borderBottom = '8px solid tomato';
                event.preventDefault();
                break;
            case '4':
                selected2.style.borderBottom = '8px solid royalblue';
                event.preventDefault();
                break;
        }
    }
});

const status = localStorage.getItem('task.status');
if (status) {
    document.querySelector('#container-main').innerHTML = status;
    document.querySelectorAll('.Task').forEach(task => {
        addTaskListeners(task);
    });
}
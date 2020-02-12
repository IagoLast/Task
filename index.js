const GRID_SIZE = 210;
let draggedTask = null;
let draggedTaskOffset = [0, 0];
let taskWithFocus = null;

function addTask() {
    const id = getTaskId()
    const task = createTask({ id });
    document.querySelector('#container-main').appendChild(task);
    document.querySelector('#container-main').setAttribute('data-last-task-id', id);
    task.focus();
}

function getTaskId() {
    const id = parseInt(document.querySelector('#container-main').getAttribute('data-last-task-id'));
    return id + 1;
}

function createTask({ id }) {
    const task = document.createElement('div');

    task.setAttribute('contenteditable', true);
    task.setAttribute('tabindex', '0');

    task.setAttribute('data-id', id);
    task.classList.add('Task');



    addTaskListeners(task);

    task.innerHTML = `
        <h3> ISSUE-00${id} </h3>
        <span> Some useful text </span>
    `
    return task;
}

function addTaskListeners(task) {
    task.addEventListener('mousedown', mouseDown);
    task.addEventListener("onkeydown", onInput);
    task.addEventListener("focus", event => taskWithFocus = event.currentTarget, true);
    task.addEventListener("blur", () => taskWithFocus = null, true);
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
    draggedTask = event.currentTarget;
    draggedTaskOffset = [
        draggedTask.offsetLeft - event.clientX,
        draggedTask.offsetTop - event.clientY
    ];
}

function mouseUp() {
    draggedTask = null;
}

function mouseMove(event) {
    event.preventDefault();
    event.stopPropagation();
    if (draggedTask) {
        const { x, y } = {
            x: event.shiftKey ? round(event.clientX + draggedTaskOffset[0], GRID_SIZE) : event.clientX + draggedTaskOffset[0],
            y: event.shiftKey ? round(event.clientY + draggedTaskOffset[1], GRID_SIZE / 2) : event.clientY + draggedTaskOffset[1],
        }
        draggedTask.style.left = x + 'px';
        draggedTask.style.top = y + 'px';
    }
}

function persistState() {
    localStorage.setItem('task.status', document.querySelector('#container-main').innerHTML);
    localStorage.setItem('task.lastID', document.querySelector('#container-main').getAttribute('data-last-task-id'));
}

function loadState() {
    const status = localStorage.getItem('task.status');
    if (status !== null && status.trim() !== '') {
        const lastID = parseInt(localStorage.getItem('task.lastID'));
        document.querySelector('#container-main').setAttribute('data-last-task-id', lastID);
        document.querySelector('#container-main').innerHTML = status;
        document.querySelectorAll('.Task').forEach(task => {
            addTaskListeners(task);
        });
    }
}

function moveTask(task, x, y) {
    task.style.left = task.offsetLeft + x + 'px';
    task.style.top = task.offsetTop + y + 'px';
}

function round(value, grid) {
    return (value / grid).toFixed() * grid;
}

function showCmd() {
    document.querySelector('aside').style.bottom = '0px';
    document.querySelector('#input-cmd').focus();
}

function hideCmd() {
    document.querySelector('aside').style.bottom = '-90px';
}

function isCmdVisible() {
    return document.querySelector('aside').style.bottom == '0px';
}

function addLink(taskID, link) {
    const task = document.querySelector(`[data-id="${taskID}"]`);
    const a = document.createElement('a');
    a.setAttribute('href', link);
    a.setAttribute('target', '_blank');
    a.innerText = link;
    task.appendChild(a);
}

function assignTask(taskID) {
    const task = document.querySelector(`[data-id="${taskID}"]`);
    const a = document.createElement('img');
    a.classList.add('Asignee');
    a.setAttribute('src', '/avatar.png');
    task.appendChild(a);

}


document.addEventListener('mouseup', mouseUp, true);

document.addEventListener('mousemove', mouseMove, true);

document.addEventListener("keydown", function (event) {
    if (event.keyCode == 27 && isCmdVisible()) {
        event.preventDefault();
        hideCmd();
    }

    if ((event.ctrlKey || event.metaKey) && event.key == 'p') {
        event.preventDefault();
        isCmdVisible() ? hideCmd() : showCmd();
        return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key == 'n') {
        event.preventDefault();
        addTask();
        return;
    }

    if (!taskWithFocus) {
        return;
    }

    if (event.ctrlKey && event.key == 'd') {
        event.preventDefault();
        deleteTask(taskWithFocus);
        return;
    }

    if (event.metaKey) {
        switch (event.keyCode) {
            case 37:
                event.preventDefault();
                moveTask(taskWithFocus, -GRID_SIZE, 0);
                return
            case 38:
                event.preventDefault();
                moveTask(taskWithFocus, 0, -GRID_SIZE / 2);
                return
            case 39:
                event.preventDefault();
                moveTask(taskWithFocus, GRID_SIZE, 0);
                return
            case 40:
                event.preventDefault();
                moveTask(taskWithFocus, 0, GRID_SIZE / 2);
                return
        }
    }

    if (event.metaKey) {
        switch (event.key) {
            case 'd':
                deleteTask(taskWithFocus);
                event.preventDefault();
            case '1':
                taskWithFocus.style.borderBottom = '8px solid limegreen';
                event.preventDefault();
                break;
            case '2':
                taskWithFocus.style.borderBottom = '8px solid orange';
                event.preventDefault();
                break;
            case '3':
                taskWithFocus.style.borderBottom = '8px solid tomato';
                event.preventDefault();
                break;
            case '4':
                taskWithFocus.style.borderBottom = '8px solid royalblue';
                event.preventDefault();
                break;
        }
    }
});

document.querySelector('#input-cmd').addEventListener('change', event => {
    let cmd, taskid, url;
    const CMD_REGEX = /:[a-z]*/;

    const input = event.target.value;
    [cmd] = CMD_REGEX.exec(event.target.value);
    document.querySelector('#input-cmd').value = '';

    switch (cmd) {
        case ':new':
            addTask();
            hideCmd();
            break;
        case ':clean':
            document.querySelector('#container-main').setAttribute('data-last-task-id', 0);
            document.querySelector('#container-main').innerHTML = '';
            break;
        case ':link':
            [cmd, taskId, url] = input.match(/([\S]+)/g);
            addLink(taskId, url);
            break;
        case ':asign':
            [cmd, taskId] = input.match(/([\S]+)/g);
            assignTask(taskId);
            break;

        default:
            break;
    }
});

window.onbeforeunload = persistState;

loadState();
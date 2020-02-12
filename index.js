const GRID_SIZE = 210;
let offset = [0, 0];
let selected = null;
let selected2 = null;

function addTask() {
    const task = createTask();
    document.querySelector('#container-main').appendChild(task);
    task.focus();
}

function createTask() {
    const task = document.createElement('div');

    task.setAttribute('contenteditable', true);
    task.setAttribute('tabindex', '0');
    task.classList.add('Task');



    addTaskListeners(task);

    task.innerHTML = `
        <h3> Task </h3>
        <span> Some useful text </span>
    `
    return task;
}

function addTaskListeners(task) {
    task.addEventListener('mousedown', mouseDown);
    task.addEventListener("onkeydown", onInput);
    task.addEventListener("focus", event => selected2 = event.currentTarget, true);
    task.addEventListener("blur", () => selected2 = null, true);
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
        const { x, y } = {
            x: event.shiftKey ? round(event.clientX + offset[0], GRID_SIZE) : event.clientX + offset[0],
            y: event.shiftKey ? round(event.clientY + offset[1], GRID_SIZE / 2) : event.clientY + offset[1],
        }
        selected.style.left = x + 'px';
        selected.style.top = y + 'px';
    }
}

function persistState() {
    localStorage.setItem('task.status', document.querySelector('#container-main').innerHTML);
}

function loadState() {
    const status = localStorage.getItem('task.status');
    if (status) {
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


window.onbeforeunload = persistState;

document.addEventListener('mouseup', mouseUp, true);

document.addEventListener('mousemove', mouseMove, true);

document.addEventListener('load', loadState, true);

document.addEventListener("keydown", function (event) {
    if (event.keyCode == 27 && isCmdVisible()) {
        event.preventDefault();
        hideCmd();
    }

    if ((event.ctrlKey || event.metaKey) && event.key == 'p') {
        event.preventDefault();
        return showCmd();
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
        switch (event.keyCode) {
            case 37:
                event.preventDefault();
                moveTask(selected2, -GRID_SIZE, 0);
                return
            case 38:
                event.preventDefault();
                moveTask(selected2, 0, -GRID_SIZE / 2);
                return
            case 39:
                event.preventDefault();
                moveTask(selected2, GRID_SIZE, 0);
                return
            case 40:
                event.preventDefault();
                moveTask(selected2, 0, GRID_SIZE / 2);
                return
        }
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

document.querySelector('#input-cmd').addEventListener('change', event => {
    const cmd = event.target.value;
    document.querySelector('#input-cmd').value = '';
    debugger;
    switch (cmd) {
        case ':new':
            addTask();
            break;
    
        default:
            break;
    }
});


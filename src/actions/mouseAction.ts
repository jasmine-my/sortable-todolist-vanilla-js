import {addTodoItem, getCurrentItems, insertItem, render} from './listAction';

let mouseStartItemId: number;
let mouseEndItemId: number;
let mouseMoving = false;

const cancelDragging = () => {
    const cancelKeyUp = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            console.log(':::Key Escape:::');
            mouseMoving = false;
            const dragging = document.querySelector('.dragging') as HTMLElement;
            const dragover = document.querySelector('.dragover') as HTMLElement;

            dragging?.classList.remove('dragging');
            dragover?.classList.remove('dragover');
        }
    };
    window.addEventListener('keyup', cancelKeyUp);
};

window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.isComposing) {
        e.preventDefault();
        console.log(':::Key Enter:::')
        addTodoItem();
        render();
    }
})

window.addEventListener(('mouseup'), (e) => {
    // 마우스를 뗏을 때 dragover 클래스가 붙어있던 것을 제거해준다.
    const items = document.querySelectorAll('.item.dragover') as unknown;
    (items as HTMLElement[]).forEach((i) => i.classList.remove('dragover'));

    const { currentItemUnCompleted, isNotOnButton } = getCurrentItems(e);

    isNotOnButton(() => {
        mouseMoving = false;

        if (currentItemUnCompleted) {
            mouseEndItemId = Number(currentItemUnCompleted.id);

            insertItem(mouseStartItemId, mouseEndItemId);
            render();
        }
    });

    const dragging = document.querySelector('.dragging') as HTMLElement;
    dragging?.classList.remove('dragging');
});

window.addEventListener(('mousedown'), (e) => {
    const { currentItemUnCompleted, isNotOnButton } = getCurrentItems(e);

    isNotOnButton(() => {
        mouseMoving = true;

        if (currentItemUnCompleted && mouseMoving) {
            currentItemUnCompleted.classList.add('dragging');

            mouseStartItemId = Number(currentItemUnCompleted.id);
        }

        cancelDragging();
    });
});

window.addEventListener(('mousemove'), (e) => {
    const mouseY = e.clientY;

    if (mouseMoving) {
        // 드래깅중이 아닌 요소를 제외한 나머지 노드들의 목록을 구하고
        const siblings = document.querySelectorAll('.item:not(.dragging)') as unknown;
        // 그 목록들 중에서 마우스의 위치가 아이템내에 있다면 해당 아이템에 dragover 클래스를 붙여준다.
        (siblings as HTMLElement[]).forEach((item) => {
            const isMouseEnterInItem = mouseY <= item.offsetTop + item.offsetHeight && mouseY > item.offsetTop;
            isMouseEnterInItem ? item.classList.add('dragover') : item.classList.remove('dragover');
        });
    }
});
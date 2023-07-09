import '~styles/style.scss';

interface ToDoItem {
    id: number;
    content: string;
    isCompleted: boolean;
}

type FilterOption = 'all' | 'completed' | 'uncompleted';

// to-do list 배열
const todoLists: ToDoItem[] = [];
// 필터링 조건
let filterOption: FilterOption = 'all';

const isIncluded = (itemId: number): boolean => todoLists.some((i) => i.id === itemId);
const getIndexOfItem = (id: number) => todoLists.map(i => i.id).indexOf(id);


// todoLists 를 화면에 보여주는 렌더 함수
const render = () => {
    const items = document.querySelector('.items');
    const total = document.querySelector('.total-numbers');
    const removeAllButton = document.querySelector('.remove-all');
    const filed = document.getElementById('new-item-content');

    const list = filterTodoLists();

    if (items && total && removeAllButton && filed) {
        items.innerHTML = '';
        // list 목록을 돌면서 ul 안에 li 삽입
        list.map((item) => {
            items.innerHTML += `
                <li id='${item.id}' class='item ${item.isCompleted ? 'completed' : 'uncompleted'}'>
                        <div class='left'>
                            <span class='btn-check'></span>
                            <p class='content'>${item.content}</p>
                        </div>
                        <div class='right'>
                            <span class='btn-remove'></span>
                        </div>
                    </li>
            `;
        });

        total.innerHTML = `총 ${list.length}개`;

        removeAllButton.innerHTML = `
            <i class='icon fa-solid  fa-trash'></i>
            <span>전체 삭제(${list.length})</span>
        `;

        filed.focus();
    }
};

const addTodoItem = () => {
    const content = document.getElementsByTagName('input')[0];
    const value = content.value;

    if (value.length > 0) {
        const newItem: ToDoItem = {
            id: Math.random(),
            content: value,
            isCompleted: false,
        };
        todoLists.push(newItem);
        content.value = '';
    } else {
        alert('내용을 입력해 주세요');
    }
};

// 아이템 삭제
const removeItem = (itemId: number) => {
    if (isIncluded(itemId)) {
        const indexToRemove = getIndexOfItem(itemId);
        todoLists.splice(indexToRemove, 1);
    }
};

const removeAllItems = () => {
    // 현재 필터링된 목록을 돌면서 removeItem 함수 실행하기
    const filtered = filterTodoLists();
    filtered.forEach((itemToRemove) => {
        removeItem(itemToRemove.id);
    });
};

const insertItem = (startItemId: number, endItemId: number) => {
    const startItem = todoLists.filter((i) => i.id === startItemId);
    const nextIndex = getIndexOfItem(endItemId);

    // 삭제
    removeItem(startItemId);
    // 원하는 위치에 item 다시 추가
    todoLists.splice(nextIndex, 0, ...startItem);
};

// 목록 필터링
const filterTodoLists = (): ToDoItem[] => {
    let filtered: ToDoItem[] = [...todoLists];
    // 지금 체크된 상태값 확인후 해당 상태값인 아이템들만 필터링하기
    if (filterOption === 'completed' as FilterOption) {
        filtered = todoLists.filter((item) => item.isCompleted);
    } else if (filterOption == 'uncompleted' as FilterOption) {
        filtered = todoLists.filter((item) => !item.isCompleted);
    }

    return filtered;
};

// 필터링 하는 태그 토글
const toggleTag = (clickedEl: HTMLElement) => {
    // 전체 태그 selected 해제
    const tags = document.querySelectorAll('.tag');
    tags.forEach((tag) => tag.classList.remove('selected'));

    // 클릭한 요소에만 selected className 추가
    clickedEl.classList.toggle('selected');
    filterOption = clickedEl.getAttribute('data-tag-id') as FilterOption;
};

// 클로저 함수로 현재 이벤트 발생한 위치에서 가장 가까운 to-do 아이템을 찾는다.
const getCurrentItems = (e: Event) => {
    const target = e.target as HTMLElement;
    const currentItem = target.closest('.item');
    const currentItemUnCompleted = target.closest('.item:not(.completed)');
    const checkBtn = target.closest('.btn-check');
    const removeBtn = target.closest('.btn-remove');

    // 체크, 삭제 버튼이 아닌 곳에서만 콜백 함수 실행
    const isNotOnButton = (cb: () => void) => {
        if (!checkBtn && !removeBtn) cb();
    };

    return { currentItem, currentItemUnCompleted, checkBtn, removeBtn, isNotOnButton };
};

window.onload = () => {
    // 초기 렌더링
    render();

    // 할일 추가 버튼
    const addButton = document.querySelector('.btn.add');
    addButton?.addEventListener('click', () => {
        addTodoItem();
        render();
    });

    // 전체 삭제 버튼
    const removeAllButton = document.querySelector('.btn.remove-all');
    removeAllButton?.addEventListener('click', () => {
        const confirmToRemoveAll = confirm('모두 삭제 하시겠습니까?');
        if (confirmToRemoveAll) {
            removeAllItems();
            render();
        }
    });

    // 상태 태그 토글 이벤트
    const tags = document.querySelector('.tags');
    tags?.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const tag = target.closest('.tag') as HTMLElement;

        if (tag) {
            toggleTag(tag);
            render();
        }
    });

    // 아이템 마다 이벤트 위임
    const items = document.querySelector('.items');
    // click 이벤트
    items?.addEventListener('click', (e) => {
        const { currentItem, checkBtn, removeBtn } = getCurrentItems(e);

        if (currentItem) {
            // 할일 완료
            if (checkBtn) {
                const indexOfItem = getIndexOfItem(Number(currentItem.id));
                todoLists[indexOfItem].isCompleted = !todoLists[indexOfItem].isCompleted;
                currentItem.classList.toggle('completed');

                render();
            }
            // 할일 삭제
            if (removeBtn) {
                removeItem(Number(currentItem.id));
                render();
            }
        }
    });
};


let mouseStartItemId: number;
let mouseEndItemId: number;
let mouseMoving = false;

const cancelDragging = () => {
    const cancelKeyUp = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            console.log('cancel');
            mouseMoving = false;
            const dragging = document.querySelector('.dragging') as HTMLElement;
            const dragover = document.querySelector('.dragover') as HTMLElement;

            dragging?.classList.remove('dragging');
            dragover?.classList.remove('dragover');
        }
    };
    window.addEventListener('keyup', cancelKeyUp);
};

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
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

export {
    todoLists,
    render,
    addTodoItem,
    insertItem,
    filterTodoLists,
    getIndexOfItem,
    removeAllItems,
    removeItem,
    toggleTag,
    isIncluded,
    getCurrentItems
};
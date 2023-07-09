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


// list를 화면에 보여주는 렌더 함수
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
                            <span id='btn-check' class='btn-check'>
                                <i class='icon fa-regular fa-square${item.isCompleted ? '-check' : ''}'></i>
                            </span>
                            <p class='content'>${item.content}</p>
                        </div>
                        <div class='right'>
                            <span class='btn-remove'></span>
                            <span class='btn-drag'></span>
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

const removeItem = (itemId: number) => {
    if (isIncluded(itemId)) {
        const indexToRemove = getIndexOfItem(itemId);
        // 삭제
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

const insertItem = (item: ToDoItem, itemToNext: ToDoItem) => {
    const nextIndex = getIndexOfItem(itemToNext.id);

    // 삭제
    removeItem(item.id);
    // 원하는 위치에 item 다시 추가
    todoLists.splice(nextIndex, 0, item);
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

window.onload = () => {
    // 초기 렌더링
    render();

    // 할일 추가 버튼
    const addButton = document.getElementById('btn-add');
    addButton?.addEventListener('click', () => {
        addTodoItem();
        render();
    });

    // 전체 삭제 버튼
    const removeAllButton = document.getElementById('btn-remove-all');
    removeAllButton?.addEventListener('click', () => {
        const confirmToRemoveAll = confirm('모두 삭제 하시겠습니까?');
        if (confirmToRemoveAll) {
            removeAllItems();
            render();
        }
    });

    // 태그 토글 이벤트
    const tags = document.querySelector('.tags');
    tags?.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const tag = target.closest('.tag') as HTMLElement;

        if (tag) {
            console.log(tag);
            toggleTag(tag);
            render();
        }
    });


    // 아이템 마다 이벤트 위임
    const items = document.querySelector('.items');
    // click 이벤트
    items?.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const item = target.closest('.item');
        const checkBtn = target.closest('.btn-check');
        const removeBtn = target.closest('.btn-remove');

        if (item) {
            // 할일 완료
            if (checkBtn) {
                item.classList.toggle('completed');
            }
            // 할일 삭제
            if (removeBtn) {
                console.log(Number(item.id));
                removeItem(Number(item.id));
                render();
            }
        }
    });

    // mousedown, mouseup, mousemove 이벤트
    items?.addEventListener('mousedown', (e) => {
        const target = e.target as HTMLElement;
        const item = target.closest('.item');
        const dragBtn = target.closest('.btn-drag');

        if (item && dragBtn) {
            console.log('mousedown', item);
        }
    });

    items?.addEventListener('mouseup', (e) => {
        const target = e.target as HTMLElement;
        const item = target.closest('.item');
        const dragBtn = target.closest('.btn-drag');

        if (item && dragBtn) {
            console.log('mouseup', item);
        }
    });

    items?.addEventListener('mousemove', (e) => {
        const target = e.target as HTMLElement;
        const item = target.closest('.item');
        const dragBtn = target.closest('.btn-drag');

        if (item && dragBtn) {
            console.log('mousemove', item);
        }
    });
};


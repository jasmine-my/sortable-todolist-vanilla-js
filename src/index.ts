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

const isIncluded = (item: ToDoItem): boolean => todoLists.some((i) => i.id === item.id);
const getIndexOfItem = (id: number) => todoLists.map(i => i.id).indexOf(id);

// todo: list를 화면에 보여주는 렌더 함수
const render = (list: ToDoItem[]) => {
    // ul 안에 list 맵 돌면서 li 삽입
    const items = document.querySelector('.items');
    if (items) {
        items.innerHTML = '';
        list.map((item) => {
            items.innerHTML += `
                <li class='item ${item.isCompleted ? 'completed' : 'uncompleted'}'>
                        <div class='left'>
                            <div class='check-box'>
                                <i class='icon fa-regular fa-square${item.isCompleted ? '-check' : ''}'></i>
                            </div>
                            <p class='content'>${item.content}</p>
                        </div>
                        <div class='right'>
                            <i class='icon fa-solid fa-trash'></i>
                            <i class='icon fa-solid fa-grip-vertical'></i>
                        </div>
                    </li>
            `;
        });
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

        // todo: render
        render(todoLists);
    } else {
        alert('내용을 입력해 주세요');
    }
};

const removeItem = (item: ToDoItem) => {
    if (isIncluded(item)) {
        const indexToRemove = getIndexOfItem(item.id);
        // 삭제
        todoLists.splice(indexToRemove, 1);

        // todo: render
        render(todoLists);
    }
};

const removeAllItems = () => {
    // 현재 조회한 목록을 돌면서 removeItem 실행하기
    const filtered = filterTodoLists();
    filtered.forEach((itemToRemove) => {
        removeItem(itemToRemove);
    });
    render(todoLists);
};

const insertItem = (item: ToDoItem, itemToNext: ToDoItem) => {
    const nextIndex = getIndexOfItem(itemToNext.id);

    // 삭제
    removeItem(item);
    // 원하는 위치에 item 다시 추가
    todoLists.splice(nextIndex, 0, item);

    //todo: render
    render(todoLists);
};

// 목록 필터링
const filterTodoLists = (): ToDoItem[] => {
    let filtered: ToDoItem[] = [...todoLists];
    // 지금 체크된 상태값 확인후 해당 상태값인 아이템들만 필터링하기
    // 전체 선택일때는 필터링을 하지 않도록 설계

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

    // 토글하는 순간 필터링한 결과 렌더
    const filtered = filterTodoLists();
    render(filtered);
};

window.onload = () => {
    render(todoLists);
    // 할일 추가 버튼
    const addButton = document.getElementById('btn-add');
    addButton?.addEventListener('click', addTodoItem);

    // 전체 삭제 버튼
    const removeAllButton = document.getElementById('btn-remove-all');
    removeAllButton?.addEventListener('click', () => {
        const confirmToRemoveAll = confirm('모두 삭제 하시겠습니까?');
        if (confirmToRemoveAll) {
            removeAllItems();
        }
    });

    document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const classList = target.classList;

        // 태그 토글 가능
        if (classList.contains('tag')) {
            console.log(classList);
            toggleTag(target);
        }
    });


    // todo: 아이템 마다 이벤트 위임
    // 할일 삭제

    // 완료 토글

    // drag&drop
};

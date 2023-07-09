import {
    addTodoItem,
    getCurrentItems,
    getIndexOfItem,
    removeAllItems,
    removeItem,
    render,
    todoLists,
    toggleTag,
} from './listAction';

window.onload = () => {
    // 초기 렌더링
    render();

    // 할일 추가 버튼
    const addButton = document.querySelector('.btn.add');
    addButton?.addEventListener('click', () => {
        console.log('c추가')
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


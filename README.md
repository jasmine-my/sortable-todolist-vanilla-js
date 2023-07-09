# sortable-todolist-vanilla-js
바닐라 자바스크립트(타입스크립트)로 만든 todo list

* [요구사항](#요구사항)
    + [1. webpack 기반 프로젝트 세팅](#1-webpack-기반-프로젝트-세팅)
    + [2. 기능 구현](#2-기능-구현)
      + [2-1. 입력부](#2-1-입력부)
      + [2-2. 목록부](#2-2-목록부)
      + [2-3. 정보부](#2-3-정보부)
      + [2-4. Drag & Drop 기능](#2-4-Drag-&-Drop-기능)
* [폴더구조](#폴더구조)
* [고민한 점](#고민한-점)
* [느낀점](#느낀점)


![메인](https://github.com/jasmine-my/sortable-todolist-vanilla-js/assets/83268528/ebb51404-26d3-43ca-b2da-bddb96b22667)



## 요구사항

### 1. webpack 기반 프로젝트 세팅
- [x] entry point를 만들고 webpack을 이용하여 하나의 번들 파일을 생성합니다.
- [x] 번들 파일은 npm run build를 통해 생성할 수 있도록 합니다.
- [x] npm run serve 명령을 통해 파일이 변경되는 HMR 될 수 있도록 합니다.
  - `package.json`
  - ```json
    "scripts": {
      "serve": "webpack serve --open --mode=development",
      "build": "webpack --mode=production",
    }
    ```
- [x] 소스 맵이 생성되도록 설정합니다.
  - ```javascript
    // webpack.config.js
    module.exports = {
      devtool: isDevMode ? 'eval-source-map' : 'source-map',
    }
    ```  
- [x] eslint 설정을 추가합니다.
- [x] babel 설정을 추가합니다.
  - 설정 옵션
  - ```javascript
    // babel.conifg.js
    use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env', {useBuiltIns: 'usage',}],
            },
          },
    ```
- [x] typescript 환경 구성을 추가합니다.
  - `tsconfig.json`
- [ ] npm run test 명령을 통해 TC가 동작하도록 합니다.


### 2. 기능 구현
#### 2-1. 입력부
한글로 KeyDownEvent 실행시 이벤트가 2번 발생되는 것을 방지하기 위해 이벤트 핸들러의 isComposing 속성이 false 일때만 `addTodoItem` 함수가 등록되도록 했습니다.
  - [x] input을 통해 입력
  - [x] Enter 키로 입력
  - [x] 등록된 todo 아이템은 상단에 추가
  - [x] 등록과 동시에 input 초기회

#### 2-2. 목록부
시간 부족으로 시간순서대로 정렬하는 부분을 구현하지 못했습니다.
  - [x] 등록된 Todo 목록 출력
  - [x] Todo는 등록 순으로 정렬되어 최근 목록이 상단에 위치해야 합니다.
  - Todo 아이템 구성
    - [x] 완료 여부를 나타내는 checkbox
    - [x] 내용을 나타내는 textNode
    - [x] `완료 상태`와 `완료 전` 상태를 구분할 수 있도록 '취소선'으로 표현
    - [x] 삭제 버튼 클릭시 해당되는 Todo 아이템을 삭제.
    - [x] checkbox를 토글 방식으로 상태를 변경할 수 있습니다.
    - [x] 완료된 Todo 아이템은 Todo 목록의 하단으로 이동시킵니다.
    - [ ] 이미 완료된 Todo 아이템을 `완료 전` 상태로 되돌린 경우, 등록된 시간 기준의 위치로 되돌아가도록 합니다.

#### 2-3. 정보부
필터링 역할을 하는 정보부를 목록부 바로 윗 부분에 위치시켜 현재 어떤 상태의 정보가 목록에 뜨는지 한눈에 잘 보이도록 구현 했습니다.
  - [x] `전체`, `완료 전`, `완료` Todo 아이템을 필터 할 수 있는 기능을 제공합니다.
  - [x] 필터 조건에 맞는 Todo 아이템의 개수를 출력합니다.
  - [x] 완료 된 Todo 항목을 제거하는 삭제 기능을 제공합니다. -> 필터별로 조회 후 필터링된 결과를 전부 삭제할 수 있는 기능으로 변경했습니다.
    - ![태그](https://github.com/jasmine-my/sortable-todolist-vanilla-js/assets/83268528/699989f1-5fd3-4ff6-96b0-1b0bf25b83ed)



#### 2-4. Drag & Drop 기능
마우스 이벤트만으로도 드래그앤 드롭 기능을 구현했습니다. 다만 preview 기능은 구현하지 못했습니다.
// 영상
  - [x] 라이브러리를 사용하지 않고 마우스 이벤트를 사용하여 드래그 앤 드롭 기능을 구현
  - [x] dragstart dragend 이벤트는 사용하지 않고, `mousedown, mouseup, mousemove` 이벤트로 구현
  - [x] `완료 전` 상태를 갖는 Todo 아이템들만 드래그 앤 드롭으로 위치를 변경할 수 있도록 설정
  - [x] 전체, 완료 전 필터 모두에서 드래그앤 드롭이 가능.
  - [x] 드래그 시 어디로 이동되는지 가이드 엘리먼트가(mirror) 표시합니다.
  - [x] 리스트 외부로 드롭 하는 경우 드래그가 취소됩니다.
  - [x] 드래그 도중 ESC를 누른 경우 드래그가 취소됩니다.
  - [ ] 이동시킬 시킬 위치에서 약 2초간 머무른 경우 블러 처리가 된 Todo 아이템이 해당 위치에 임시로 적용되어 preview가 나타납니다.
  - [ ] 리스트 외부로 드롭 또는 ESC를 누른 경우 preview가 제거됩니다.


***


## 폴더구조
![스크린샷 2023-07-10 오전 3 52 42](https://github.com/jasmine-my/sortable-todolist-vanilla-js/assets/83268528/730e1aba-b63a-44af-b12e-3f751bc83631)


| 폴더           | 용도                                                                                        |
| -------------- | --------------------------------------------------------------------- |
| **actions**    | 관심사나 기능별로 분리된 구현부                       |
| **styles**      | scss 스타일링 파일 보관             |
| **index.html**   | 프로젝트 템플릿  |
| **index.ts**   | webpack 진입 지점, actions 및 scss 파일을 한번에 불러와서 사용하는 파일 |



***


## 고민한 점
1. 서비스 로직과 뷰 로직을 분리하려 노력했습니다.
  - ![스크린샷 2023-07-10 오전 3 35 41](https://github.com/jasmine-my/sortable-todolist-vanilla-js/assets/83268528/0a1420b7-b395-45d1-b54d-6ecf0e92c2b3)

  - `actions` 라는 디렉토리 안에 로직을 구분해 정리했습니다.
  - `listActions`: todo에 기본적으로 사용되는 추가, 삭제, 정렬등의 기능이 구현되어 있습니다.
  - `mappingActions`: html 태그에 listActions에 있는 기능들을 연결하는 동작이 분리되어 있습니다.
  - `mouseActions`: 마우스 이벤트로 드래그앤드랍 기능을 구현하는 동작이 분리되어 있습니다.
    
2. 중복 사용되는 코드를 방지하기 위해 함수로 분리했습니다.
  - ```javascript
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
    ```     
3. 사용자가 서비스와 상호작용 하는 느낌을 받 수 있게 alert과 confirm을 사용했습니다.
  - ```javascript
    // 확인 버튼을 눌렀을때 모두 삭제 기능이 동작하도록 구현.
    const confirmToRemoveAll = confirm('모두 삭제 하시겠습니까?');
    if (confirmToRemoveAll) {
        removeAllItems();
        render();
    }
    ```

4. sass-loader
  - 코드의 가독성 향상을 위해 css 대신 scss 방식으로 스타일링 했습니다.


## 느낀점
1. 프레임워크의 도움을 받지 않고, 순수 자바스크립트로 기능을 구현해 본 것이 처음이라 시간 부족으로 일부 기능을 구현하지 못한점이 아쉽습니다.
2. 평소 리액트에서 이벤트 처리는 아주 쉽게 사용했었는데, 직접 이벤트 핸들러로 구현해보려 하니 `이벤트 위임` 부분이 어려웠습니다. 이론으로 보는 것 보다 직접 구현하며 익히니 잘 이해됐습니다.
3. 클로저 함수 역시 이론으로만 알고있을 때는 어려웠지만 리액트에서 커스텀 훅스를 구현할때처럼 하니 수월했습니다.
4. 테스트코드를 작성하지 못한 것이 아쉬웠습니다. 이번 기회로 테스트 코드 작성법을 공부해야겠다고 생각했습니다.

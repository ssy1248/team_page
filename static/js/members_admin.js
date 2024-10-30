// ======================================================================================================================
// ======================================================================================================================
// firebase db의 [members]로부터 데이터 로드

//-------------------------------------------------------------------------------------------------------------
// fire base connection
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, query, where } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { doc, addDoc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDz3wGRePugMYvj2U01AZQAUNxxUqxEW0g",
    authDomain: "sparta-d16df.firebaseapp.com",
    projectId: "sparta-d16df",
    storageBucket: "sparta-d16df.appspot.com",
    messagingSenderId: "705618231338",
    appId: "1:705618231338:web:88330fae016dc81f700353",
    measurementId: "G-G7F6HC716P"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const adminRef = collection(db, 'admin');
const adminDocs = await getDocs(adminRef);
// ======================================================================================================================
// ======================================================================================================================

let isAdminBtnClicked = false;
// 어드민 모드 버튼
$(document).on('click', '.button-admin', function () {
    console.log("[btn check] button-admin pressed");
    // 플래그 변수를 통해 버튼 눌린거 비주얼화
    isAdminBtnClicked = !isAdminBtnClicked;
    if (!isAdminBtnClicked)
        $(this).css('filter', 'brightness(1.0)'); // 활성화 시 밝게
    else
        $(this).css('filter', 'brightness(0.8)'); // 활성화 시 밝게

    toggleAdminSpace();
});
// 어드민 키 입력창 띄우기
function toggleAdminSpace() {
    console.log("[func check] toggleAdminSpace called");
    $('.admin-access').toggle('show');
};

// 어드민 키값 제출 버튼
$(document).on('click', '.button-admin-key-enter', async function () {
    console.log("[btn check] button-admin-key-enter pressed");
    let input = $('.admin-access-input').val();
    let isKeyMatched = await checkAdminKey(input);
    if (isKeyMatched) {
        showToast("correct");
    }
    else {
        showToast("wrong");
    }
    $('.admin-access-input').val('');
});
// 토스트 메시지 띄우기
function showToast(message, flag) {
    console.log("[func check] showToast called");
    $('.admin-toast').text(message); // 메시지 설정
    $('.admin-toast').addClass('showToast'); // 토스트 메시지 보이기

    // 일정 시간 후 토스트 메시지 숨기기
    setTimeout(() => {
        $('.admin-toast').removeClass('showToast');
    }, 1500); // 3초 후 사라짐
};

// firebase에서 어드민 키 확인하기
async function checkAdminKey(input) {
    console.log("[func check] checkAdminKey called");
    try {
        const adminKeys = adminDocs.docs.map(admin => admin.data().key);
        return adminKeys.includes(input);
    } catch (e) {
        console.error("[Error] cannot load admin data ", e);
        return false;
    }
};

// ======================================================================================================================
// ======================================================================================================================

// admin 모드 상태 플래그
let isAdmin = false;
// admin 모드 진입
function enterAdminMode() {
    isAdmin = true;
};
// admin 모드 탈출
function exitAdminMode() {
    isAdmin = false;
};

// ======================================================================================================================
// ======================================================================================================================

// 어드민 기능 : 멤버카드 생성 버튼
$(document).on('click', '.button-admin-create', async function () {
    console.log("[btn check] button-admin-create pressed");
    createMemberCard();
});
// 멤버카드 생성 팝업 띄우기
function createMemberCard() {
    let myModal = new bootstrap.Modal($('#memberModal')[0]);
    myModal.show();
    let modalBody = $('.modal-body');
    modalBody.empty();
    let tmp = `
                <h4 id="member-name"><input type="text" placehoder="팀원 이름" class="edited-name"></h4>
                <button type="button" class="button-enroll button-basic"> <img src="../static/img/icon-enroll.png" alt="FAILED TO LOAD IMG" class="img-button-enroll">등록</button>
                <img id="member-image" src="" alt="FAILED TO LOAD IMG" class="img-fluid mb-3"><input type="text" placehoder="이미지 URL" class="edited-image">
                <p id="member-text">
                    MBTI : <input type="text" placehoder="MBTI" class="edited-mbti">
                    <br>
                    자기소개 : <input type="text" placehoder="자기소개" class="edited-intro">
                    <br>
                    관심사 : <input type="text" placehoder="관심사" class="edited-interest">
                    <br>
                    좋아하는 게임 : <input type="text" placehoder="좋아하는 게임" class="edited-favGame">
                    <br><br>
                    + G A M E 키워드로 표현하기 +
                    <br>
                    G : <textarea rows="4" cols="30" class="edited-game_G" placehoder="G로 시작하는 키워드 영단어"></textarea>
                    <br>
                    A : <textarea rows="4" cols="30" class="edited-game_A" placehoder="G로 시작하는 키워드 영단어"></textarea>
                    <br>
                    M : <textarea rows="4" cols="30" class="edited-game_M" placehoder="G로 시작하는 키워드 영단어"></textarea>
                    <br>
                    E : <textarea rows="4" cols="30" class="edited-game_E" placehoder="G로 시작하는 키워드 영단어"></textarea>
                    <br><br>
                    Github Link : <input type="text" placehoder="Github Link" class="edited-linkGithub">
                    <br>
                    Blog Link :   <input type="text" placehoder="블로그 Link" class="edited-linkBlog">
                </p>
                <!-- GitHub, Blog 아이콘과 링크 -->
                <div class="modal-icons">
                </div>
    `;
    modalBody.append(tmp);
};

// 멤버카드 생성 팝업 모달에서 등록 버튼
$(document).on('click', '.button-enroll', async function () {
    console.log("[btn check] button-enroll pressed");
    enrollMemberInfos();
});

// 등록버튼: 새로 입력한 멤버정보 입력
async function enrollMemberInfos() {
    console.log("[func check] enrollMemberInfos called");
    try {
        let newID = generateRandomID();
        let newMember = {
            'id': newID,
            'name': $('.edited-name').val(),
            'image': $('.edited-image').val(),
            'mbti': $('.edited-mbti').val(),
            'intro': $('.edited-intro').val(),
            'interest': $('.edited-interest').val(),
            'favGame': $('.edited-favGame').val(),
            'game_G': $('.edited-game_G').val(),
            'game_A': $('.edited-game_A').val(),
            'game_M': $('.edited-game_M').val(),
            'game_E': $('.edited-game_E').val(),
            'linkGithub': $('.edited-linkGithub').val(),
            'linkBlog': $('.edited-linkBlog').val()
        };
        // 예외 처리: 작성하지 않은 필드
        const hasEmpty = Object.values(newMember).some(value => value.trim() === '');
        if (hasEmpty) {
            console.log("[Error] 작성하지 않은 필드가 존재.");
            alert('작성하지 않은 필드가 존재!');
            return;
        }

        // 새 멤버 데이터 추가
        await addDoc(collection(db, "members"), newMember);
        alert('새 팀원 등록완료');
        window.location.reload();
    } catch (e) {
        console.error("[Error] cannot enroll member", e);
    }
};

// ======================================================================================================================
// ======================================================================================================================
// id 생성 위한 난수 코드 생성

function generateRandomID(){
    const pool = '0123456789abcdefghijklmnopqrstuvwxyz';
    let result = '';
    const len = 8;  // 8자리로 생성
    for (let i = 0; i < len; i++) {
        const randIndex = Math.floor(Math.random() * pool.length);
        result += pool[randIndex];
    }
    return result;
}

// ======================================================================================================================
// ======================================================================================================================



$(document).on('click', '.card', function (event) {
    if (!$(event.target).is('button') && !$(event.target).is('img')) { // 클릭된 요소가 버튼이 아닌 경우에만 실행
        //selected 클래스 추가
        $(this).toggleClass('selected');
        //카드가 선택이 되면 아웃라인을 설정 아닐 시 기본 아웃라인을 보여줌
        $(this).css('outline', $(this).hasClass('selected') ? '2px solid red' : 'auto');
    }
});


// 어드민 기능 : 멤버카드 삭제
$(document).on('click', '.button-admin-delete', async function () {
    console.log("[btn check] button-admin-create pressed");
    deleteMemberCard();
});

function deleteMemberCard() {
    // 뷰에서 삭제
    //$('.card.selected').remove();

};

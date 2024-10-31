// ======================================================================================================================
// ======================================================================================================================
// firebase db의 [members]로부터 데이터 로드

//-------------------------------------------------------------------------------------------------------------
// fire base connection
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, query, where } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { doc, addDoc, getDocs, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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

const membersRef = collection(db, 'members');
const adminRef = collection(db, 'admin');
const adminDocs = await getDocs(adminRef);
// ======================================================================================================================
// ======================================================================================================================

// ======================================================================================================================
// ======================================================================================================================
// member.js로부터 가져와서 사용할 function 존재
import { loadAllMembers } from './members.js';


// ======================================================================================================================
// ======================================================================================================================



let isAdminBtnClicked = false;
// 어드민 모드 버튼
$(document).on('click', '.button-admin', function () {
    console.log("[btn check] button-admin pressed");
    // 플래그 변수를 통해 버튼 눌린거 비주얼화
    isAdminBtnClicked = !isAdminBtnClicked;
    if (!isAdminBtnClicked)
        $(this).css('filter', 'brightness(1.0)');
    else
        $(this).css('filter', 'brightness(0.8)');
    // 어드민 키 입력창 보이기
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
    // locked된 상황
    if (isLocked)  
        return;
    // 어드민 키값이 일치하게 되면, 어드민 모드 진입 / 불일치 시에는 틀렸음 알려주기
    let input = $('.admin-access-input').val();
    let isKeyMatched = await checkAdminKey(input);
    if (isKeyMatched) {
        showToast(":: ADMIN KEY MATCHED ::", 'blue');
        $('.button-admin').css('filter', 'brightness(1.0)');
        toggleAdminSpace();
        resetTrialCnt();
        enterAdminMode();
    }
    else {
        // 틀리면 시도 횟수 차감
        availableTrialCnt--;
        showToast("ACCESS DENIED", 'red');
        // 잔여 시도횟수 없으면 락 걸기
        if (availableTrialCnt <= 0) 
            lockAdminAccess();
    }
    // 어드민 키 입력창 값 비우기
    $('.admin-access-input').val('');
});
// 토스트 메시지 띄우기
function showToast(message, color = 'black') {
    console.log("[func check] showToast called");
    $('.admin-toast').text(message);
    $('.admin-toast').css('color', color);
    $('.admin-toast').addClass('showToast');
    // 일정 시간 후 토스트 메시지 숨기기
    setTimeout(() => {
        $('.admin-toast').removeClass('showToast');
    }, 1000);
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

// 어드민 키 입력 횟수 제한의 위한 추가 구현부
const adminAccessTrialConstraint = 3;       // 틀릴 기회
const lockTime = 10 * 1000;
let availableTrialCnt = adminAccessTrialConstraint;
let isLocked = false;
let timeout;
let remainTime;
// 시도가능 횟수 다시 부여
function resetTrialCnt(){
    availableTrialCnt = adminAccessTrialConstraint;
}
// 시도 가능횟수 초과 시 락 걸기
function lockAdminAccess(){
    isLocked = true;
    remainTime = lockTime;
    timeout = setInterval(function () {
        remainTime -= 1000;
        let secs = Math.floor(remainTime / 1000);
        $('.text-info-admin-access').html("시도횟수 초과로 잠겨있습니다.<br>" + secs + "초 후에 다시 시도하세요.");
        if (remainTime <= 0) {
            clearInterval(timeout); // 타이머 정지
            isLocked = false; // 잠금 해제
            availableTrialCnt = adminAccessTrialConstraint;
            $('.text-info-admin-access').text("");
        }
    }, 1000);
}
// ======================================================================================================================
// ======================================================================================================================



// ======================================================================================================================
// ======================================================================================================================
// === ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ ===
// +++++++ !!!!!!!!!! admin 모드인지에 대한 상태 파악 여부는, body 태그에 admin-mode가 있는지를 이용 !!!!!!!!!!!!!!
// === ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ ===
// ======================================================================================================================
// ======================================================================================================================
// admin 모드 진입
function enterAdminMode() {
    // 어드민 모드가 켜지면, body의 태그에 admin mode 추가, 그리고 only-admin 클래스 관리
    $('body').toggleClass('admin-mode');
    $('.only-admin').toggle();
    // 어드민 모드 세션 저장
    sessionStorage.setItem('admin-mode', 'true'); // 어드민 모드 상태 저장
};
// admin 모드 탈출
function exitAdminMode() {
    $('body').toggleClass('admin-mode');
    $('.only-admin').toggle();
    // 어드민 모드 세션 저장
    sessionStorage.setItem('admin-mode', 'false');
};

// admin과 관련하여 새로고침할 때 세션 정보를 위해
$(document).ready(function() {
    // 세션에 admin-mode가 되어 있으면 어드민으로
    const wasAdminMode = sessionStorage.getItem('admin-mode') === 'true';
    if (wasAdminMode){
        enterAdminMode();
    }   
});

// home 버튼 눌렀을 때 세션 admin 모드 탈출
$(".button-home").click(async function () {
    exitAdminMode();
    $(location).attr('href', '../main_home.html');
 });


// ======================================================================================================================
// ======================================================================================================================

// 어드민 모드 탈출 버튼
$(document).on('click', '.button-exit-admin', function () {
    console.log("[btn check] button-exit-admin pressed");
    // 플래그 변수를 통해 버튼 눌린거 비주얼화
    showToast("Return to GuestMode");
    exitAdminMode();
});

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
                <h4 id="member-name"><input type="text" placeholder="팀원 이름" class="edited-name"></h4>
                <button type="button" class="button-enroll button-basic"> <img src="../static/img/icon-enroll.png" alt="FAILED TO LOAD IMG" class="img-button-enroll">등록</button>
                <img id="member-image" src="" alt="FAILED TO LOAD IMG" class="img-fluid mb-3"><input type="text" placeholder="이미지 URL" class="edited-image">
                <p id="member-text">
                    MBTI : <input type="text" placeholder="MBTI" class="edited-mbti">
                    <br>
                    자기소개 : <input type="text" placeholder="자기소개" class="edited-intro">
                    <br>
                    관심사 : <input type="text" placeholder="관심사" class="edited-interest">
                    <br>
                    좋아하는 게임 : <input type="text" placeholder="좋아하는 게임" class="edited-favGame">
                    <br><br>
                    + G A M E 키워드로 표현하기 +
                    <br>
                    G : <textarea rows="4" cols="30" class="edited-game_G" placeholder="G로 시작하는 키워드 영단어"></textarea>
                    <br>
                    A : <textarea rows="4" cols="30" class="edited-game_A" placeholder="G로 시작하는 키워드 영단어"></textarea>
                    <br>
                    M : <textarea rows="4" cols="30" class="edited-game_M" placeholder="G로 시작하는 키워드 영단어"></textarea>
                    <br>
                    E : <textarea rows="4" cols="30" class="edited-game_E" placeholder="G로 시작하는 키워드 영단어"></textarea>
                    <br><br>
                    Github Link : <input type="text" placeholder="Github Link" class="edited-linkGithub">
                    <br>
                    Blog Link :   <input type="text" placeholder="블로그 Link" class="edited-linkBlog">
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
        let newMember = {
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
// 카드 선택으로 select
$(document).on('click', '.card', function (event) {
    console.log("[check] .card selection checked");
    // 단, admin-mode에서만 가능하므로,
    if (!($('body').hasClass('admin-mode'))) return;
    // 카드 내 버튼 누르는 게 아닐 때, <<< view 버튼을 눌러서 카드 선택말고 카드 들여다보기 해야하므로
    if (!$(event.target).is('button')) {       
        $(this).toggleClass('selected');
        $(this).css('outline', $(this).hasClass('selected') ? '4px solid yellow' : '0px auto');
    }
});

// 어드민 기능 : 현재 선택된 멤버들 기준으로 멤버카드 삭제
$(document).on('click', '.button-admin-delete', async function () {
    console.log("[btn check] button-admin-delete pressed");
    try {
        const selectedCards = $('.card.selected');
        console.log("selecteds : " + selectedCards.length);
        const myPromises = [];
        for (const card of selectedCards) {
            let selectedMemberName = $(card).closest('.member-card').find('.member-name').text();
            let selectedMember = query(membersRef, where('name', '==', selectedMemberName));
            const querySnapshot = await getDocs(selectedMember);
            querySnapshot.forEach((member) => {
                myPromises.push(deleteDoc(doc(db, "members", member.id)));
            });
        }
        await Promise.all(myPromises);
        window.location.reload();
        /* RELOAD로 새로고침하면 어드민 모드 탈출 해버리니까 이에 대한 대책 필요. */
    } catch (e) {
        console.error("[Error] cannot bring doc IDs : " + e);
    }
});

//==============================================================
//==============================================================
//==============================================================
// 에러 많은 레거시 코드는 이후 공부를 위해 잠시 백업
/*
async function deleteMemberCard() {
    for (const id of ids) {
        await deleteMemberData(id); // 각 ID에 대해 삭제 실행
    }
};
// db로부터 현재 선택된 멤버 문서id 들 배열로 가져오기
async function getSelectedMembersID(){
    console.log("[func check] getSelectedMembersID");
    try {
        // 리턴값으로 할 id값 배열
        const selectedCards = $('.card.selected');
        console.log("selecteds : " + selectedCards.length);
        const promises = [];
        const tmpIDs = [];
        for (const card of selectedCards) {
            let selectedMemberName = $(card).closest('.member-card').find('.member-name').text();
            let selectedMember = query(membersRef, where('name', '==', selectedMemberName));
            const querySnapshot = await getDocs(selectedMember);
            querySnapshot.forEach((member) => {
                //promises.push(deleteDoc(doc(db, "members", member.id)));
                promises.push(tmpIDs.push(member.id));
            });
        }
        await Promise.all(promises);
        return tmpIDs;
    } catch (e) {
        console.error("[Error] cannot bring doc IDs : " + e);
    }
}
*/
//==============================================================
//==============================================================
//==============================================================


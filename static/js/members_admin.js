// ======================================================================================================================
// ======================================================================================================================
// firebase db의 [members]로부터 데이터 로드

//-------------------------------------------------------------------------------------------------------------
// fire base connection
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, query, where } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { doc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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
    if (isKeyMatched){
        showToast("correct");
    }
    else{
        showToast("wrong");
    }
});
// 토스트 메시지 띄우기
function showToast(message) {
    console.log("[func check] showToast called");
    $('.admin-toast').text(message); // 메시지 설정
    $('.admin-toast').addClass('showToast'); // 토스트 메시지 보이기

    // 일정 시간 후 토스트 메시지 숨기기
    setTimeout(() => {
        $('.admin-toast').removeClass('showToast');
    }, 3000); // 3초 후 사라짐
};

// firebase에서 어드민 키 확인하기
async function checkAdminKey(input){
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
function enterAdminMode(){
    isAdmin = true;
}
// admin 모드 탈출
function exitAdminMode(){
    isAdmin = false;
}
//-------------------------------------------------------------------------------------------------------------
// fire base connection

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, query, where } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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

//-------------------------------------------------------------------------------------------------------------


// js 파일 제대로 읽히는지 테스트
console.log("test log: i am memberjs");
//-------------------------------------------------------------------------------------------------------------
// LEGACY CODE: 백엔드 없이 프론트엔드 임시 테스트용
// 버튼 액션: 모달 띄우기
function showModal(name, text, image) {
    console.log("func :: showModal called");

    let myModal = new bootstrap.Modal($('#memberModal')[0]);
    myModal.show();
};
//-------------------------------------------------------------------------------------------------------------

// 전역으로 함수 노출
window.showModal = showModal;





//-------------------------------------------------------------------------------------------------------------
// 전체 카드 불러오기

const membersRef = collection(db, 'members');
const members = await getDocs(membersRef);

$('.member-cards').empty();
members.forEach((member) => {
    let name = member.data().name;
    let image = member.data().image;

    let temp_html = `           
            <div class="member-card">
                <div class="card">
                    <img src="${image}" class="member-image" alt="...">
                    <h4 class="member-name">${name}</h4>
                </div>
            </div>
            `;
    $('.member-cards').append(temp_html);
});




// card 클래스 클릭 시 팝업 띄우기
$('.card').click(async function () {
    // firebase db의 [members]로부터 데이터 로드 : 쿼리:: 해당하는 팀원 이름으로 검색
    const membersRef = collection(db, 'members');
    let targetMemberName = $(this).find('.member-name').text();
    let member = query(membersRef, where('name', '==', targetMemberName));

    console.log("targetMemberName : " + targetMemberName);

    try {
        // 로드한 데이터 분류
        const querySnapshot = await getDocs(member);
        querySnapshot.forEach((member) => {
            let name = member.data().name;
            let image = member.data().image;
            let mbti = member.data().mbti;
            let intro = member.data().intro;
            let interest = member.data().mbti;
            let favGame = member.data().favGame;
            let game_G = member.data().game_G;
            let game_A = member.data().game_A;
            let game_M = member.data().game_M;
            let game_E = member.data().game_E;
            let linkGithub = member.data().linkGithub;
            let linkBlog = member.data().linkBlog;

            // 데이터 기반 모달창 html 생성

            let tempHtml = `
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modal-label">멤버 정보</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <h4 id="member-name">${name}</h4>
                <img id="member-image" src="${image}" alt="FAILED TO LOAD IMG" class="img-fluid mb-3">
                <p id="member-text">
                    MBTI : ${mbti}
                    <br>
                    자기소개 : ${intro}
                    <br>
                    관심사 : ${interest}
                    <br>
                    좋아하는 게임 : ${favGame}
                    <br><br>
                    + G A M E 키워드로 표현하기 +
                    <br>
                    G : ${game_G}
                    <br>
                    A : ${game_A}
                    <br>
                    M : ${game_M}
                    <br>
                    E : ${game_E}
                    <br><br>
                </p>
                <!-- GitHub, Blog 아이콘과 링크 -->
                <div class="modal-icons">
                    <a href="${linkGithub}" target="_blank"><img src="../static/img/github-mark.png" alt="FAILED TO LOAD GitHub Icon" class="icon"></a>
                    <a href="${linkBlog}" target="_blank"><img src="../static/img/icon-blog.png" alt="FAILED TO LOAD Blog Icon" class="icon"></a>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
            </div>
        </div>
        `;
            // html 초기화하고 붙여주기
            $(".member-modal").empty();
            $(".member-modal").append(tempHtml);
            // 해당 내용의 모달창 띄우기
            let myModal = new bootstrap.Modal($('#memberModal')[0]);
            myModal.show();
        });

    } catch (error) {
        console.error("[Error] caanot load data ", error);
    }

});




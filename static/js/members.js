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

//-------------------------------------------------------------------------------------------------------------
// js 파일 제대로 읽히는지 테스트
console.log("test log: i am memberjs");

//-------------------------------------------------------------------------------------------------------------
// firebase db의 [members]로부터 데이터 로드
const membersRef = collection(db, 'members');
const members = await getDocs(membersRef);

// 팀원 멤버 전체: 초기화 후 불러오기
$('.member-cards').empty();
members.forEach((member) => {
    let name = member.data().name;
    let image = member.data().image;

    let temp_html = `           
            <div class="member-card">
                <div class="card">
                    <img src="${image}" class="member-image" alt="...">
                    <h4 class="member-name">${name}</h4>
                    <button class="button-view button-small"><img src="../static/img/icon-view.png" alt="FAILED TO LOAD View Icon"
                    class="icon"></button>                
                </div>
            </div>
            `;
    $('.member-cards').append(temp_html);
});


// 전역변수로서 필요한 멤버데이터 객체
let memberData = null;
let curMemberID = null;

// card 클래스 클릭 시 팝업 띄우기
$(document).on('click', '.button-view', async function () {
    let targetMemberName = $(this).closest('.member-card').find('.member-name').text();
    let member = query(membersRef, where('name', '==', targetMemberName));
    popupMembercard(member);
});
// card 클래스 클릭 시 팝업 띄우기
async function popupMembercard(member) {
    // 해당하는 팀원 이름으로 검색
    console.log("[func check] popupMembercard called");
    try {
        // 로드한 데이터 분류
        const querySnapshot = await getDocs(member);
        querySnapshot.forEach((member) => {
            // 현재 선택된 멤버 문서 id 값 기억
            curMemberID = member.id;
            // 멤버의 정보 기억
            memberData = {
                name: member.data().name,
                image: member.data().image,
                mbti: member.data().mbti,
                intro: member.data().intro,
                interest: member.data().interest,
                favGame: member.data().favGame,
                game_G: member.data().game_G,
                game_A: member.data().game_A,
                game_M: member.data().game_M,
                game_E: member.data().game_E,
                linkGithub: member.data().linkGithub,
                linkBlog: member.data().linkBlog
            };
            // 멤버 정보 업데이트하기
            updateMemberInfos();
            // 해당 내용의 모달창 띄우기
            let myModal = new bootstrap.Modal($('#memberModal')[0]);
            myModal.show();
        });
        console.log("[Success] popupMembercard successfully!");
    } catch (e) {
        console.error("[Error] cannot load data ", e);
    }
}
// 데이터 기반 모달창 html 생성
function updateMemberInfos() {
    let tempHtml_sub1 = `
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="modal-label">멤버 정보</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <h4 id="member-name">${memberData.name}</h4>
    `;
    let tempHtml_sub2 = ($('body').hasClass('admin-mode') ? `
        <button type="button" class="button-edit button-basic"> <img src="../static/img/icon-edit.png" alt="FAILED TO LOAD IMG" class="img-button-edit"> 수정 </button>
    ` : ``);
    let tempHtml_sub3 = `
            <img id="member-image" src="${memberData.image}" alt="FAILED TO LOAD IMG" class="img-fluid mb-3">
            <p id="member-text">
                MBTI : ${memberData.mbti}
                <br>
                자기소개 : ${memberData.intro}
                <br>
                관심사 : ${memberData.interest}
                <br>
                좋아하는 게임 : ${memberData.favGame}
                <br><br>
                + G A M E 키워드로 표현하기 +
                <br>
                G : ${memberData.game_G}
                <br>
                A : ${memberData.game_A}
                <br>
                M : ${memberData.game_M}
                <br>
                E : ${memberData.game_E}
                <br><br>
            </p>
            <!-- GitHub, Blog 아이콘과 링크 -->
            <div class="modal-icons">
                <a href="${memberData.linkGithub}" target="_blank"><img src="../static/img/github-mark.png" alt="FAILED TO LOAD GitHub Icon" class="icon"></a>
                <a href="${memberData.linkBlog}" target="_blank"><img src="../static/img/icon-blog.png" alt="FAILED TO LOAD Blog Icon" class="icon"></a>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
        </div>
    </div>
    `;

    let tempHtml = tempHtml_sub1 + tempHtml_sub2 + tempHtml_sub3;
    //let tempHtml = tempHtml_sub1 + tempHtml_sub3;


    // html 초기화하고 붙여주기
    $(".member-modal").empty();
    $(".member-modal").append(tempHtml);
}
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
// 버튼 기능 : 수정하기, 저장하기
// 동적으로 추가되었기 때문에 이벤트 위임 형식으로 필요
$(document).on('click', '.button-edit', function () {
    editMemberInfos();
});
// 수정버튼: 수정하기
function editMemberInfos() {
    console.log("[func check] editMemberInfos called");
    let modalBody = $('.modal-body');
    modalBody.empty();
    let tmp = `
                <h4 id="member-name"><input type="text" value="${memberData.name}" class="edited-name"></h4>
                <button type="button" class="button-save button-basic"> <img src="../static/img/icon-save.png" alt="FAILED TO LOAD IMG" class="img-button-save"> 저장 </button>
                <img id="member-image" src="${memberData.image}" alt="FAILED TO LOAD IMG" class="img-fluid mb-3"><input type="text" value="${memberData.image}" class="edited-image">
                <p id="member-text">
                    MBTI : <input type="text" value="${memberData.mbti}" class="edited-mbti">
                    <br>
                    자기소개 : <input type="text" value="${memberData.intro}" class="edited-intro">
                    <br>
                    관심사 : <input type="text" value="${memberData.interest}" class="edited-interest">
                    <br>
                    좋아하는 게임 : <input type="text" value="${memberData.favGame}" class="edited-favGame">
                    <br><br>
                    + G A M E 키워드로 표현하기 +
                    <br>
                    G : <textarea rows="4" cols="30" class="edited-game_G">${memberData.game_G}</textarea>
                    <br>
                    A : <textarea rows="4" cols="30" class="edited-game_A">${memberData.game_A}</textarea>
                    <br>
                    M : <textarea rows="4" cols="30" class="edited-game_M">${memberData.game_M}</textarea>
                    <br>
                    E : <textarea rows="4" cols="30" class="edited-game_E">${memberData.game_E}</textarea>
                    <br><br>
                    Github Link : <input type="text" value="${memberData.linkGithub}" class="edited-linkGithub">
                    <br>
                    Blog Link :   <input type="text" value="${memberData.linkBlog}" class="edited-linkBlog">
                </p>
                <!-- GitHub, Blog 아이콘과 링크 -->
                <div class="modal-icons">
                </div>
    `;
    modalBody.append(tmp);
};
// 동적으로 추가되었기 때문에 이벤트 위임 형식으로 필요
$(document).on('click', '.button-save', async function () {
    saveMemberInfos();
});
// 저장버튼: 수정한 내용대로 저장하기
async function saveMemberInfos() {
    console.log("[func check] saveMemberInfos called");
    console.log("[func check] curMemberID : " + curMemberID);
    let curMember = doc(db, 'members', curMemberID);
    try {
        memberData = {
            id: curMemberID,
            name: $('.edited-name').val(),
            image: $('.edited-image').val(),
            mbti: $('.edited-mbti').val(),
            intro: $('.edited-intro').val(),
            interest: $('.edited-interest').val(),
            favGame: $('.edited-favGame').val(),
            game_G: $('.edited-game_G').val(),
            game_A: $('.edited-game_A').val(),
            game_M: $('.edited-game_M').val(),
            game_E: $('.edited-game_E').val(),
            linkGithub: $('.edited-linkGithub').val(),
            linkBlog: $('.edited-linkBlog').val()
        };
        await updateDoc(curMember, memberData);
        // 멤버 정보 업데이트하기
        updateMemberInfos();
        console.log("[Success] Member information updated successfully!");
        window.location.reload();
    } catch (e) {
        console.error("[Error] cannot updating member information: ", e);
    }
};
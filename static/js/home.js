// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase 구성 정보 설정
const firebaseConfig = {
  apiKey: "AIzaSyBL_TK4E1ofWOysNqB4pgQCB2bve5YrA4k",
  authDomain: "sparta-b8a7a.firebaseapp.com",
  projectId: "sparta-b8a7a",
  storageBucket: "sparta-b8a7a.appspot.com",
  messagingSenderId: "322205353513",
  appId: "1:322205353513:web:2b730def7c71fa5ca73e38",
};
// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const firestoreDBName = "after_home";

$("#hov-anim").mouseover(function () {
  $(this).attr("src", $(this).data("animated"));
}),
  $("#hov-anim").mouseout(function () {
    $(this).attr("src", $(this).data("static"));
  });

// JavaScript로 Modal 창 띄우는 스크립트
var $button = $(".bannerbtn"),
  $modalContainer = $("#modal-container"),
  $body = $("body"),
  $content = $(".content"),
  btnId;

// banner에 있는 버튼 누르면 Modal 작동
$("#two").click(async function () {
  btnId = $(this).attr("id");

  $modalContainer.removeAttr("class").addClass(btnId);
  $content.removeAttr("class").addClass("content");

  $body.addClass("modal-active");

  if (btnId == "two" || btnId == "closebtn") {
    $content.addClass(btnId);
  }
});

// 페이지 로드 시 데이터 표시
$(document).ready(async function () {
  const querySnapshot = await getDocs(collection(db, firestoreDBName));
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    const data = doc.data();

    let temp_html = `
      <div class="modal-background">
          <div class="modal" style="max-height: calc(120vh - 200px); overflow-x: hidden; overflow-y: auto; display:block">
            <button id="closebtn" type="button" class="btn-close" aria-label="Close" style="float:right;"></button>
            <h2 style="font-size: 25px;">우리 팀을 소개합니다</h2>
            <div class="loginbtn">
              <button style="float:inline-end;" type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">페이지 수정</button>
            </div>
            <hr>
            <div class="explaincard1">
              <div class="card border-dark mb-3" style="max-width: auto; height:300px;">
                <div class="card-header">팀 이름 설명</div>
                <div class="card-body" style="margin-top:80px;">
                  <h5 class="card-title"></h5>
                  <p class="content" style="font-size:25px;">${data.inputtext}</p>
                </div>
              </div>
            </div>
            <div class="explaincard2">
              <div class="card border-dark mb-3" style="max-width: auto; height:300px;">
                <div class="card-header">팀 Notion 링크</div>
                <div class="card-body" style="margin-top:40px;">
                  <h5 class="card-title">▼▼▼▼5조의 notion 링크▼▼▼▼</h5>
                  <a href="${data.link}">
                    <img src="${data.linkimage}" alt="">
                  </a>
                </div>
              </div>
            </div>
            <div class="explaincard3">
              <div class="card border-dark mb-3" style="max-width: auto; height:300px;">
                <div class="card-header">팀 로고</div>
                <div class="card-body">
                  <h5 class="card-title"></h5>
                  <img src="${data.logoimage}" alt="" style="width:200px;">
                </div>
              </div>
            </div>
          </div>
        </div>`;

    $("#modal-container").html(temp_html);
  }
});

// 팀 소개 눌러서 나오는 Modal 창에서 X 버튼 눌렀을 때 Modal 창 닫기
$("#modal-container").on("click", "#closebtn", async function () {
  $modalContainer.addClass("clostbtn out"); // 모달에 닫기 애니메이션 클래스 추가
  $body.removeClass("modal-active"); // body에서 modal-active 클래스 제거

  if ($modalContainer.hasClass(btnId)) {
    $content.addClass("clostbtn out"); // 콘텐츠 부분에도 닫기 애니메이션 클래스 추가
  }
});

// // home 페이지 내에서만 수정 가능한 로그인 세션
const validUsername = "admin";
const validPassword = "admin";

// submit 버튼 눌렀을 때 Action
// submit 버튼 누를 때 현재 데이터를 데이터베이스에 저장
$("#submitbtn").click(async function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const loginMessage = document.getElementById("login-message");

  btnId = $(this).attr("id");

  if (btnId == "submitbtn") {
    $content.addClass(btnId);
  }

  // 로그인 유효성 검사
  if (username === validUsername && password === validPassword) {
    // 먼저 로그인 모달 닫기
    var loginModal = bootstrap.Modal.getInstance(
      document.getElementById("exampleModal")
    );
    loginModal.hide();

    // success 알림 표시
    alert("수정 페이지로 이동합니다");

    // 로그인 성공 시 세션 스토리지에 인증 정보 저장
    sessionStorage.setItem("isAuthenticated", "true");

    document.location.href = "./templates/modify_home.html";
  } else {
    loginMessage.classList.remove("hidden"); // 오류 메시지 표시
  }
});

$(document).ready(function () {
  // 현재 페이지가 modify_home.html이고 인증되지 않은 상태라면 메인 페이지로 리다이렉트
  if (
    currentPath.includes("modify_home.html") &&
    sessionStorage.getItem("isAuthenticated") !== "true"
  ) {
    window.location.href = mainPageUrl;
  }
});

// 팀원 소개 페이지로 이동
$("#movepage1").click(async function () {
  document.location.href = "templates/members.html";
});

// 게임 추천 페이지로 이동
$("#movepage2").click(async function () {
  document.location.href = "templates/game_introduce.html";
});

// 메뉴 추천 페이지로 이동
$("#movepage3").click(async function () {
  window.open("https://www.dogumaster.com/select/menu");
});

// 응원의 한마디 페이지로 이동
$("#movepage4").click(async function () {
  document.location.href = "templates/cheer.html";
});

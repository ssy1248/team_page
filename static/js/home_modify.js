// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  query,
  deleteDoc,
  limit,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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

// #two 버튼 클릭 이벤트
$("#two").click(async function () {
  //alert("수정할 내용을 입력하세요");
  alertSWAL('info', "페이지 이동", "수정할 내용을 입력하세요");

  // Firebase에서 첫 번째 데이터만 남기고 나머지 삭제
  const querySnapshot = await getDocs(collection(db, firestoreDBName));
  let isFirst = true;
  querySnapshot.forEach((doc) => {
    if (isFirst) {
      isFirst = false;
    } else {
      deleteDoc(doc.ref);
    }
  });

  // temp_html 양식으로 modal-container 업데이트
  let temp_html = `
      <div class="modal-background">
        <div class="modal" style="max-height: calc(120vh - 200px); overflow-x: hidden; overflow-y: auto; display:block">
          <h2 style="font-size: 25px;">우리 팀을 소개합니다</h2>
          <button id="savebtn" style="float:inline-end;" type="button" class="btn btn-secondary">Save</button>
          <hr>
          <div class="explaincard1">
            <div class="card border-dark mb-3" style="max-width: auto; height:300px;">
              <div class="card-header">팀 이름 설명</div>
              <div class="card-body" style="margin-bottom: 10px;">
                <h5 class="card-title"></h5>
                <textarea id="inputtext" cols="30" style="font-size:25px; width: 100%; height:100%; display:flex;text-align: center;"></textarea>
              </div>
            </div>
          </div>
          <div class="explaincard2">
            <div class="card border-dark mb-3" style="max-width: auto; height:300px;">
              <div class="card-header">팀 Notion 링크</div>
              <div class="card-body" style="margin-top:40px;">
                <h5 class="card-title">▼▼▼▼1조 Notion 링크▼▼▼▼</h5>
                <input id="link" type="text" style="width: 70%;">
                <p style="float:left;">연결할 링크 :</p>
                <input id="linkimage" type="text" style="width: 70%;">
                <p style="float:left; align: left;">링크를 표현할 이미지 :</p>
              </div>
            </div>
          </div>
          <div class="explaincard3">
            <div class="card border-dark mb-3" style="max-width: auto; height:300px;">
              <div class="card-header">팀 로고</div>
              <div class="card-body">
                <h5 class="card-title"></h5>
                <p style="float:left;">설정할 로고의 이미지 주소 :</p>
                <input id="logoimage" type="text" style="width: 100%;">
              </div>
            </div>
          </div>
        </div>
      </div>`;

  $("#modal-container").html(temp_html);

  // 첫 번째 데이터 불러와서 input 필드에 채우기
  const firstDoc = await getDocs(
    query(collection(db, firestoreDBName), limit(1))
  );
  if (!firstDoc.empty) {
    const data = firstDoc.docs[0].data();
    $("#inputtext").val(data.inputtext || "");
    $("#link").val(data.link || "");
    $("#linkimage").val(data.linkimage || "");
    $("#logoimage").val(data.logoimage || "");
  }
});

// #savebtn 버튼 클릭 이벤트
$("#modal-container").on("click", "#savebtn", async function () {
  let inputtext = $("#inputtext").val();
  let link = $("#link").val();
  let linkimage = $("#linkimage").val();
  let logoimage = $("#logoimage").val();

  let doc = {
    inputtext: inputtext,
    link: link,
    linkimage: linkimage,
    logoimage: logoimage,
  };

  // 기존 데이터 삭제
  const querySnapshot = await getDocs(collection(db, firestoreDBName));
  querySnapshot.forEach((doc) => {
    deleteDoc(doc.ref);
  });

  // 새 데이터 추가
  await addDoc(collection(db, firestoreDBName), doc);

  alert("저장되었습니다.");
  window.location.href = "../main_home.html";
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

// 팀 소개 눌러서 나오는 Modal 창에서 X 버튼 눌렀을 때 Modal 창 닫기
$("#closebtn").click(async function () {
  $modalContainer.addClass("clostbtn out"); // 모달에 닫기 애니메이션 클래스 추가
  $body.removeClass("modal-active"); // body에서 modal-active 클래스 제거

  if ($modalContainer.hasClass(btnId)) {
    $content.addClass("clostbtn out"); // 콘텐츠 부분에도 닫기 애니메이션 클래스 추가
  }
});

// Alert 표시하기
$("#movepage1").click(async function () {
  //alert("'팀 소개'만 수정할 수 있습니다!");
  alertSWAL('warning', "주의", "'팀 소개'만 수정할 수 있습니다!");
});

// 게임 추천 페이지로 이동
$("#movepage2").click(async function () {
  //alert("'팀 소개'만 수정할 수 있습니다!");
  alertSWAL('warning', "주의", "'팀 소개'만 수정할 수 있습니다!");

});

// 메뉴 추천 페이지로 이동
$("#movepage3").click(async function () {
  //alert("'팀 소개'만 수정할 수 있습니다!");
  alertSWAL('warning', "주의", "'팀 소개'만 수정할 수 있습니다!");
});

// 응원의 한마디 페이지로 이동
$("#movepage4").click(async function () {
  //alert("'팀 소개'만 수정할 수 있습니다!");
  alertSWAL('warning', "주의", "'팀 소개'만 수정할 수 있습니다!");
});

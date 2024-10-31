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
  alert("수정할 내용을 입력하세요");

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
        <div class="modal">
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
                <h5 class="card-title">▼▼▼▼5조의 notion 링크▼▼▼▼</h5>
                <input id="link" type="text" style="width: 100%;">
                <input id="linkimage" type="text" style="width: 100%;">
              </div>
            </div>
          </div>
          <div class="explaincard3">
            <div class="card border-dark mb-3" style="max-width: auto; height:300px;">
              <div class="card-header">팀 로고</div>
              <div class="card-body">
                <h5 class="card-title"></h5>
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

// $("#two").click(async function () {

//   alert("수정할 내용을 입력하세요");
// });

// $("#savebtn").click(async function () {
//   await deleteDoc(collection(db, firestoreDBName, 1));
//   let inputtext = $("#inputtext").val();
//   let link = $("#link").val();
//   let linkimage = $("#linkimage").val();
//   let logoimage = $("#logoimage").val();

//   let doc = {
//     inputtext: inputtext,
//     link: link,
//     linkimage: linkimage,
//     logoimage: logoimage,
//   };

//   await addDoc(collection(db, firestoreDBName), doc);
//   window.location.reload();
// });

// let docs = await getDocs(collection(db, firestoreDBName));
// docs.forEach((doc) => {
//   let row = doc.data();

//   let inputtext = row["inputtext"];
//   let link = row["link"];
//   let linkimage = row["linkimage"];
//   let logoimage = row["logoimage"];

//   let temp_html = `
//     <div class="modal-background">
//           <div class="modal">
//             <h2 style="font-size: 25px;">우리 팀을 소개합니다</h2>
//             <button id="savebtn" style="float:inline-end;" type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">Save</button>
//             <hr>
//             <div class="explaincard1">
//               <div class="card border-dark mb-3" style="max-width: auto; height:300px;">
//                 <div class="card-header">팀 이름 설명</div>
//                 <div class="card-body" style="margin-bottom: 10px;">
//                   <h5 class="card-title"></h5>
//                   <textarea name="" id="inputtext" cols="30" style="font-size:25px; width: 100%; height:100%; display:flex;text-align: center;">${inputtext}</textarea>
//                 </div>
//               </div>
//             </div>
//             <div class="explaincard2">
//               <div class="card border-dark mb-3" style="max-width: auto; height:300px;">
//                 <div class="card-header">팀 Notion 링크</div>
//                 <div class="card-body" style="margin-top:80px;">
//                   <h5 class="card-title">▼▼▼▼5조의 notion 링크▼▼▼▼</h5>
//                   <a href="${link}">
//                    <input id="link" type="text" value="${link}" style="width: 100%;">
//                     <img src="${linkimage}" alt="">
//                     <input id="linkimage" type="text" value="${linkimage}" style="width: 100%;">
//                   </a>
//                 </div>
//               </div>
//             </div>
//             <div class="explaincard3">
//               <div class="card border-dark mb-3" style="max-width: auto; height:300px;">
//                 <div class="card-header">팀 로고</div>
//                 <div class="card-body">
//                   <h5 class="card-title"></h5>
//                   <img src="${logoimage}" alt="" style="width:200px;">
//                   <input id="logoimage" type="text" value="${logoimage}" style="width: 100%;">
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>`;
//   $("#modal-container").update(temp_html);
// });

// async function createInitialData() {
//   const initialData = {
//     inputtext: "(수정할 내용을 입력하세요)",
//     link: "https://teamsparta.notion.site/No-m-de-ul-1-1252dc3ef51481b9abe6cb3d5696d723",
//     linkimage:
//       "https://i.namu.wiki/i/FT_lY0lj2ZCMofO1Qx6hWk2IixWIWCyOCUXKKWcwNzWZtzaAxvXjfp_8hN96A485KZhI1MePYc8Ysk4kphbUcQ.svg",
//     logoimage:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1280px-Node.js_logo.svg.png",
//   };

//   try {
//     const currentHomeSnapshot = await getDocs(collection(db, "current_home"));
//     if (currentHomeSnapshot.empty) {
//       // current_home 컬렉션이 비어있으면 초기 데이터 추가
//       await addDoc(collection(db, "current_home"), initialData);
//       console.log("Initial data created in current_home");
//     } else {
//       console.log("current_home already has data");
//     }
//   } catch (error) {
//     console.error("Error creating initial data:", error);
//   }
// }

// // 1. current_home에서 데이터 가져오기
// const currentHomeSnapshot = await getDocs(collection(db, "current_home"));
// let currentHomeData = {};
// currentHomeSnapshot.forEach((doc) => {
//   currentHomeData = doc.data();
// });

// // 2. after_home에 current_home 데이터 덮어씌우기
// await addDoc(collection(db, "after_home"), currentHomeData);

// // 3. 수정 가능한 폼으로 데이터 표시
// displayEditableForm(currentHomeData);

// alert("데이터가 로드되었습니다. 수정을 진행해주세요.");

// // Save 버튼 클릭 이벤트
// $("#savebtn").click(async function () {});

// // 수정 가능한 폼 표시 함수
// function displayEditableForm(data) {
//   let tmp_html = `
//         <div class="modal-background">
//           <div class="modal">
//             <button id="closebtn" type="button" class="btn-close" aria-label="Close" style="float:right;"></button>
//             <h2 style="font-size: 25px;">우리 팀을 소개합니다</h2>
//             <button id="updatebtn" style="float:inline-end;" type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">Save</button>
//             <hr>
//             <div class="explaincard1">
//               <div class="card border-dark mb-3" style="max-width: auto; height:300px;">
//                 <div class="card-header">팀 이름 설명</div>
//                 <div class="card-body" style="margin-bottom: 10px;">
//                   <h5 class="card-title"></h5>
//                   <textarea name="" id="inputtext" cols="30" style="font-size:25px; width: 100%; height:100%; display:flex;text-align: center;">${data.inputtext}</textarea>
//                 </div>
//               </div>
//             </div>
//             <div class="explaincard2">
//               <div class="card border-dark mb-3" style="max-width: auto; height:300px;">
//                 <div class="card-header">팀 Notion 링크</div>
//                 <div class="card-body" style="margin-top:80px;">
//                   <h5 class="card-title">▼▼▼▼5조의 notion 링크▼▼▼▼</h5>
//                     <p style="float:left;">링크 : </p><input id="link" type="text" value="${link}" style="width: 80%;">
//                     <input id="linkimage" type="text" value="${linkimage}" style="width: 80%;">
//                     <p style="float:left;">링크 이미지 : </p>
//                   </a>
//                 </div>
//               </div>
//             </div>
//             <div class="explaincard3">
//               <div class="card border-dark mb-3" style="max-width: auto; height:300px;">
//                 <div class="card-header">팀 로고</div>
//                 <div class="card-body">
//                   <h5 class="card-title"></h5>
//                   <input id="logoimage" type="text" value="${logoimage}" style="width: 100%;">
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       `;

//   $("#modal-container").html(tmp_html);

//   // Update 버튼 클릭 이벤트
//   $("#updatebtn").click(async function () {
//     await updateData();
//   });
// }

// // 데이터 업데이트 함수
// async function updateData() {
//   let inputtext = $("#inputtext").val();
//   let link = $("#link").val();
//   let linkimg = $("#linkimage").val();
//   let logoimg = $("#logoimage").val();

//   let updatedDoc = {
//     inputtext: inputtext,
//     link: link,
//     linkimage: linkimg,
//     logoimage: logoimg,
//   };

//   // 1. after_home 컬렉션 업데이트
//   const afterHomeSnapshot = await getDocs(collection(db, "after_home"));
//   afterHomeSnapshot.forEach(async (doc) => {
//     await updateDoc(doc.ref, updatedDoc);
//   });

//   // 2. current_home 컬렉션 업데이트
//   const currentHomeSnapshot = await getDocs(collection(db, "current_home"));
//   currentHomeSnapshot.forEach(async (doc) => {
//     await updateDoc(doc.ref, updatedDoc);
//   });

//   alert("업데이트 완료!");
//   window.location.reload();
//   document.location.href = "../main_home.html";
// }

// // 페이지 로드 시 current_home 데이터 표시
// async function loadCurrentHomeData() {
//   const currentHomeSnapshot = await getDocs(collection(db, "current_home"));
//   currentHomeSnapshot.forEach((doc) => {
//     let data = doc.data();
//     displayData(data);
//   });
// }

// // 데이터 표시 함수
// function displayData(data) {
//   let tmp_html = `
//       <div class="explaincard1">
//         <div class="card border-dark mb-3" style="max-width: auto; height:300px;">
//           <div class="card-header">팀 이름 설명</div>
//           <div class="card-body" style="margin-bottom: 10px;">
//             <p id="inputtext" style="font-size:25px;">${
//               data.inputtext || ""
//             }</p>
//           </div>
//         </div>
//       </div>
//       <div class="explaincard2">
//         <div class="card border-dark mb-3" style="max-width: auto; height:300px;">
//           <div class="card-header">팀 Notion 링크</div>
//           <div class="card-body" style="margin-top:80px;">
//             <h5 class="card-title">▼▼▼▼5조의 notion 링크▼▼▼▼</h5>
//             <a id="link" href="${data.link || "#"}">
//               <img id="linkimage" src="${data.linkimage || ""}" alt="">
//             </a>
//           </div>
//         </div>
//       </div>
//       <div class="explaincard3">
//         <div class="card border-dark mb-3" style="max-width: auto; height:300px;">
//           <div class="card-header">팀 로고</div>
//           <div class="card-body">
//             <img id="logoimage" src="${
//               data.logoimage || ""
//             }" alt="" style="width:200px;">
//           </div>
//         </div>
//       </div>
//     `;
//   $("#modal-container").html(tmp_html);
// }

// // 페이지 로드 시 실행
// $(document).ready(function () {
//   loadCurrentHomeData();
// });

// 저장버튼 누르면 내용을 After에 저장
// $("#savebtn").click(async function () {
//   let inputtext = $("#inputtext").val();
//   let link = $("#link").val();
//   let linkimg = $("#linkimage").val();
//   let logoimg = $("#logoimage").val();

//   let doc = {
//     inputtext: inputtext,
//     link: link,
//     linkimage: linkimg,
//     logoimage: logoimg,
//   };

//   await addDoc(collection(db, "after_home"), doc);
//   alert("저장완료!");
//   window.location.reload();
//   document.location.href = "../main_home.html";
// });

// // Firebase에서 가져온 데이터를 입력
// let docs = await getDocs(collection(db, "after_home"));
// docs.forEach((doc) => {
//   let row = doc.data();

//   let inputtext = row["inputtext"];
//   let link = row["link"];
//   let linkimg = row["linkimage"];
//   let logoimg = row["logoimage"];

//   if (link == "" || linkimg == "" || logoimg == "") {
//     link =
//       "https://teamsparta.notion.site/No-m-de-ul-1-1252dc3ef51481b9abe6cb3d5696d723";
//     linkimg =
//       "https://i.namu.wiki/i/FT_lY0lj2ZCMofO1Qx6hWk2IixWIWCyOCUXKKWcwNzWZtzaAxvXjfp_8hN96A485KZhI1MePYc8Ysk4kphbUcQ.svg";
//     logoimg =
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1280px-Node.js_logo.svg.png";
//   } else {
//     let tmp_html = `<div class="explaincard1">
//               <div class="card border-dark mb-3" style="max-width: auto; height:300px;">
//                 <div class="card-header">팀 이름 설명</div>
//                 <div class="card-body" style="margin-bottom: 10px;">
//                   <h5 class="card-title"></h5>
//                   <textarea name="" id="inputtext" cols="30"
//                   style="font-size:25px; width: 100%; height:100%; display:flex;text-align: center;">
//                   ${inputtext}</textarea>
//                 </div>
//               </div>
//             </div>
//             <div class="explaincard2">
//               <div class="card border-dark mb-3" style="max-width: auto; height:300px;">
//                 <div class="card-header">팀 Notion 링크</div>
//                 <div class="card-body" style="margin-top:80px;">
//                   <h5 class="card-title">▼▼▼▼5조의 notion 링크▼▼▼▼</h5>
//                   <a id="link" href="${link}">
//                     <img id="linkimage" src="${linkimg}" alt="">
//                   </a>
//                 </div>
//               </div>
//             </div>
//             <div class="explaincard3">
//               <div class="card border-dark mb-3" style="max-width: auto; height:300px;">
//                 <div class="card-header">팀 로고</div>
//                 <div class="card-body">
//                   <h5 class="card-title"></h5>
//                   <img id="logoimage" src="${logoimg}" alt="" style="width:200px;">
//                 </div>
//               </div>
//             </div>`;
//     $("#modal-container").append(tmp_html);
//   }
// });

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
  alert("'팀 소개'만 수정할 수 있습니다!");
});

// 게임 추천 페이지로 이동
$("#movepage2").click(async function () {
  alert("'팀 소개'만 수정할 수 있습니다!");
});

// 메뉴 추천 페이지로 이동
$("#movepage3").click(async function () {
  alert("'팀 소개'만 수정할 수 있습니다!");
});

// 응원의 한마디 페이지로 이동
$("#movepage4").click(async function () {
  alert("'팀 소개'만 수정할 수 있습니다!");
});

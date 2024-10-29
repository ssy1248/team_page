
console.log("test log: i am memberjs");

function openModal(name, text, image) {
    console.log("func :: openModal called");
    
    // jQuery를 사용하여 모달에 데이터 설정
    $('#member-name').text(name);
    $('#member-image').attr('src', image);
    
    // 모달 띄우기
    var myModal = new bootstrap.Modal($('#memberModal')[0]); // jQuery로 선택한 요소의 DOM 객체를 사용
    myModal.show();
};

// 전역으로 함수 노출
window.openModal = openModal;

console.log("test log: i am memberjs");

function openModal(name, text, image) {
    console.log("func :: openModal called");
    // 모달에 데이터 설정
    document.getElementById('modalName').textContent = name;
    document.getElementById('modalText').textContent = text;
    document.getElementById('modalImage').src = image;
    
    // 모달 띄우기
    var myModal = new bootstrap.Modal(document.getElementById('memberModal'));
    myModal.show();
};

// 전역으로 함수 노출
window.openModal = openModal;
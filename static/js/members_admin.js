
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

    showAdminSpace();   
});
// 
function showAdminSpace(){
    console.log("[func check] showAdminSpace called"); 
    $('.admin-access').toggle('show');
}


// 어드민 키값 제출 버튼
$(document).on('click', '.button-admin-key-enter', function () {
    console.log("[btn check] button-admin-key-enter pressed"); 

    showToast("This is a toast message!");
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
}

//==============================================================
//==============================================================
//==============================================================

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

//==============================================================
//==============================================================
//==============================================================













//==============================================================
//==============================================================
//==============================================================



// 삭제 시 드래그앤드랍

$(document).on('click', '.card', function (event) {
    if (!$(event.target).is('button')) {
        //DragNdrop();
    }
});

function DragNdrop() {

    let isDragging = false;
    let curCard = null;
    let previewCard = null;
    let offset = { x: 0, y: 0 };

    // 마우스 버튼이 눌릴 때
    $('.card').on('mousedown', function (event) {
        isDragging = true;
        curCard = $(this);

        // 마우스 클릭 위치와 카드의 위치 오프셋 계산
        offset.x = event.clientX - curCard.offset().left;
        offset.y = event.clientY - curCard.offset().top;

        // 카드의 클론 생성 및 스타일 설정
        previewCard = curCard.clone().css({
            position: 'absolute',
            left: curCard.offset().left,
            top: curCard.offset().top,
            opacity: 0.7,
            zIndex: 1005,
        }).appendTo('body'); // 클론을 body에 추가

        curCard.addClass('onDrag'); // 원래 카드에 드래그 스타일 추가
    });

    // 마우스가 움직일 때
    $(document).on('mousemove', function (event) {
        if (isDragging && previewCard) {
            previewCard.css({
                left: event.clientX - offset.x,
                top: event.clientY - offset.y,
            });
        }
    });

    // 마우스 버튼이 떼어질 때
    $(document).on('mouseup', function () {
        if (isDragging) {
            isDragging = false;
            curCard.removeClass('onDrag'); 
            previewCard.remove(); 
            curCard = null; 
            previewCard = null; 
        }
    });


};


//==============================================================
//==============================================================
//==============================================================

// id 생성 위한 난수 코드 생성

function generateRandomID() {
    const pool = '0123456789abcdefghijklmnopqrstuvwxyz';
    let result = '';
    const len = 8;  // 8자리로 생성
    for (let i = 0; i < len; i++) {
        const randIndex = Math.floor(Math.random() * pool.length);
        result += pool[randIndex];
    }
    return result;
}

//==============================================================
//==============================================================
//==============================================================

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


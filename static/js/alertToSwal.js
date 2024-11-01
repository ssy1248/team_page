

// SweetAlert 함수화
function alertSWAL(myIcon, myTitle, myText){
    Swal.fire({
        icon: myIcon,
        title: myTitle,
        text: myText,
      });
};

//
function toastSWAL(myIcon, myTitle){
  const Toast = Swal.mixin({
      toast: true,
      position: 'center-center',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: myIcon,
      title: myTitle
    })
}

async function waitAlertSWAL(myIcon, myTitle, myText) {
  const Toast = Swal.fire({
    icon: myIcon,
    title: myTitle,
    text: myText,
    showConfirmButton: false,
    timer: 1500, // 원하는 시간 설정
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  // 알림이 끝난 후 새로고침
  await Toast;
}
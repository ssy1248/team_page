

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
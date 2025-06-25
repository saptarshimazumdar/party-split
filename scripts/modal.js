// Get the modal
var modal = document.getElementById("expense-form");
var btn = document.getElementById("toggle-expense-form");
var backBtn = document.getElementById("go-back");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
  openModal();
}

// When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//   modal.style.display = "none";
//   btn.style.display = "block";
// }

// When the user clicks anywhere outside of the modal, close it
document.onclick = function (event) {
  if (event.target == modal) {
    closeModal();
  }
}

const closeModal = () => {
  modal.style.display = "none";
  btn.style.display = "block";
  backBtn.style.display = "block";
}

const openModal = () => {
  modal.style.display = "block";
  btn.style.display = "none";
  backBtn.style.display = "none";
}
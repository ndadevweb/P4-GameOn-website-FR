function editNav() {
  const x = document.getElementById("myTopnav");

  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const modalBtnClose = document.querySelectorAll(".close");
const formData = document.querySelectorAll(".formData");

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

// launch modal form
function launchModal() {
  modalbg.style.display = "block";
}

// close modal event
modalBtnClose.forEach((btn) => btn.addEventListener("click", closeModal));

// form registration
const formSignup = document.querySelector('.form-signup');

formSignup.addEventListener('submit', validate);


/**
 * Close the modal
 */
function closeModal() {
  modalbg.style.display = "none";
}

/**
 * Check form is valid
 *
 * @param {SubmitEvent} event
 * @return {boolean}
 */
function validate(event) {

  const fieldsNotValid = [];

  const first = event.currentTarget?.first?.value;
  const last = event.currentTarget?.last?.value;
  const quantity = event.currentTarget?.quantity?.value;
  const email = event.currentTarget?.email?.value;
  const location = event.currentTarget?.querySelectorAll('input[name="location"]:checked');
  const readAndConditionsAccepted = event.currentTarget?.querySelector('#checkbox1')

  if(/^[a-zA-Z]{2,}$/.test(first) === false) {
    fieldsNotValid.push("first");
  }

  if(/^[a-zA-Z]{2,}$/.test(last) === false) {
    fieldsNotValid.push("last");
  }

  if(/^[a-zA-Z0-9-.+_]+@[a-zA-Z0-9-]+[.]{1}[a-zA-Z]{2,4}$/.test(email) === false) {
    fieldsNotValid.push("email");
  }

  if(/^[0-9]?[0-9]$/.test(quantity) === false) {
    fieldsNotValid.push("quantity");
  }

  if(location.length === 0) {
    fieldsNotValid.push("location");
  }

  if(readAndConditionsAccepted.checked === false) {
    fieldsNotValid.push("conditions_accepted");
  }

  if(fieldsNotValid.length !== 0) {
    event.preventDefault();
  }
}

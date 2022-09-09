class Modal {
  /**
   * Selecteur ( ID ou class ) de la modal
   *
   * @param {String} selector
   */
  constructor(selector) {
    this.modalContainer = document.querySelector(selector);
  }

  /**
   * Selecteur du bouton fermant la modal
   *
   * @param {String} selector
   */
  setLaunchElement(selector) {
    this.modalLaunchElement = document.querySelector(selector);
  }

  /**
   * Afficher / ouvrir la modal
   */
  launch() {
    this.modalContainer.classList.add("bground-show");
  }

  /**
   * Masquer / fermer la modal
   */
  close() {
    this.modalContainer.classList.remove("bground-show");
  }
}

class Validator {
  /**
   * Initialise un objet rules contenant les regles de gestion de chaque champs
   * et les messages derreur associes
   */
  constructor() {
    this.rules = {};
  }

  /**
   * Fonction callback appelee en troisieme argument de add(...)
   *
   * @callback checkValueCallback
   * @param {*} value
   * @returns {Boolean}
   */

  /**
   * Ajout d'une regle permettant de verifier la validite d'un champs
   *
   * @param {String} ruleName ( valeur de l'attribut name du champs cible )
   * @param {String} errorMessage
   * @param {checkValueCallback} callback
   */
  add(ruleName, errorMessage, callback) {
    this.rules[ruleName] = {
      errorMessage: errorMessage,
      callback: callback,
    };
  }

  /**
   * Retournes un objet contenant les differents regles permettant de verifier la validite de chaque champs
   *
   * @returns {Object}
   */
  getRules() {
    return this.rules;
  }

  /**
   * Verifie si une valeur est valide en utilisant l'une des regles de validite
   * definie via la methode add(...)
   *
   * @param {String} ruleName
   * @param {Integer|String|Boolean} value
   * @returns {Boolean}
   */
  isValid(ruleName, value) {
    return this.rules[ruleName]["callback"](value) === true;
  }

  /**
   * Retourne le message d'erreur associe au nom de la regle de validite
   * Le nom de la regle de validite peut etre la valeur de l'attribut name du champs
   *
   * @param {String} ruleName
   * @returns {String}
   */
  getErrorMessage(ruleName) {
    return this.rules[ruleName].errorMessage;
  }
}

class Form {
  /**
   * Types des champs pouvant etre saisies
   *
   * @property {Array}
   */
  fieldsTypeContainingCharacters = ["text", "email", "number", "date"];

  /**
   * Selecteur du formulaire ( ID ou class )
   *
   * @param {String} selector
   * @param {Validator} Validator
   */
  constructor(selector, validator) {
    this.form = document.querySelector(selector);
    this.validator = validator;
  }

  /**
   * Retourne true si le formulaire est valide
   *
   * @returns {Boolean}
   */
  isValid() {
    const fieldNames = Object.keys(RegistrationValidator.getRules());

    fieldNames.forEach((fieldName) => {
      const nameAttribute = `[name="${fieldName}"]`;
      const elements = Array.from(this.form.querySelectorAll(nameAttribute));
      const target = elements[0];
      this.handleField(target, elements);
    });

    // Des qu'un element affiche une erreur le formulaire n'est pas valide
    return this.form.querySelector('[data-error-visible="true"') === null;
  }

  /**
   * Ajoute un evenement onChange sur chaque champs cible du formulaire
   *
   * @param {String} name ( valeur de l'attribut name )
   * @param {Validator} validator
   */
  setFormFieldOnChange(name) {
    const nameAttribute = `[name="${name}"]`;
    const elements = Array.from(this.form.querySelectorAll(nameAttribute));

    elements.forEach((element) => {
      const eventType =
        this.fieldsTypeContainingCharacters.includes(element.type) === true
          ? "input"
          : "change";

      element.addEventListener(eventType, (event) =>
        this.handleField(event.target, elements)
      );
    });
  }

  /**
   * Gere l'affichage des messages d'erreurs losqu'un champs est incorrect
   *
   * @param {Element} target
   * @param {Array} elements
   * @param {Validator} validator
   */
  handleField(target, elements) {
    const dataAttributes = target.closest(".formData").dataset;
    let isValid = true;

    // Gestion des differents types de champs
    if (target.type === "radio") {
      isValid = this.validator.isValid(target.name, elements);
    } else if (target.type === "checkbox") {
      isValid = this.validator.isValid(target.name, target);
    } else if (
      this.fieldsTypeContainingCharacters.includes(target.type) === true
    ) {
      isValid = this.validator.isValid(target.name, target.value);
    } else {
      isValid = false;
    }

    // Affiche ou masque le message d'erreur du champs cible
    if (isValid === false) {
      dataAttributes.error = this.validator.getErrorMessage(target.name);
      dataAttributes.errorVisible = true;
    } else if (dataAttributes.hasOwnProperty("error") === true) {
      // hasOwnProperty('error') pour eviter un effet visuel " vide " cause par le pseudo element ::after
      dataAttributes.error = "";
      dataAttributes.errorVisible = false;
    }
  }
}

// Initialisation des regles de gestions determinant la validite des champs du formulaire

const RegistrationValidator = new Validator();

RegistrationValidator.add("firstname", getText("firstname"), (value) =>
  /^[a-zA-Z\ \-']{2,}$/.test(value)
);
RegistrationValidator.add("lastname", getText("lastname"), (value) =>
  /^[a-zA-Z\ \-']{2,}$/.test(value)
);
RegistrationValidator.add("email", getText("email"), (value) =>
  /^[a-zA-Z0-9-.+_]+@[a-zA-Z0-9-]+[.]{1}[a-zA-Z]{2,4}$/.test(value)
);
RegistrationValidator.add(
  "birthdate",
  getText("birthdate"),
  (value) => value.trim() !== ""
);
RegistrationValidator.add("quantity", getText("quantity"), (value) =>
  /^[0-9]?[0-9]$/.test(value)
);
RegistrationValidator.add(
  "location",
  getText("location"),
  (radioNodeList) =>
    Array.from(radioNodeList).filter((radio) => radio.checked).length === 1
);
RegistrationValidator.add(
  "conditionsAccepted",
  getText("conditionsAccepted"),
  (checkbox) => checkbox.checked
);

// Initialisation du formulaire et ajout des regles de gestion sur chaque champs cibles

const RegistrationForm = new Form(".form-signup", RegistrationValidator);

Object.keys(RegistrationValidator.getRules()).forEach((fieldName) => {
  RegistrationForm.setFormFieldOnChange(fieldName);
});

//

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
const modalBody = document.querySelector(".modal-body");
const modalBtn = document.querySelector(".modal-btn");
const modalBtnClose = document.querySelector(".close");
const formSignup = document.querySelector(".form-signup");

// Modal
const RegistrationModal = new Modal(".bground");

// Event declenchant l'affichage de la modal
modalBtn.addEventListener("click", () => RegistrationModal.launch());

// Event declenchant la fermeture de la modal
modalBtnClose.addEventListener("click", () => RegistrationModal.close());

// Event declenchant l'envoi du formulaire
formSignup.addEventListener("submit", handleFormRegistration);

function handleFormRegistration(event) {
  event.preventDefault();

  if (RegistrationForm.isValid() === true) {
  }
}

/**
 * Retourne le texte associe a la cle passe en parametre
 *
 * @param {String} fieldName
 * @returns {String}
 */
function getText(fieldName) {
  switch (fieldName) {
    case "firstname":
      return "Veuillez entrer 2 caractères ou plus (uniquement des lettres).";

    case "lastname":
      return "Veuillez entrer 2 caractères ou plus (uniquement des lettres).";

    case "email":
      return "Veuillez entrer une adresse email valide.";

    case "birthdate":
      return "Vous devez entrer votre date de naissance.";

    case "quantity":
      return "Vous devez entrer une valeur numérique entre 0 et 99 inclus.";

    case "location":
      return "Vous devez choisir une option.";

    case "conditionsAccepted":
      return "Vous devez vérifier que vous acceptez les termes et conditions.";
  }
}

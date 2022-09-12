class Modal {
  /**
   * Selecteur ( ID ou class ) de la modal
   *
   * @param {String} selector
   */
  constructor(selector) {
    this.modalContainer = document.querySelector(selector);
  }

  getModalElement() {
    return this.modalContainer;
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
    this.modalContainer.classList.remove('hide');
  }

  /**
   * Masquer / fermer la modal
   */
  close() {
    this.modalContainer.classList.add('hide');
  }

  /**
   * Affiche ou masque un contenu de l'element .content
   *
   * @param {String} selector
   * @param {Boolean} display
   * @param {String} className
   */
  displayContent(selector, display, className = '.hide') {
    className = className[0] === '.' ? className.substring(1) : className;

    const element = this.modalContainer.querySelector('.content ' + selector);

    display === true ? element.classList.remove(className) : element.classList.add(className);
  }

  /**
   * Change le contenu de l'element cible
   *
   * @param {String} selector
   * @param {String} contentToUpdate
   */
  updateContent(selector, contentToUpdate) {
    this.modalContainer.querySelector('.content ' + selector).innerHTML = contentToUpdate;
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
    return this.rules[ruleName]['callback'](value) === true;
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
  fieldsTypeContainingCharacters = ['text', 'email', 'number', 'date'];

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
   * Retourne un form element
   *
   * @returns {Element}
   */
  getFormElement() {
    return this.form;
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

    // Pas d'erreur affichee le formulaire est valide
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
      const eventType = this.fieldsTypeContainingCharacters.includes(element.type) === true ? 'input' : 'change';

      element.addEventListener(eventType, (event) => this.handleField(event.target, elements));
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
    const dataAttributes = target.closest('.formData').dataset;
    let isValid = true;

    // Gestion des differents types de champs
    if (target.type === 'radio') {
      isValid = this.validator.isValid(target.name, elements);
    } else if (target.type === 'checkbox') {
      isValid = this.validator.isValid(target.name, target);
    } else if (this.fieldsTypeContainingCharacters.includes(target.type) === true) {
      isValid = this.validator.isValid(target.name, target.value);
    } else {
      isValid = false;
    }

    // Affiche ou masque le message d'erreur du champs cible
    if (isValid === false) {
      dataAttributes.error = this.validator.getErrorMessage(target.name);
      dataAttributes.errorVisible = true;
    } else if (dataAttributes.hasOwnProperty('error') === true) {
      // hasOwnProperty('error') pour eviter un effet visuel " vide " cause par le pseudo element ::after
      dataAttributes.error = '';
      dataAttributes.errorVisible = false;
    }
  }

  /**
   * Reinitialise toutes les valeurs du formulaire
   * Reinitialise les informations gerant l'affichage des messages d'erreurs
   */
  reset() {
    this.form.reset();

    Array.from(this.form.querySelectorAll('.formData')).map((element) => {
      element.dataset.error = '';
      element.dataset.errorVisible = false;
    });
  }
}

// Initialisation des regles de gestions determinant la validite des champs du formulaire

const checkBirthdate = (value) => {
  const today = new Date();
  const dateChoosen = new Date(value);

  return value.trim() !== '' && dateChoosen < today;
};

const RegistrationValidator = new Validator();

RegistrationValidator.add('firstname', getText('firstname'), (value) => /^([a-zA-Z]{2,})([a-zA-Z\ \- \']*)([a-zA-Z]*)$/.test(value));
RegistrationValidator.add('lastname', getText('lastname'), (value) => /^([a-zA-Z]{2,})([a-zA-Z\ \- \']*)([a-zA-Z]*)$/.test(value));
RegistrationValidator.add('email', getText('email'), (value) => /^[a-zA-Z0-9-.+_]+@[a-zA-Z0-9-]+[.]{1}[a-zA-Z]{2,4}$/.test(value));
RegistrationValidator.add('birthdate', getText('birthdate'), checkBirthdate);
RegistrationValidator.add('quantity', getText('quantity'), (value) => /^[0-9]?[0-9]$/.test(value));
RegistrationValidator.add('location', getText('location'), (radioNodeList) => Array.from(radioNodeList).filter((radio) => radio.checked).length === 1);
RegistrationValidator.add('conditionsAccepted', getText('conditionsAccepted'), (checkbox) => checkbox.checked);

// Initialisation du formulaire et ajout des regles de gestion sur chaque champs cibles

const RegistrationForm = new Form('.form-signup', RegistrationValidator);

// Les noms des cles definissant chaque regle de gestion est identique au nom du champs cible

Object.keys(RegistrationValidator.getRules()).forEach((fieldName) => {
  RegistrationForm.setFormFieldOnChange(fieldName);
});

// Gestion de l'affichage du menu sur une largeur d'ecran responsive

function editNav() {
  const x = document.getElementById('myTopnav');

  if (x.className === 'topnav') {
    x.className += ' responsive';
  } else {
    x.className = 'topnav';
  }
}

// Modal
const RegistrationModal = new Modal('.bground');

// DOM Elements
const modalBtn = document.querySelectorAll('.modal-btn');
const modalBtnClose = RegistrationModal.getModalElement().querySelector('.close');

// Event declenchant l'affichage de la modal
modalBtn.forEach((btn) => btn.addEventListener('click', () => RegistrationModal.launch()));

// Event declenchant la fermeture de la modal
modalBtnClose.addEventListener('click', handleCloseModal);

// Event declenchant l'envoi du formulaire
RegistrationForm.getFormElement().addEventListener('submit', handleFormRegistration);

// Configuration
const modalProcessTimeout = 3000;

/**
 * Fermeture de la modal
 *
 * Les elements contenu dans la modal sont reinitialise
 * aux valeurs par defaut des le premier affichage
 */
function handleCloseModal() {
  // Formulaire re-affiche par defaut
  RegistrationModal.displayContent('.form-signup', true, '.notVisible');
  // Spinner + message de confirmation masques
  RegistrationModal.displayContent('.status-work-in-progress', false);
  RegistrationModal.displayContent('.status-processed', false);
  // Reinitialisation du message d'information
  RegistrationModal.updateContent('.status-processed', '');
  RegistrationModal.close();
}

/**
 * Traitement des donnees du formulaire
 *
 * @param {Event} event
 */
function handleFormRegistration(event) {
  event.preventDefault();

  if (RegistrationForm.isValid() === true) {
    // bouton close masque
    RegistrationModal.displayContent('.close', false);

    // Le formulaire est masque visuellement mais toujours present dans le rendu
    // La class .notVisible est utilisee pour conserver la hauteur de l'element
    RegistrationModal.displayContent('.form-signup', false, '.notVisible');

    // Affichage du spinner
    RegistrationModal.displayContent('.status-work-in-progress', true);

    // Traitement en cours ( simulation )
    window.setTimeout(() => {
      // Traitement termine le spinner est masque
      RegistrationModal.displayContent('.status-work-in-progress', false);

      // Message de confirmation affiche
      RegistrationModal.updateContent('.status-processed', getText('formProcessed'));
      RegistrationModal.displayContent('.status-processed', true);

      // bouton close re-affiche
      RegistrationModal.displayContent('.close', true);

      RegistrationForm.reset();
    }, modalProcessTimeout);
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
    case 'firstname':
      return 'Le champs prénom doit au moins commencer par 2 lettres et peut ensuite contenir des lettres, espaces et apostrophes.';

    case 'lastname':
      return 'Le champs nom doit au moins commencer par 2 lettres et peut ensuite contenir des lettres, espaces et apostrophes.';

    case 'email':
      return 'Veuillez entrer une adresse email valide.';

    case 'birthdate':
      return 'Vous devez indiquer une date de naissance valide.';

    case 'quantity':
      return 'Vous devez entrer une valeur numérique entre 0 et 99 inclus.';

    case 'location':
      return 'Vous devez choisir une option.';

    case 'conditionsAccepted':
      return 'Vous devez vérifier que vous acceptez les termes et conditions.';

    case 'formProcessed':
      return 'Merci ! Votre réservation a été reçue.';
  }
}

/**
 * Fermeture de la modal
 *
 * Les elements contenu dans la modal sont reinitialises
 * aux valeurs par defaut des le premier affichage
 */
function handleCloseModal() {
  // Formulaire re-affiche par defaut
  RegistrationModal.displayContent('.form-signup', true);
  // Spinner + message de confirmation masques
  RegistrationModal.displayContent('.status-work-in-progress', false);
  RegistrationModal.displayContent('.status-processed', false);
  // Reinitialisation du message d'information
  RegistrationModal.close();

  topNavFixed(false);
  enableBodyScroll(true);
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
    RegistrationModal.displayContent('.form-signup', false);

    // Affichage du spinner
    RegistrationModal.displayContent('.status-work-in-progress', true);

    // Traitement en cours ( simulation )
    window.setTimeout(() => {
      // Traitement termine le spinner est masque
      RegistrationModal.displayContent('.status-work-in-progress', false);

      // Message de confirmation affiche
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

	default:
		return '';
  }
}


// Configuration
const modalProcessTimeout = 3000;


// Initialisation des regles de gestions determinant la validite des champs du formulaire

const checkBirthdate = (value) => {
  const today = new Date();
  const dateChoosen = new Date(value);

  return value.trim() !== '' && dateChoosen < today;
};

const checkName = (value) => {
	return /^([a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{2,})([a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\ \- \']*)([a-zA-Z]*)$/.test(value);
};

const RegistrationValidator = new Validator();

RegistrationValidator.add('firstname', getText('firstname'), checkName);
RegistrationValidator.add('lastname', getText('lastname'), checkName);
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


// Gestion de la desactivation du scroll de la page
const enableBodyScroll = (bool) => {
  bool === true ? document.body.classList.remove('overflow-hidden') : document.body.classList.add('overflow-hidden');
};


// Gestion de l'affichage du menu en fixed sur une largeur d'ecran responsive

const topNav = document.getElementById('myTopnav');

const topNavFixed = (bool) => {
  bool === true ? topNav.classList.add('topnav-fixed-mobile') : topNav.classList.remove('topnav-fixed-mobile');
};

topNav.addEventListener('click', () => {
  topNav.classList.contains('responsive') === false ? topNav.classList.add('responsive') : topNav.classList.remove('responsive');
});


// Modal
const RegistrationModal = new Modal('.bground');


// DOM Elements
const modalBtn = document.querySelectorAll('.modal-btn');
const modalBtnClose = RegistrationModal.getModalElement().querySelector('.close');


// Event declenchant l'affichage de la modal
modalBtn.forEach((btn) =>
  btn.addEventListener('click', () => {
    RegistrationModal.launch();
    topNavFixed(true);
    enableBodyScroll(false);
  })
);


// Event declenchant la fermeture de la modal
['.close', '.btn-close'].forEach(function (btn) {
  RegistrationModal.getModalElement().querySelector(btn).addEventListener('click', handleCloseModal);
});

document.body.addEventListener('keyup', (event) => event.key === 'Escape' ? handleCloseModal() : null);


// Event declenchant l'envoi du formulaire
RegistrationForm.getFormElement().addEventListener('submit', handleFormRegistration);


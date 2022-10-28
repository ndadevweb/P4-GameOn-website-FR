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

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

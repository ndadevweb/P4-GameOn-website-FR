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
}

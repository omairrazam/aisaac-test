import Controller from '@ember/controller';

export default Controller.extend({

  actions: {
    showInvoicePopup(){
      this.set('showInvoicePopup',true)
    },

    hideInvoicePopup(){
      this.set('showInvoicePopup',false)
    }
  }
});

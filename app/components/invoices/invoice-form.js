import Component from '@ember/component';
import {inject as service} from '@ember/service';
import {task} from 'ember-concurrency';

export default Component.extend({
  store: service(),

  init() {
    this._super(...arguments);

    if (this.newInvoice) {
      let invoice = this.get('store').createRecord('invoice');
      this.set('invoice', invoice);
    }
  },

  saveInvoiceTask: task(function* () {
    try {
      yield this.get('invoice').save();
      !!this.onClose && this.onClose();
      alert('success');
    } catch (error) {
      alert('some error occurred');
    }
  }).drop(),

  actions: {
    submit() {
      this.get('saveInvoiceTask').perform();
    }
  }
});

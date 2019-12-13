import Component from '@ember/component';

export default Component.extend({
  init(){
    this._super(...arguments);
  },

  actions: {
    onClose(){
      this.set('showDialog',false);
    }
  }
});

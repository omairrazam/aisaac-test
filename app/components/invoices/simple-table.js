import Component from '@ember/component';
import TableCommon from '../../mixins/table-common';
import {computed} from '@ember/object';
import moment from 'moment';
import {task, timeout} from 'ember-concurrency';

export default Component.extend(TableCommon, {

  columns: computed(function () {
    return [
      {
        label: 'Id',
        valuePath: 'id',
        width: '60px',
        sortable: false,

      }, {
        label: 'Amount',
        valuePath: 'amount',
        sortable: false,
      }, {
        label: 'Date',
        valuePath: 'date',
        sortable: false,
        cellComponent: 'invoices/simple-table-segments/display-date'
      }, {
        label: 'Actions',
        width: '100px',
        sortable: false,
        cellComponent: 'invoices/invoice-actions'
      }];
  }),

  listedInvoicesAmount: computed('filteredResults.[]', function(){
    if(!this.get('filteredResults')){
      return 0;
    }

    return this.get('filteredResults').map(el=>el.amount).reduce((a, b) => a + b, 0);
  }),

  init() {
    this._super(...arguments);
    this.set('modelName', 'Invoice');
    this.set('qParams', {});
  },

  setRows: task(function* (rows) {
    this.get('table').setRows([]);
    yield timeout(100); // Allows isLoading state to be shown
    this.get('table').setRows(rows);
  }).restartable(),

  filterModel: task(function* (debounceMs = 200) {
    yield timeout(debounceMs);

    let model = this.get('model');
    let query = this.get('qParams');
    let startDateMoment = moment(query.startDate,'YYYY-MM-DD',true);
    let endDateMoment = moment(query.endDate,'YYYY-MM-DD', true);
    let result = model;

    if (query.startDate && startDateMoment.isValid()) {
      result = result.filter((m) => {
        return moment(m.date).diff(startDateMoment) >= 0;
      });
    }

    if (query.endDate && endDateMoment.isValid()) {
      result = result.filter((m) => {
        return moment(m.date).diff(endDateMoment) <= 0;
      });
    }

    this.set('filteredResults',result);
    yield this.get('setRows').perform(result);
  }).restartable(),

  actions: {
    deleteInvoice(row) {
      let confirmed = window.confirm(`Are you sure you want to delete ${row.get('firstName')} ${row.get('lastName')}?`);

      if (confirmed) {
        this.get('table').removeRow(row);
        row.get('content').deleteRecord();
      }
    },

    editInvoice(row) {
      this.set('editableInvoice', row.get('content'));
      this.set('showInvoicePopup', true);
    },

    onSearchChange(input) {
      let qParams = this.get('qParams');
      qParams[input.name] = input.value;

      this.set('qParams', qParams);
      this.get('filterModel').perform();
    }

  }
});

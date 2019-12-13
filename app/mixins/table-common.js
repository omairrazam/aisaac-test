import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import Table from 'ember-light-table';
import { task } from 'ember-concurrency';

export default Mixin.create({
  store: service(),

  page: 0,
  limit: 10,
  dir: 'asc',

  isLoading: computed.oneWay('fetchRecords.isRunning'),
  canLoadMore: true,
  enableSync: true,

  model: null,
  meta: null,
  columns: null,
  table: null,

  init() {
    this._super(...arguments);

    let table = Table.create();
    table.setRowsSynced([]);
    table.addColumns(this.get('columns'));
    table.setRowsSynced (this.get('store').findAll('invoice'));
    this.set('table', table);
  },

  fetchRecords: task(function*() {
    let records = yield this.get('store').findAll(this.get('modelName'));
    this.set('model', records.toArray());
    this.set('filteredResults', records.toArray());
    this.table.setRowsSynced (records);
    this.set('meta', records.get('meta'));
    this.set('canLoadMore', false);
  }).restartable(),


  actions: {
    onScrolledToBottom() {
      if (this.get('canLoadMore')) {
        this.incrementProperty('page');
        this.get('fetchRecords').perform();
      }
    },

    onColumnClick(column) {
      if (column.sorted) {
        this.setProperties({
          dir: column.ascending ? 'asc' : 'desc',
          sort: column.get('valuePath'),
          canLoadMore: true,
          page: 0
        });
        this.get('model').clear();
      }
    }
  }
});

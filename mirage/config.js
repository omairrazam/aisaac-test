export default function () {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    https://www.ember-cli-mirage.com/docs/route-handlers/shorthands
  */


  this.patch('/invoices/:id'); // or this.patch
  this.get(`/invoices`, (schema, request) => {
    return schema.invoices.all();
  });

  this.post('/invoices', function (schema, request) {
    let params = JSON.parse(request.requestBody);
    let obj = schema.db.invoices.firstOrCreate({amount: params.amount,date:params.date});

    return {
      data: {
        type: 'invoices',
        id: obj.id,
        attributes: schema.invoices.find(obj.id)
      }
    };
  });

}

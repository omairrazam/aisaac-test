import {faker} from "ember-cli-mirage";
import moment from "moment";

export default function (server) {

  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */

  // server.createList('post', 10);
  for (var i = 0; i < 50; i++) {
    server.create('invoice', {amount: faker.random.number(), date: moment(faker.date.past())})
  }


}


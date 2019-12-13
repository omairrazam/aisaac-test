import Model from '@ember-data/model';
import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  amount: validator('presence', true),
  date: [
    validator('presence', true),
  ],
});

export default Model.extend(Validations,{
	amount: DS.attr('number'),
	date: DS.attr('date')
});

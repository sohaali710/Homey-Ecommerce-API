'use strict';

var expect = require('chai').expect;
var mosc   = require('../mosc');

describe('#MoscModelBuilder', function () {

	it('Should return {id:{type:"string"}}', function () {

		var result = new mosc({}).build('id', 'type:string').end(); 
		expect(result).to.have.property('id').to.have.property('type').to.equal('string');

	});

	it('Should return {id:string}', function () {

		var result = new mosc({}).build('id:string', '').end(); 
		expect(result).to.have.property('id').to.equal('string');

	});

	it('Should return {id:{type:"SEQUELIZE_STRING"}}', function () {

		var context_dictionary = {'SEQ':{string:'SEQUELIZE_STRING'}};
		var result = new mosc(context_dictionary).build('id', 'type:*SEQ*.string').end();
		expect(result).to.have.property('id').to.have.property('type').to.equal('SEQUELIZE_STRING');

	});

	it('Should return {id:string, comment:{ type:{} }', function () {

		var result = new mosc({}).build('id:string').buildIn('comment.type').end();
		expect(result).to.have.property('comment').to.have.property('type');

	});

	it('Should return {attributes:{id:{type:"SEQUELIZE_STRING"}}}', function () {

		var context_dictionary = {'SEQ':{string:'SEQUELIZE_STRING'}};
		var result = new mosc(context_dictionary).buildIn('attributes.id', 'type:*SEQ*.string').end();
		expect(result).to.have.property('attributes').to.have.property('id').to.have.property('type').to.equal('SEQUELIZE_STRING');

	});

	it('Should throw a Path not an object error', function () {
		var result = new mosc({});

		function testNoPropThrow(){
			result.buildIn('main.type', 'compound:True, unique:false').buildIn('main.type.compound');
		}

		expect(testNoPropThrow).to.throw('Path not an object');
	});

	it('Should throw a No prop key passed error', function () {
		var result = new mosc({});

		function testNoPropThrow(){
			result.build();
		}

		expect(testNoPropThrow).to.throw('No prop key passed');
	});

	it('Should throw a No object properties passed error', function () {
		var result = new mosc({});

		function testNoPropThrow(){
			result.build('id', '');
		}

		expect(testNoPropThrow).to.throw('Invalid key:value pair passed');
	});

	it('Should throw an Invalid key:value pair passed error', function () {
		var result = new mosc({});

		function testNoPropThrow(){
			result.build('id', 'type::script');
		}

		expect(testNoPropThrow).to.throw('Invalid key:value pair passed');
	});


	it('Should throw a Context not found in eval_dict error', function () {
		var result = new mosc({});

		function testNoPropThrow(){
			result.build('id', 'type:*s*.script');
		}

		expect(testNoPropThrow).to.throw('Context not found in eval_dict');
	});


});
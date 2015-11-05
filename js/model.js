"use strict";

function MainModel(db) {
	var self = this;
	self.orders = ko.observableArray();
	self.customers = ko.observableArray();
	db.customer.toArray(self.customers);
	db.customer.forEach(function(e) {
		//
	});
	self.addOrder = function() {
		self.orders.push(new Order());
	};
}

function Order() {
	var self = this;
	self.customer = ko.observable();
	self.machine = null;
	self.tasks = ko.observableArray();
	self.addTask = function() {
		self.tasks.push(new Task());
	};
};

function Customer(name, machines) {
	this.name = name;
	this.machines = machines;
};

function Machine(name) {
	this.name = name;
};

function Task() {
	this.part = ko.observable();
	this.startDate = ko.observable();
	this.startTime = ko.observable();
	this.endDate = ko.observable();
	this.endTime = ko.observable();
};

ko.bindingHandlers.datePicker = {
	init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
		var options = allBindings().params || {};
		options.onChangeDateTime = function(dp, input) {
			var value = valueAccessor();
			value(input.val());
		};
		options.startDate = ko.unwrap(valueAccessor());
		ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
			$(element).datetimepicker("destroy");
		});
		$(element).datetimepicker(options);
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

    }
};
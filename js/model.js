"use strict";

function MainModel() {
	var self = this;
    self.orders = ko.observableArray();
	self.customers = [
		new Customer("Peter Fischer GmbH", [ new Machine("Fräse"), new Machine("Drucker"), new Machine("Presse") ]),
		new Customer("Hans Dampf Ldt.", [ new Machine("Pumpe"), new Machine("Säge") ]),
	];
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
	this.part = null;
	this.start = null;
	this.end = null;
};

ko.applyBindings(new MainModel());

ko.bindingHandlers.datePicker = {
    init: function(element, valueAccessor) {
        $(element).datetimepicker();
    },
};
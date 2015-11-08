"use strict";

function MainModel(db) {
	var self = this;
	
	self.orders = ko.observableArray([]);
	db._order
		.include("machine")
		.include("machine.customer")
		.include("tasks")
		.toArray(self.orders);
	
	self.customers = ko.observableArray([]);
	//db.customer.include("machines").toArray(self.customers);
	
	self.addOrder = function() {
		var order = new Order();
		self.orders.push(order.asKoObservable());
	};
	self.reset = function() {
		
	};
	self.save = function() {
		
	};
}

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
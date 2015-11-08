"use strict";

function MainModel(db) {
	var self = this;
	
	self.createOrder = function() {
		var machine = self.selectedMachine();
		self.selectedCustomer(undefined);
		self.selectedMachine(undefined);
		var order = new Order({ machine: machine });
		db._order.add(order);
		db.saveChanges().then(refreshOrders);
	};
	self.removeOrder = function(order) {
		var orderEntity = order.getEntity();
		db._order.remove(orderEntity);
		orderEntity.tasks.forEach(function(task) {
			db.task.remove(task);
		});
		db.saveChanges().then(refreshOrders);
	};
	self.addTask = function(order) {
		var task = order.newTask.getEntity();
		order.newTask = createNewTaskObservable(order);
		var taskEntity = db.task.add(task);
		db.saveChanges().then(refreshOrders);
	};
	self.removeTask = function(task) {
		db.task.remove(task);
		db.saveChanges().then(refreshOrders);
	};

	self.customers = ko.observableArray([]);
	db.customer
		.include("machines")
		.toArray(self.customers);
		
	self.orders = ko.observableArray([]);
	self.orders.subscribe(function(array) {
		//insert a new task to each new order for adding tasks
		array.forEach(function(order) {
			order.newTask = createNewTaskObservable(order);
		});
	});
	refreshOrders();
		
	self.selectedCustomer = ko.observable();
	self.selectedMachine = ko.observable();
	
	function refreshOrders() {
		db._order
			.include("machine")
			.include("machine.customer")
			.include("tasks")
			.toArray(self.orders);
	};
	
	function createNewTaskObservable(order) {
		var task = new Task({ order: order.getEntity() });
		var observable = task.asKoObservable();
		var validate = function() {
			task.isValid();
		}
		//force ValidationErrors to be set
		validate();
		//call isValid on changes to update ValidationErrors
		observable.part.subscribe(validate);
		observable.start.subscribe(validate);
		observable.end.subscribe(validate);
		return observable;
	};
};

ko.bindingHandlers.datePicker = {
	init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
		var options = allBindings().params || {};
		options.onChangeDateTime = function(dp, input) {
			var value = valueAccessor();
			value(dp);
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
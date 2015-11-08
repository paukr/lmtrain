"use strict";

$data.Entity.extend("Customer", {
    id: { type: "integer", key: true, computed: true },
    name: { type: "string", required: true },
	
    machines: { type: "Array", elementType: "Machine", inverseProperty: "customer" },
	//orders: { type: "Array", elementType: "Order", inverseProperty: "customer" },
});

$data.Entity.extend("Machine", {
    id: { type: "integer", key: true, computed: true },
    customer: { type: "Customer", required: true, inverseProperty: "machines" },
	name: { type: "string", required: true },
	
	orders: { type: "Array", elementType: "Order", inverseProperty: "machine" }
});

$data.Entity.extend("Task", {
    id: { type: "integer", key: true, computed: true },
	order: { type: "Order", required: true, inverseProperty: "tasks" },
    part: { type: "string", required: true },
	start: { type: "datetime", required: true },
	end: { type: "datetime", required: true }
});

$data.Entity.extend("Order", {
    id: { type: "integer", key: true, computed: true },
	machine: { type: "Machine", required: true, inverseProperty: "orders" },

	tasks: { type: "Array", elementType: "Task", inverseProperty: "order" }
});

$data.EntityContext.extend("Context", {
	customer: { type: $data.EntitySet, elementType: "Customer" },
	machine: { type: $data.EntitySet, elementType: "Machine" },
	_order: { type: $data.EntitySet, elementType: "Order" },
	task: { type: $data.EntitySet, elementType: "Task" },
});

var db = new Context({ provider: "local", dbCreation: $data.storageProviders.DbCreationType.DropAllExistingTables });
db.onReady(function() {
	var applyBinding = function() {
		ko.applyBindings(new MainModel(db));
	};
	db.customer.count(function(count) {
		if (count > 0) {
			applyBinding();
			return;
		}
		var fischer = db.customer.add({ name: "Peter Fischer GmbH" });
		var hans = db.customer.add({ name: "Hans Dampf Ldt." });

		var fraese = db.machine.add({ name: "Fräse", customer: fischer });
		db.machine.addMany([
			{ name: "Drucker", customer: fischer },
			{ name: "Presse", customer: fischer },
			{ name: "Pumpe", customer: hans },
			{ name: "Säge", customer: hans }
		]);
		var order = db._order.add({ machine: fraese });
		db.task.add({ order: order, part: "Schraube", start: new Date(), end: new Date() });
		db.saveChanges().then(applyBinding);
	});
});


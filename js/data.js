"use strict";

$data.Entity.extend("Customer", {
    id: { type: "int", key: true, computed: true },
    name: { type: String, required: true },
    machines: { type: Array, elementType: "Machine", inverseProperty: "owner" }
});

$data.Entity.extend("Machine", {
    id: { type: "int", key: true, computed: true },
    name: { type: String, required: true },
	owner: { type: Customer, inverseProperty: "machines", required: true }
});

$data.EntityContext.extend("Context", {
	customer: { type: $data.EntitySet, elementType: Customer },
	machine: { type: $data.EntitySet, elementType: Machine }
});

var db = new Context({ provider: "local", dbCreation: $data.storageProviders.DbCreationType.DropAllExistingTables });
db.onReady(function() {
	var fischer = db.customer.add({ name: "Peter Fischer GmbH" });
	var hans = db.customer.add({ name: "Hans Dampf Ldt." });
	db.saveChanges().then(function() {
		db.machine.addMany([
			{ name: "Fräse", owner: fischer },
			{ name: "Drucker", owner: fischer },
			{ name: "Presse", owner: fischer },
			{ name: "Pumpe", owner: hans },
			{ name: "Säge", owner: hans }
		]);
		db.saveChanges().then(function() {
			ko.applyBindings(new MainModel(db));
		});
	});	
});
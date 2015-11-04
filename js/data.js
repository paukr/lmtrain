"use strict";

$data.Entity.extend("$org.types.Customer", {
    Id: { type: "int", key: true, computed: true },
    Name: { type: "string", required: true },
    Machines: { type: "Array", elementType: "$org.types.Machine", inverseProperty: "Customer" }
});

$data.Entity.extend("$org.types.Machine", {
    Id: { type: "int", key: true, computed: true },
    Name: { type: "string", required: true },
	Customer: { type: "$org.types.Customer", inverseProperty: "Machines", required: true }
});

$data.EntityContext.extend("$org.types.Context", {
	Customer: { type: $data.EntitySet, elementType: $org.types.Customer },
	Machine: { type: $data.EntitySet, elementType: $org.types.Machine }
});

$org.context = new $org.types.Context({ name: "indexedDb", databaseName: "DB" });
$org.context.onReady(function() {
	$org.context.Customer.count(function(count) {
		if (count > 0) {
			return;
		}
		var fischer = new $org.types.Customer({ Name: "Peter Fischer GmbH" });
		var fraese = new $org.types.Machine({ Name: "Fräse", Customer: fischer });
		var drucker = new $org.types.Machine({ Name: "Drucker", Customer: fischer });
		var presse = new $org.types.Machine({ Name: "Presse", Customer: fischer });
		$org.context.Customer.add(fischer);
		$org.context.Machine.add(fraese, drucker, presse);
		
		var hans = new $org.types.Customer({ Name: "Hans Dampf Ldt." });
		var pumpe = new $org.types.Machine({ Name: "Pumpe", Customer: hans });
		var saege = new $org.types.Machine({ Name: "Säge", Customer: hans });
		$org.context.Customer.add(hans);
		$org.context.Machine.add(pumpe, saege);
		
		$org.context.saveChanges();
	});
});

//http://jaydata.org/blog/how-to-use-jaydata-with-knockoutjs
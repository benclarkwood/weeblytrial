function startEasel() {
	// Set all the counts at initialization
	$("#easel").find(".canvas").each( function() {
		canvasCounter += 1;
		
		elementCounter += $(this).children(".canvas-element").length;
	});
	
	// Add click handler for the page tabs
	$(".page-tab").click( function() {
		pageTabWasClicked(this);
	});

	// Add click handler for all existing elements
	$(".canvas-element").click( function() {
		elementWasClicked(this);
	});
	
	// Add click for all existing delete buttons
	$(".canvas-element-control.delete").click( function() {
		deleteElementWasClicked(this);
	});
	
	// Add click for all existing canvas elements
	$(".canvas").click( function() {
		canvasWasClicked(this)
	});
	
	// Make all existing canvas elements droppable
	$(".canvas").each( function() {
		if (this.id === 'canvas-template') {
		
		} else {
			$(this).droppable();
		}
	});
	
	// Bind the listener for elements being dropped onto the canvas
	$(".canvas").on( "drop", function( event, ui ) {
		console.log("dropped");
		
		var typeOfElement = ui.draggable.attr('id');
		
		addNewElementofTypeToActiveCanvas(typeOfElement);
	});
}

/*
 * Canvas methods 
 */
 
 function addNewCanvasWithTitle(canvasTitle) {
  	newCanvasId = "canvas-" + canvasCounter;
 	
 	newPageTabId = "pagetab-" + canvasCounter;
 	
 	// Create the new canvas from the template
 	var newCanvas = $("#canvas-template").clone(true).removeAttr('id');
 	 	 	
 	newCanvas.attr('id', newCanvasId);
 	
 	// Deep copy does not preserve droppable. Instantiate here instead.
 	newCanvas.droppable();
 	
 	// Create the new pageTab from the template
 	var newPageTab = $("#page-tab-template").clone(true).removeAttr('id');
 	
 	newPageTab.attr('id', newPageTabId);
 	
 	// Set the title of the page tab
 	newPageTab.empty().append(canvasTitle);
 	
 	// Add both to their respective places in the easel.
 	$("#canvases").append(newCanvas);
 	$("#page-tabs").append(newPageTab);
 }
 
 // Removes the canvas with the specified id
 function deleteCanvasWithId(canvasId) {
 	var wasActiveCanvas = false;
 	
 	console.log($("#" + canvasId).hasClass("active"));
 	
 	// Check if the canvas was the active canvas
 	if ($("#" + canvasId).hasClass("active")) {
		wasActiveCanvas = true;
 	}
 	
 	console.log("wasActiveCanvas = " + wasActiveCanvas)
 	
 	// Delete the canvas
 	$("#" + canvasId).remove();
 	
 	// Remove the associated pageTab
 	pageTabId = "#pagetab-" + numberFromIdString(canvasId);
 	
 	$(pageTabId).remove();
 	
 	// Since that was the active canvas we need to switch what canvas is active
 	// And select the associated pageTab
 	if (wasActiveCanvas) {
 		var canvases = $("#canvases").children(".canvas");
 		
 		// Check if there are actually any canvases
 		if (canvases.length > 0) {
 			// Make the first one active
 			$(canvases[0]).addClass("active");
 			
 			// Highlight the appropriate pageTab
 			$("#pagetab-" + numberFromIdString(canvases[0].id)).addClass("selected");
 		}
 	}
 }

/* Routes clicks on canvas elements */
function canvasWasClicked(canvas) {
	console.log("canvasWasClicked");
}


/* Routes page-tab clicks */
function pageTabWasClicked(pageTab) {
	console.log("pageTabWasClicked");
	
	if ($(pageTab).hasClass("selected")) {
		// Do nothing. Canvas should not change
	} else {
		// Deselect old tab
		$(".page-tab.selected").removeClass("selected");
		
		// Select new tab
		$(pageTab).addClass("selected");
		
		// get page tab number
		
		// get canvasId of new canvas
		var canvasId = "canvas-" + numberFromIdString($(pageTab).attr('id'));
		
		// call canvasWasChangeTo and give it canvasId
		canvasWasChangedTo(canvasId);
		
		// Update the correct pageButton to be shown as visible
		var pageButtonId = "pagebutton-" + numberFromIdString($(pageTab).attr('id'));
		
		// Remove canvas-visible from all page buttons, add just to visible one
		$(".page-button").removeClass("canvas-visible");
		
		$("#" + pageButtonId).addClass("canvas-visible");
	}
}

/* Hides all canvases except that with id = canvasId */
function canvasWasChangedTo(canvasId) {
	console.log("canvasWasChangedTo");
	
	// Hide all canvases except that with correct id
	$(".canvas").each( function() {
		if (this.id !== canvasId) {
			$(this).removeClass("active");
		} else {
			$(this).addClass("active");
		}	
	});
}

/*
 * Element selection methods
 */

/* Routes element clicks */
function elementWasClicked(element) {
	console.log("elementWasClicked");
	
	// Check if this element is selected
	if ($(element).hasClass("selected")) {
		// Nothing should change. Element already selected.
		
	} else {
		// Call elementSelectionWasChangeTo and give it elementId.
		elementSelectionWasChangedTo(element.id);
	}
}

function elementSelectionWasChangedTo(elementId) {
	console.log("elementSelectionWasChangeTo");
	
	// Get current canvas
	var canvas = $("#" + elementId).closest(".canvas");
	
	// Use find to find selected element in this canvas.
	var currentSelectedElement = canvas.find(".canvas-element.selected");
	
	// Deselect the element
	currentSelectedElement.removeClass("selected");
	
	// Remove delete from the element
	currentSelectedElement.removeClass("delete");
	
	// Destroy its resizable widget
	if (currentSelectedElement.resizable()) {
		currentSelectedElement.resizable( "destroy" );
	}

	// Select the new element
	$("#" + elementId).addClass("selected");
	
	// Make the new element resizable
	
	// Get the minimums for this object type
	if ($("#" + elementId).hasClass("title-element")) {
		var minW = 150;
		var minH = 50;
	} else if ($("#" + elementId).hasClass("nav-element")) {
		var minW = 100;
		var minH = 50;
	} else if ($("#" + elementId).hasClass("image-element")) {
		var minW = 150;
		var minH = 150;
	} else if ($("#" + elementId).hasClass("text-element")) {
		var minW = 100;
		var minH = 50;
	}
	
	$("#" + elementId).resizable({ handles: "e, s, w", containment: "parent", minWidth: minW, minHeight: minH });
}

/*
 *	Element creation methods
 */
function addNewElementofTypeToActiveCanvas(type) {
	// Increment element counter
	elementCounter += 1;
	
	// Get appropriate element template
	var templateId = "#" + type + "-template";
	
	// Clone the element
	var newElement = $(templateId).clone(true).removeAttr('id');
	
	// Set the id
	var newElementId = "el-" + elementCounter;
	
	newElement.attr('id', newElementId);
	
	// Append the element to the active canvas
	$(".canvas.active").append(newElement);
}

/*
 * Element delete methods 
 */
function deleteElementWasClicked(deleteControl) {
	if ($(deleteControl).parent().hasClass("delete")) {
		// This is the second delete click, so the element should be removed from the canvas.
		$(deleteControl).parent().remove();
	} else {
		// First click on delete. Remove resizable and then add confirm to delete control 
		// and delete to element
		$(deleteControl).parent().resizable( "destroy" );
		
		$(deleteControl).parent().addClass("delete");
	}
}

// Takes string of format name-# and returns #
function numberFromIdString(id) {
	var bits = id.split('-');
	
	return bits[1];
}
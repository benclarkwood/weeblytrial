function startEasel() {
	// Set all the counts at initialization
	$("#easel").find(".canvas").each( function() {
		canvasCounter += 1;
		
		elementCounter += $(this).children(".canvas-element").length;
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
 	 	
 	// Create the new canvas from the template
 	var newCanvas = $("#canvas-template").clone(true).removeAttr('id');
 	 	 	
 	newCanvas.attr('id', newCanvasId);
 	
 	// Deep copy does not preserve droppable. Instantiate here instead.
 	newCanvas.droppable();
 	
 	// Add both to their respective places in the easel.
 	$("#canvases").append(newCanvas);
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
 	
 	// Remove the associated pageTabs from any nav elements
 	removeTabFromNavElements(canvasId);
 	
 	if (wasActiveCanvas) {
 		var canvases = $("#canvases").children(".canvas");
 		
 		// Check if there are actually any canvases
 		if (canvases.length > 0) {
 			// Make the first one active
 			$(canvases[0]).addClass("active");
 			
 			// Make the corresponding page button active as well
 			$("#pagebutton-" + numberFromIdString(canvases[0].id)).addClass("canvas-visible");
 		}
 	}
 }

/* Routes clicks on canvas elements */
function canvasWasClicked(canvas) {
	console.log("canvasWasClicked");
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
	// If it is a nav-element, run addNavElementToActiveCanvas()
	if (type === 'nav-element') {
		addNavElementToActiveCanvas();
	} else {
		// Otherwise directly call and append newElementOfType()
		var newElement = newElementOfType(type);
	
		// Append the element to the active canvas
		$(".canvas.active").append(newElement);
	}
}

/*
 *	This special method controls the creation of the singleton nav element 
 *  (singleton relative to each canvas)
 */
function addNavElementToActiveCanvas() {
	// First check if the canvas already has a nav element. If it doesn't proceed.
	if ($(".canvas.active").children(".nav-element").length == 0) {
		// Get a new nav element
		var navElement = newElementOfType("nav-element");
		
		// For each current page, get the title and canvas id and make a newPageTab to append to navElement
		var titles = [];
		var ids = [];
		
		$(".page-button").each( function() {
			// Exclude the add new button
			if ($(this).attr('id') != 'add-new-page' && $(this).attr('id') != 'page-button-template') {
				titles.push($(this).children(".page-button-title").val());
				ids.push($(this).attr('id')); 
			}
		});
		
		// Now make each page button and append to the navElement
		for (var i = 0; i < ids.length; i++) {
			navElement.append(newPageTab(ids[i], titles[i]));
		}
		
		// Set the page tab that corresponds to this canvas to be "selected"
		var activeCanvasId = $(".canvas.active").attr('id');
		
		activeCanvasId = numberFromIdString(activeCanvasId);
		
		var idClass = "pagetab-" + activeCanvasId;
		
		navElement.children("." + idClass).addClass("selected");
		
		// Now append the nav Element to the canvas
		$(".canvas.active").append(navElement);
	} else {
		alert("Already have nav");
	}
}

function newElementOfType(type) {
	elementCounter += 1;
	
	// Get appropriate element template
	var templateId = "#" + type + "-template";

	// Clone the element
	var newElement = $(templateId).clone(true).removeAttr('id');

	// Set the id
	var newElementId = "el-" + elementCounter;

	newElement.attr('id', newElementId);
	
	return newElement;
}

function newPageTab(id, title) {
	console.log("newPageTab");
	console.log("id is: " + id + " title is: " + title);
	
	var newPageTab = $("#page-tab-template").clone().removeAttr('id');
	
	// Set the title of the page tab
	newPageTab.empty();
	
	newPageTab.append(title);

	// Set the href of the page tab
	var idClass = "pagetab-" + numberFromIdString(id);
	
	newPageTab.addClass(idClass);
	
	// Return the new page tab
	return newPageTab;	
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

/* nav-element methods */
function removeTabFromNavElements(canvasId) {
	// Need to remove all corresponding tabs from any existing nav elements
	$("#canvases").find(".nav-element").each( function() {
		$(this).children(".pagetab-" + numberFromIdString(canvasId)).remove();
	});
}

function updatePageTabTitleForId(pageId, title) {
	$("#canvases").find(".nav-element").children(".pagetab-" + numberFromIdString(pageId)).empty().append(title);
}

function updateNavElementsWithNewPageTab(pageButtonId, title) {	
	// Need to add new page tab for new page
	$("#canvases").find(".nav-element").each( function() {		
		
		var pageTab = newPageTab(pageButtonId, title);
				
		// Check to see if this is the canvas of this page tab. If it is, tab should be selected.
		var canvasId = $(this).parent().attr('id');
		
		console.log("canvasId is: " + canvasId);
		
		canvasId = numberFromIdString(canvasId);
		pageButtonId = numberFromIdString(pageButtonId);
		
		if (pageButtonId == canvasId) {
			pageTab.addClass("selected");
		}
		
		// Now append the page tab to the nav element
		$(this).append(pageTab);
	});
}

// Takes string of format name-# and returns #
function numberFromIdString(id) {
	var bits = id.split('-');
	
	return bits[1];
}
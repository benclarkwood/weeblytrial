var elementCounter = 0;
var canvasCounter = 0;

$(document).ready( function() {
	startEditor();
	startEasel();
})

function startEditor() {	
	pageButtonHover();
	draggableElements();
	
	// Watch for clicks on the element icons
	$(".element-icon").click( function() {
	});
	
	// Add hover handler for existing pageButtons
	pageButtonHover();
	
	// Add click handler for page button delete and edit controls
	$(".page-button-control.delete").click( function() {
		pageButtonDeleteWasClicked(this);
	});
	
	$(".page-button-control.edit").click( function() {
		pageButtonEditWasClicked(this)
	});
	
	// Add click handler for the add page button
	$("#add-new-page").click( function() {
		addPageButtonWasClicked();
	})
	
	// Add click handler for the page buttons
	$(".page-button").not("#add-new-page").click( function() {
		pageButtonWasClicked(this);
	});
	
	// Add click handler for settings
	$(".setting-control").click( function() {
		settingControlWasClicked(this);
	});
	
	// Add keypress handler for the page button title editing (not add new button)
	$(".page-button-title").not("#add-new-page-title").keypress( function(event) {
		// Enter was hit
		if (event.which == 13) {
			pageButtonEditWasClicked($(this).parent().children(".edit"));
		}
	});
	
	// Add keypress handler for the page button title editing (not add new button)
	$("#add-new-page-title").keypress( function(event) {
		// Enter was hit
		if (event.which == 13) {
			var pageButtonInput = $("#add-new-page-title");
			
			// Validate the field
			if (pageButtonInput.val().length > 0) {
				addNewPageWithTitle(pageButtonInput.val());
			
				// Add back readonly to the input
				pageButtonInput.attr('readonly', true);
			} else {
				// No title, refocus on input.
				pageButtonInput.focus();
			}
			
			addPageButtonWasClicked();
		}
	});
}

/* Templates Section Methods */

// Controls styling of hovered page button
function pageButtonHover() {
	$(".page-button").hover( function() {
		// check if this is the add page button
		$(this).addClass("hovered");
	}, function() {
		$(this).removeClass("hovered");
	});
}

// Routes clicks on specified page button
function pageButtonWasClicked(pageButton) {
	// Check if this is the first click on the pageButton
	if ($(pageButton).hasClass("canvas-visible")) {
		// Not the first click
		
	} else {
		var noEditsOpen = true;
		
		// Check to see if the canvas visible has an edit. If there is, do nothing, refocus the text field
		if ($(".canvas-visible.edit").length > 0) {
			noEditsOpen = false;
			
			// Refocus on open edit
			$(".canvas-visible.edit").children(".page-button-title").focus();
		}
						
		if (noEditsOpen) {
			// Remove canvas-visible, active, delete and edit from all other page buttons
			$(".page-button").not(pageButton).removeClass("canvas-visible active delete edit");
			// Add it to this one
			$(pageButton).addClass("canvas-visible");
		
			// Make the corresponding canvas visible
			canvasWasChangedTo("canvas-" + numberFromIdString(pageButton.id));
		}
	}
}

/* Edit control methods */

// Routes clicks on page button edit controls
function pageButtonEditWasClicked(editControl) {
	if ($(editControl).parent().hasClass("edit")) {
		var pageButtonTitle = $(editControl).parent().children(".page-button-title");
		
		// Make sure the new title has length
		if (pageButtonTitle.val().length > 0) {
			// Done editing, lock the text input
			pageButtonTitle.attr('readonly', true);
		
			// Remove the active and edit states
			$(editControl).parent().removeClass("active edit");
			
			// Update all the nav elements
			updatePageTabTitleForId($(editControl).parent().attr('id'), pageButtonTitle.val());
		} else {
			// Not a valid title, refocus
			pageButtonTitle.focus();
		}
	} else {
		var noEditsOpen = true;
		
		// Check to see if there is an edit in progress. If there is, do nothing, refocus the text field
		if ($(".page-button.edit").length > 0) {
			noEditsOpen = false;
			
			// Refocus on open edit
			$(".page-button.edit").children(".page-button-title").focus();
		}
		
		if (noEditsOpen) {
			// Remove active, edit and delete from all other page buttons
			$(".page-button").removeClass("active edit delete");
		
			// First click. Add the edit active classes to the page button
			$(editControl).parent().addClass("edit active");		
		
			// Manipulate page button title 
			var pageButtonTitle = $(editControl).parent().children(".page-button-title");
		
			// Make the page button title editable
			pageButtonTitle.removeAttr('readonly');
		
			// Focus on the page button title
			pageButtonTitle.focus().select();
		}
	}
}

/* Delete Control Methods */

// Routes clicks on page button delete controls
function pageButtonDeleteWasClicked(deleteControl) {
	// Check if this is the first or second delete
	if ($(deleteControl).parent().hasClass("delete")) {
		// Second click, so delete the page button
		
		// Get id of canvas to be removed
		var idOfCanvasToDelete = "canvas-" + numberFromIdString($(deleteControl).parent().attr('id'));
		
		// Delete the canvas
		deleteCanvasWithId(idOfCanvasToDelete);
		
		// Delete the pagetab
		$(deleteControl).parent().remove();
	} else {
		// Remove active, edit and delete from all other page buttons
		$(".page-button").removeClass("active edit delete");
		
		// First click. Hide the edit button and add delete to page button.
		$(deleteControl).parent().addClass("delete active");		
	}
}

/* Add New Page Button Methods */

// Route clicks on the add page button
function addPageButtonWasClicked() {
	// Grab add new page button.
	var newPageButton = $("#add-new-page");
	
	// Route click appropriately.
	
	// Is it first click?
	if (newPageButton.hasClass("active second")) {
		// Not first click, is click on add button
		newPageButton.removeClass("hovered");
		newPageButton.removeClass("active second");
	} else if (newPageButton.hasClass("active")) {
		// Random click. Ignore.
	} else {
		var noEditsOpen = true;
		
		// Check to see if there is an edit in progress. If there is, do nothing, refocus the text field
		if ($(".page-button.edit").length > 0) {
			noEditsOpen = false;
			
			// Refocus on open edit
			$(".page-button.edit").children(".page-button-title").focus();
		}		
			
		if (noEditsOpen) {
		
			// Remove active, delete and edit state from all page buttons
			$(".page-button").removeClass("active delete edit");
		
			// First click. Add active state
			newPageButton.addClass("active");
		
			// Remove readonly from the text input
			var pageButtonInput = newPageButton.children(".page-button-title")
		
			pageButtonInput.removeAttr('readonly');
		
			// Focus on the text input
			pageButtonInput.focus();
		
			// Add a click handler for the add control and for enter. Both to call 
			// addNewPageWithTitle()
			newPageButton.children(".add").click( function() {
				// Check to see if the title has length. If so, call addNewPageWithTitle()
				if (pageButtonInput.val().length > 0) {
					addNewPageWithTitle(pageButtonInput.val());
				
					// remove click handler
					$(this).unbind("click");
				
					// Add back readonly to the input
					pageButtonInput.attr('readonly', true);
				} else {
					// No title, refocus on input.
					pageButtonInput.focus();
				}
			});
		}
	}
}

// Add new page with specified title.
function addNewPageWithTitle(title) {
	// Increment canvas count
	canvasCounter += 1;
	
	// Get id for new page
	var newPageId = "pagebutton-" + canvasCounter;
	
	// Call addNewCanvasWithTitle() to add canvas to easel
	addNewCanvasWithTitle(title);
	
	// Add a corresponding pageButton
	var newPageButton = $("#page-button-template").clone(true).removeAttr('id');
	
	// Set the id of the new page button
	newPageButton.attr('id', newPageId);
	
	// Set the value of the text input to the title
	newPageButton.children(".page-button-title").val(title);
	
	// Clear the add new page title
	$("#add-new-page").children(".page-button-title").val("");
	
	// Add the page button before the add new page button
	$("#add-new-page").before(newPageButton);
	
	// Set the new page to be active canvas and active page-button everywhere via pageTabWasClicked();
	// DO THIS	
	
	$("#add-new-page").addClass("second");
	
	// Update any existing nav elements
	updateNavElementsWithNewPageTab(newPageId, title);
	
	// If there aren't any active canvases, this new page should be the active one.
	if ($("#canvases").children(".active").length == 0) {
		$("#canvas-" + canvasCounter).addClass("active");
		newPageButton.addClass("canvas-visible");
	}
}

// Elements Section Methods
function draggableElements() {
	// Initialize each of the element icons to be draggable.
	$(".element-icon").each( function() {
		$(this).draggable();
		
		// Set the draggable to revert
		$(this).draggable({ revert: true, revertDuration: 0, zIndex: 1000, stop: function() {
			// Reset the element icon after it is dropped
			$(this).removeAttr('style');
			$(this).hide();
			$(this).fadeIn(500);
		} });
	});
}

/* 
 * Settings Section Methods
 */
 
 // Route clicks on setting controls
function settingControlWasClicked(control) {
	if ($(control).hasClass("active")) {
		$(control).removeClass("active");
		
		if (control.id == 'site-grid-toggle') {
			// See if there is an active ui-resizable, and reset the grid to [ 1, 1 ]
			$(".canvas-element.ui-resizable").resizable( "option", "grid", [ 1, 1 ] );
		}
	} else {
		$(control).addClass("active");
		
		if (control.id == 'site-grid-toggle') {
			// See if there is an active ui-resizable, and reset the grid to [ 20, 20 ]
			$(".canvas-element.ui-resizable").resizable( "option", "grid", [ 20, 20 ] );
		}
	}
}
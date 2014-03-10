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
}

// Templates Section Methods
function pageButtonHover() {
	$(".page-button").hover( function() {
		// check if this is the add page button
		$(this).addClass("hovered");
	}, function() {
		$(this).removeClass("hovered");
	});
}

/* Delete Control Methods */
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

function addPageButtonWasClicked() {
	console.log("addPageButtonWasClicked");
	
	// Grab add new page button.
	var newPageButton = $("#add-new-page");
	
	// Route click appropriately.
	
	// Is it first click?
	if (newPageButton.hasClass("active second")) {
		// Not first click, is click on add button
		newPageButton.removeClass("hovered");
		newPageButton.removeClass("active second");
	} else if (newPageButton.hasClass("active")) {
		// Random click
	} else {
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
	
	// Set the new page to be active everywhere via pageTabWasClicked();
	pageTabWasClicked($("#pagetab-" + canvasCounter));
	
	$("#add-new-page").addClass("second");
}
// 
// function pageButtonHover() {
// 	$(".page-button").hover( function() {
// 		console.log("Hovered over page-button");
// 
// 		$(this).addClass("is-hovered");
// 
// 		// If it's the new page button
// 		if (this.id === 'add-new-page') {
// 			// Check if the add new title is already being edited. If it isn't, change the
// 			// add icon and add a click handler for the button
// 			if ($(this).children(".page-button-title").attr('readonly')) {
// 				// Change add icon
// 				$(this).children(".add").addClass("hovered");
// 
// 				$(this).click( function() {
// 					$(this).unbind("click");
// 					addNewPageButtonWasClicked(this);
// 				});
// 			}
// 		} else {
// 			// Grab controls
// 			var deleteControl = $(this).children(".delete");
// 			var editControl = $(this).children(".edit");
// 			var pageButtonTitle = $(this).children(".page-button-title");
// 		
// 			// Show controls
// 			deleteControl.fadeIn(300);
// 			editControl.fadeIn(300);
// 		
// 			// Assign click handlers
// 			deleteControl.click( function() {
// 				$(this).unbind("click");
// 				pageButtonDelete(this)
// 			});
// 			editControl.click( function() {
// 				$(this).unbind("click");
// 				pageButtonEditWasClicked(pageButtonTitle)
// 			});
// 		}
// 	}, function() {
// 		console.log("Left page-button");
// 		
// 		$(this).removeClass("is-hovered");
// 		
// 		if (this.id === 'add-new-page') {
// 			$(this).children(".add").removeClass("hovered");
// 		} else {
// 			// Grab controls
// 			var deleteControl = $(this).children(".delete");
// 			var editControl = $(this).children(".edit");
// 			var pageButtonTitle = $(this).children(".page-button-title");
// 		
// 			// Unbind handlers
// 			deleteControl.unbind("click");
// 			editControl.unbind("click");
// 			
// 			// Only fade edit control if they aren't active
// 			if (!editControl.hasClass("editing")) {
// 				editControl.fadeOut(200);
// 				
// 				if (!deleteControl.hasClass("deleting")) {
// 					deleteControl.fadeOut(200);
// 				}
// 			}
// 		}
// 	});
// }
// 
// function pageButtonEditWasClicked(pageButtonTitle) {
// 	console.log("Edit Clicked");
// 	
// 	if ($(pageButtonTitle).attr('readonly')) {
// 		// Highlight the edit button
// 		$(pageButtonTitle).parent().children(".edit").addClass("editing");
// 				
// 		// Page button title was not editable. Call focus on pageButtonTitle to edit.
// 		$(pageButtonTitle).focus();
// 		
// 		$(pageButtonTitle).select();
// 				
// 		$(pageButtonTitle).removeAttr('readonly');
// 		
// 		// Add handler for ways editing can end. All should call pageButtonDidFinishEditing().		
// 		$(pageButtonTitle).parent().children(".edit").click( function() {
// 			$(this).unbind("click");
// 			pageButtonDidFinishUpdating(pageButtonTitle);
// 		});
// 		
// 		$(pageButtonTitle).keypress( function(event) {
// 			if (event.which == 13) {
// 				$(this).unbind("keypress");
// 				pageButtonDidFinishUpdating(pageButtonTitle);
// 				
// 				// Check if mouse if over the pageButton and hide the controls if it isn't
// 				if (!$(pageButtonTitle).parent().hasClass("is-hovered")) {
// 					$(pageButtonTitle).parent().children(".delete").fadeOut(200);
// 					$(pageButtonTitle).parent().children(".edit").fadeOut(200);
// 				}
// 			}
// 		});		
// 	}
// }
// 
// function pageButtonDidFinishUpdating(pageButtonTitle) {
// 	console.log("pageButtonDidFinishUpdating");
// 	
// 	// Lock the pageButtonTitle from editing.
// 	$(pageButtonTitle).attr('readonly', true);
// 	
// 	// Update the page template name.
// 	updatePageTemplate(pageButtonTitle);
// 	
// 	// If the pagebutton is an existing page button rebind and dehighlight
// 	if ($(this).parent().attr('id') != 'add-new-page') {
// 		// Remove the highlight on the edit button
// 		$(pageButtonTitle).parent().children(".edit").removeClass("editing");
// 	
// 		// Edit click needs to be rebound to look for further edits
// 		$(pageButtonTitle).parent().children(".edit").click( function() {
// 			pageButtonEditWasClicked(pageButtonTitle);
// 		});
// 	}
// }
// 
// function addNewPageButtonWasClicked(addNewButton) {
// 	// Grab addNewTitle
// 	var addNewTitle = $(addNewButton).children(".page-button-title");
// 	
// 	// Add new was clicked. Remove readonly from page button title to allow editing.
// 	$(addNewTitle).removeAttr('readonly');
// 	
// 	// Focus on the add new title
// 	$(addNewTitle).focus();
// 	
// 	// Remove class hovered from add button
// 	$(addNewButton).children(".add").removeClass("hovered");
// 	
// 	// Add click handler to add button. When it detects a click it calls pageButtonDidFinishUpdating
// 	// to lock the new page name.
// 	$(addNewButton).children(".add").click( function() {
// 		$(this).unbind("click");
// 		
// 		pageButtonDidFinishUpdating(addNewTitle);
// 	});
// 	
// 	// Also accept enter as an add action
// 	$(addNewTitle).keypress( function(event) {
// 		if (event.which == 13) {
// 			$(this).unbind("keypress");
// 			pageButtonDidFinishUpdating(addNewTitle);
// 		}
// 	});		
// }
// 
// function pageButtonDelete(deleteControl) {
// 	console.log("Delete Clicked");
// }
// 
// function updatePageTemplate(pageButtonTitle) {
// 	console.log("updatePageTemplate was called");
// 	
// 	if ($(pageButtonTitle).parent().attr('id') === 'add-new-page') {
// 		console.log("Is new page button");
// 		
// 		newPageButtonShouldBeAdded(pageButtonTitle);
// 	} else {
// 		console.log("Is page name update");
// 	}
// }
// 
// function newPageButtonShouldBeAdded(pageButtonTitle) {
// 	console.log("New page button should be added");
// 	
// 	// Clone the pageButtonTemplate
// 	var newPageButton = $("#page-button-template").clone(true, true).removeAttr('id');
// 	
// 	// Set the placeholder of the newPageButton to that of pageButtonTitle (the value stored
// 	// in the addNewPageButton).	
// 	newPageButton.children(".page-button-title").val($(pageButtonTitle).val());	
// 
// 	// Remove the value of the add new page title
// 	$(pageButtonTitle).val("");
// 	
// 	// Unbind the enter watcher as it has served its purpose.
// 	$(pageButtonTitle).unbind("keypress");
// 	
// 	// Unbind the click watcher on the add button
// 	$(pageButtonTitle).parent().children(".add").unbind("click");
// 	
// 	// Append the new button to the DOM before the add new page button
// 	$(pageButtonTitle).parent().before(newPageButton);
// 	
// }

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
























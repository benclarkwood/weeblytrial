function startEditor() {	
	pageButtonHover();
}

// Templates Section Methods

function pageButtonHover() {
	$(".page-button").hover( function() {
		console.log("Hovered over page-button");

		$(this).addClass("is-hovered");

		// If it's the new page button
		if (this.id === 'add-new-page') {
			// Check if the add new title is already being edited. If it isn't, change the
			// add icon and add a click handler for the button
			if ($(this).children(".page-button-title").attr('readonly')) {
				// Change add icon
				$(this).children(".add").addClass("hovered");

				$(this).click( function() {
					$(this).unbind("click");
					addNewPageButtonWasClicked(this);
				});
			}
		} else {
			// Grab controls
			var deleteControl = $(this).children(".delete");
			var editControl = $(this).children(".edit");
			var pageButtonTitle = $(this).children(".page-button-title");
		
			// Show controls
			deleteControl.fadeIn(300);
			editControl.fadeIn(300);
		
			// Assign click handlers
			deleteControl.click( function() {
				$(this).unbind("click");
				pageButtonDelete(this)
			});
			editControl.click( function() {
				$(this).unbind("click");
				pageButtonEditWasClicked(pageButtonTitle)
			});
		}
	}, function() {
		console.log("Left page-button");
		
		$(this).removeClass("is-hovered");
		
		if (this.id === 'add-new-page') {
			$(this).children(".add").removeClass("hovered");
		} else {
			// Grab controls
			var deleteControl = $(this).children(".delete");
			var editControl = $(this).children(".edit");
			var pageButtonTitle = $(this).children(".page-button-title");
		
			// Unbind handlers
			deleteControl.unbind("click");
			editControl.unbind("click");
			
			// Only fade edit control if they aren't active
			if (!editControl.hasClass("editing")) {
				editControl.fadeOut(200);
				
				if (!deleteControl.hasClass("deleting")) {
					deleteControl.fadeOut(200);
				}
			}
		}
	});
}

function pageButtonEditWasClicked(pageButtonTitle) {
	console.log("Edit Clicked");
	
	if ($(pageButtonTitle).attr('readonly')) {
		// Highlight the edit button
		$(pageButtonTitle).parent().children(".edit").addClass("editing");
				
		// Page button title was not editable. Call focus on pageButtonTitle to edit.
		$(pageButtonTitle).focus();
		
		$(pageButtonTitle).select();
				
		$(pageButtonTitle).removeAttr('readonly');
		
		// Add handler for ways editing can end. All should call pageButtonDidFinishEditing().		
		$(pageButtonTitle).parent().children(".edit").click( function() {
			$(this).unbind("click");
			pageButtonDidFinishUpdating(pageButtonTitle);
		});
		
		$(pageButtonTitle).keypress( function(event) {
			if (event.which == 13) {
				$(this).unbind("keypress");
				pageButtonDidFinishUpdating(pageButtonTitle);
				
				// Check if mouse if over the pageButton and hide the controls if it isn't
				if (!$(pageButtonTitle).parent().hasClass("is-hovered")) {
					$(pageButtonTitle).parent().children(".delete").fadeOut(200);
					$(pageButtonTitle).parent().children(".edit").fadeOut(200);
				}
			}
		});		
	}
}

function pageButtonDidFinishUpdating(pageButtonTitle) {
	console.log("pageButtonDidFinishUpdating");
	
	// Lock the pageButtonTitle from editing.
	$(pageButtonTitle).attr('readonly', true);
	
	// Update the page template name.
	updatePageTemplate(pageButtonTitle);
	
	// If the pagebutton is an existing page button rebind and dehighlight
	if ($(this).parent().attr('id') != 'add-new-page') {
		// Remove the highlight on the edit button
		$(pageButtonTitle).parent().children(".edit").removeClass("editing");
	
		// Edit click needs to be rebound to look for further edits
		$(pageButtonTitle).parent().children(".edit").click( function() {
			pageButtonEditWasClicked(pageButtonTitle);
		});
	}
}

function addNewPageButtonWasClicked(addNewButton) {
	// Grab addNewTitle
	var addNewTitle = $(addNewButton).children(".page-button-title");
	
	// Add new was clicked. Remove readonly from page button title to allow editing.
	$(addNewTitle).removeAttr('readonly');
	
	// Focus on the add new title
	$(addNewTitle).focus();
	
	// Remove class hovered from add button
	$(addNewButton).children(".add").removeClass("hovered");
	
	// Add click handler to add button. When it detects a click it calls pageButtonDidFinishUpdating
	// to lock the new page name.
	$(addNewButton).children(".add").click( function() {
		$(this).unbind("click");
		
		pageButtonDidFinishUpdating(addNewTitle);
	});
	
	// Also accept enter as an add action
	$(addNewTitle).keypress( function(event) {
		if (event.which == 13) {
			$(this).unbind("keypress");
			pageButtonDidFinishUpdating(addNewTitle);
		}
	});		
}

function pageButtonDelete(deleteControl) {
	console.log("Delete Clicked");
}

function updatePageTemplate(pageButtonTitle) {
	console.log("updatePageTemplate was called");
	
	if ($(pageButtonTitle).parent().attr('id') === 'add-new-page') {
		console.log("Is new page button");
		
		newPageButtonShouldBeAdded(pageButtonTitle);
	} else {
		console.log("Is page name update");
	}
}

function newPageButtonShouldBeAdded(pageButtonTitle) {
	console.log("New page button should be added");
	
	// Clone the pageButtonTemplate
	var newPageButton = $("#page-button-template").clone(true, true).removeAttr('id');
	
	// Set the placeholder of the newPageButton to that of pageButtonTitle (the value stored
	// in the addNewPageButton).	
	newPageButton.children(".page-button-title").val($(pageButtonTitle).val());	

	// Remove the value of the add new page title
	$(pageButtonTitle).val("");
	
	// Append the new button to the DOM before the add new page button
	$(pageButtonTitle).parent().before(newPageButton);
}


























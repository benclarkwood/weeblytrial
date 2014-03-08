function startEditor() {
	getTemplates();
	
	pageButtonHover();
}

// Read in archetypal templates for page button, nav, title, text and image
function getTemplates() {
	var pageButtonTemplate = $("#pageButtonTemplate").clone().removeAttr('id');
}

// Templates Section Methods

function pageButtonHover() {
	$(".page-button").hover( function() {
		console.log("Hovered over page-button");
		// Hover over
		
		// Grab controls
		var deleteControl = $(this).children(".delete");
		var editControl = $(this).children(".edit");
		var pageButtonTitle = $(this).children(".page-button-title");
		
		// Show controls
		deleteControl.show();
		editControl.show();
		
		// Assign click handlers
		deleteControl.click( function() {
			pageButtonDelete(this)
		});
		editControl.click( function() {
			pageButtonEditWasClicked(pageButtonTitle)
		});
	}, function() {
		console.log("Left page-button");
		
		// Grab controls
		var deleteControl = $(this).children(".delete");
		var editControl = $(this).children(".edit");
		var pageButtonTitle = $(this).children(".page-button-title");
		
		// Unbind handlers
		deleteControl.unbind("click");
		editControl.unbind("click");
		
		// Hide controls
		deleteControl.hide();
		editControl.hide();
	});
}

function pageButtonEditWasClicked(pageButtonTitle) {
	console.log("Edit Clicked");
	
	if ($(pageButtonTitle).attr('readonly') === 'readonly') {
		// Page button title was not editable. Call focus on pageButtonTitle to edit.
		$(pageButtonTitle).focus();
		
		$(pageButtonTitle).removeAttr('readonly');
		
		// Add handler for focusout.
		$(pageButtonTitle).focusout( function() {
		
			pageButtonTitleDidLoseFocus(this);
		
		});
	}
}

function pageButtonTitleDidLoseFocus(pageButtonTitle) {
	console.log("pageButtonTitleDidLoseFocus");
	
	// Lock the pageButtonTitle from editing.
	$(pageButtonTitle).attr('readonly', 'readonly');
	
	// Update the page template name.
	updatePageTemplateName(pageButtonTitle);
	
	// Kill focusout handler.
	$(pageButtonTitle).unbind("focusout");
}

function pageButtonDelete(deleteControl) {
	console.log("Delete Clicked");
}

function updatePageTemplateName(pageButtonTitle) {
	console.log("updatePageTemplateName was called");
}
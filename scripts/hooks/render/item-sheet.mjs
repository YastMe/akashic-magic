/**
 * Handles the visibility of save type fields and headers based on the item's save type.
 *
 * @param {Object} item - The item being rendered.
 * @param {JQuery} html - The jQuery-wrapped HTML element of the item sheet.
 */

function handleSaveTypeVisibility(item, html) {
	let headers = html[0].querySelectorAll(".saveHeader");

	if (item.system.saveType === "None" || item.system.saveType === "Special") {
		html.find("select[name='system.saveEffect']").hide();
		for (let header of headers) {
			header.style.display = "none";
		}
	} else {
		html.find("select[name='system.saveEffect']").show();
		for (let header of headers) {
			header.style.display = "block";
		}
	}
}

/**
 * Handles the visibility of special save headers based on the item's save type.
 *
 * @param {Object} item - The item being rendered.
 */
function handleSpecialSaveHeaders(item) {
	let headers = document.getElementsByClassName("saveHeaderSpecial");

	if (item.system.saveType === "Special") {
		for (let header of headers) {
			header.style.display = "block";
		}
	} else {
		for (let header of headers) {
			header.style.display = "none";
		}
	}
}

export function renderItemHook(app, html) {
	let item = app.object;

	if (item.type === "akashic-magic.veil") {
		handleSaveTypeVisibility(item, html);
		handleSpecialSaveHeaders(item);
	}
}

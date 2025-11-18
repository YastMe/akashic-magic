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
		addControlHandlers(app, html);
	}
}

function addControlHandlers(app, html) {
	let item = app.object;

	if (item.type === "akashic-magic.veil") {
		const duplicateButtons = html[0].querySelectorAll(".duplicate-action");
		const deleteButtons = html[0].querySelectorAll(".delete-action");

		duplicateButtons.forEach(button => {
			// Remove the element completely without re-adding it as a whole
			button.parentNode.removeChild(button);
		});
		deleteButtons.forEach(button => {
			const newButton = button.cloneNode(true);
			button.parentNode.replaceChild(newButton, button);

			newButton.addEventListener("click", async (event) => {
				event.preventDefault();
				event.stopPropagation();
				event.stopImmediatePropagation();
				const actionId = newButton.parentNode?.parentNode?.dataset?.actionId;
				if (!actionId) return;
				const action = item.actions.get(actionId);
				if (!action) return;
				const confirmed = await Dialog.confirm({
					title: game.i18n.localize("AkashicMagic.confirm"),
					content: `<p>${game.i18n.localize("AkashicMagic.delete-action-confirmation")}</p>`,
					defaultYes: false
				});
				if (!confirmed) return;
				item.actions.delete(actionId);
				const systemActions = item.system.actions.filter(a => a._id !== actionId);
				await item.update({ "system.actions": systemActions });
				await app.render();
			});
		});
	}
}

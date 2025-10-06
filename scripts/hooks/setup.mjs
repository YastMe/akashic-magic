import { TEMPLATES } from "../akashic-magic.mjs";

export function setupHook() {
	loadTemplates(TEMPLATES);
	Handlebars.registerHelper('get', function (obj, key, value) {
		if (value === "name")
			return obj.get(key)?.name;
		return obj.get(key)?.system?.uses[value] || 0;
	});
	Handlebars.registerHelper('cleanDice', function (haystack) {
		return haystack.replaceAll('[', '').replaceAll(']', '');
	});
}

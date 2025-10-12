import { TEMPLATES } from "../akashic-magic.mjs";
import { cleanDice } from "../utils.mjs";

export function setupHook() {
	loadTemplates(TEMPLATES);
	Handlebars.registerHelper('get', function (obj, key, value) {
		if (value === "name")
			return obj.get(key)?.name;
		return obj.get(key)?.system?.uses[value] || 0;
	});
	Handlebars.registerHelper('cleanDiceAkashic', function (haystack) {
		return cleanDice(haystack);
	});
	Handlebars.registerHelper('gt', function (a, b) {
		return a > b;
	});
	Handlebars.registerHelper('lt', function (a, b) {
		return a < b;
	});
}

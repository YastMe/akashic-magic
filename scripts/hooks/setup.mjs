import { TEMPLATES } from "../akashic-magic.mjs";

export function setupHook() {
	loadTemplates(TEMPLATES);
	Handlebars.registerHelper('get', function (obj, key, value) {
		if (value === "name")
			return obj.get(key)?.name;
		return obj.get(key)?.system?.uses[value] || 0;
	});
	Handlebars.registerHelper('getClassVeils', async function (actor) {
		const classes = actor.items.filter(i => i.type === "class" &&
			((i.system?.tags ?? []).some(t => (typeof t === "string" ? t : t.value)?.toLowerCase() === "akashic") || (
				pf1.config.akashicClasses.hasOwnProperty(i.name))));
		if (classes.length === 0) return [];
		const classVeils = [];
		for (const cls of classes) {
			const promises = [];
			game.packs.forEach((pack) => {
				const compendiumPackName = pack.metadata.id;
				pack.index.forEach((item) => {
					if (item.type === "akashic-magic.veil" && item.system?.classes.base?.includes(cls.name) && !classVeils.includes(item._id))
					{
						const promise = (async () => {
							const veilName = item.name;
							const compendiumPack = game.packs.get(compendiumPackName);
							await compendiumPack.getIndex();
							const veilId = compendiumPack.index.find(e => e.name === veilName)?._id;
							if (!veilId) return;
							const veil = await pack.getDocument(veilId);
							if (veil) {
								classVeils.push(veil);
							}
						})();
						promises.push(promise);
					}	
				})
			})
			await Promise.all(promises);
		}
		// Sort veils alphabetically by name
		classVeils.sort((a, b) => a.name.localeCompare(b.name));
		return classVeils;
	})
	Handlebars.registerHelper('cleanDiceAkashic', function (haystack) {
		return haystack.replaceAll('[', '').replaceAll(']', '');
	});
}

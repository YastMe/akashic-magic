import { MODULE_ID } from "../_moduleId.mjs";
import { VeilBrowser } from "../compendiumBrowser/veil-browser.mjs";


export async function readyHook() {
	console.log(`${MODULE_ID} | Ready`);
	registerVeilBrowser();
	await registerAkashicClasses();
	await registerVeilDescriptors();
	await addVeilsToItemPilesFilter();
}

/**
 * Registers the Veil Browser in the `pf1.applications.compendiums` and `pf1.applications.compendiumBrowser` namespaces.
 * This allows users to access and interact with a specialized browser for veils.
 */
function registerVeilBrowser() {
	pf1.applications.compendiums.veil = new VeilBrowser();
	pf1.applications.compendiumBrowser.veil = VeilBrowser;
}

async function registerAkashicClasses() {
	for (const pack of game.packs) {
		const index = await pack.getIndex({ fields: ["system.classes.base"] });
		index.forEach((item) => {
			if (item.type === "akashic-magic.veil" && item.system?.classes?.base) {
				for (const cls of item.system.classes.base) {
					if (!pf1.config.akashicClasses[cls]) {
						pf1.config.akashicClasses[cls] = cls;
					}
				}
			}
		});
	}
}

async function registerVeilDescriptors() {
	for (const pack of game.packs) {
		const index = await pack.getIndex({ fields: ["system.descriptors.base"] });
		index.forEach((item) => {
			if (item.type === "akashic-magic.veil" && item.system?.descriptors?.base) {
				for (const desc of item.system.descriptors.base) {
					if (!pf1.config.veilDescriptors[desc]) {
						pf1.config.veilDescriptors[desc] = desc;
					}
				}
			}
		});
	}
}

// This function adds the "akashic-magic.veil" item type to the filters of the Item Piles module, 
// allowing veils to be excluded from item piles merchants if the module is active.
async function addVeilsToItemPilesFilter() {
	if (game.modules.get("item-piles-pf1e")?.active)
		game.itempiles.API.ITEM_FILTERS[0].filters += ", akashic-magic.veil";
};
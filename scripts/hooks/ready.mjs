import { MODULE_ID } from "../_moduleId.mjs";
import { VeilBrowser } from "../compendiumBrowser/veil-browser.mjs";


export function readyHook() {
	console.log(`${MODULE_ID} | Ready`);
	registerVeilBrowser();
}

/**
 * Registers the Veil Browser in the `pf1.applications.compendiums` and `pf1.applications.compendiumBrowser` namespaces.
 * This allows users to access and interact with a specialized browser for veils.
 */
function registerVeilBrowser() {
	pf1.applications.compendiums.veil = new VeilBrowser();
	pf1.applications.compendiumBrowser.veil = VeilBrowser;
}
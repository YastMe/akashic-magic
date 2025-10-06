import { MODULE_ID } from "../_moduleId.mjs";

export function i18nHook() {
	console.log(`${MODULE_ID} | Localizing`);
	for (let [key, value] of Object.entries(pf1.config.chakraSlots)) {
		pf1.config.chakraSlots[key] = game.i18n.localize(`AkashicMagic.ChakraSlots.${key}`, value);
	}
    for (let r of Object.values(pf1.config.veilSaveTypes)) {
		r.label = game.i18n.localize(r.label);
	}
    for (let r of Object.values(pf1.config.veilSaveEffects)) {
		r.label = game.i18n.localize(r.label);
    }
}

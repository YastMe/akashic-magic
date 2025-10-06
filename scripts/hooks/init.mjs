import { MODULE_ID } from "../_moduleId.mjs";
import { VeilSheet } from "../applications/_module.mjs";
import { VeilModel } from "../dataModels/_module.mjs";
import { VeilItem } from "../documents/_module.mjs";


export function initHook() {
	registerConfig();
	registerItems();
	console.log(`${MODULE_ID} | Initialized`);
}

/**
 * Registers configuration settings and item types for the module.
 * This includes adding new skills, maneuver types, save types, and feat subtypes.
 * It also sets up the sheet sections for maneuvers and martial disciplines.
 *
 * @returns {void}
 */
function registerConfig() {
    // Add Chakra Binds to config
	pf1.config.chakraSlots = {
		Hands: "AkashicMagic.ChakraSlots.Hands",
        Feet: "AkashicMagic.ChakraSlots.Feet",
        Head: "AkashicMagic.ChakraSlots.Head",
        Wrists: "AkashicMagic.ChakraSlots.Wrists",
        Shoulders: "AkashicMagic.ChakraSlots.Shoulders",
        Headband: "AkashicMagic.ChakraSlots.Headband",
        Neck: "AkashicMagic.ChakraSlots.Neck",
        Belt: "AkashicMagic.ChakraSlots.Belt",
        Chest: "AkashicMagic.ChakraSlots.Chest",
        Body: "AkashicMagic.ChakraSlots.Body"
	};

	// Add save types to config
	pf1.config.veilSaveTypes = {
		Fortitude: {
			label: "AkashicMagic.Veils.SaveTypes.fortitude",
		},
		Reflex: {
			label: "AkashicMagic.Veils.SaveTypes.reflex",
		},
		Will: {
			label: "AkashicMagic.Veils.SaveTypes.will",
		},
		None: {
			label: "AkashicMagic.Veils.SaveTypes.none",
		},
		Special: {
			label: "AkashicMagic.Veils.SaveTypes.special",
		},
	};

	// Add save effects to config
	pf1.config.veilSaveEffects = {
		Half: {
			label: "AkashicMagic.Veils.SaveEffects.half",
		},
		Negates: {
			label: "AkashicMagic.Veils.SaveEffects.negate",
		},
		Partial: {
			label: "AkashicMagic.Veils.SaveEffects.partial",
		},
		Text: {
			label: "AkashicMagic.Veils.SaveEffects.text",
		},
	};
}

/**
 * Registers new item types and their corresponding sheets for the module.
 * This includes adding the Maneuver item type and its associated sheet.
 *
 * @returns {void}
 */
function registerItems() {
	// Register new item type
	Object.assign(CONFIG.Item.documentClasses, {
		[`${MODULE_ID}.veil`]: VeilItem
	});

	Object.assign(pf1.documents.item, {
		Veil: VeilItem
	});

	Object.assign(CONFIG.Item.dataModels, {
		[`${MODULE_ID}.veil`]: VeilModel
	});

	// Register new item sheet.
	const itemSheets = {
		[`${MODULE_ID}.veil`]: VeilSheet,
	};

	for (let [type, sheet] of Object.entries(itemSheets)) {
		DocumentSheetConfig.registerSheet(Item, MODULE_ID, sheet, {
			types: [type],
			makeDefault: true
		});
	}
}


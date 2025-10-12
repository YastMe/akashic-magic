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
		Belt: "AkashicMagic.ChakraSlots.Belt",
		Blood: "AkashicMagic.ChakraSlots.Blood",
		Body: "AkashicMagic.ChakraSlots.Body",
		Chest: "AkashicMagic.ChakraSlots.Chest",
		Feet: "AkashicMagic.ChakraSlots.Feet",
		Hands: "AkashicMagic.ChakraSlots.Hands",
		Head: "AkashicMagic.ChakraSlots.Head",
		Headband: "AkashicMagic.ChakraSlots.Headband",
		Neck: "AkashicMagic.ChakraSlots.Neck",
		Ring: "AkashicMagic.ChakraSlots.Ring",
		Shoulders: "AkashicMagic.ChakraSlots.Shoulders",
		Wrists: "AkashicMagic.ChakraSlots.Wrists"
	};

	pf1.config.akashicClasses = {};
	pf1.config.veilDescriptors = {};

	// Add save types to config
	pf1.config.veilSaveTypes = {
		fort: "AkashicMagic.Veils.SaveTypes.fortitude",
		ref: "AkashicMagic.Veils.SaveTypes.reflex",
		will: "AkashicMagic.Veils.SaveTypes.will",
		none: "AkashicMagic.Veils.SaveTypes.none",
		special: "AkashicMagic.Veils.SaveTypes.special",
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

	pf1.config.buffTargetCategories.akasha = {
		label: "AkashicMagic.BuffCategories.akasha",
		filters: {}
	}

	pf1.config.buffTargets.akshveilweavingLevel = {
		label: "AkashicMagic.BuffTargets.VeilweaverLevel",
		category: "akasha"
	};

	pf1.config.buffTargets.akshmaxCapacity = {
		label: "AkashicMagic.BuffTargets.MaxCapacity",
		category: "akasha"
	};

	pf1.config.buffTargets.akshveilweavingAttr = {
		label: "AkashicMagic.BuffTargets.VeilweavingModifier",
		category: "akasha"
	};

	pf1.config.buffTargets.akshessence = {
		label: "AkashicMagic.BuffTargets.Essence",
		category: "akasha"
	}

	pf1.config.buffTargets.akshpassionEssence = {
		label: "AkashicMagic.BuffTargets.PassionEssence",
		category: "akasha"
	}

	pf1.config.buffTargets.akshpassionCapacity = {
		label: "AkashicMagic.BuffTargets.PassionCapacity",
		category: "akasha"
	}
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


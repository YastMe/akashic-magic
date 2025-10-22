import { MODULE_ID } from "../_moduleId.mjs";

export function onGetRollData(doc, rollData) {
    try {
        if (doc instanceof pf1.documents.actor.ActorPF) {
            const actor = doc;
            if (!actor || !actor._rollData) return;
            if (actor.getFlag(MODULE_ID, "nonVeilweaver")) return;
            const items = actor.items;
            rollData.akasha = rollData.akasha || {};

            const hasVeils = items.some(i => i.type === "akashic-magic.veil" || i.type === "veil");

            const akashicClasses = new Set(
                Object.values(pf1.config.akashicClasses).map(c => c.toLowerCase())
            );

            const isVeilweaver = items.some(i => {
                if (!i || (i.type !== "feat" && i.type !== "class")) return false;

                const name = i.name?.toLowerCase() ?? "";
                const subtype = i.system?.subType;

                const hasVeilweaving = /\bveilweav\w*\b/i.test(name);
                const hasVeilFeat = subtype === "feat" && /\bveil\b/i.test(name);
                const isAkashicClass = akashicClasses.has(name);

                if (hasVeilweaving)
                    console.info("Found veilweaving on item:", i.name, "actor:", actor.name);
                if (hasVeilFeat)
                    console.info("Found veil feat on item:", i.name, "actor:", actor.name);
                if (isAkashicClass)
                    console.info("Found akashic class on item:", i.name, "actor:", actor.name);

                return hasVeilweaving || hasVeilFeat || isAkashicClass;
            });


            if (hasVeils || isVeilweaver)
                actor.setFlag(MODULE_ID, "veilweaver", true);
            else {
                actor.setFlag(MODULE_ID, "veilweaver", false);
                return;
            }

            if (isVeilweaver) {
                const classLevels = items.filter(i => i.type === "class").map(i => {
                    return i.system?.level ?? 0;
                });

                const veilweavingLevel = classLevels.reduce((a, b) => a + b, 0);
                if (rollData.akasha.veilweavingLevel === undefined)
                    rollData.akasha.veilweavingLevel = veilweavingLevel;
                else
                    rollData.akasha.veilweavingLevel += veilweavingLevel;

                // Max Capacity
                let maxCapacity = 1;
                if (veilweavingLevel < 6) {
                    maxCapacity = 1;
                } else if (veilweavingLevel < 12) {
                    maxCapacity = 2;
                } else if (veilweavingLevel < 18) {
                    maxCapacity = 3;
                } else if (veilweavingLevel < 24) {
                    maxCapacity = 4;
                } else if (veilweavingLevel < 30) {
                    maxCapacity = 5;
                } else if (veilweavingLevel < 36) {
                    maxCapacity = 6;
                } else if (veilweavingLevel < 42) {
                    maxCapacity = 7;
                } else if (veilweavingLevel < 48) {
                    maxCapacity = 8;
                } else if (veilweavingLevel < 54) {
                    maxCapacity = 9;
                } else if (veilweavingLevel < 60) {
                    maxCapacity = 10;
                } else {
                    maxCapacity = 11;
                }

                if (rollData.akasha.maxCapacity === undefined)
                    rollData.akasha.maxCapacity = maxCapacity;
                else
                    rollData.akasha.maxCapacity += maxCapacity;

                if (rollData.akasha.passionCapacity !== undefined)
                    rollData.akasha.passionCapacity += maxCapacity;

                // Veilweaving attribute
                const veilweavingAttr = actor.getFlag(MODULE_ID, "veilweavingAttr");
                if (veilweavingAttr && actor._rollData.abilities[veilweavingAttr])
                    if (rollData.akasha.veilweavingAttr === undefined)
                        rollData.akasha.veilweavingAttr = actor._rollData.abilities[veilweavingAttr].mod || 0;
                    else
                        rollData.akasha.veilweavingAttr += actor._rollData.abilities[veilweavingAttr].mod || 0;

                // Essence and invested essence
                const veils = items.filter(i => i.type === "akashic-magic.veil" || i.type === "veil");
                let totalInvestedEssence = 0;
                veils.forEach(v => {
                    if (!v.system.shaped) return;
                    const invested = v.system?.investedEssence ?? 0;
                    totalInvestedEssence += invested;
                });
                rollData.akasha.investedEssence = totalInvestedEssence;

                if (rollData.akasha.passionCapacity)
                    rollData.akasha.hasPassion = true;
                else
                    rollData.akasha.hasPassion = false;

                if (rollData.essence === undefined)
                    rollData.essence = 0;
            }
            rollData.investedEssence = undefined;
            rollData.isPassionVeil = undefined;
        }
    } catch (err) {
        console.error(err);
        return;
    }
}

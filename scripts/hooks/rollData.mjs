import { MODULE_ID } from "../_moduleId.mjs";

export function onGetRollData(doc, rollData) {
    try {
        if (doc instanceof pf1.documents.actor.ActorPF) {
            const actor = doc;
            if (!actor || !actor._rollData) return;
            const items = actor.items;
            rollData.akasha = rollData.akasha || {};

            const hasVeils = items.some(i => i.type === "akashic-magic.veil" || i.type === "veil");

            const isAkashicClass = items.some(i => {
                if (i.type !== "feat") return false;
                const name = i.name.toLowerCase();
                return name.includes("veilweaving") || name.includes("veil");
            });

            if (hasVeils || isAkashicClass)
                actor.setFlag(MODULE_ID, "veilweaver", true);

            else
                return;

            if (isAkashicClass) {
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
            }

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
                const invested = v.system?.investedEssence ?? 0;
                totalInvestedEssence += invested;
            });
            rollData.akasha.investedEssence = totalInvestedEssence;

            let essenceFeature = items.find(i => i.type === "feat" && i.name.toLowerCase().includes("essence"));
            if (essenceFeature) {
                rollData.akasha.essence = essenceFeature.system?.uses?.value ?? 0;
            }
        }
    } catch (err) {
        console.error(err);
        return;
    }
}

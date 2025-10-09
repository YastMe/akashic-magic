export function onGetRollData(doc, rollData) {
    try {
        if (doc instanceof pf1.documents.actor.ActorPF) {
            const actor = doc;
            const items = actor.items; // Foundry collection supports .some
            rollData.akasha = rollData.akasha || {};

            const hasVeils = items.some(i => i.type === "akashic-magic.veil" || i.type === "veil")

            const isAkashicClass = items.some(i => {
                if (i.type !== "class") return false;
                const tags = i.system?.tags ?? [];
                return (tags.some(t => (typeof t === "string" ? t : t.value)?.toLowerCase() === "akashic") || (
                    pf1.config.akashicClasses.hasOwnProperty(i.name)));
            });

            if (hasVeils || isAkashicClass)
                rollData.akasha.veilweaver = true;
            else
                return;

            if (isAkashicClass) {
                const classLevels = items.filter(i => i.type === "class").map(i => {
                    return i.system?.level ?? 0;
                });
                rollData.akasha.veilweavingLevel = classLevels.reduce((a, b) => a + b, 0);
            }

            // Veilweaving attribute
            const veilweavingAttr = actor._rollData.abilities.int;
            rollData.akasha.veilweavingAttr = veilweavingAttr?.mod ?? 0;

        }
    } catch (err) {
        console.error(err);
        return;
    }
}
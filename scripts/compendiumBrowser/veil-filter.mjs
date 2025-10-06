const BOOLEAN_OPERATOR = ({
	AND: "AND",
	OR: "OR",
	NONE: false,
});

export class SlotFilter extends pf1.applications.compendiumBrowser.filters.CheckboxFilter {
    static label = "AkashicMagic.VeilFilter.Label";
    static indexField = "system.chakraSlots";
    static type = "akashic-magic.veil";

    /** @override */
    prepareChoices() {
        this.choices = this.constructor.getChoicesFromConfig(pf1.config.akasha.chakraSlots);
    }

    /** @override */
    applyFilter(entry) {
        const activeChoices = this.choices.filter((choice) => choice.active);
        if (activeChoices.length === 0) return true;

        const types = this.constructor.handledTypes;
        if (types.size && !types.has(entry.type)) return true;

        const data = foundry.utils.getProperty(entry, this.constructor.indexField);
        const testMethod = this.booleanOperator === BOOLEAN_OPERATOR.OR ? "some" : "every";
        if (Array.isArray(data)) {
            return activeChoices[testMethod]((choice) => data.includes(choice.value));
        } if (Array.isArray(data)) {
			return activeChoices[testMethod]((choice) => data.includes(choice.key));
		} else if (typeof data === "object" && data !== null) {
			return activeChoices[testMethod]((choice) => choice.key in data && data[choice.key] !== false);
		} else {
			return activeChoices.some((choice) => {
				return data == choice.label;
			});
		}
    }
}
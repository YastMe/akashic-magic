const BOOLEAN_OPERATOR = ({
    AND: "AND",
    OR: "OR",
    NONE: false,
});

export class SlotFilter extends pf1.applications.compendiumBrowser.filters.CheckboxFilter {
    static label = "AkashicMagic.VeilFilter.Label";
    static indexField = "system.chakraSlots.base";
    static type = "veil";

    /** @override */
    prepareChoices() {
        this.choices = this.constructor.getChoicesFromConfig(pf1.config.chakraSlots);
    }

    /** @override */
    applyFilter(entry) {
        const activeChoices = this.choices.filter((choice) => choice.active);
        if (activeChoices.length === 0) return true;

        const data = foundry.utils.getProperty(entry, this.constructor.indexField);
        const testMethod = this.booleanOperator === BOOLEAN_OPERATOR.OR ? "some" : "every";
        if (Array.isArray(data)) {
            return activeChoices[testMethod]((choice) => data.includes(choice.key));
        }
        if (Array.isArray(data)) {
            return activeChoices[testMethod]((choice) => data.includes(choice.value));
        } else if (typeof data === "object" && data !== null) {
            return activeChoices[testMethod]((choice) => choice.key in data && data[choice.key] !== false);
        } else {
            return activeChoices.some((choice) => {
                return data == choice.label;
            });
        }
    }
}

export class VeilweaverFilter extends pf1.applications.compendiumBrowser.filters.CheckboxFilter {
    static label = "AkashicMagic.ClassFilter.Label";
    static indexField = "system.classes.base";
    static type = "veil";

    /** @override */
    prepareChoices() {
        this.choices = this.constructor.getChoicesFromConfig(pf1.config.akashicClasses);
    }

    /** @override */
    applyFilter(entry) {
        const activeChoices = this.choices.filter((choice) => choice.active);
        if (activeChoices.length === 0) return true;

        const data = foundry.utils.getProperty(entry, this.constructor.indexField);
        const testMethod = this.booleanOperator === BOOLEAN_OPERATOR.OR ? "some" : "every";
        if (Array.isArray(data)) {
            return activeChoices[testMethod]((choice) => data.includes(choice.key));
        }
        if (Array.isArray(data)) {
            return activeChoices[testMethod]((choice) => data.includes(choice.value));
        } else if (typeof data === "object" && data !== null) {
            return activeChoices[testMethod]((choice) => choice.key in data && data[choice.key] !== false);
        } else {
            return activeChoices.some((choice) => {
                return data == choice.label;
            });
        }
    }
}

export class VeilDescriptorFilter extends pf1.applications.compendiumBrowser.filters.CheckboxFilter {
    static label = "AkashicMagic.DescriptorFilter.Label";
    static indexField = "system.descriptors.base";
    static type = "veil";

    /** @override */
    prepareChoices() {
        this.choices = this.constructor.getChoicesFromConfig(pf1.config.veilDescriptors);
    }

    /** @override */
    applyFilter(entry) {
        const activeChoices = this.choices.filter((choice) => choice.active);
        if (activeChoices.length === 0) return true;

        const data = foundry.utils.getProperty(entry, this.constructor.indexField);
        const testMethod = this.booleanOperator === BOOLEAN_OPERATOR.OR ? "some" : "every";
        if (Array.isArray(data)) {
            return activeChoices[testMethod]((choice) => data.includes(choice.key));
        }
        if (Array.isArray(data)) {
            return activeChoices[testMethod]((choice) => data.includes(choice.value));
        } else if (typeof data === "object" && data !== null) {
            return activeChoices[testMethod]((choice) => choice.key in data && data[choice.key] !== false);
        } else {
            return activeChoices.some((choice) => {
                return data == choice.label;
            });
        }
    }
}
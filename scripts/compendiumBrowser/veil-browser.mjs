import { SlotFilter } from "./veil-filter.mjs";

const commonFilters = pf1.applications.compendiumBrowser.filters.common;

export class VeilFilter extends pf1.applications.compendiumBrowser.filters.BaseFilter {
    static label = "AkashicMagic.VeilFilter.Label";
    static type = "akashic-magic.veil";
}

export class VeilBrowser extends pf1.applications.compendiumBrowser.CompendiumBrowser {
    static documentName = "Item";
    static typeName = "AkashicMagic.Veils.Name.Plural";
    static filterClasses = [commonFilters.TagFilter, SlotFilter];
}

export function veilBrowser(event) {
    event.preventDefault();
    let type = event.target.dataset.category;
    if (type === undefined)
        type = "akashic-magic.veil";
    pf1.applications.compendiums[type].render(true, { focus: true });
}
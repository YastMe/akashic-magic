import { VeilItemSheet } from "./veil_item_sheet.mjs";
import { MODULE_ID } from "../../_moduleId.mjs";

export class VeilSheet extends VeilItemSheet {
    get template() {
    return `modules/${MODULE_ID}/templates/item/veil.hbs`;
    }
}
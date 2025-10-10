export class VeilItem extends pf1.documents.item.ItemPF {
    async shapeToSlot(slot) {
        await this.update({ "system.shaped": true, "system.shapedTo": slot });
    }

    async unshape() {
        await this.update({ "system.shaped": false, "system.shapedTo": "", "system.boundTo": "", "system.bound": false });
    }

    async bindToSlot(slot) {
        await this.update({ "system.bound": true, "system.boundTo": slot, "system.shaped": true, "system.shapedTo": slot });
    }

    async unbind() {
        await this.update({ "system.bound": false, "system.boundTo": "" });
    }

    async investEssence(amount) {
        const newEssence = this.system.investedEssence + amount;
        await this.system.update({ "system.investedEssence": newEssence });
    }

    removeEssence(amount) {
        this.investEssence(-amount);
    }

    showShapeBindDialog(actor) {
        let slots = this.system?.chakraSlots.total || [];
        // Convert Set to Array if needed
        if (slots instanceof Set) {
            slots = Array.from(slots);
        }
        // Sort slots in alphabetical order
        slots.sort((a, b) => a.localeCompare(b));
        const dialogContent = `
            <form>
                <div class="form-group">
                    <label for="shapeTo">${game.i18n.localize("AkashicMagic.Dialogs.ShapeTo")}</label>
                    <select id="shapeTo" name="shapeTo">
                        <option value="">${game.i18n.localize("AkashicMagic.Dialogs.SelectSlot")}</option>`
            + slots.map(s => `<option value="${s}" ${this.system?.shapedTo === s ? "selected" : ""}>${s}</option>`).join('') +
            `</select>
                </div>
                <div class="form-group">
                    <label for="bindTo">${game.i18n.localize("AkashicMagic.Dialogs.BindTo")}</label>
                    <select id="bindTo" name="bindTo">
                        <option value="">${game.i18n.localize("AkashicMagic.Dialogs.SelectSlot")}</option>` +
            slots.map(s => `<option value="${s}" ${this.system?.boundTo === s ? "selected" : ""}>${s}</option>`).join('') +
            `</select>
                </div>
            </form>
        `;
        new Dialog({
            title: game.i18n.localize(`AkashicMagic.Dialogs.ShapeBindVeilTitle`),
            content: dialogContent,
            buttons: {
                confirm: {
                    label: game.i18n.localize(`AkashicMagic.Dialogs.Confirm`),
                    callback: async (html) => {

                        let newVeil;
                        const shapeTo = html.find('[name="shapeTo"]').val();
                        const bindTo = html.find('[name="bindTo"]').val();
                        if (!actor.items.get(this.id) && (shapeTo || bindTo)) {
                            newVeil = await Item.implementation.create(this.toObject(), { parent: actor });
                        }
                        else if (!actor.items.get(this.id))
                            return;
                        if (newVeil) {
                            if (shapeTo)
                                await newVeil.shapeToSlot(shapeTo);
                            if (bindTo)
                                await newVeil.bindToSlot(bindTo);
                        }
                        else {
                            if (shapeTo)
                                await this.shapeToSlot(shapeTo);
                            if (bindTo)
                                await this.bindToSlot(bindTo);
                        }
                        actor.sheet._forceShowVeilTab = true;
                    }
                },
                cancel: {
                    label: game.i18n.localize(`AkashicMagic.Dialogs.Cancel`)
                }
            },
            default: "confirm"
        }).render(true);
    }
}
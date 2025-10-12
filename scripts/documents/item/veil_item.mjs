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
        let slotNames = this.system?.chakraSlots.names || [];
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
            + slots.map(s => `<option value="${s}" ${this.system?.shapedTo === s ? "selected" : ""}>${slotNames[slots.indexOf(s)]}</option>`).join('') +
            `</select>
                </div>
                <div class="form-group">
                    <label for="bindTo">${game.i18n.localize("AkashicMagic.Dialogs.BindTo")}</label>
                    <select id="bindTo" name="bindTo">
                        <option value="">${game.i18n.localize("AkashicMagic.Dialogs.SelectSlot")}</option>` +
            slots.map(s => `<option value="${s}" ${this.system?.boundTo === s ? "selected" : ""}>${slotNames[slots.indexOf(s)]}</option>`).join('') +
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
                            newVeil = await actor.createEmbeddedDocuments('Item', [this.toObject()]);
                        }
                        else if (!actor.items.get(this.id))
                            return;
                        if (newVeil) {
                            if (!bindTo)
                                await newVeil.unbind();
                            if (!shapeTo)
                                await newVeil.unshape();
                            if (shapeTo)
                                await newVeil.shapeToSlot(shapeTo);
                            if (bindTo)
                                await newVeil.bindToSlot(bindTo);
                        }
                        else {
                            if (!bindTo)
                                await this.unbind();
                            if (!shapeTo)
                                await this.unshape();
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

    static sendChatMessage(veil) {
        const actor = veil.actor;
        const description = veil.system.description.value;
        let descriptors = veil.system.descriptors?.total || [];

        // Ensure descriptors is an array
        if (!Array.isArray(descriptors)) {
            if (descriptors instanceof Set) {
                descriptors = Array.from(descriptors);
            } else if (typeof descriptors === 'string') {
                descriptors = [descriptors];
            } else {
                descriptors = [];
            }
        }

        let messageContent = `
        <div class="pf1 chat-card item-card" data-actor-id="${actor.id}" data-item-id="${veil.id}">
            <header class="card-header type-color type-akashic-magic.veil flexrow">
                <img src="${veil.img}" data-tooltip="${veil.name}" width="36" height="36">
                <div class="item-name"><h3>${veil.name}</h3></div>
            </header>
            <div class="card-content">
                <section class="item-description">${description}</section>
            </div>
            <footer class="card-footer">`;


        messageContent += `
            <div class="flexcol property-group gm-sensitive common-notes general-notes">
                <label>${game.i18n.localize("AkashicMagic.Veils.Descriptors.Label")}</label>
                <div class="flexrow tag-list">
                    ${descriptors.map(d => `<span class="tag">${d}</span>`).join('')}
                </div>
            </div>`;

        if (!["None", "Special"].includes(veil.system.saveType)) {
            const dc = VeilItem.getVeilSaveDC(veil);
            messageContent += `
			<div class="chat-attack" data-index="0">
				<div class="card-button-group flexcol">
					<button data-action="save" data-dc="${dc}" 
                    data-type="${veil.system.saveType}" 
                    data-gm-sensitive-inner="${game.i18n.localize(pf1.config.veilSaveTypes[veil.system.saveType])} 
                    ${game.i18n.localize("AkashicMagic.Veils.Save.Label")}">
                    ${game.i18n.localize(pf1.config.veilSaveTypes[veil.system.saveType])} 
                    ${game.i18n.localize("AkashicMagic.Veils.Save.DC")} ${dc}</button>
				</div>
			</div>`;
        }


        messageContent += `</footer></div>`;
        messageContent = messageContent.replaceAll("[[", "[[/roll ");

        ChatMessage.create({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker(),
            content: messageContent,
            type: 0
        });
    }

    static getVeilSaveDC(veil) {
        let dc = 10;
        const actor = veil.parent;
        if (!actor) return dc;

        const veilweavingMod = actor._rollData.akasha.veilweavingAttr || 0;
        const investedEssence = veil.system.investedEssence || 0;
        const veilweavingLevel = actor._rollData.akasha.veilweavingLevel || 0;

        const descriptors = veil.system.descriptors?.total;
        let hasSteady = false;
        if (descriptors) {
            if (descriptors instanceof Set) {
                hasSteady = Array.from(descriptors).some(d => d?.toLowerCase() === "steady");
            } else if (Array.isArray(descriptors)) {
                hasSteady = descriptors.some(d => d?.toLowerCase() === "steady");
            }
        }

        if (!hasSteady)
            dc += veilweavingMod + investedEssence;
        else
            dc += veilweavingMod + Math.floor(veilweavingLevel / 2);
        return dc;
    }
}
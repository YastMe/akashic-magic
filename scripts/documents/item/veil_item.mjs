export class VeilItem extends pf1.documents.item.ItemPF {
    shapeToSlot(slot) {
        if (!this.data.data.shaped) {
            this.data.update({ "data.shaped": true, "data.boundTo": slot });
        }
        else {
            ui.notifications.warn(`${game.i18n.localize(`AkashicMagic.Notifications.VeilAlreadyShaped`)}`);
        }
    }

    unshape() {
        if (this.data.data.shaped) {
            this.data.update({ "data.shaped": false, "data.boundTo": "" });
        }
        else {
            ui.notifications.warn(`${game.i18n.localize(`AkashicMagic.Notifications.VeilNotShaped`)}`);
        }
    }

    bindToSlot(slot) {
        if (!this.data.data.bound) {
            this.data.update({ "data.bound": true, "data.boundTo": slot });
        }
        else {
            ui.notifications.warn(`${game.i18n.localize(`AkashicMagic.Notifications.VeilAlreadyBound`)}`);
        }
    }

    unbind() {
        if (this.data.data.bound) {
            this.data.update({ "data.bound": false, "data.boundTo": "" });
        }
        else {
            ui.notifications.warn(`${game.i18n.localize(`AkashicMagic.Notifications.VeilNotBound`)}`);
        }
    }

    investEssence(amount) {
        const newEssence = this.data.data.investedEssence + amount;
        if (newEssence < 0) {
            ui.notifications.warn(`${game.i18n.localize(`AkashicMagic.Notifications.NegativeEssence`)}`);
            return;
        }
        this.data.update({ "data.investedEssence": newEssence });
    }

    removeEssence(amount) {
        this.investEssence(-amount);
    }
}
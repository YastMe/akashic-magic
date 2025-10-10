import { veilBrowser } from "./compendiumBrowser/veil-browser.mjs";

export async function getVeilDocument(veilId, packName) {
    if (!packName) {
        return game.actors.get(veilId)?.items.get(veilId) || game.items.get(veilId);
    }
    const pack = game.packs.get(packName);
    if (!pack) return null;
    return await pack.getDocument(veilId);
}

export function cleanDice(diceString) {
    return diceString.replaceAll('[', '').replaceAll(']', '');
}

export function getActorVeils(actor) {
    const classes = actor.items.filter(i => i.type === "class" &&
        ((i.system?.tags ?? []).some(t => (typeof t === "string" ? t : t.value)?.toLowerCase() === "akashic") || (
            pf1.config.akashicClasses.hasOwnProperty(i.name))));
    const veilweaver = actor.getFlag("akashic-magic", "veilweaver");
    if (classes.length === 0 && !veilweaver) return [];
    let classVeils = [];
    for (const cls of classes) {
        game.packs.forEach((pack) => {
            const compendiumPackName = pack.metadata.id;
            pack.index.forEach((item) => {
                if (actor.items.find(i => i.name === item.name && i.type === "akashic-magic.veil")) {
                    classVeils.push({
                        id: item._id,
                        name: item.name,
                        pack: compendiumPackName,
                        shaped: item.system?.shaped || false,
                        shapedTo: item.system?.shapedTo || "",
                        bound: item.system?.bound || false,
                        boundTo: item.system?.boundTo || "",
                        actorItem: false
                    });
                    return;
                }
                if (item.type === "akashic-magic.veil" && item.system?.classes.base?.includes(cls.name) && !classVeils.includes(item._id)) {
                    classVeils.push({
                        id: item._id,
                        name: item.name,
                        pack: compendiumPackName,
                        shaped: item.system?.shaped || false,
                        actorItem: false
                    });
                }
            })
        });
    }
    for (const item of actor.items) {
        if (item.type === "akashic-magic.veil" && !classVeils.find(v => v.id === item.id)) {
            classVeils.push({
                id: item.id,
                name: item.name,
                pack: null,
                shaped: item.system?.shaped || false,
                actorItem: true
            });
        }
    }
    // Sort veils alphabetically by name
    classVeils.sort((a, b) => a.name.localeCompare(b.name));

    // Remove duplicates
    classVeils = classVeils.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
    return classVeils;
}

export function handleJumpingToSummary() {
    libWrapper.register('akashic-magic', 'pf1.applications.actor.ActorSheetPF.prototype._focusTabByItem', function (wrapped, item) {
        wrapped(item);

        if (item.type === "akashic-magic.veil") {
            this._forceShowVeilTab = true;
        }
    }, 'WRAPPER');

    libWrapper.register('akashic-magic', 'pf1.applications.actor.ActorSheetPF.prototype._onItemCreate', function (wrapped, event) {
        wrapped(event);

        const el = event.currentTarget;
        const [categoryId, sectionId] = el.dataset.create?.split(".") ?? [];
        const createData = foundry.utils.deepClone(pf1.config.sheetSections[categoryId]?.[sectionId]?.create);
        if (!createData) throw new Error(`No creation data found for "${categoryId}.${sectionId}"`);
        const type = createData.type || el.dataset.type;
        if (type === "akashic-magic.veil") {
            this._forceShowVeilTab = true;
        }
    }, 'WRAPPER');

    libWrapper.register('akashic-magic', 'pf1.applications.actor.ActorSheetPF.prototype._onItemDelete', function (wrapped, event) {
        const button = event.currentTarget;
        if (button.disabled) return;

        const li = event.currentTarget.closest(".item");
        const type = this.actor.items.get(li.dataset.itemId)?.type;

        wrapped(event);

        if (type === "akashic-magic.veil") {
            this._forceShowVeilTab = true;
        }
    }, 'WRAPPER');

    libWrapper.register('akashic-magic', 'pf1.applications.actor.ActorSheetPF.prototype._onChangeInput', async function (wrapped, item) {
        if (item.target.name !== "system.investedEssence")
            wrapped(item);
        else {
            const input = item.target;
            const name = input.name;
            let veil = this.actor.items.get(input.id);
            if (!veil) return;
            let value;
            if (input.type === "checkbox") {
                value = input.checked;
            } else if (!input.value.startsWith("+")) {
                value = parseFloat(input.value);
                if (isNaN(value)) value = 0;
            } else if (input.value.startsWith("+")) {
                value = parseFloat(input.value) + veil.system.investedEssence;
                if (isNaN(value)) value = veil.system.investedEssence;
            }
            if (value >= 0)
                await veil.update({ [name]: value });
            else
                await veil.update({ [name]: veil.system.investedEssence + value });
            veil.parent.sheet._forceShowVeilTab = true;
            veil.parent.sheet.activateTab("akashic-magic", "primary");

            // Remove focus to avoid accidental changes
            input.blur();
        }
    }, 'MIXED');
}

export function injectVeilsButton(html) {
	let footer;
	if (html && typeof html.find === "function") {
		footer = html.find(".directory-footer");
		if (footer.length > 0) {
			footer = footer[0];
		} else {
			footer = $("section.action-buttons")[0];
		}
	} else {
		footer = $("section.action-buttons")[0];
	}

	if (!footer || footer.querySelector('button[data-category="veil"]')) return;

	const button = document.createElement("button");
	button.type = "button";
	button.dataset.category = "veil";
	button.classList.add("compendium", "veil");
	button.innerText = game.i18n.localize("AkashicMagic.CompendiumButton");
	footer.appendChild(button);
	button.addEventListener("click", ev => {
        veilBrowser(ev);
    });
    // Remove colspan-2 from previous button
	if (footer.children.length % 2 === 0)
        footer.children[footer.children.length - 2].classList.remove("colspan-2");
}
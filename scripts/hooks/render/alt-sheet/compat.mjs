import { MODULE_ID } from "../../../_moduleId.mjs";
import { createTemplate } from "../../../documents/actor/actor-sheet.mjs";
import { VeilItem } from "../../../documents/item/veil_item.mjs";
import { cleanDice, getVeilDocument } from "../../../utils.mjs";


export function renderAltActorHook(data, app, html) {
    injectAkashicTab(app, html);
    addControlHandlers(app, html);  
    if (app._forceShowVeilTab) {
        data.actor.sheet.activateTab("akashic-magic");
        setTimeout(() => app._forceShowVeilTab = false, 100);
    }
    if (app._forceShowVeilList) {
        const listDiv = html.find(".veil-list")[0];
        if (listDiv) {
            listDiv.style.maxHeight = `${listDiv.scrollHeight - 50}px`;
            if (!listDiv.classList.contains("open"))
                listDiv.classList.add("open");
        }
    }  
}

function injectAkashicTab(app, html) {
    const { actor } = app;

    // Show tab if actor is a veilweaver OR if force open is enabled
    if (actor.getFlag("akashic-magic", "veilweaver") || actor.getFlag("akashic-magic", "forceVeilTabOpen")) {
        const tabSelector = html.find("a[data-tab=skills]");
        const veilsTab = document.createElement("a");
        veilsTab.classList.add("item");
        veilsTab.dataset["tab"] = "akashic-magic";
        veilsTab.dataset["group"] = "primary";
        veilsTab.innerHTML = game.i18n.localize("AkashicMagic.TabName");
        tabSelector.after(veilsTab);

        const akashicBody = createTemplate(
            'akashic-magic-alt',
            {
                actor: actor,
            }
        );
        const bodySelector = html.find("div.tab[data-tab=skills]");
        bodySelector.after(akashicBody);
    }
}

function addControlHandlers(app, html) {
    const { actor } = app;
    const items = html.find(".veil-control");

    const forceTab = () => app._forceShowVeilTab = true;
    items.each((_, el) => {
        const item = el;
        const veil = actor.items.get(item.id);
        const action = item.name;
        item.addEventListener("click", async () => {
            const resolvedVeil = veil || await getVeilDocument(item.id, item.dataset.pack);
            const actionMap = {
                showVeils: () => {
                    const listDiv = html.find(".veil-list")[0];
                    // Find the parent div to calculate scrollHeight. Keep going up if it's not a div.
                    let parentDiv = listDiv?.parentElement;
                    if (!parentDiv) return;
                    // Toggle maxHeight to create accordion effect between 0 and scrollHeight
                    listDiv.style.maxHeight = (listDiv.style.maxHeight && listDiv.style.maxHeight !== "0px")
                        ? "0"
                        : `${listDiv.scrollHeight - 50}px`;
                    listDiv.classList.toggle("open");
                    actor.sheet._forceShowVeilList = listDiv.classList.contains("open");
                    forceTab();
                },
                veilName: () => {
                    if (!resolvedVeil) return;
                    // Find the description body div inside the veil summary
                    const descriptionBody = html.find(`#veil-summary-${resolvedVeil.id} .description-body`)[0];
                    if (!descriptionBody) return;
                    // Toggle visibility of description body
                    if (descriptionBody.innerHTML.trim() === "")
                        descriptionBody.innerHTML = cleanDice(resolvedVeil.system.description.value);
                    const summaryDiv = html.find(`#veil-summary-${resolvedVeil.id}`)[0];
                    summaryDiv.classList.toggle("open");
                    summaryDiv.style.maxHeight = (summaryDiv.style.maxHeight && summaryDiv.style.maxHeight !== "0px")
                        ? "0"
                        : `${descriptionBody.scrollHeight + 20}px`;
                },
                shapeBindVeil: async function () {
                    if (!resolvedVeil) return;
                    resolvedVeil.showShapeBindDialog(actor);
                    forceTab();
                },
                rearrange: async function () {
                    if (!resolvedVeil) return;
                    resolvedVeil.showShapeBindDialog(actor);
                    forceTab();
                },
                unshape: async function () {
                    if (!resolvedVeil) return;
                    const akashicClasses = actor.items.filter(i => i.type === "class" &&
                        ((i.system?.tags ?? []).some(t => (typeof t === "string" ? t : t.value)?.toLowerCase() === "akashic") || (
                            pf1.config.akashicClasses.hasOwnProperty(i.name))));
                    if (resolvedVeil.system?.classes?.base.some(c => akashicClasses.some(ac => ac.name === c)))
                        resolvedVeil.delete();
                    else
                        resolvedVeil.update({ "system.shaped": false });
                    forceTab();
                },
                create: async function () {
                    const baseName = game.i18n.localize("AkashicMagic.NewVeil");
                    const n = actor.items.filter(i => i.type === "akashic-magic.veil" && i.name.startsWith(baseName)).length;
                    const name = n ? `${baseName} (${n})` : baseName;

                    actor.createEmbeddedDocuments('Item', [new Item({
                        name,
                        type: "akashic-magic.veil",
                        system: {
                            classes: {
                                base: [actor.items.forEach(i => {
                                    if (i.type === "class" &&
                                        ((i.system?.tags ?? []).some(t => (typeof t === "string" ? t : t.value)?.toLowerCase() === "akashic") || (
                                            pf1.config.akashicClasses.hasOwnProperty(i.name)))) return i.name;
                                })]
                            },
                            description: { value: "" },
                            shaped: true
                        }
                    })]);
                    forceTab();
                },
                delete: async function () {
                    if (!resolvedVeil) return;
                    resolvedVeil.delete();
                    forceTab();
                },
                browse: async function () {
                    pf1.applications.compendiums["veil"].render(true, { focus: true });
                },
                display: function () {
                    VeilItem.sendChatMessage(resolvedVeil);
                    forceTab();
                },
                use: function () {
                    resolvedVeil?.use(actor);
                    forceTab();
                }
            };
            actionMap[action]?.();
        });

        item.addEventListener("mousedown", async (event) => {
            if (event.button === 2) {
                event.preventDefault();
                const resolvedVeil = veil || await getVeilDocument(item.id, item.dataset.pack);
                const sheet = resolvedVeil?.sheet;
                if (sheet) sheet.render(true);
            }
        });
    });
}

export function injectAltAkashicMagicDiv(app, html, data) {
    const targetBlock = html.find(".form-group.stacked:contains('Saving Throws')");

    // 1. Read the flags safely
    const hideVeilTab = data.actor.getFlag(MODULE_ID, "nonVeilweaver") || false;
    const forceVeilTabOpen = data.actor.getFlag(MODULE_ID, "forceVeilTabOpen") || false;
    const veilweavingAttr = data.actor.getFlag(MODULE_ID, "veilweavingAttr") || "int";
    const forceTabOpen = data.actor.getFlag(MODULE_ID, "forceVeilTabOpen");
    const isVeilweaver = data.actor.getFlag(MODULE_ID, "veilweaver");
    const hideTab = data.actor.getFlag(MODULE_ID, "nonVeilweaver");
    const shouldShowTab = (isVeilweaver || forceTabOpen) && !hideTab;


    // 2. Conditionally build the Dropdown HTML
    let veilweavingAttrHtml = "";

    if (shouldShowTab) {
        const abilityOptions = Object.entries(pf1.config.abilities).map(([key, label]) => {
            const isSelected = (key === veilweavingAttr) ? "selected" : "";
            return `<option value="${key}" ${isSelected}>${label}</option>`;
        }).join("");

        veilweavingAttrHtml = `
            <div class="flexrow" data-tooltip="${game.i18n.localize("AkashicMagic.Attributes.veilweavingAttrTooltip")}">
                <label class="cell left-label half" for="flags.${MODULE_ID}.veilweavingAttr">
                    ${game.i18n.localize("AkashicMagic.Attributes.veilweavingAttr")}
                </label>
                <select class="cell midsize half" name="flags.${MODULE_ID}.veilweavingAttr">
                    ${abilityOptions}
                </select>
            </div>
        `;
    }

    // 3. Build the entire section
    // We inject ${veilweavingAttrHtml} right below the header. 
    // If they aren't a veilweaver, it just injects an empty string.
    const akashicSection = $(`
        <div class="form-group stacked akashic-magic-div">
            <div class="flexrow">
                <h2>${game.i18n.localize("AkashicMagic.Config.Name")}</h2>
            </div>
            
            ${veilweavingAttrHtml}

            <div class="form-group stacked">
                <label class="checkbox">
                    <input type="checkbox" name="flags.${MODULE_ID}.nonVeilweaver" ${hideVeilTab ? "checked" : ""}>
                    ${game.i18n.localize("AkashicMagic.Config.HideVeilTab")}
                </label>
            </div>

            <div class="form-group stacked">
                <label class="checkbox">
                    <input type="checkbox" name="flags.${MODULE_ID}.forceVeilTabOpen" ${forceVeilTabOpen ? "checked" : ""}>
                    ${game.i18n.localize("AkashicMagic.Config.ForceVeilTabOpen")}
                </label>
            </div>
        </div>
    `);

    // 4. Inject it all
    targetBlock.after(akashicSection);
}
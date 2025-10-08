import { createTemplate } from "../../documents/actor/actor-sheet.mjs";

export function renderActorHook(data, app, html) {
    if (data.actor.type !== "character" && data.actor.type !== "npc") return;
    if (data.actor.flags?.core?.sheetClass !== "pf1alt.AltActorSheetPFCharacter") {
        injectAkashicTab(app, html);
    }
    addControlHandlers(app, html);
}

function injectAkashicTab(app, html) {
    const { actor } = app;

    if (actor._rollData?.akasha.veilweaver) {
        const tabSelector = html.find("a[data-tab=skills]");
        const artsTab = document.createElement("a");
        artsTab.classList.add("item");
        artsTab.dataset["tab"] = "akashic-magic";
        artsTab.dataset["group"] = "primary";
        artsTab.innerHTML = game.i18n.localize("AkashicMagic.TabName");
        tabSelector.after(artsTab);

        const akashicBody = createTemplate(
            'akashic-magic',
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
    items.each((_, el) => {
        const item = el;
        const veil = actor.items.get(item.id);
        const action = item.name;
        item.addEventListener("click", () => {
            const actionMap = {
                showVeils: () => {
                    const listDiv = html.find(".veil-list")[0];
                    const parentDiv = listDiv.parentElement;
                    if (!parentDiv) return;
                    // Toggle maxHeight to create accordion effect between 0 and parent div scrollHeight
                    listDiv.style.maxHeight = (listDiv.style.maxHeight && listDiv.style.maxHeight !== "0px")
                        ? "0"
                        : `${parentDiv.scrollHeight - 50}px`;
                    listDiv.classList.toggle("accordion", "open");
                }
            };
            actionMap[action]?.();
        });
    });
}
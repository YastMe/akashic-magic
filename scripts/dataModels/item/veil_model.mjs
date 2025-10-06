import {VeilItemModel} from './veil_item_model.mjs';

export class VeilModel extends VeilItemModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        const schema = {
            chakraSlots: new fields.SchemaField({
                base: new fields.ArrayField(new fields.StringField({required: true, initial: ""})),
                custom: new fields.SetField(new fields.StringField({required: true, initial: ""})),
                names: new fields.ArrayField(new fields.StringField({required: true, initial: ""})),
                standard: new fields.SetField(new fields.StringField({required: true, initial: ""})),
                total: new fields.SetField(new fields.StringField({required: true, initial: ""})),
            }),
            descriptors: new fields.ArrayField(new fields.StringField({required: true, initial: ""})),
            saveType: new fields.StringField({required: true, initial: "none"}),
            saveEffect: new fields.StringField({required: true, initial: "none"}),
            shaped: new fields.BooleanField({required: false, initial: false}),
            bound: new fields.BooleanField({required: false, initial: false}),
            boundTo: new fields.StringField({required: false, initial: ""}),
            investedEssence: new fields.NumberField({required: false, initial: 0}),
        };
        this.addDefaultSchemaFields(schema);
        return schema;
    }

    prepareDerivedData() {
        for (let slot of this?.chakraSlots?.base) {
            this.chakraSlots.total.add(slot);
            if (slot in pf1.config.chakraSlots)
            {
                this.chakraSlots.standard.add(slot);
                this.chakraSlots.names.push(game.i18n.localize(`AkashicMagic.ChakraSlots.${slot}`));
            }
            else
            {
                this.chakraSlots.custom.add(slot);
                this.chakraSlots.names.push(slot);
            }
        }
        super.prepareDerivedData();
    }
}
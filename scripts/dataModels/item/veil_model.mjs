import { VeilItemModel } from './veil_item_model.mjs';

export class VeilModel extends VeilItemModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        const schema = {
            chakraSlots: new fields.SchemaField({
                base: new fields.ArrayField(new fields.StringField({ required: true, initial: "" })),
                custom: new fields.SetField(new fields.StringField({ required: true, initial: "" })),
                names: new fields.ArrayField(new fields.StringField({ required: true, initial: "" })),
                standard: new fields.SetField(new fields.StringField({ required: true, initial: "" })),
                total: new fields.SetField(new fields.StringField({ required: true, initial: "" })),
            }),
            descriptors: new fields.SchemaField({
                base: new fields.ArrayField(new fields.StringField({ required: true, initial: "" })),
                custom: new fields.SetField(new fields.StringField({ required: true, initial: "" })),
                names: new fields.ArrayField(new fields.StringField({ required: true, initial: "" })),
                standard: new fields.SetField(new fields.StringField({ required: true, initial: "" })),
                total: new fields.SetField(new fields.StringField({ required: true, initial: "" })),
            }),
            saveType: new fields.StringField({ required: true, initial: "None" }),
            saveEffect: new fields.StringField({ required: true, initial: "None" }),
            shaped: new fields.BooleanField({ required: false, initial: false }),
            shapedTo: new fields.StringField({ required: false, initial: "" }),
            bound: new fields.BooleanField({ required: false, initial: false }),
            boundTo: new fields.StringField({ required: false, initial: "" }),
            classes: new fields.SchemaField({
                base: new fields.ArrayField(new fields.StringField({ required: true, initial: "" })),
                custom: new fields.SetField(new fields.StringField({ required: true, initial: "" })),
                names: new fields.ArrayField(new fields.StringField({ required: true, initial: "" })),
                standard: new fields.SetField(new fields.StringField({ required: true, initial: "" })),
                total: new fields.SetField(new fields.StringField({ required: true, initial: "" })),
            }),
            investedEssence: new fields.NumberField({ required: false, initial: 0 }),
            isPassionVeil: new fields.BooleanField({ required: false, initial: false }),
        };
        this.addDefaultSchemaFields(schema);
        return schema;
    }

    prepareDerivedData() {
        for (let slot of this?.chakraSlots?.base) {
            this.chakraSlots.total.add(slot);
            if (slot in pf1.config.chakraSlots) {
                this.chakraSlots.standard.add(slot);
                this.chakraSlots.names.push(game.i18n.localize(`AkashicMagic.ChakraSlots.${slot}`));
            }
            else {
                this.chakraSlots.custom.add(slot);
                this.chakraSlots.names.push(slot);
            }
        }
        for (let descriptor of this?.descriptors?.base) {
            this.descriptors.total.add(descriptor);
            if (descriptor && pf1.config?.veilDescriptors && !(pf1.config.veilDescriptors.hasOwnProperty(descriptor.toUpperCase())))
                pf1.config.veilDescriptors[descriptor] = descriptor;
            this.descriptors.custom.add(descriptor);
            this.descriptors.names.push(descriptor);
        }
        for (let cls of this?.classes?.base) {
            if (cls && pf1.config?.akashicClasses && !(pf1.config.akashicClasses.hasOwnProperty(cls)))
                pf1.config.akashicClasses[cls] = cls;
            this.classes.total.add(cls);
            this.classes.custom.add(cls);
            this.classes.names.push(cls);
        }
        super.prepareDerivedData();
    }
}
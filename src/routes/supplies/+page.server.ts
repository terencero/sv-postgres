import { addSupply, getPet } from "$lib/server/db";
import type { InsertSupplies } from "$lib/server/db/schema"
import { fail } from "@sveltejs/kit";

export const actions = {
  addNewSupply: async ({ request }: { request: Request }) => {
    type NewSupply = InsertSupplies;

    const data = await request.formData();
    const formFieldValues = {
      supplyType: String(data.get('supplyType')),
      inventory: Number(data.get('inventory')),
      description: String(data.get('description')),
      petName: String(data.get('petName')).toLowerCase(),
    };

    try {
      const [ { id: petId } ] = await getPet(formFieldValues.petName);
      console.log(`pet: ${petId}`)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { petName, ...rest } = formFieldValues;
      const params: NewSupply = {
        petId,
        ...rest,
      }
      await addSupply(params);
    } catch (e) {
      return fail(422, {
        description: data.get('description'),
        error: e.message,
      });
    }
  }
}

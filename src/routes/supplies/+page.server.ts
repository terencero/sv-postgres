import { addSupply, deleteSupply, getSupplies, updateSupply } from "$lib/server/supplies";
import { getPet } from "$lib/server/pets";
import type { InsertSupplies } from "$lib/server/db/schema"
import { fail } from "@sveltejs/kit";
import type { RequestEvent } from "../$types";

export async function load() {
  const supplies = await getSupplies();
  return {
    supplies,
  }
}

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { petName, ...rest } = formFieldValues;
      const params: NewSupply = {
        petId,
        ...rest,
      }

      const [newSupply] = await addSupply(params);

      return {
        success: true,
        supplyId: newSupply.id,
        actionType: 'addSupply',
      };
    } catch (e) {
      return fail(422, {
        description: data.get('description'),
        error: e.message,
      });
    }
  },
  deleteSupply: async ({ request }: RequestEvent ) => {
    const data = await request.formData();
    try {

      await deleteSupply(Number(data.get('id')));
    } catch(e) {
      return fail(422, {
        description: data.get('description'),
        error: e.message,
      });
    }
  },
  updateSupply: async ({ request }: RequestEvent ) => {
    const data = await request.formData();
    const formFieldValues = {
      id: Number(data.get('id')),
      supplyType: String(data.get('supplyType')),
      inventory: Number(data.get('inventory')),
      description: String(data.get('description')),
      petName: String(data.get('petName')).toLowerCase(),
    };

    try {
      const [updatedSupplyItem] = await updateSupply(formFieldValues);
      return {
        success: true,
        supplyId: updatedSupplyItem.id,
        actionType: 'updateSupply',
      };
    } catch(e) {
      return fail(422, {
        description: data.get('description'),
        error: e.message,
      });
    }
  }
}

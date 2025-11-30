<script lang="ts" generics="T extends Todos | Supplies">
	import { type SelectPetProfiles, type Supplies, type Todos } from "$lib/server/db/schema";
	import type { Snippet } from "svelte";

  interface Props {
    pets: SelectPetProfiles[];
    items: T[];
    card: Snippet<[ pet: string, item: T[] ]>;
  }

  let { pets, items, card }: Props = $props();

  interface PetItemMapping {
    [pet: string]: Props['items'];
  }

  const petItemsMapping = $derived(pets.reduce((acc: PetItemMapping, pet) => {
    if (pet.name && !acc[pet.name]) {
      acc[pet.name] = items.filter((item) => item.petId === pet.id);

      return acc;
    }

    if (pet.name) {
     acc[pet.name] = items.filter((item) => item.petId === pet.id);
    }

    return acc;
  }, {}));
</script>

{#each Object.entries(petItemsMapping) as [pet, item] (pet) }
  
  {@render card(pet, item)}
{/each}

  

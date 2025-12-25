import { atom } from "jotai";
import { rentalObjectsAtom } from "./rentalObjectsAtom";

export const objectStatusSeriesDataAtom = atom<number[]>((get) => {
  const rentalObjectsResults = get(rentalObjectsAtom);

  const rentalObjects = rentalObjectsResults.data ?? [];

  if (rentalObjects.length === 0) {
    return [0, 0];
  }

  const inhabited = rentalObjects.filter((rentalObject) => rentalObject.renter.length > 0).length;

  const uninhabited = rentalObjects.filter((rentalObject) => rentalObject.renter.length === 0).length;

  return [inhabited, uninhabited];
});

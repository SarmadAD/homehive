import { atom, selector } from "recoil";
import { objectsApi } from "src/api/objects";
import { RentalObject } from "src/types/object";

export const rentalObjectsAtom = atom<RentalObject[]>({
  key: "rentalObjectsAtom",
  default: selector({
    key: "rentalObjectsAtom/rentalObjects",
    get: async () => {
      const response = await objectsApi.getAllObjects();
      return response;
    },
  }),
});

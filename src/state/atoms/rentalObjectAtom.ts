import { atom, selector } from "recoil";
import { objectsApi } from "src/api/objects";
import { RentalObject } from "src/types/object";
import { selectedRentalObjectIdAtom } from "./selectedRentalObjectIdAtom";

export const rentalObjectAtom = atom<RentalObject>({
  key: "rentalObjectAtom",
  default: selector({
    key: "rentalObjectAtom/rentalObject",
    get: async ({ get }) => {
      const selectedRentalObjectId = get(selectedRentalObjectIdAtom);
      const response = await objectsApi.getObject({ objectId: selectedRentalObjectId });
      return response;
    },
  }),
});

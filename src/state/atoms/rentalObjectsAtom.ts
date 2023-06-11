import { RentalObject } from "@prisma/client";
import { atom, selector } from "recoil";
import { objectsApi } from "src/api/objects";

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

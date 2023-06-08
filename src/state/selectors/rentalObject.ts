import { selector } from "recoil";
import { selectedRentalObjectIdAtom } from "../atoms/selectedRentalObjectIdAtom";
import { objectsApi } from "src/api/objects";

export const rentalObjectSelector = selector({
  key: "rentalObjectSelector",
  get: async ({ get }) => {
    const objectId = get(selectedRentalObjectIdAtom);
    try {
      const response = await objectsApi.getObject({ objectId: objectId.toString() });
      return response;
    } catch (err) {
      console.error(err);
      return null;
    }
  },
});

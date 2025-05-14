import { selector } from "recoil";
import { rentalObjectsAtom } from "../atoms/rentalObjectsAtom";

export const objectStatusSeriesData = selector({
  key: "objectStatusSeriesData",
  get: ({ get }) => {
    const rentalObjects = get(rentalObjectsAtom);
    if (rentalObjects.length > 0) {
      const inhabitedData = rentalObjects?.filter((rentalObject) => rentalObject.renter.length > 0).length;
      const uninhabitedData = rentalObjects?.filter((rentalObject) => rentalObject.renter.length === 0).length;
      return [Number(inhabitedData.toFixed(0)), Number(uninhabitedData.toFixed(0))];
    }
    return [0, 0];
  },
});

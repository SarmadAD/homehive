import { selector } from "recoil";
import { rentalObjectsAtom } from "../atoms/rentalObjectsAtom";

export const objectStatusSeriesData = selector({
  key: "objectStatusSeriesData",
  get: ({ get }) => {
    const rentalObjects = get(rentalObjectsAtom);
    const inhabitedData = (rentalObjects.filter((rentalObject) => rentalObject.status === "INHABITED").length / rentalObjects.length) * 100;
    const uninhabitedData = (rentalObjects.filter((rentalObject) => rentalObject.status === "UNINHABITED").length / rentalObjects.length) * 100;
    return [inhabitedData, uninhabitedData];
  },
});

import { selector } from "recoil";
import { rentalObjectsAtom } from "../atoms/rentalObjectsAtom";

export const objectStatusSeriesData = selector({
  key: "objectStatusSeriesData",
  get: ({ get }) => {
    const rentalObjects = get(rentalObjectsAtom);
    const inhabitedData = (rentalObjects.filter((rentalObject) => rentalObject.status === "inhabited").length / rentalObjects.length) * 100;
    const uninhabitedData = (rentalObjects.filter((rentalObject) => rentalObject.status === "uninhabited").length / rentalObjects.length) * 100;
    return [inhabitedData, uninhabitedData];
  },
});

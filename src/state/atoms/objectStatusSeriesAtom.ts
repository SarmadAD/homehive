import { atom } from "jotai";
import { rentalObjectsAtom } from "./rentalObjectsAtom";

export const objectStatusSeriesDataAtom = atom((get) => {
  const { data, isLoading, isError } = get(rentalObjectsAtom);

  if (isLoading) {
    return {
      data: [0, 0] as [number, number],
      isLoading: true,
      isError: false,
    };
  }

  if (isError || !data) {
    return {
      data: [0, 0] as [number, number],
      isLoading: false,
      isError: true,
    };
  }

  const inhabited = data.filter((o) => o.renter.length > 0).length;
  const uninhabited = data.filter((o) => o.renter.length === 0).length;

  return {
    data: [inhabited, uninhabited] as [number, number],
    isLoading: false,
    isError: false,
  };
});

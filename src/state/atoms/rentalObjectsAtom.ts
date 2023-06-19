import { atom, selector, useRecoilValue } from "recoil";
import { objectsApi } from "src/api/objects";
import { RentalObject } from "src/types/object";
import { currentLandlordAtom } from "./currentLandlordAtom";

export const rentalObjectsAtom = atom<RentalObject[]>({
  key: "rentalObjectsAtom",
  default: selector({
    key: "rentalObjectsAtom/rentalObjects",
    get: async ({ get }) => {
      const landlord = get(currentLandlordAtom);
      if (landlord.id) {
        const response = await getRentalObjects(landlord.id);
        return response;
      }
      return [];
    },
  }),
});

async function getRentalObjects(landlordId: string) {
  const response = await fetch(`/api/dashboard/objects?lloId=${landlordId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const rentalObjects = (await response.json()) as RentalObject[];
  return rentalObjects;
}

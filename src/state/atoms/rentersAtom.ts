import { atom, selector } from "recoil";
import { renterApi } from "src/api/renter";
import { Renter } from "src/types/renter";

export const rentersAtom = atom<Renter[]>({
  key: "rentersState",
  default: selector({
    key: "rentersState/renters",
    get: async () => {
      const response = await renterApi.getAllRenter();
      return response;
    },
  }),
});

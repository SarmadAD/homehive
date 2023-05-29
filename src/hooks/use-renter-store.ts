import { useCallback, useEffect, useState } from "react";
import { useMounted } from "./use-mounted";
import { RentersSearchState } from "src/types/rentersSearchState";
import { renterApi } from "src/api/renter";
import { RentersStoreState } from "src/types/RentersStoreState";

export const useRentersStore = (searchState: RentersSearchState) => {
  const isMounted = useMounted();
  const [state, setState] = useState<RentersStoreState>({
    renters: [],
    rentersCount: 0,
  });

  const handleRentersGet = useCallback(async () => {
    try {
      const response = await renterApi.getRenters(searchState);

      if (isMounted()) {
        setState({
          renters: response.data,
          rentersCount: response.count,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [searchState, isMounted]);

  useEffect(
    () => {
      handleRentersGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchState]
  );

  return {
    ...state,
  };
};

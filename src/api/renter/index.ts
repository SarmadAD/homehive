import { applyPagination } from "src/utils/apply-pagination";
import { applySort } from "src/utils/apply-sort";
import { deepCopy } from "src/utils/deep-copy";
import { RentalObject } from "src/types/object";
import { Renter } from "src/types/renter";
import { renters } from "./data";

type GetRentersRequest = {
  filters?: {
    query?: string;
  };
  page?: number;
  rowsPerPage?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

type GetRentersResponse = Promise<{
  data: Renter[];
  count: number;
}>;

type GetRenterRequest = {
  renterId?: string;
};

type GetRenterResponse = Promise<Renter>;

// type GetCustomerEmailsRequest = {};

// type GetCustomerEmailsResponse = Promise<CustomerEmail[]>;

// type GetCustomerInvoicesRequest = {};

// type GetCustomerInvoicesResponse = Promise<CustomerInvoice[]>;

// type GetCustomerLogsRequest = {};

// type GetCustomerLogsResponse = Promise<CustomerLog[]>;

class RentersApi {
  getRenters(request: GetRentersRequest = {}): GetRentersResponse {
    const { filters, page, rowsPerPage, sortBy, sortDir } = request;

    let data = deepCopy(renters) as Renter[];
    let count = data.length;

    if (typeof filters !== "undefined") {
      data = data.filter((object) => {
        if (typeof filters.query !== "undefined" && filters.query !== "") {
          let queryMatched = false;
          const properties: "name"[] = ["name"];

          properties.forEach((property) => {
            if (object[property].toLowerCase().includes(filters.query!.toLowerCase())) {
              queryMatched = true;
            }
          });

          if (!queryMatched) {
            return false;
          }
        }

        // if (typeof filters.hasAcceptedMarketing !== "undefined") {
        //   if (customer.hasAcceptedMarketing !== filters.hasAcceptedMarketing) {
        //     return false;
        //   }
        // }

        // if (typeof filters.isProspect !== "undefined") {
        //   if (customer.isProspect !== filters.isProspect) {
        //     return false;
        //   }
        // }

        // if (typeof filters.isReturning !== "undefined") {
        //   if (customer.isReturning !== filters.isReturning) {
        //     return false;
        //   }
        // }

        return true;
      });
      count = data.length;
    }

    if (typeof sortBy !== "undefined" && typeof sortDir !== "undefined") {
      data = applySort(data, sortBy, sortDir);
    }

    if (typeof page !== "undefined" && typeof rowsPerPage !== "undefined") {
      data = applyPagination(data, page, rowsPerPage);
    }

    return Promise.resolve({
      data,
      count,
    });
  }

  getRenter(request: GetRenterRequest): GetRenterResponse {
    let data = deepCopy(renters) as Renter[];
    let renter = data.find((x) => x.id === request?.renterId);
    return Promise.resolve(deepCopy(renter));
  }

  //   getEmails(request?: GetCustomerEmailsRequest): GetCustomerEmailsResponse {
  //     return Promise.resolve(deepCopy(emails));
  //   }

  //   getInvoices(request?: GetCustomerInvoicesRequest): GetCustomerInvoicesResponse {
  //     return Promise.resolve(deepCopy(invoices));
  //   }

  //   getLogs(request?: GetCustomerLogsRequest): GetCustomerLogsResponse {
  //     return Promise.resolve(deepCopy(logs));
  //   }
}

export const renterApi = new RentersApi();

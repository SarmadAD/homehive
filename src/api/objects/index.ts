import { applyPagination } from "src/utils/apply-pagination";
import { applySort } from "src/utils/apply-sort";
import { deepCopy } from "src/utils/deep-copy";
import { objects } from "./data";
import { RentalObject } from "src/types/object";
import { repairRequests } from "./repairRequests/data";
import { RepairRequest } from "src/types/repairRequest";

type GetObjectsRequest = {
  filters?: {
    query?: string;
  };
  page?: number;
  rowsPerPage?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

type GetObjectsResponse = Promise<{
  data: RentalObject[];
  count: number;
}>;

type GetObjectRequest = {
  objectId?: string;
};

type GetRepairRequests = {
  objectId?: string;
};

type GetObjectResponse = Promise<RentalObject>;
type GetRepairRequestsResponse = Promise<RepairRequest[]>;

// type GetCustomerEmailsRequest = {};

// type GetCustomerEmailsResponse = Promise<CustomerEmail[]>;

// type GetCustomerInvoicesRequest = {};

// type GetCustomerInvoicesResponse = Promise<CustomerInvoice[]>;

// type GetCustomerLogsRequest = {};

// type GetCustomerLogsResponse = Promise<CustomerLog[]>;

class ObjectsApi {
  getObjects(request: GetObjectsRequest = {}): GetObjectsResponse {
    const { filters, page, rowsPerPage, sortBy, sortDir } = request;

    let data = deepCopy(objects) as RentalObject[];
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

  getObject(request: GetObjectRequest): GetObjectResponse {
    let data = deepCopy(objects) as RentalObject[];
    let object = data.find((x) => x.id === request?.objectId);
    return Promise.resolve(deepCopy(object));
  }

  getRepairRequests(request: GetRepairRequests): GetRepairRequestsResponse {
    let data = deepCopy(objects) as RentalObject[];
    let object = data.find((x) => x.id === request?.objectId);
    const repairRequestsData = deepCopy(repairRequests) as RepairRequest[];
    const filteredData = repairRequestsData.filter((repairReqest) => object?.repairRequestsIds.includes(repairReqest.id));
    return Promise.resolve(deepCopy(filteredData));
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

export const objectsApi = new ObjectsApi();

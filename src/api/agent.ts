import { Token } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { LinkTokenCreateResponse, Transaction } from "plaid";
import { Landlord } from "prisma/types/landlord";
import { RentalObject } from "prisma/types/objects";
import { RentalAgreement } from "prisma/types/rentalAgreement";
import { Renter } from "prisma/types/renter";
import { RentPayment } from "prisma/types/rentPayment";
import { RepairRequest } from "prisma/types/repairRequest";
import { UserRole } from "prisma/types/userrole";
import { TokenWithGrantTypeAndScope, OneTimeAccessToken, TokenWithScope } from "src/types/token";

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  patch: <T>(url: string, body: {}) => axios.patch<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const objects = {
  list: (landlordId: string) => requests.get<RentalObject[]>(`/api/dashboard/objects/${landlordId}`),
  details: (objectId: string) => requests.get<RentalObject>(`/api/dashboard/objects/object/${objectId}`),
  create: (object: RentalObject) => requests.post<RentalObject>(`/api/dashboard/objects/${object.landlord.id}`, object),
  update: (object: RentalObject) => requests.put<RentalObject>(`/api/dashboard/objects/object/${object.id}`, object),
  delete: (id: string) => requests.del<RentalObject>(`/api/dashboard/objects/object/${id}`),
  updateRepairRequest: (repairRequest: RepairRequest) =>
    requests.put<void>(`/api/dashboard/objects/object/repairRequest/${repairRequest.id}`, repairRequest),
  //   attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}),
};

const landlord = {
  details: (authenticatedUserId: string) => requests.get<Landlord>(`/api/landlord?aId=${authenticatedUserId}`),
  create: (authenticatedUserId: string) => requests.post<void>(`/api/landlord/`, authenticatedUserId),
};

const renter = {
  details: (authenticatedUserId: string) => requests.get<Renter>(`/api/renter?aId=${authenticatedUserId}`),
  removeRentalObjectFromRenter: (renters: string[], rentalObjectId: string) => requests.patch<Renter>(`/api/renter`, { renters, rentalObjectId }),
};

const renters = {
  list: (landlordId: string) => requests.get<Renter[]>(`/api/dashboard/renters/${landlordId}`),
  details: (renterId: string) => requests.get<Renter>(`/api/dashboard/renters/renter/${renterId}`),
  create: (renter: Renter, landlordId: string) => requests.post<Renter>(`/api/dashboard/renters/${landlordId}`, renter),
  delete: (id: string) => requests.del<Renter>(`/api/dashboard/renters/renter/${id}`),
  updateAuthenticatedUserId: (renterId: string, authenticatedUserId: string) =>
    requests.put<void>(`/api/dashboard/renters/renter/${renterId}`, authenticatedUserId),
};

const rentalAgreements = {
  list: (landlordId: string) => requests.get<RentalAgreement[]>(`/api/rentalAgreements/?landlordId=${landlordId}`),
  details: (rentalAgreementId: string) => requests.get<RentalAgreement>(`/api/rentalAgreements/rentalAgreement/${rentalAgreementId}`),
  create: (rentalAgreement: RentalAgreement, landlordId: string) =>
    requests.post<RentalAgreement>(`/api/rentalAgreements/?landlordId=${landlordId}`, rentalAgreement),
  update: (rentalAgreement: RentalAgreement) =>
    requests.put<RentalAgreement>(`/api/rentalAgreements/rentalAgreement/${rentalAgreement.id}`, rentalAgreement),
  delete: (rentalAgreementId: string) => requests.del<RentalAgreement>(`/api/rentalAgreements/rentalAgreement/${rentalAgreementId}`),
};

const userRoles = {
  details: (authenticatedUserId: string) => requests.get<UserRole>(`/api/role/${authenticatedUserId}`),
};

const rentPayments = {
  checkForNewTransactionsForRenter: (landlordId: string, renterId: string) =>
    requests.post<void>(`/api/rentPayments/renter/?landlordId=${landlordId}&renterId=${renterId}`, {}),
  checkForNewTransactions: (landlordId: string) => requests.post<void>(`/api/rentPayments/?landlordId=${landlordId}`, {}),
  update: (rentPaymentId: string) => requests.put<RentPayment[]>(`/api/rentPayments/${rentPaymentId}`, {}),
  list: (landlordId: string) => requests.get<RentPayment[]>(`/api/rentPayments/?landlordId=${landlordId}`),
};

const integrations = {
  tink: {
    user: {
      create: (landlordId: string) => requests.post(`/api/dashboard/settings/integrations/tink/user/?landlordId=${landlordId}`, {}),
      delete: (landlordId: string) => requests.del(`/api/dashboard/settings/integrations/tink/user/?landlordId=${landlordId}`),
      grantAccess: {
        grant: (landlordId: string) => requests.post(`/api/dashboard/settings/integrations/tink/user/grantAccess/?landlordId=${landlordId}`, {}),
      },
    },
    token: {
      generate: (landlordId: string, tokenInfo: OneTimeAccessToken | TokenWithGrantTypeAndScope | TokenWithScope) =>
        requests.post<Token>(`/api/dashboard/settings/integrations/tink/?landlordId=${landlordId}`, tokenInfo),
      generateUserAccessToken: (landlordId: string) => requests.get<Token>(`/api/dashboard/settings/integrations/tink/?landlordId=${landlordId}`),
    },
  },
  plaid: {
    linktoken: {
      create: (landlordId: string) =>
        requests.post<LinkTokenCreateResponse>(`/api/dashboard/settings/integrations/plaid/linktoken/create/?landlordId=${landlordId}`, {}),
    },
    accessToken: {
      create: (landlordId: string, public_token: string) =>
        requests.post(`/api/dashboard/settings/integrations/plaid/accesstoken/create`, { landlordId, public_token }),
      deactivate: (landlordId: string) =>
        requests.post(`/api/dashboard/settings/integrations/plaid/accesstoken/deactivate/?landlordId=${landlordId}`, {}),
    },
    transactions: {
      sync: (landlordId: string) =>
        requests.post<Transaction[]>(`/api/dashboard/settings/integrations/plaid/transactions/sync/?landlordId=${landlordId}`, {}),
    },
  },
};

const token = {
  get: (landlordId: string) => requests.get(`/api/token/?landlordId=${landlordId}`),
  delete: (landlordId: string) => requests.del(`/api/token/?landlordId=${landlordId}`),
};

const agent = {
  objects,
  landlord,
  renter,
  renters,
  rentalAgreements,
  userRoles,
  rentPayments,
  integrations,
  token,
};

export default agent;

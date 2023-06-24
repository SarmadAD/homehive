import { Landlord, RentalObject, RentalObjectInfo } from "@prisma/client";
import axios, { AxiosResponse } from "axios";

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const objects = {
  list: (landlordId: string) => requests.get<RentalObject[]>(`/api/dashboard/objects?lloId=${landlordId}`),
  details: (id: string) => requests.get<RentalObject>(`/api/dashboard/objects/${id}`),
  rentalObjectInfo: (id: string) => requests.get<RentalObjectInfo>(`/rentalObjectInfo/${id}`),
  //   create: (activity: ActivityFormValues) => requests.post<void>("/activities", activity),
  //   update: (activity: ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`, activity),
  //   delete: (id: string) => requests.del<void>(`/activities/${id}`),
  //   attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}),
};

const landlord = {
  details: (firebaseUserId: string) => requests.get<Landlord>(`/api/landlord?fbId=${firebaseUserId}`),
};

const agent = {
  objects,
  landlord,
};

export default agent;

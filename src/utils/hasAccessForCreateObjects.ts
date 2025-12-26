import { Landlord } from "prisma/types/landlord";

export default function checkIfUserIsNotAllowedToCreateRentalObjects(landlord: Landlord) {
  // If user has no access
  if (landlord && "hasAccess" in landlord && !landlord.hasAccess) {
    // Disable if at least one rental object exists
    return landlord.rentalObjects.length >= 1;
  }
  // If user has access, allow creation
  return false;
}

import { Landlord } from "prisma/types/landlord";

export default function checkIfUserIsNotAllowedToCreateRentalAgreement(landlord: Landlord) {
  // If user has no access
  if ("hasAccess" in landlord && !landlord.hasAccess) {
    // Disable if at least one renter exists
    return landlord.rentalAgreements.length >= 1;
  }
  // If user has access, allow creation
  return false;
}

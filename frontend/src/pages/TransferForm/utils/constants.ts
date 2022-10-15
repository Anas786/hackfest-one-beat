import { IBedType, IFacility, ITransportationType, IDiagonosis } from "./types";

export const facilities: Array<IFacility> = [
  {
    id: 1,
    name: "Liaquat National Hospital",
    address: "National Stadium Rd",
    address2: null,
    zip: "74800",
    city: "Karachi",
    state: "Sindh",
    country_id: 167,
    latitude: "24.89",
    longitude: "67.07",
    facility_type_id: 2,
    phone: "021111456456",
    email: "info@lnh.edu.pk",
    representative_name: "Ali Akbar",
    representative_phone: "+92123456789",
    representative_email: "aliakbar@lnh.edu.pk",
    is_active: 1,
    created_at: "2022-10-15T12:11:36.000+05:00",
    updated_at: "2022-10-15T12:11:36.000+05:00",
  },
];

export const bedTypes: Array<IBedType> = [
  {
    id: 2,
    name: "Intensive Care Unit",
    created_at: "2022-10-15T17:39:38.000+05:00",
    updated_at: "2022-10-15T17:39:38.000+05:00",
  },
  {
    id: 3,
    name: "Intermediate Medical Unit",
    created_at: "2022-10-15T17:39:38.000+05:00",
    updated_at: "2022-10-15T17:39:38.000+05:00",
  },
  {
    id: 1,
    name: "Pediatrics Bed",
    created_at: "2022-10-15T17:39:38.000+05:00",
    updated_at: "2022-10-15T17:39:38.000+05:00",
  },
];

export const transportationTypes: Array<ITransportationType> = [
  {
    id: 3,
    name: "Air Medical Transport",
    created_at: "2022-10-15T17:39:38.000+05:00",
    updated_at: "2022-10-15T17:39:38.000+05:00",
  },
  {
    id: 1,
    name: "Ambulance",
    created_at: "2022-10-15T17:39:38.000+05:00",
    updated_at: "2022-10-15T17:39:38.000+05:00",
  },
  {
    id: 2,
    name: "Personal Transportation",
    created_at: "2022-10-15T17:39:38.000+05:00",
    updated_at: "2022-10-15T17:39:38.000+05:00",
  },
];

export const diagnoses: Array<IDiagonosis> = [
  {
    id: 1,
    name: "Back Pain",
    created_at: "2022-10-15T17:39:38.000+05:00",
    updated_at: "2022-10-15T17:39:38.000+05:00",
  },
  {
    id: 2,
    name: "Chest Pain",
    created_at: "2022-10-15T17:39:38.000+05:00",
    updated_at: "2022-10-15T17:39:38.000+05:00",
  },
  {
    id: 3,
    name: "Dengue",
    created_at: "2022-10-15T17:39:38.000+05:00",
    updated_at: "2022-10-15T17:39:38.000+05:00",
  },
];

export const ETA = [
  {
    id: 1,
    name: "1 hr",
  },
  {
    id: 2,
    name: "2 hr",
  },
  {
    id: 5,
    name: "5 hr",
  },
  {
    id: 7,
    name: "7 hr",
  },
];

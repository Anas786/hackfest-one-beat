import { IBedType, IFacility, ITransportationType } from "pages/TransferForm/utils/types";

export const ADMISSION_STATUS_OPTIONS = [
  { label: "INITIATED", value: 1 },
  { label: "APPROVED", value: 2 },
  { label: "REJECTED", value: 3 },
  { label: "PATIENT_ARRIVED", value: 4 },
  { label: "CANCELLED", value: 5 },
  { label: "DISCHARGED", value: 6 },
];

export const DIET_OPTIONS = [
  { label: "NPO", value: 1 },
  { label: "Clear Liquids", value: 2 },
  { label: "Regular", value: 3 },
];

export const IV_FLUIDS_OPTIONS = [
  { label: "Heplock", value: 1 },
  { label: "KVO", value: 2 },
  { label: "Hospital Physician to Order", value: 3 },
];

export const BLOOD_TESTS_OPTIONS = [
  { label: "CBC", value: 1 },
  { label: "BMP", value: 2 },
  { label: "LFT", value: 3 },
];

export const URINE_TESTS_OPTIONS = [
  { label: "UA", value: 1 },
  { label: "U", value: 2 },
];

export const IMAGING_TESTS_OPTIONS = [
  { label: "X-Rays", value: 1 },
  { label: "US", value: 2 },
  { label: "CT", value: 3 },
  { label: "MRI", value: 4 },
  { label: "EKG", value: 5 },
];

export const GENDER_OPTIONS = ["M", "F"];

export const MEDICINES_OPTIONS = [
  "Panadol",
  "Cefalor",
  "Dasatinib",
  "Enalapril",
  "Famciclovir",
  "Gabapentin",
  "Methadone",
  "Probencid",
  "Topotecan",
];

export const CONSULT_OPTIONS = [
  { label: "Cardiology", value: 1 },
  { label: "Pulmonology", value: 2 },
  { label: "Nephrology", value: 3 },
];

export const BED_TYPES: Array<IBedType> = [
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

export const TRANSPORTAT_TYPES: Array<ITransportationType> = [
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

export const FACILITIES: Array<IFacility> = [
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

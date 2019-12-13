// An individual meta field from rest
export interface Field {
  name: string; // bullhorn internal field name
  type: string; // SCALAR, TO-ONE, TO-MANY, COMPOSITE
  dataType?: string; // String, Boolean, Etc.
  dataSpecialization?: string; // DATE, FLOAT, SYSTEM, Etc.
  required?: boolean; // Opposite of optional
  optional?: boolean; // Required by forms
  readOnly?: boolean; // Disabled by forms
  multiValue?: boolean; // Can have multiple values
  confidential?: boolean; // Hidden from non-owners
  sortOrder?: number; // How to sort the list
  label?: string; // human readable name in ATS
  hint?: string; // hover text
  description?: string; // tooltip text
  associatedEntity?: Meta; // For To-Many fields
}

// Meta from rest
export interface Meta {
  entity: string; // The canonical entity name
  label: string; // The entity name for the private label
  fields: Field[]; // List of fields
}

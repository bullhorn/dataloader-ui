// An individual meta field from rest
export interface Field {
  name: string; // bullhorn internal field name
  type: 'SCALAR' | 'TO_ONE' | 'TO_MANY' | 'COMPOSITE' | 'ID';
  dataType?: string; // String, Boolean, Etc.
  dataSpecialization?: string; // DATE, FLOAT, SYSTEM, Etc.
  required?: boolean; // Marked as required in frontend forms
  optional?: boolean; // Marked as optional in frontend forms
  readOnly?: boolean; // Hidden (disabled) in forms
  multiValue?: boolean; // Can have multiple values
  confidential?: boolean; // Hidden from non-owners
  sortOrder?: number; // How to sort the fields in a form
  label?: string; // human readable name in ATS
  hint?: string; // hover text
  description?: string; // tooltip text
  associatedEntity?: Meta; // For To-Many fields
  fields?: Field[]; // For composite fields (addresses)
}

// Meta from rest
export interface Meta {
  entity: string; // The canonical entity name
  label: string; // The entity label for the private label
  fields: Field[]; // List of fields
}

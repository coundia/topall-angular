export type FieldDefinition = {
  name: string;
  displayName: string;
  type?: FieldType;
  entityType?: string;
  nullable?: boolean;
  relation?: string;
  defaultValue?: string;
  options?: { value: string; label: string }[];
  inputType?: string;
};


export type FieldType = 'string' | 'boolean' | 'badge' | 'date' | 'select' | 'textarea' | 'number';


export function isValidUUID(uuid: any): boolean {

  if (!uuid) {
    return false;
  }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

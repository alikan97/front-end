export enum TypeDefinitionTypes {
    BOOLEAN = 'boolean',
    DATE = 'date',
    INTEGER = 'integer',
    NUMBER = 'number',
    TEXT = 'text',
    TIMESTAMP = 'timestamp',
}

export enum InputTypes {
    CALENDAR = 'calendar',
    CHECK = 'check',
    LIST = 'list',
    SLIDER = 'slider',
    TEXT = 'text',
    TOGGLE = 'toggle',
}
export enum MultipleTypeDefinitionTypes {
    ARRAY = 'array',
    SET = 'set',
}

export interface MultipleTypeDefinitionValidation {
    coerceMaxLength: number | null;
    maxLength: number | null;
    minLength: number | null;
}

export interface MultipleTypeDefinition {
    type: MultipleTypeDefinitionTypes.ARRAY | MultipleTypeDefinitionTypes.SET;
    input: InputTypes.LIST;
    validation: MultipleTypeDefinitionValidation;
}

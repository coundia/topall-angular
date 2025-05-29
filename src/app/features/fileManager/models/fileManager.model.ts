
export type TypeFileManager = 'TYPE1' | 'TYPE2';

export interface FileManager {
    id: string;
    name: string;
    details?: string;
    objectId?: string;
    objectName?: string;
    originalName?: string;
    mimeType?: string;
    size?: number;
    path?: string;
    uri?: string;
    isPublic?: boolean;
}


import {FileStorage} from "../admin/file.reader";

export class Documents {
    id?: number;
    created_at?: Date;
    updated_at?: Date;
    file: FileStorage;
    name: string;
    description: string;
    private : boolean;
}

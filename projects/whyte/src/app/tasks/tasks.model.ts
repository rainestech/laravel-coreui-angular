import {User} from "../admin/users.model";

export const priorityOptions = [
    {value: 'lowest', name: 'Lowest', class: 'info'},
    {value: 'low', name: 'Low', class: 'info'},
    {value: 'moderate', name: 'Moderate', class: 'warning'},
    {value: 'could-have', name: 'Could Have', class: 'warning'},
    {value: 'must-have', name: 'Must Have', class: 'warning'},
    {value: 'high', name: 'High', class: 'danger'},
    {value: 'highest', name: 'Highest', class: 'danger'},
];

export class Comments {
    task: Tasks;
    comment: string;
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    created_at?: Date;
    updated_at?: Date;
    createdBy?: string;
    lastModifiedBy?: string;
    editorName?: string;
    editorId?: number;
    editorUsername?: string;
    channelId: number;
    user: User;
}

export class TaskSort {
    id: number;
    position: number;
    tab: string
}


export class Tasks {
    id?: number;
    created_at?: Date;
    updated_at?: Date;
    taskNo: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: User;
    lastModifiedBy?: string;
    editorName?: string;
    editorId?: number;
    editorUsername?: string;
    name: string;
    description: string;
    followers?: User[];
    channel: Channel;
    comments: Comments[];
    dueDate: Date;
    priority: string;
    doneBy: User;
    assignedTo: User[];
    doneDate: Date;
    tab: string;
    position: number
    channelName?: string;
}

export class Channel {
    id?: number;
    created_at?: Date;
    updated_at?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    lastModifiedBy?: string;
    editorName?: string;
    editorId?: number;
    editorUsername?: string;
    name: string;
    description: string;
    members: User[];
}

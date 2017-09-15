export interface IMockService {
    method: string;
    path: string;
    status: number;
    body: any;
    timeout: string | number;
    header: object | string;
}
export declare class JSONServiceMocker {
    defaultResHeaders: {};
    constructor();
    init(services: IMockService[]): void;
    enable(): void;
    disable(): void;
}

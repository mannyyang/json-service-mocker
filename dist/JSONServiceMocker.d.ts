export interface IMockService {
    method: string;
    path: string;
    status: number;
    body: any;
    timeout: string | number;
    headers: object | string;
}
export declare class JSONServiceMocker {
    defaultResHeaders: {};
    private server;
    constructor();
    init(services: IMockService[]): void;
    enable(): void;
    disable(): void;
}

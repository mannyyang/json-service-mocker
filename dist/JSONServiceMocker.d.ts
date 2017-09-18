/**
 * Single Mock Service Interface
 */
export interface IMockService {
    method: string;
    path: string | RegExp;
    status: number;
    body: any;
    timeout?: string | number;
    headers: object;
}
/**
 * JSON Service Mocker
 */
export declare class JSONServiceMocker {
    defaultResHeaders: {};
    defaultOpts: {
        autoRespond?: boolean;
        autoRespondAfter?: number;
    };
    mockServices: IMockService[];
    private server;
    constructor(services: IMockService[], options?: any);
    enable(): void;
    disable(): void;
    private setUp();
    private setFilters();
}

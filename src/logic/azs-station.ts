import { AbstractStation } from "./abstract-station";
import { SIMULATED_ENTITIES } from "./simulated-entities";

export class AszStation extends AbstractStation {
    public storeLimit: number = 42_000;
    public stores: Record<string, number> = {
        '92': 30_000,
        '95': 16_000,
        '98': 16_000,
        'ДТ': 30_000
    };


    constructor() {
        super();
        SIMULATED_ENTITIES.createEntity(this);
    }
    
}
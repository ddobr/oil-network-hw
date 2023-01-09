import { AbstractStation } from "./abstract-station";
import { SIMULATED_ENTITIES } from "./simulated-entities";

export class AaszStation extends AbstractStation {
    public storeLimit: number = 24_000;
    public stores: Record<string, number> = {
        '92': 16_000,
        'ДТ': 15_000
    };


    constructor() {
        super();
        SIMULATED_ENTITIES.createEntity(this);
    }
    
}
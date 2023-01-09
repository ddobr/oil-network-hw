import { ITimeSimulated } from "./types";

export class SimulatedEntities {
    public timeSimulatedEntities: ITimeSimulated[] = [];


    public createEntity(entity: ITimeSimulated): void {
        this.timeSimulatedEntities.push(entity);
    }

    public removeEntity(entity: ITimeSimulated): void {
        this.timeSimulatedEntities = this.timeSimulatedEntities.filter(e => e !== entity);
    }
}

export const SIMULATED_ENTITIES = new SimulatedEntities();
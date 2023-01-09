import { SimulatedEventEmitter } from "./event-emitter";
import { random } from "./random.util";
import { SIMULATED_ENTITIES } from "./simulated-entities";
import { TimeManager } from "./time-manager";
import { ITimeSimulated, OilType } from "./types";

export class OrderStream implements ITimeSimulated {
    // поток автомобилей с интервалом 0-5 минут
    public autoEventEmitter: SimulatedEventEmitter = new SimulatedEventEmitter(1, 5);
    // поток грузовиков с интервалом 0-12 минут
    public truckEventEmitter: SimulatedEventEmitter = new SimulatedEventEmitter(1, 12);
    // Очередь заказов 
    public queue: Array<{ type: OilType, amount: number }> = [];

    constructor() {
        SIMULATED_ENTITIES.createEntity(this);
    }

    tick(): void {
        // если срабатывает событие в данную минуту, то добавляем в очередь автомобили или грузовики

        // для легковых
        if (this.autoEventEmitter.tryEmit()) {
            this.queue.push(this.createAutoOrder());
        }

        // для грузовых
        if (this.truckEventEmitter.tryEmit()) {
            this.queue.push(this.createTruckOrder());
        }
    }

    public createAutoOrder(): { type: OilType, amount: number } {
        const oilTypes: OilType[] = [OilType.t92, OilType.t95, OilType.t98, OilType.tDt];

        return {
            type: oilTypes[random(0, oilTypes.length - 1)], // случайным образом выбирается тип топлива
            amount: random(10, 40) // и количество топлива от 10 до 40
        }
    }

    public createTruckOrder(): { type: OilType, amount: number } {
        const oilTypes: OilType[] = [OilType.t92, OilType.tDt];

        return {
            type: oilTypes[random(0, oilTypes.length - 1)], // случайным образом выбирается тип топлива
            amount: random(30, 300) // и количество топлива от 30 до 300
        }
    }

}
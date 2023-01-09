import { AaszStation } from "./aazs-station";
import { AbstractStation } from "./abstract-station";
import { AszStation } from "./azs-station";
import { PRICES, SIMULATION_TIME } from "./constants";
import { OrderStream } from "./order-stream";
import { SIMULATED_ENTITIES } from "./simulated-entities";
import { STATISTICS } from "./statistics";
import { ITimeSimulated } from "./types";

/**
 * Менеджер времени. Содержит все симулируемые во времени сущности
 */
export class TimeManager {
    public static simulate(): void {
       
        let simTime = SIMULATION_TIME;
        let cash = 0;
        
        const azsStations = Array.from({ length: 14 }).map(() => { // создадим 14 АЗС
            return this.createAzsPair();
        });
        const aazsStations = Array.from({ length: 16 }).map(() => { // создадим 16 ААЗС
            return this.createAazsPair();
        });

        const stationList: Array<{ station: AbstractStation, stream: OrderStream }> = [...azsStations, ...aazsStations] // конкатенируем их в один массив

        while (simTime > 0) { // пока время симуляции в минутах не кончилось
            simTime -= 1;

            stationList.forEach(pair => { // для каждой станции
                while (pair.stream.queue.length > 0) { // обслуживаем каждого клиента в очереди
                    const order = pair.stream.queue.shift()!; 
    
                    if (pair.station.serveOrder(order.type, order.amount)) { // если станция может обслужить
                        STATISTICS.writeEarned(PRICES[order.type] * order.amount); // запишем сколько заработали
                        STATISTICS.writeDidServed(true); // запишем что обслужили
                    } else if (Object.keys(pair.station.stores).includes(order.type)) {
                        STATISTICS.writeDidServed(false); // запишем что не обслужили
                    }
                }
            })

            SIMULATED_ENTITIES.timeSimulatedEntities.forEach(e => e.tick());

            // проверяем что настал конец дня
            if (simTime % (24 * 60) === 1) {
                STATISTICS.finishDay();
            }
        }

        console.log(STATISTICS);

    }

    public static createAzsPair(): { station: AszStation, stream: OrderStream } {
        return {
            station: new AszStation(),
            stream: new OrderStream(),
        }
    }

    public static createAazsPair(): { station: AaszStation, stream: OrderStream } {
        return {
            station: new AaszStation(),
            stream: new OrderStream(),
        }
    }
}

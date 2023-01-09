import { AbstractStation } from "./abstract-station";
import { SIMULATED_ENTITIES } from "./simulated-entities";
import { TimeManager } from "./time-manager";
import { ITimeSimulated } from "./types";

export class SupplierTruck implements ITimeSimulated {
    /** 
     * Состояние 
     * waiting - ожидание заказа на доставку
     * delivering - доставка
     * returning - возврат на базу
     */
    public state: 'waiting' | 'delivering' | 'returning' = 'waiting';

    /**
     * Сколько времени ехать до заправки (50 минут)
     */
    public static travelTime = 40;

    /** 
     * Чем заполнены секции
     */
    public sections: Array<{ type: string, amount: number }>;
    /**
     * Кол-во секций
     */
    public sectionAmount: number;
    /**
     * Сколько осталось времени ехать до точки
     */
    public travelTimeRemaining: number = SupplierTruck.travelTime;
    /**
     * Пункт назначения - станция, куда нужно доставить ресурсы
     */
    public destination?: AbstractStation;


    constructor(
        sectionAmount: number
    ) {
        this.sectionAmount = sectionAmount;
        this.sections = [];

        
        SIMULATED_ENTITIES.createEntity(this);
    }

    tick(): void {
        if (this.state === "waiting") {
            return;
        }

        if (this.state === 'delivering') {
            this.travelTimeRemaining -= 1;

            if (this.travelTimeRemaining === 0) {
                this.unloadOrder();
                this.state = 'returning';
                this.travelTimeRemaining = SupplierTruck.travelTime;
            }
        }

        if (this.state === 'returning') {
            this.travelTimeRemaining -= 1;

            if (this.travelTimeRemaining === 0) {
                this.state = 'waiting';
                this.travelTimeRemaining = SupplierTruck.travelTime;
            }
        }
    }

    /**
     * Отправить бензовоз на доставку
     * @param sections типы топлива (заливается максимум 6000уе)
     * @param station пункт назначения
     */
    public createOrder(sections: string[], station: AbstractStation): void {
        if (this.state !== 'waiting') {
            return;
        }

        this.travelTimeRemaining = SupplierTruck.travelTime;
        this.state = 'delivering';

        if (sections.length > this.sectionAmount) {
            throw new Error('Не может столько доставить');
        }

        this.sections = sections.map((type) => ({ amount: 6000, type }));
        this.destination = station;

    }

    /**
     * Залить топливо на станцию
     */
    public unloadOrder(): void {
        if (!this.destination) {
            throw new Error('Нет пункта назначения');
        }

        this.destination.receiveOil(this.sections);
    }
}
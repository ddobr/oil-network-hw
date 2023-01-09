import { SIMULATED_ENTITIES } from "./simulated-entities";
import { Supplier } from "./supplier";
import { TimeManager } from "./time-manager";
import { ITimeSimulated } from "./types";

export abstract class AbstractStation implements ITimeSimulated {

    /** Объем хранилища для каждого типа топлива */
    public abstract storeLimit: number;
    /** Хранилища с топливом в формате ключ (тип топлива) - значение (остаток в хранилище) */
    public abstract stores: Record<string, number>;


    /**
     * Интервал времени, через который менеджер заказывает нужные ресурсы
     * 
     * По-умолчанию 12 часов
     */
    public static refillTime: number = 60 * 12;
    /**
     * Сколько времени осталось до пополнения топлива
     */
    public timeBeforeRefill = AbstractStation.refillTime;
    /**
     * Флаг, что станция ждет доставки топлива.
     * Если станция ждет, то не заказывает еще.
     */
    public isWaitingForDelivery: boolean = false;


    /**
     * Обслужить заказ
     * @param type тип топлива
     * @param amount количество топлива
     * @returns true если успешно. false если заказ отклонен из-за недостатка ресурсов
     */
    public serveOrder(type: string, amount: number): boolean {
        // Проверяем что АЗС может заправить тип топлива
        if (this.stores[type] === undefined) {
            return false;
        }

        // Если топлива данного типа нет, то не обслуживаем
        if (this.stores[type] < amount) {
            return false;
        }

        // Иначе обслуживаем и уменьшаем запас
        this.stores[type] -= amount;

        return true;
    }

    public tick(): void {
        this.timeBeforeRefill -= 1;

        // Заказываем топливо по истечению таймера
        if (this.timeBeforeRefill === 0) {
            this.orderTopMissing();
            this.timeBeforeRefill = AbstractStation.refillTime;
        } else {
            // ИЛИ запрашиваем то, в чем нуждаемся
            this.checkSupplies();
        }

    }

    /**
     * Получить топливо. Метод вызывается бензовозом
     * @param sections 
     */
    public receiveOil(sections: Array<{ type: string, amount: number }>): void {
        // заливаем топливо
        sections.forEach(section => {
            // ...соблюдая лимиты в storeLimit
            this.stores[section.type] = Math.min(this.storeLimit, this.stores[section.type] + section.amount);
        });
    }

    /**
     * Проверяет наличие ресурсов
     */
    public checkSupplies(): void {
        /** Типы топлива, в которых нуждается станция */
        const missing: string[] = [];

        Object.keys(this.stores).forEach((type) => {
            // если остаток данного типа меньше или равен 20% от максимального, то просим привезти
            if (this.stores[type] <= this.storeLimit * 0.2) {
                missing.push(type);
            }
        });

        Supplier.request(missing, this);
    }

    /**
     * Заказать наиболее нужные типы топлива у поставщика
     */
    public orderTopMissing(): void {
        Supplier.request(
            // запрашиваем все ресурсы, но в порядке уменьшения надобности. поставщик доставит столько, сколько сможет
            Object.keys(this.stores).sort((a: string, b: string) => {
                return this.stores[a] - this.stores[b];
            }), 
            this
        );
    }
}
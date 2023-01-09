import { AbstractStation } from "./abstract-station";
import { SupplierTruck } from "./supplier-truck";

/**
 * Поставщик топлива. Отправляет бензовозы по заказу
 */
export class Supplier {
    /**
     * Парк
     */
    public static trucks: SupplierTruck[] = [
        new SupplierTruck(2),
        new SupplierTruck(2),
        new SupplierTruck(3),
        new SupplierTruck(3),
        new SupplierTruck(3),
        new SupplierTruck(3),
        new SupplierTruck(3),
        new SupplierTruck(3),
        new SupplierTruck(2),
        new SupplierTruck(2),
        new SupplierTruck(2),
        new SupplierTruck(2),
    ];
    /**
     * Доступные бензовозы
     */
    public static get availableTrucks(): SupplierTruck[] {
        return this.trucks.filter(truck => truck.state === 'waiting');
    }
    /**
     * Получить свободный бензовоз
     */
    public static get availableTruck(): SupplierTruck {
        return this.availableTrucks[0]
    }

    /**
     * Заказать топливо
     * @param oilTypes типы топлива, которые требуются
     * @param receiver получатель
     * @returns true если заказ отправлен, false если отказано
     */
    public static request(oilTypes: string[], receiver: AbstractStation): boolean {
        if (this.availableTrucks.length === 0) {
            return false;
        }

        while (oilTypes.length > 0 && this.availableTruck !== undefined) {
            const availableTruck = this.availableTruck;
            const oilTypesForTruck = oilTypes.splice(0, availableTruck.sectionAmount);
            availableTruck.createOrder(oilTypesForTruck, receiver);
        }

        return true;
    }
}



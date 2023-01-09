import { random } from "./random.util";

export class SimulatedEventEmitter {
    /** Минут прошло с последнего события */
    public minutesSinceLastEvent: number = 0;
    /** Минут осталось перед следующим событием */
    public minutesBeforeNextEvent: number;

    constructor(
        public rangeFrom: number,
        public rangeTo: number
    ) {
        this.minutesBeforeNextEvent = random(this.rangeFrom, this.rangeTo);
    }

    /**
     * Запускать каждую минуту
     * 
     * true - если произошло событие
     */
    public tryEmit(): boolean {
        this.minutesSinceLastEvent += 1;

        if (this.minutesBeforeNextEvent === 0) {
            this.minutesSinceLastEvent = 0;
            this.minutesBeforeNextEvent = random(this.rangeFrom, this.rangeTo);

            return true;
        }

        this.minutesBeforeNextEvent -= 1;

        return false;
    }
}
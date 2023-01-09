export class Statistics {
    /** Сколько обслужено и сколько пропущено по дням */
    public served: Array<{ served: number, missed: number }> = [];
    protected servedPending: { served: number, missed: number } = { served: 0, missed: 0 };

    /** Сколько заработано по дням */
    public earned: Array<number> = [];
    protected earnedPending: number = 0;


    /** Закончить день, записать результаты */
    public finishDay(): void {
        this.served.push(this.servedPending);
        this.servedPending = { served: 0, missed: 0 };

        this.earned.push(this.earnedPending);
        this.earnedPending = 0;
    }

    public clear(): void {
        this.served = [];
        this.servedPending = { served: 0, missed: 0 };
        
        this.earned = [];
        this.earnedPending = 0;
    }

    /**
     * Был ли обслужен
     * @param served 
     */
    public writeDidServed(served: boolean): void {
        if (served) {
            this.servedPending.served += 1;
        } else {
            this.servedPending.missed += 1;
        }
    }

    /**
     * Сколько заработали
     * @param cash 
     */
    public writeEarned(cash: number): void {
        this.earnedPending += cash;
    }
}

export const STATISTICS = new Statistics();
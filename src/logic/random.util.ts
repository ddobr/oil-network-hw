export function random(from: number, to: number): number {
    if (to < from) {
        throw new Error()
    }

    const max = to - from;

    return Math.round(Math.random() * max) + from;
}
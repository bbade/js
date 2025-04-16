


export interface ScalarAnimation {
    getValue(timeMs:number): number;
}


export function slowRotateAnimation(initialValue: number, rateScale: number = 1): ScalarAnimation {
    return {
        getValue(timeMs: number): number {
            const r =  rotatePerSecond(.2, timeMs*rateScale)
            return r+ initialValue;
        },
    };
} // end slowRotateAnimation



export function rotatePerSecond(rps: number, timestampMs: number): number {
    // 1. Convert rotations per second (rps) to radians per second (angular velocity ω)
    //    Since 1 rotation = 2 * PI radians:
    const angularVelocityRadPerSec = rps * (2 * Math.PI);

    // 2. Convert the timestamp from milliseconds to seconds
    const timeSeconds = timestampMs / 1000.0;

    // 3. Calculate the total angle: angle = angular velocity * time
    const totalAngleRadians = angularVelocityRadPerSec * timeSeconds;

    return totalAngleRadians;
}
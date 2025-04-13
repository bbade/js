


interface ScalarAnimation {
    getValue(timeMs:number): number;
}


function slowRotateAnimation(initialValue: number): ScalarAnimation {
    return {
        getValue(timeMs: number): number {
            return initialValue+ (timeMs / 3000) % 1;
        },
    };
} // end slowRotateAnimation
// topbuttons.ts

export class TopButtons {
    private fontSizeInput: HTMLInputElement;
    private setFontSizeButton: HTMLButtonElement;
    private randomButton: HTMLButtonElement;

    constructor(
        private setFontSizeCallback: (fontSize: number) => void,
        private generateRandomMapCallback: () => void
    ) {
        this.fontSizeInput = document.getElementById('font-size-input') as HTMLInputElement;
        this.setFontSizeButton = document.getElementById('set-font-size-button') as HTMLButtonElement;
        this.randomButton = document.getElementById('random-button') as HTMLButtonElement;

        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.setFontSizeButton.addEventListener('click', () => this.setFontSize());
        this.randomButton.addEventListener('click', () => this.generateRandomMapCallback());
    }

    private setFontSize(): void {
        const newFontSize = parseInt(this.fontSizeInput.value, 10);
        if (!isNaN(newFontSize) && newFontSize > 0) {
            this.setFontSizeCallback(newFontSize);
        }
    }
}
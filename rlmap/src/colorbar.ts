// colorbar.ts
export class ColorBar {
    private fgColorInput: HTMLInputElement;
    private bgColorInput: HTMLInputElement;
    private colorPreview: HTMLDivElement;

    constructor(
        private setDrawingFgColorCallback: (color: string) => void,
        private setDrawingBgColorCallback: (color: string) => void
    ) {
        this.fgColorInput = document.getElementById('fg-color') as HTMLInputElement;
        this.bgColorInput = document.getElementById('bg-color') as HTMLInputElement;
        this.colorPreview = document.getElementById('color-preview') as HTMLDivElement;

        this.addEventListeners();
        this.updateColorPreview(); // Initial preview update
    }

    private addEventListeners(): void {
        this.fgColorInput.addEventListener('input', () => {
            this.setDrawingFgColorCallback(this.fgColorInput.value);
            this.updateColorPreview();
        });

        this.bgColorInput.addEventListener('input', () => {
            this.setDrawingBgColorCallback(this.bgColorInput.value);
            this.updateColorPreview();
        });
    }

    private updateColorPreview(): void {
        this.colorPreview.style.backgroundColor = this.bgColorInput.value;
        this.colorPreview.style.color = this.fgColorInput.value;
    }
}
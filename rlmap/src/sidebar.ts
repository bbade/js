// sidebar.ts
export class Sidebar {
    private tilePicker: HTMLDivElement;


    constructor(
        private setFontSizeCallback: (fontSize: number) => void,
        private setDrawingTileCallback: (char: string) => void,
        private chars: string[]
    ) {

        this.tilePicker = document.getElementById('tile-picker') as HTMLDivElement;
        this.addEventListeners();
        this.createTilePicker();

    }
    private addEventListeners(): void {}


    private createTilePicker(): void {
        for (const char of this.chars) {
            const button = document.createElement('button');
            button.textContent = char;
            button.style.width = `${document.getElementById('font-size-input')["value"]}px` //get value from input
            button.addEventListener('click', () => {
                this.setDrawingTileCallback(char);
            });
            this.tilePicker.appendChild(button);
        }
    }
}
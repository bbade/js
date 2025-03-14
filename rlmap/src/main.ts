// main.ts
import { CHARS } from './model';
import { Sidebar } from './sidebar';
import { ColorBar } from './colorbar';
import { MapView } from './mapview';
import { TopButtons } from './topbuttons';
import { Map } from './map';
import { Generator } from './generator';
import { DrawingState } from './drawing-state';

class AsciiMapEditor  {
    private map: Map;
    private drawingState: DrawingState = new DrawingState(' ', '#000000', '#ffffff', 16);


    private sidebar: Sidebar;
    private colorBar: ColorBar;
    private mapView: MapView;
    private topButtons: TopButtons;
    private mapGenerator: Generator;


    constructor() {
        this.map = new Map();

        this.sidebar = new Sidebar(
            this.setFontSize.bind(this),
            this.setDrawingTile.bind(this),
            CHARS
        );
        this.colorBar = new ColorBar(
            this.setDrawingFgColor.bind(this),
            this.setDrawingBgColor.bind(this)
        );
        this.mapView = new MapView(
            this.map,
            this.drawingState,
        );
        this.topButtons = new TopButtons(
            this.setFontSize.bind(this),
            this.generateRandomMap.bind(this)
        );

   
        this.mapView.draw();
        this.addEventListeners();
        let resizeTimeout: NodeJS.Timeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.mapView.calculateFontAspectRatio();
                this.mapView.draw()
            }, 250);
        });
    }

    private addEventListeners(): void {}

     setFontSize(fontSize: number): void {
        this.drawingState.setFontSize(fontSize);
        this.mapView.refresh();
         for (const button of this.sidebar["tilePicker"].children) {
              (button as HTMLButtonElement).style.width = `${fontSize}px`;
          	}
    }

    setDrawingTile(char: string): void {
        this.drawingState.setTileToDraw({
            char: char,
            fg: this.drawingState.tileToDraw.fg,
            bg: this.drawingState.tileToDraw.bg
        });
    }

     setDrawingFgColor(color: string): void {
        this.drawingState.tileToDraw = { ...this.drawingState.tileToDraw, fg: color };
    }

     setDrawingBgColor(color: string): void {
          this.drawingState.tileToDraw = { ...this.drawingState.tileToDraw, bg: color };
    }
    private generateRandomMap(): void {
       this.mapGenerator.generate(this.map, this.drawingState.tileToDraw.fg, this.drawingState.tileToDraw.bg);
       this.mapView.draw();
    }
}

new AsciiMapEditor();
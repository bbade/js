import { Vec2 } from "../vec2";

// Ai generated
export class Circle {
    constructor(public p: Vec2,  public r: number) {}

    get x(): number  { return this.p.x;}
    get y(): number { return this.p.y;}

    /**
     * returns a circle with its bottom center pixel on centerx, basey
     * @param centerX 
     * @param baseY assumes positve y is down
     */
    static onBaseline(centerX: number, baseY: number, r: number): Circle {
        return new Circle(new Vec2(centerX, baseY - r), r);
    }
  
    contains(p: Vec2): boolean {
      const dx = p.x - this.x;
      const dy = p.y - this.y;
      return dx * dx + dy * dy <= this.r * this.r;
    }
  
    intersects(other: Circle): boolean {
      const dx = this.x - other.x;
      const dy = this.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < this.r + other.r;
    }
    
    randomPoint(): Vec2 {
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.sqrt(Math.random()) * this.r; // Corrected radius distribution
        return new Vec2(this.x + radius * Math.cos(angle), this.y + radius * Math.sin(angle));
    }
  }
  

  // Ai Generated
  export class CircleUnion {
    circles: Circle[];
  
    constructor(circles: Circle[]) {
      this.circles = this.filterOverlappingCircles(circles);
    }
      
      private filterOverlappingCircles(circles: Circle[]): Circle[] {
        if(circles.length <= 1) {
            return [...circles];
        }
  
        const overlappingCircles: Circle[] = [];
        const added: boolean[] = new Array(circles.length).fill(false);
        
        for(let i = 0; i < circles.length; i++){
            if(added[i]) continue; //if the circle has already been added, we can skip.
  
            let hasOverlap = false;
            for(let j = 0; j < circles.length; j++) {
                if(i === j || added[j]) continue;
                
                if(circles[i].intersects(circles[j])){
                    hasOverlap = true;
                    if(!added[j]) {
                        overlappingCircles.push(circles[j]);
                        added[j] = true;
                    }
                }
            }
            
            if(hasOverlap || circles.length === 1)
            {
                overlappingCircles.push(circles[i]);
                added[i] = true;
            }
        }
      return overlappingCircles;
    }
  
    contains(p: Vec2): boolean {
      for (const circle of this.circles) {
        if (circle.contains(p)) {
          return true;
        }
      }
      return false;
    }
      
      private totalArea(): number {
         let area = 0;
          for(const circle of this.circles){
              area += Math.PI * circle.r * circle.r;
          }
          return area;
      }
  
    randomPoint(): Vec2 {
      if (this.circles.length === 0) {
        throw new Error("Cannot generate a random point from an empty CircleUnion.");
      }
        
      if (this.circles.length === 1){
          return this.circles[0].randomPoint();
      }
  
      // Weighted random selection based on area
      const areas = this.circles.map(c => Math.PI * c.r * c.r);
      const totalArea = areas.reduce((sum, area) => sum + area, 0);
      let randomArea = Math.random() * totalArea;
  
      for (let i = 0; i < this.circles.length; i++) {
        randomArea -= areas[i];
        if (randomArea <= 0) {
          return this.circles[i].randomPoint();
        }
      }
  
      // Should never reach here, but just in case, return from last
       return this.circles[this.circles.length - 1].randomPoint();
    }
  }
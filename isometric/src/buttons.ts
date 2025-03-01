import {WorldEventHandler} from "./world";

class Buttons {
    
    private worldEvents: WorldEventHandler;
    
    constructor( worldEventHandler: WorldEventHandler) {
        this.worldEvents = worldEventHandler;
        
        console.log("registering listeners");
        // --- Texture Upload and Reset Logic ---
        const uploadButton = document.getElementById("uploadButton") as HTMLButtonElement;
        const textureUploadFile = document.getElementById("textureUpload") as HTMLInputElement;
        const resetButton = document.getElementById("resetButton") as HTMLButtonElement;
        
        uploadButton.addEventListener("click", (event: MouseEvent) => {
            console.log("upload BUTTON clicked");
            
            event.stopPropagation(); // Prevent event from bubbling up
            textureUploadFile.click(); // Trigger the file input
        });
        
        textureUploadFile.addEventListener("change", (event: Event) => {
            console.log("upload EVENT change()");
            const target = event.target as HTMLInputElement;
            const file: File | null = target.files ? target.files[0] : null;  //Check for null
            if (file && file.type === "image/png") {
                this.onUpload(file);
            } else {
                alert("Please upload a PNG image.");
            }
        });
        
        resetButton.addEventListener("click", (event: MouseEvent) => {
            event.stopPropagation(); // Prevent event from bubbling up
            this.worldEvents.reset();
            // Reset the file input (so the same file can be selected again)
            textureUploadFile.value = "";
        });
    }

    
    private onUpload(file: File) {
        const reader = new FileReader();
        reader.onload = this.onLoad;
        reader.readAsDataURL(file);
    }
    
    
    onLoad = (e: ProgressEvent<FileReader>)  =>{
        if (e.target && e.target.result) { //Check that result is not null
            const img = new Image();
            img.onload = () => {
                this.worldEvents.setTexture(img);
            };
            img.src = e.target.result as string;
        }
    };
}

export default Buttons;
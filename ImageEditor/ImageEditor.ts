import nodefs = require("node:fs")

class Color {
    public red: number
    public green: number
    public blue: number

    constructor(){
        this.red = this.green = this.blue = 0
    }

    public toString(){
        return `${this.red} ${this.green} ${this.blue}`
    }
}

class Image_ {
    private pixels: (Color)[][]

    public constructor(private width: number, private height: number){
        this.pixels = Array<Color[]>(width)
        for (let x = 0; x < this.pixels.length; x++){
            this.pixels[x] = Array<Color>(height).fill(new Color())
        }
    }

    public getWidth(): number {
        return this.width
    }

    public getHeight(): number {
        return this.height
    }

    public set(x: number, y: number, c: Color): void{
        if (typeof this.pixels[x] == "undefined"){ return }
        if (typeof this.pixels[x][y] == "undefined") { return }
        this.pixels[x][y] = c
    }

    public get(x: number, y: number): (Color){
        if (typeof this.pixels[x] == "undefined"){ return new Color()}
        if (typeof this.pixels[x][y] == "undefined") { return new Color()}
        return this.pixels[x][y]
    }

    public toString(){
        return this.pixels.toString()
    }

}

class ImageEditor{
    public constructor(){}

    public run(args: [string, string, string, string?]): void{
        try {
            if (args.length < 3){
                this.usage()
                return
            }

            const inputFile: string = args[0]
            const outputFile: string = args[1]
            const filter: string = args[2]

            let image: Image_ = this.read(inputFile) 
            // console.log(image.toString())
            
            if (args.length == 3){
                if (filter.match(/gr(e|a)yscale/)){
                    this.grayscale(image)
                }
                else if (filter.match(/invert/)){
                    this.invert(image)
                }
                else if (filter.match(/emboss/)){
                    this.emboss(image)
                }
                else {this.usage()}
            }
            else if (args.length == 4){
                if (filter.match(/motionblur/)){
                    let length: number = -1
                    try {
                        length = parseInt(args[3] ? args[3] : "-1")
                    }
                    catch{}
                    if (length < 0) {
                        this.usage() 
                        return
                    }
                    this.motionblur(image, length)
                }
                else {this.usage()}
            }

            else {
                this.usage()
            }
            this.write(image, outputFile)
        }
        catch (error) {
            console.error(error);
        }
    }

    private usage(): void{
        console.log("USAGE: TypeScript ImageEditor <in-file> <out-file> <grayscale|invert|emboss|motionblur> {motion-blur-length}")
    }

    private read(filePath: string): Image_{
        const data = nodefs.readFileSync(filePath, "utf8").split(/\s+/) as [string, string, string, string, ...string[]]

        const width: number = parseInt(data[1])
        const height: number = parseInt(data[2])

        const startIndex: number = 4
        let image: Image_ = new Image_(width, height)
        console.log(image.toString())

        for (let y = 0; y < height; ++y){
            for (let x = 0; x < width; ++x){
                let position = startIndex + (x + (y * width)) * 3
                let color = new Color()


                color.red = parseInt(data[position] as string)
                color.green = parseInt(data[position + 1] as string)
                color.blue = parseInt(data[position + 2] as string)
                image.set(x, y, color)
            }
        }
        return image    
    }

    private write(image: Image_, filePath: string): void{
        let output: string = "P3\r\n"
        output += `${image.getWidth()} ${image.getHeight()}\r\n`
        output += "255\r\n"
        for (let y: number = 0; y < image.getHeight(); ++y){
            for (let x: number = 0; x < image.getWidth(); ++x){
                let color: (Color) = image.get(x, y)
                output += `${x == 0 ? "" : " "}${color.red} ${color.green} ${color.blue}`
            }
            output += "\r\n"
        }
        nodefs.writeFileSync(filePath, output)
    }

    private grayscale(image: Image_): void{
        for (let x: number = 0; x < image.getWidth(); ++x){
            for (let y: number = 0; y < image.getHeight(); ++y){
                let curColor: Color = image.get(x, y)
                
                let grayLevel: number = Math.floor((curColor.red + curColor.green + curColor.blue) / 3)
                grayLevel = Math.max(0, Math.min(grayLevel, 255))

                curColor.red = curColor.green = curColor.blue = grayLevel
            }
        }
    }

    private invert(image: Image_): void{
        for (let x = 0; x < image.getWidth(); ++x){
            for (let y = 0; y < image.getHeight(); ++y){
                let curColor: Color = image.get(x, y)

                curColor.red = 255 - curColor.red
                curColor.green = 255 - curColor.green
                curColor.blue = 255 - curColor.blue
            }
        }
    }

    private emboss(image: Image_): void{
        for (let x = image.getWidth() - 1; x >= 0; --x){
            for (let y = image.getHeight() - 1; y >=0; --y){
                let curColor: Color = image.get(x, y)

                let diff: number = 0
                if (x > 0 && y > 0){
                    let upLeftColor: Color = image.get(x - 1, y -1)
                    if (Math.abs(curColor.red - upLeftColor.red) > Math.abs(diff)){
                        diff = curColor.red - upLeftColor.red
                    }
                    if (Math.abs(curColor.green - upLeftColor.green) > Math.abs(diff)){
                        diff = curColor.green - upLeftColor.green
                    }
                    if (Math.abs(curColor.blue - upLeftColor.blue) > Math.abs(diff)){
                        diff = curColor.blue - upLeftColor.blue
                    }
                }

                let grayLevel: number = 128 + diff
                grayLevel = Math.max(0, Math.min(grayLevel, 255))

                curColor.red = curColor.green = curColor.blue = grayLevel
            }
        }
    }

    private motionblur(image: Image_, length: number): void{
        if (length < 1) {
            return
        }
        for (let x: number = 0; x < image.getWidth(); ++x){
            for (let y: number = 0; y < image.getHeight(); ++y){
                let curColor: Color = image.get(x, y)
                
                let maxX = Math.min(image.getWidth() - 1, x + length - 1)
                for (let i: number = x + 1; i <= maxX; ++i){
                    let tmpColor: Color = image.get(i, y)
                    curColor.red += tmpColor.red
                    curColor.green += tmpColor.green
                    curColor.blue += tmpColor.blue
                }

                let delta: number = maxX - x + 1
                curColor.red = Math.floor(curColor.red / delta)
                curColor.green = Math.floor(curColor.green / delta)
                curColor.blue = Math.floor(curColor.blue / delta)
            }
        }
    }
}

function main(args: string[]): void{
        new ImageEditor().run(args as [string, string, string, string?])
    }

const args = process.argv.slice(2)
main(args)
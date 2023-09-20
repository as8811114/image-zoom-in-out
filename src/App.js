import { Component } from "react";

class App extends Component {
  constructor() {
    super();
    this.state = {
      hasFile: false,
    };
    this.originPoint = { x: 0, y: 0 }; // originPoint of the image that inside the canvas
    this.oldOrignPoint = { x: 0, y: 0 }; // originPoint before drag finish to calcu new originPoint after drag
    this.oldPoint = { x: 0, y: 0 }; // the coordinate of mouse down
    this.offSet = { x: 0, y: 0 }; // drag offset coordinate
    this.scale = 0;
    this.isDragging = false;
    this.imgSrc = "";
  }
  drawImageInCanvas(type, imgUrl) {
    const Canvas = document.getElementById("canvas");
    const canvasContext2D = Canvas.getContext("2d");
    const img = new Image();
    img.src = imgUrl;

    //wait for image loading
    img.onload = () => {
      //adjust img scale to set the init scale as 1
      if (type === "init") {
        this.scale =
          img.height >= img.width
            ? Canvas.height / img.height
            : Canvas.width / img.width;
      } else if (type === "zoomIn") this.scale = this.scale + 0.1;
      else if (type === "zoomOut") this.scale = this.scale - 0.1;

      //set image height and width
      const h = img.height * this.scale;
      const w = img.width * this.scale;
      if (type !== "drag") {
        //set the position of img at the center of canvas
        //oldOriginPoint is for drag to calculate the offset of the originPoint
        this.originPoint = {
          x: Canvas.width / 2 - w / 2,
          y: Canvas.height / 2 - h / 2,
        };
        this.oldOrignPoint = {
          x: Canvas.width / 2 - w / 2,
          y: Canvas.height / 2 - h / 2,
        };
      }
      //if image's bound is outside of canvas's bound then user can drag the image
      else if (
        type === "drag" &&
        (this.originPoint.x < 0 ||
          this.originPoint.y < 0 ||
          this.originPoint.x + w > Canvas.width ||
          w > this.originPoint.y + Canvas.width)
      ) {
        //calculate the offset of the new originPoint
        this.originPoint = {
          x: this.oldOrignPoint.x + this.offSet.x,
          y: this.oldOrignPoint.y + this.offSet.y,
        };
      }

      //set image origin coordinate
      const originX = this.originPoint.x;
      const originY = this.originPoint.y;
      //clean last image
      canvasContext2D.clearRect(0, 0, Canvas.width, Canvas.height);

      //if image scale too small image won't be showed
      if (this.scale > 0.05)
        canvasContext2D.drawImage(img, originX, originY, w, h);
    };
  }
  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <canvas
          id={"canvas"}
          width={640}
          height={480}
          style={{
            border: "1px black solid",
            width: "70vw",
            maxWidth: "640px",
          }}
          onMouseDown={(e) => {
            this.oldPoint = { x: e.clientX, y: e.clientY };
            this.isDragging = true;
          }}
          onMouseMove={(e) => {
            if (this.isDragging) {
              const currentPoint = { x: e.clientX, y: e.clientY };
              const offSetX = currentPoint.x - this.oldPoint.x;
              const offSetY = currentPoint.y - this.oldPoint.y;
              this.offSet = { x: offSetX, y: offSetY };

              this.drawImageInCanvas("drag", this.imgSrc);
            }
          }}
          onMouseUp={(e) => {
            this.offSet = { x: 0, y: 0 };
            this.isDragging = false;
            this.oldOrignPoint = {
              x: this.originPoint.x,
              y: this.originPoint.y,
            };
          }}
        ></canvas>
        {!this.state.hasFile && (
          <input
            type="file"
            onChange={(e) => {
              const img = e.target.files[0];
              const imgUrl = window.URL.createObjectURL(img);
              this.imgSrc = imgUrl;
              this.setState({ hasFile: true });
              this.drawImageInCanvas("init", this.imgSrc);
            }}
          />
        )}
        {this.state.hasFile && (
          <div>
            <button
              onClick={() => {
                this.drawImageInCanvas("zoomIn", this.imgSrc);
              }}
            >
              Zoom In
            </button>
            <button
              onClick={() => {
                this.drawImageInCanvas("zoomOut", this.imgSrc);
              }}
            >
              Zoom Out
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default App;

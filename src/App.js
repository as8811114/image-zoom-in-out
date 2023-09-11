import { Component } from "react";

class App extends Component {
  constructor() {
    super();
    this.state = {
      originPoint: { x: 0, y: 0 },
      oldOrignPoint: { x: 0, y: 0 },
      oldPoint: { x: 0, y: 0 },
      offSet: { x: 0, y: 0 },
      hasFile: false,
      imgSrc: "",
      scale: 0,
      isDragging: false,
    };
  }
  drawImageInCanvas(type, imgUrl) {
    const Canvas = document.getElementById("canvas");
    const canvasContext2D = Canvas.getContext("2d");
    const img = new Image();
    img.src = imgUrl;

    //wait for image loading
    img.onload = () => {
      if (type === "init") {
        this.setState({
          scale:
            img.height >= img.width
              ? Canvas.height / img.height
              : Canvas.width / img.width,
        });
      } else if (type === "zoomIn")
        this.setState({ scale: this.state.scale * 1.1 });
      else if (type === "zoomOut")
        this.setState({ scale: this.state.scale * 0.9 });

      //set image height and width
      const h = img.height * this.state.scale;
      const w = img.width * this.state.scale;
      if (type === "init") {
        this.setState({
          originPoint: {
            x: Canvas.width / 2 - w / 2,
            y: Canvas.height / 2 - h / 2,
          },
          oldOrignPoint: {
            x: Canvas.width / 2 - w / 2,
            y: Canvas.height / 2 - h / 2,
          },
        });
      }
      //if image's bound is outside of canvas's bound then user can drag the image
      else if (
        type === "drag" &&
        (this.state.originPoint.x < 0 ||
          this.state.originPoint.y < 0 ||
          this.state.originPoint.x + w > Canvas.width ||
          w > this.state.originPoint.y + Canvas.width)
      ) {
        this.setState({
          originPoint: {
            x: this.state.oldOrignPoint.x + this.state.offSet.x,
            y: this.state.oldOrignPoint.y + this.state.offSet.y,
          },
        });
      }

      //set image origin coordinate
      const originX = this.state.originPoint.x;
      const originY = this.state.originPoint.y;
      //clean last image
      canvasContext2D.clearRect(0, 0, Canvas.width, Canvas.height);

      //if image scale too small image won't be showed
      if (this.state.scale > 0.05)
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
            this.setState({
              oldPoint: { x: e.clientX, y: e.clientY },
              isDragging: true,
            });
          }}
          onMouseMove={(e) => {
            if (this.state.isDragging) {
              const currentPoint = { x: e.clientX, y: e.clientY };
              const offSetX = currentPoint.x - this.state.oldPoint.x;
              const offSetY = currentPoint.y - this.state.oldPoint.y;
              this.setState({ offSet: { x: offSetX, y: offSetY } });
              this.drawImageInCanvas("drag", this.state.imgSrc);
            }
          }}
          onMouseUp={(e) => {
            this.setState({
              isDragging: false,
              offSet: { x: 0, y: 0 },
              oldOrignPoint: {
                x: this.state.originPoint.x,
                y: this.state.originPoint.y,
              },
            });
          }}
        ></canvas>
        {!this.state.hasFile && (
          <input
            type="file"
            onChange={(e) => {
              const img = e.target.files[0];
              const imgSrc = window.URL.createObjectURL(img);
              this.setState({ hasFile: true, imgSrc: imgSrc });
              this.drawImageInCanvas("init", imgSrc);
            }}
          />
        )}
        {this.state.hasFile && (
          <div>
            <button
              onClick={() => {
                this.drawImageInCanvas("zoomIn", this.state.imgSrc);
              }}
            >
              Zoom In
            </button>
            <button
              onClick={() => {
                this.drawImageInCanvas("zoomOut", this.state.imgSrc);
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

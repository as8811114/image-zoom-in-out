import { Component } from "react";

class App extends Component {
  constructor() {
    super();
    this.state = { hasFile: false, imgSrc: "", scale: 0 };
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
          scale: img.height >= img.width ? 480 / img.height : 640 / img.width,
        });
      } else if (type === "zoomIn")
        this.setState({ scale: this.state.scale * 1.1 });
      else if (type === "zoomOut")
        this.setState({ scale: this.state.scale * 0.9 });

      //set image height and width
      const h = img.height * this.state.scale;
      const w = img.width * this.state.scale;

      //set image origin coordinate
      const originX = Canvas.width / 2 - w / 2;
      const originY = Canvas.height / 2 - h / 2;

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
          style={{ border: "1px black solid" }}
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

/*  PLAN OVERVIEW

1. First click line button initiate length and and angle of rotation of angle according create a base line.
2. Now when the line forms drag and drop feature.
3. Screw option clicking give screw image.
4. Fixing the screw on a bar shows length from surrounding bars automatically.
5. Assistance bar on side to guide.
6. A ruler to measure the distance. 
7. When we place a node/screw it measures the distance from its most nearest node anoter way to measure the distace by giving the name of two screw and then it with show the distance.

8. After design confirmation. Force calculation.
9. according to force on rods giving color: Red, Yellow,Green.
10. Weighnt testing taking spagetti like substance for testing. We can also change materials strength.

*/
const toolname=["RULER","FIXED JOINT","MOVING JOINT","SCREWS","BARS"];
const toolimg=["./IMAGES/istockphoto-188151131-612x612.png","./IMAGES/Untitled21_20250620133135.png","./IMAGES/Untitled21_20250620133541.png","./IMAGES/pngtree-screw-cartoon-png-image_8955148.png","./IMAGES/Untitled21_20250620133135.png",];
const tools=document.querySelector(".tools");
for(let i=0;i<toolname.length;i++)
{
    const div=document.createElement("div");
    div.className="element";

    //Creating h1 tag for name.
    const h1=document.createElement("h1");
    h1.textContent=toolname[i];

    //Creating img tag for image
    const img=document.createElement("img");
    img.src=toolimg[i];
    img.className="toolimg";

    //appending h1 and img to div
    div.appendChild(h1);
    div.appendChild(img);

    //appending div to tools.
    tools.appendChild(div)

}

const canvas = document.getElementById("bridgeCanvas");
const ctx = canvas.getContext("2d");

let jointX = 50;
let jointY = 50;
const triSize = 24;
let isDragging = false;

// Draw triangle centered at (x, y)
function drawTriangle(x, y, size = triSize, color = "#000") {
  const height = size * Math.sqrt(3) / 2;

  ctx.beginPath();
  ctx.moveTo(x, y - height / 2);          // top
  ctx.lineTo(x - size / 2, y + height / 2); // bottom left
  ctx.lineTo(x + size / 2, y + height / 2); // bottom right
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.stroke();
}

// Clear and draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  drawTriangle(jointX, jointY);
}

// Resize canvas based on device pixel ratio
function resizeCanvasToDisplaySize() {
  const dpr = window.devicePixelRatio || 1;

  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
  ctx.scale(dpr, dpr); // scale all drawings

  // Recalculate initial joint position at bottom-left
  jointX = 5 + triSize / 2;
  jointY = canvas.clientHeight - 5 - triSize / 2;

  draw();
}

// Handle dragging
canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (
    x >= jointX - triSize / 2 && x <= jointX + triSize / 2 &&
    y >= jointY - triSize / 2 && y <= jointY + triSize / 2
  ) {
    isDragging = true;
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const rect = canvas.getBoundingClientRect();
    jointX = e.clientX - rect.left;
    jointY = e.clientY - rect.top;
    draw();
  }
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
});

window.addEventListener("resize", resizeCanvasToDisplaySize);
resizeCanvasToDisplaySize();

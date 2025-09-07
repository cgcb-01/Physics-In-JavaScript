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
let nodes = [];
let bars = [];
let forces = [];
let nodeCounter = 1;
let barCounter = 1;
let stateStack = [];

function startBridge() {
  addNode(150, 300, "pinned"); // default first node
}

// Clone current state
function cloneState() {
  return {
    nodes: JSON.parse(JSON.stringify(nodes)),
    bars: JSON.parse(JSON.stringify(bars)),
    forces: JSON.parse(JSON.stringify(forces)),
    nodeCounter,
    barCounter,
  };
}

function saveState() {
  stateStack.push(cloneState());
}

function goBack() {
  if (stateStack.length === 0) {
    alert("No previous state!");
    return;
  }
  const prevState = stateStack.pop();
  nodes = prevState.nodes;
  bars = prevState.bars;
  forces = prevState.forces;
  nodeCounter = prevState.nodeCounter;
  barCounter = prevState.barCounter;

  // Clear bridge
  const bridge = document.getElementById("bridge");
  bridge.innerHTML = "";

  // Re-render nodes
  nodes.forEach((n) => {
    let nodeDiv = document.createElement("div");
    nodeDiv.id = "node-" + n.id;
    nodeDiv.className = "node";
    nodeDiv.style.left = n.x - 7 + "px";
    nodeDiv.style.top = n.y - 7 + "px";
    nodeDiv.onclick = () => openNodeForm(n.id);
    bridge.appendChild(nodeDiv);

    let label = document.createElement("div");
    label.innerText = "N" + n.id;
    label.className = "label";
    label.style.left = n.x + 12 + "px";
    label.style.top = n.y - 8 + "px";
    bridge.appendChild(label);
  });

  // Re-render bars
  bars.forEach((b) => {
    let startNode = nodes.find((n) => n.id === b.startNode);
    let barDiv = document.createElement("div");
    barDiv.id = "bar-" + b.id;
    barDiv.className = "bar";
    barDiv.style.left = startNode.x + "px";
    barDiv.style.top = startNode.y + "px";
    barDiv.style.width = b.length + "px";
    barDiv.style.transform = "rotate(" + -b.angle + "deg)";
    bridge.appendChild(barDiv);
  });

  updateDetails();
}

// Add node
function addNode(x, y, jointType = "free") {
  let nodeId = nodeCounter++;
  nodes.push({
    id: nodeId,
    x,
    y,
    jointType,
    force: { fx: 0, fy: 0 },
  });

  const bridge = document.getElementById("bridge");

  let nodeDiv = document.createElement("div");
  nodeDiv.id = "node-" + nodeId;
  nodeDiv.className = "node";
  nodeDiv.style.left = x - 7 + "px";
  nodeDiv.style.top = y - 7 + "px";
  nodeDiv.onclick = () => openNodeForm(nodeId);
  bridge.appendChild(nodeDiv);

  let label = document.createElement("div");
  label.innerText = "N" + nodeId;
  label.className = "label";
  label.style.left = x + 12 + "px";
  label.style.top = y - 8 + "px";
  bridge.appendChild(label);

  updateDetails();
  return nodeId;
}

// Add bar
function addBar(startNodeId, length, angleDeg) {
  saveState();
  let startNode = nodes.find((n) => n.id === startNodeId);
  let angleRad = (angleDeg * Math.PI) / 180;

  let endX = startNode.x + length * Math.cos(angleRad);
  let endY = startNode.y - length * Math.sin(angleRad);

  let endNodeId = addNode(endX, endY);

  bars.push({
    id: barCounter,
    startNode: startNodeId,
    endNode: endNodeId,
    length,
    angle: angleDeg,
  });

  const bridge = document.getElementById("bridge");
  let barDiv = document.createElement("div");
  barDiv.id = "bar-" + barCounter;
  barDiv.className = "bar";
  barDiv.style.left = startNode.x + "px";
  barDiv.style.top = startNode.y + "px";
  barDiv.style.width = length + "px";
  barDiv.style.transform = "rotate(" + -angleDeg + "deg)";
  bridge.appendChild(barDiv);

  barCounter++;
  updateDetails();
  return endNodeId;
}

// Node form
function openNodeForm(nodeId) {
  let node = nodes.find((n) => n.id === nodeId);
  const formContainer = document.getElementById("formContainer");
  formContainer.innerHTML = `
        <h3>Edit Node ${nodeId}</h3>
        <label>Joint Type:
          <select id="jointType">
            <option ${node.jointType === "free" ? "selected" : ""}>free</option>
            <option ${
              node.jointType === "pinned" ? "selected" : ""
            }>pinned</option>
            <option ${
              node.jointType === "roller" ? "selected" : ""
            }>roller</option>
            <option ${
              node.jointType === "fixed" ? "selected" : ""
            }>fixed</option>
          </select>
        </label>
        <label>Force Fx: <input id="fx" type="number" value="${
          node.force.fx
        }"></label>
        <label>Force Fy: <input id="fy" type="number" value="${
          node.force.fy
        }"></label>
        <button onclick="saveNode(${nodeId})">Save</button>
        <button onclick="addNewBar(${nodeId})">Add Bar</button>
      `;
}

function saveNode(nodeId) {
  saveState();
  let node = nodes.find((n) => n.id === nodeId);
  node.jointType = document.getElementById("jointType").value;
  node.force.fx = parseFloat(document.getElementById("fx").value);
  node.force.fy = parseFloat(document.getElementById("fy").value);

  let existing = forces.find((f) => f.nodeId === nodeId);
  if (existing) {
    existing.fx = node.force.fx;
    existing.fy = node.force.fy;
  } else {
    forces.push({
      nodeId: nodeId,
      fx: node.force.fx,
      fy: node.force.fy,
    });
  }

  updateDetails();
  alert("Node " + nodeId + " updated!");
}

function addNewBar(startNodeId) {
  let length = parseFloat(prompt("Enter bar length (px):"));
  let angle = parseFloat(prompt("Enter bar angle (deg):"));
  addBar(startNodeId, length, angle);
}

// Update sidebar details
function updateDetails() {
  let nodeDetails = document.getElementById("nodeDetails");
  let barDetails = document.getElementById("barDetails");

  nodeDetails.innerHTML = "<strong>Nodes:</strong>";
  nodes.forEach((n) => {
    nodeDetails.innerHTML += `
          <div class="detail-item">N${n.id} (${n.jointType}) Fx=${n.force.fx}, Fy=${n.force.fy}</div>
        `;
  });

  barDetails.innerHTML = "<strong>Bars:</strong>";
  bars.forEach((b) => {
    barDetails.innerHTML += `
          <div class="detail-item">B${b.id}: N${b.startNode}→N${b.endNode}, L=${b.length}, θ=${b.angle}°</div>
        `;
  });
}

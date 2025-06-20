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
const toolname=["RULER","FIXED JOINT","MOVING JOINT","BARS","SCREWS"];
const toolimg=["","","","","",""];
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


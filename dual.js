const arrowpadding = 70;

/**
 * Shuffle the elements of an array randomly.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} - The shuffled array.
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Draw a circle on a canvas with a given radius and center coordinates.
 * @param {HTMLCanvasElement} canvas - The canvas element to draw on.
 * @param {number} radius - The radius of the circle.
 * @param {number} centerX - The x-coordinate of the center of the circle.
 * @param {number} centerY - The y-coordinate of the center of the circle.
 */
function drawCircle(canvas, radius, centerX, centerY) {
  const context = canvas.getContext("2d");
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  context.stroke();
  context.fill();
}

/**
 * Draw a straight line on a canvas between two given points.
 * @param {HTMLDivElement} canvas - The canvas element to draw on.
 * @param {number} startX - The x-coordinate of the starting point of the line.
 * @param {number} startY - The y-coordinate of the starting point of the line.
 * @param {number} endX - The x-coordinate of the ending point of the line.
 * @param {number} endY - The y-coordinate of the ending point of the line.
 */
function drawLine(canvas, startX, startY, endX, endY, color = "black") {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.style.position = "absolute";
  svg.style.top = "50px";
  svg.style.left = "50px";

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", startX);
  line.setAttribute("y1", startY);
  line.setAttribute("x2", endX);
  line.setAttribute("y2", endY);
  line.setAttribute("stroke", color);

  svg.style.zIndex = -1;

  svg.appendChild(line);
  canvas.appendChild(svg);
}

/**
 * Write text on a canvas, centering the text on the given coordinates.
 * @param {HTMLCanvasElement} canvas - The canvas element to write on.
 * @param {string} text - The text to write.
 * @param {number} x - The x-coordinate of the center of the text.
 * @param {number} y - The y-coordinate of the center of the text.
 */
function writeText(canvas, text, x, y) {
  const context = canvas.getContext("2d");
  context.font = "24px Arial";
  const textWidth = context.measureText(text).width;
  const textHeight = 12; // Assuming font size of 12px
  const textX = x - textWidth / 2;
  const textY = y + textHeight / 2;
  context.fillText(text, textX, textY);
}

/**
 * Draw an arrow on a canvas between two given points with padding.
 * @param {HTMLDivElement} canvas - The canvas element to draw on.
 * @param {number} startX - The x-coordinate of the starting point of the arrow.
 * @param {number} startY - The y-coordinate of the starting point of the arrow.
 * @param {number} endX - The x-coordinate of the ending point of the arrow.
 * @param {number} endY - The y-coordinate of the ending point of the arrow.
 * @param {number} padding - The padding value for the arrow.
 */
function drawArrow(
  canvas,
  startX,
  startY,
  endX,
  endY,
  cb,
  padding = 70,
  color = "blue"
) {
  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
  const arrow = document.createElement("div");
  arrow.classList.add("complex-arrow");
  arrow.style.transform = `rotate(${angle + 90}deg)`;

  const shiftX =
    ((endX - startX) * padding) /
    Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
  const shiftY =
    ((endY - startY) * padding) /
    Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);

  arrow.style.top = `${startY + 50 - 50 / 2 + shiftY}px`;
  arrow.style.left = `${startX + 50 - 15 / 2 + shiftX}px`;

  arrow.style.setProperty("--arrow-color", color);
  setTimeout;
  if (cb != undefined) {
    cb(arrow);
  }

  canvas.appendChild(arrow);
}

class Coords {
  /**
   *
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static minx = 0;
  static maxx = null;
  static miny = 0;
  static maxy = 100;

  static normalize() {
    let xs = Router.allRouters.map((x) => x.coords.x);
    let ys = Router.allRouters.map((x) => x.coords.y);
    console.log(xs);
    // Find the minimum and maximum values for xs and ys
    let minX = Math.min(...xs);
    let maxX = Math.max(...xs);
    let minY = Math.min(...ys);
    let maxY = Math.max(...ys);

    // Set the minimum and maximum values to the related static variables
    Coords.minx = minX;
    Coords.maxx = maxX;
    Coords.miny = minY;
    Coords.maxy = maxY;
  }

  static routerScaleFactor = 200;
  static routerPadding = 0;

  translate() {
    if (Coords.maxx === null) Coords.normalize();
    console.log("COORDS", Coords.minx);
    return new Coords(
      Coords.routerPadding + (this.x - Coords.minx) * Coords.routerScaleFactor,
      Coords.routerPadding + (this.y - Coords.miny) * Coords.routerScaleFactor
    );
  }
}

class Link {
  static count = 0;
  /**
   * @type {Link[]}
   */
  static allLinks = [];
  /**
   *
   * @param {Router} a
   * @param {Router} b
   * @param {number} cost
   */
  constructor(a, b, cost) {
    this.a = a;
    this.b = b;
    this.cost = cost;
    this.id = Link.count;
    Link.count++;
    Link.allLinks.push(this);
  }
  /**
   *
   * @param {Router} x
   * @returns {Router}
   */
  getOther(x) {
    return this.a.id == x.id ? this.b : this.a;
  }

  static setupLinks() {
    Link.allLinks.forEach((x) => {
      x.a.addLink(x);
      x.b.addLink(x);
    });
  }

  drawLink(canvas) {
    let t = [this.a.coords.translate(), this.b.coords.translate()];
    drawLine(canvas, t[0].x, t[0].y, t[1].x, t[1].y, "blue");
    // canvas.getContext("2d").strokeStyle = "black";
    let center = [(t[0].x + t[1].x) / 2, (t[0].y + t[1].y) / 2];
    let cnt = document.createElement("div");
    cnt.className = "scircle";
    cnt.style.left = `${center[0] + 50 - 15}px`;
    cnt.style.top = `${center[1] + 50 - 15}px`;

    let inn = document.createElement("div");
    inn.className = "textbox";
    inn.innerHTML = `
    Link from ${this.a.id} - ${this.b.id} <br>
    Cost: ${this.cost}<br>
    `;
    cnt.innerHTML = `${this.cost}`;
    cnt.appendChild(inn);

    canvas.appendChild(cnt);

    // writeText(canvas, this.cost, center[0] + 10, center[1] + 10);
  }

  static drawAllLinks(canvas) {
    Link.allLinks.forEach((x) => x.drawLink(canvas));
  }

  removeSelf() {
    Link.allLinks = Link.allLinks.filter((link) => link.id !== this.id);
    this.a.links = this.a.links.filter((link) => link.id !== this.id);
    this.b.links = this.b.links.filter((link) => link.id !== this.id);

    this.a.routingTable.delete(this.b);
    this.b.routingTable.delete(this.a);

    this.a.firstReply = undefined;
    this.b.firstReply = undefined;
    this.a.logs.push(`link to ${this.b.id} disappeared`);
    this.b.logs.push(`link to ${this.a.id} disappeared`);
    this.a.runChecks();
    this.b.runChecks();
  }
  updateSelf(nc) {
    this.cost = nc;
    this.a.firstReply = undefined;
    this.b.firstReply = undefined;
    this.a.logs.push(`link cost to ${this.b.id} changed to ${nc}`);
    this.b.logs.push(`link cost to ${this.a.id} changed to ${nc}`);
    this.a.runChecks();
    this.b.runChecks();
  }
}

class DistanceState {
  /**
   *
   * @param {number} dist
   * @param {number} fd
   * @param {Router} next
   */
  constructor(dist, fd, next) {
    this.dist = dist;
    this.fd = fd;
    this.next = next;
  }

  /**
   *
   * @returns {string}
   */
  toString() {
    return `${this.dist != Infinity ? this.dist : "inf"}, ${
      this.fd != Infinity ? this.fd : "inf"
    }, ${this.next != null ? this.next.id : "--"}`;
  }
  /**
   *
   * @param {DistanceState} x
   * @returns {boolean}
   */
  equals(x) {
    // console.log(this, x);
    return x.dist == this.dist && x.fd == this.fd && this.next == x.next;
  }
}

class Router {
  /**
   * @type {Router[]}
   */
  static allRouters = [];

  /**
   * @type {Router}
   */
  static distanceRouter = null;

  static draw = false;

  static nextStep = [];

  static stepCount = 0;

  static doStep() {
    let temp = [...Router.nextStep];
    Router.nextStep = [];
    this.newDrawing(temp.map((x) => x[0]));
    // temp = shuffle(temp);
    for (let cb of temp) {
      let action_cb = cb[1];
      action_cb();
    }
    this.newDrawing([]);
    Router.stepCount++;
    if (Router.nextStep.length > 0 && Router.stepCount < 100) Router.doStep();
  }

  /**
   *
   * @param {string} id
   * @param {Coords} coords
   */
  constructor(id, coords) {
    this.id = id;
    /**
     * @type {Array<Link>}
     */
    this.links = [];
    /**
     * @type {Map<Router,number>}
     */
    this.routingTable = new Map();
    this.coords = coords;
    /**
     * STATES:
     * PASSIVE 0
     * ACTIVE0 1
     * ACTIVE1 2
     * ACTIVE2 3
     * ACTIVE3 4
     */
    this.state = 0;
    /**
     * @type {Map<Router,number>}
     */
    this.queryStatus = new Map();

    this.distance = new DistanceState(Infinity, Infinity, null);

    this.ignoreall = false;
    this.firstReply = null;

    this.logs = [];

    /**
     * not used
     * @type {Router[]}
     */
    this.sendLater = [];

    Router.allRouters.push(this);
  }

  /**
   *
   * @param {Link} x
   */
  addLink(x) {
    if (x.a.id != this.id && x.b.id != this.id) {
      console.error("Appending wrong link to wrong router!", x, this);
    }
    this.links.push(x);
  }

  initRoutingTable() {
    this.links.forEach((x) => {
      this.routingTable.set(x.getOther(this), Infinity);
    });
  }

  static initRoutingTableAll() {
    Router.allRouters.forEach((x) => {
      x.initRoutingTable();
    });
  }

  /**
   *
   * @returns {Router[]}
   */
  getNeighbors() {
    let ret = [];
    this.links
      .filter((x) => x.cost != Infinity)
      .forEach((x) => {
        ret.push(x.getOther(this));
      });
    return ret;
  }

  drawSelf(canvas, logdiv = undefined) {
    let t = this.coords.translate();
    let radius = 60;
    let color = this.state == 0 ? "green" : "red";
    let circle = document.createElement("div");
    circle.className = "circle";
    circle.style.backgroundColor = color;
    circle.style.top = t.y + "px";
    circle.style.left = t.x + "px";

    let p1 = document.createElement("p");
    p1.innerText = this.id;
    let p2 = document.createElement("p");
    p2.innerText = this.distance.toString();
    circle.appendChild(p1);
    circle.appendChild(p2);

    let tb = document.createElement("div");
    tb.className = "textbox";
    circle.appendChild(tb);

    tb.innerHTML = `
    Router: ${this.id}<br>
    Routing Table: <br>
    `;
    this.routingTable.forEach((v, k) => (tb.innerHTML += `${k.id}: ${v}<br>`));
    tb.innerHTML += `Distance:${this.distance.toString()} <br>
    State: ${this.state} <br>
    Received Responses (if in query mode): <br>
    `;
    this.queryStatus.forEach((v, k) => (tb.innerHTML += `${k.id}<br>`));

    canvas.appendChild(circle);

    if (logdiv !== undefined && this.logs.length > 0) {
      let ul = document.createElement("ul");
      logdiv.appendChild(ul);
      let head = document.createElement("h4");
      head.innerText = `${this.id}:`;
      ul.appendChild(head);
      this.logs.forEach((entry) => {
        let li = document.createElement("li");
        li.innerText = entry;
        ul.appendChild(li);
      });
      // logdiv.appendChild(document.createElement("br"));
    }
    this.logs = [];
    return;
  }

  static drawAll(canvas, logdiv = undefined) {
    Router.allRouters.forEach((x) => x.drawSelf(canvas, logdiv));
  }

  static newCanvas() {
    let canv = document.createElement("div");
    canv.className = "inner";
    const w = Coords.maxx * Coords.routerScaleFactor + 100 + 8;
    const h = Coords.maxy * Coords.routerScaleFactor + 100 + 8;

    // Set the width and height of the canv element
    canv.style.width = w + "px";
    canv.style.height = h + "px";

    return canv;
  }

  static newDrawing(callbacks) {
    if (Router.draw == false) return;
    let canvas = Router.newCanvas();
    let logdiv = document.createElement("div");
    logdiv.className = "logdiv";

    Link.drawAllLinks(canvas);
    Router.drawAll(canvas, logdiv);
    // filter callbacks with monke logic
    // group by senders
    /**
     * @type {Map<Router, Map<Router,Array>>>}
     */
    let senders = new Map();
    // x: fnc, self, target, type
    callbacks.forEach((x) => {
      if (!senders.has(x[1])) senders.set(x[1], new Map());
      let slf = senders.get(x[1]);
      if (!slf.has(x[2])) slf.set(x[2], null);
      let targ = slf.get(x[2]);
      if (targ == null) {
        slf.set(x[2], [x[0], x[3]]);
      } else {
        if (targ[1] < x[3]) {
          slf.set(x[2], [x[0], x[3]]);
        }
      }
    });
    let temp = [];
    senders.forEach((v, k) => {
      v.forEach((v2, k2) => {
        temp.push(v2[0]);
      });
    });

    for (let cb of temp) {
      cb(canvas);
    }

    let sc = document.createElement("div");
    sc.className = "scrollable";
    sc.appendChild(canvas);

    let comb = document.createElement("div");
    comb.className = "combouter";
    comb.appendChild(sc);
    comb.appendChild(logdiv);

    document.body.appendChild(comb);
  }

  sendUpdates() {
    this.logs.push(`send U=${this.distance.dist} to neighbours`);
    this.getNeighbors().forEach((x) => {
      Router.nextStep.push([
        [
          (canvas) => {
            // todo check x state
            let t = this.coords.translate();
            // check state cheat ?? (filter above)
            let t2 = x.coords.translate();
            drawArrow(
              canvas,
              t.x,
              t.y,
              t2.x,
              t2.y,
              (x) => {
                let d =
                  this.distance.dist == Infinity ? "∞" : this.distance.dist;
                x.innerText = `U: ${d}`;
              },
              arrowpadding,
              "Coral"
            );
            // writeText(
            //   canvas,
            //   `U: ${this.distance.dist}`,
            //   (t.x + t2.x) / 2,
            //   (t.y + t2.y) / 2
            // );
          },
          this,
          x,
          0,
        ],
        () => x.getUpdate(this, this.distance.dist),
      ]);
    });
  }

  logRoutingTable() {
    this.logs.push("Routing table:");
    this.routingTable.forEach((v, k) => {
      this.logs.push(`${k.id}: ${v}`);
    });
  }

  runChecks(ns = 2) {
    if (this.ignoreall) return;
    if (this.state != 0) {
      console.error("STATE IS NOT 0, SHOULD NOT RUN CHECKS!", this);
      return;
    }
    this.logs.push("check FD satisfied");
    this.logs.push(`Distance: ${this.distance.toString()}`);
    this.logRoutingTable();

    // get minimum
    let min_dist = Infinity;
    let min_nh = null;
    let min_dist_fd = Infinity;
    for (let entry of this.routingTable.entries()) {
      let link = this.links.filter(
        (x) => x.getOther(this).id == entry[0].id
      )[0];

      if (entry[1] + link.cost < min_dist) {
        min_dist = entry[1] + link.cost;
        min_nh = entry[0];
        min_dist_fd = entry[1];
      }
    }
    if (min_dist == Infinity) {
      if (this.distance.fd == Infinity) {
        if (this.distance.dist != Infinity || this.distance.next != null) {
          this.distance.next = null;
          this.distance.dist = Infinity;
          this.logs.push("fd satisfied");
          this.sendUpdates();
        }
      } else {
        // an update turned us to diffusion computations
        this.logs.push("fd not satisfied");
        this.state = ns;
        this.startDiffuse();
        return;
      }
    } else {
      if (min_dist_fd >= this.distance.fd) {
        // start diffusing computation
        this.logs.push("fd not satisfied");
        this.state = ns;
        this.startDiffuse();
        return;
      } else {
        let newDistance = new DistanceState(
          min_dist,
          Math.min(this.distance.fd, min_dist),
          min_nh
        );
        let same = this.distance.equals(newDistance);
        if (!same) {
          this.distance = newDistance;
          this.logs.push("fd satisfied");
          this.sendUpdates();
        }
      }
    }
  }

  startDiffuse() {
    this.logs.push("start diffusing computations");
    this.distance.fd = Infinity;
    this.distance.dist = Infinity;
    // check if default next hop still exists
    if (this.distance.next != null) {
      if (
        this.routingTable.has(this.distance.next) &&
        this.routingTable.get(this.distance.next) != Infinity
      ) {
        this.distance.dist =
          this.routingTable.get(this.distance.next) +
          this.links.filter((x) => x.getOther(this) == this.distance.next)[0]
            .cost;
      }
      if (this.distance.dist == Infinity) {
        if (
          this.links.filter((x) => x.getOther(this) == this.distance.next)
            .length == 0
        ) {
          this.distance.next = null;
        }
      }
    }

    // set query state
    this.queryStatus = new Map();
    this.logs.push(`send Q=${this.distance.dist} to neighbours`);
    for (let n of this.getNeighbors()) {
      this.sendQuery(n);
    }
  }

  /**
   *
   * @param {Router} target
   */
  sendQuery(target) {
    Router.nextStep.push([
      [
        (canvas) => {
          let t = this.coords.translate();
          let t2 = target.coords.translate();
          drawArrow(
            canvas,
            t.x,
            t.y,
            t2.x,
            t2.y,
            (x) => {
              let d = this.distance.dist == Infinity ? "∞" : this.distance.dist;
              x.innerText = `Q: ${d}`;
            },
            arrowpadding,
            "crimson"
          );
          // writeText(
          //   canvas,
          //   `Q: ${this.distance.dist}`,
          //   (t.x + t2.x) / 2,
          //   (t.y + t2.y) / 2
          // );
        },
        this,
        target,
        1,
      ],
      () => target.processQuery(this, this.distance.dist),
    ]);
  }

  /**
   *
   * @param {Router} x
   * @param {number} dist
   */
  getUpdate(x, dist) {
    this.logs.push(`got U=${dist} from ${x.id}`);
    this.routingTable.set(x, dist);
    if (this.state == 0) {
      // at state 0 run checks
      this.runChecks();
    } else {
      if (this.queryStatus.has(x)) {
        this.queryStatus.set(x, dist);
      }
    }
  }

  minFrom() {
    let links = this.links.map((x) => [
      x.getOther(this),
      x.getOther(this).distance,
      x.cost,
    ]);
    let red = links.reduce((p, c, u1, u2) => {
      if (p[1] + p[2] < c[1] + c[2]) return p;
      return c;
    });
    return red;
  }

  /**
   *
   * @param {Router} from
   * @param {number} dist
   */
  processQuery(from, dist) {
    this.logs.push(`got Q=${dist} from ${from.id}`);
    this.routingTable.set(from, dist);
    switch (this.state) {
      case 0:
        {
          if (this.distance.next == from) {
            this.distance.dist = dist;
            this.distance.fd = Infinity;
            this.logs.push("Query is from successor");
            this.state = 4;
            this.startDiffuse();
          } else {
            this.logs.push("q not from successor");
            let min = this.minFrom();
            if (min[1] >= this.distance.fd) {
              // feasable distance not satisfied!
              this.logRoutingTable();
              this.logs.push("fd not satisfied");
              this.state = 2;
              this.startDiffuse();
            }
            this.sendReply(from);
          }
        }
        break;
      case 1:
        {
          if (this.queryStatus.has(from)) this.queryStatus.set(from, dist);
          if (this.distance.next == from) {
            this.distance.dist =
              this.links.filter((x) => x.getOther(this) == from)[0].cost + dist;
            this.state = 3;
            this.logs.push(
              `q from successor, update distance to ${this.distance.dist}`
            );
          } else {
            this.logs.push("q not from successor");
            this.sendReply(from);
          }
        }
        break;
      case 2:
        {
          if (this.distance.next == from) {
            this.distance.dist =
              this.links.filter((x) => x.getOther(this) == from)[0].cost + dist;
            this.state = 3;
            this.logs.push(
              `q from successor, update distance to ${this.distance.dist}`
            );
          } else {
            // what does distance increases mean??
            this.logs.push("q not from successor");
            this.sendReply(from);
          }
        }
        break;
      case 3:
      case 4:
        {
          this.sendReply(from);
        }
        break;
    }
  }

  processReply(from, dist) {
    if (this.state == 0) {
      console.error("STATE 0 STILL RECEIVED REPL; IGNORE", this);
      return;
    }
    this.logs.push(`got R=${dist} from ${from.id}`);
    this.queryStatus.set(from, dist);
    this.checkStateDone();
  }

  checkStateDone() {
    let nbs = this.getNeighbors();
    let flag = true;
    for (let n of nbs) {
      if (!this.queryStatus.has(n)) {
        flag = false;
        break;
      }
    }
    if (!flag) {
      let needs = nbs.filter((x) => !this.queryStatus.has(x)).map(x => x.id);
      this.logs.push(`still waiting replies from ${needs.toString()}`);
      return;
    }
    this.state = 0;
    this.routingTable = this.queryStatus;
    this.queryStatus = new Map();
    // send awaiting replies
    // this.sendLater.forEach((x) => this.sendReply(x));
    // this.sendLater = [];
    let tolater = this.distance.next;
    this.logs.push("Got all replies needed, stop diffusing computation");
    this.runChecks();
    this.logs.push(`send reply to previous succssor`);
    if (tolater != null) this.sendReply(tolater);
  }

  sendReply(target) {
    this.logs.push(`send R=${this.distance.dist} to ${target.id}`);
    Router.nextStep.push([
      [
        (canvas) => {
          let t = this.coords.translate();
          let t2 = target.coords.translate();
          drawArrow(
            canvas,
            t.x,
            t.y,
            t2.x,
            t2.y,
            (x) => {
              let d = this.distance.dist == Infinity ? "∞" : this.distance.dist;
              x.innerText = `R: ${d}`;
            },
            arrowpadding,
            "ForestGreen"
          );
          // writeText(
          //   canvas,
          //   `R: ${this.distance.dist}`,
          //   (t.x + t2.x) / 2,
          //   (t.y + t2.y) / 2
          // );
        },
        this,
        target,
        2,
      ],
      () => target.processReply(this, this.distance.dist),
    ]);
  }
}

function simpleDraw() {
  Router.allRouters[0].coords.translate();
  let canvas = Router.newCanvas();
  Link.drawAllLinks(canvas);
  Router.drawAll(canvas);
  let wr = document.createElement("div");
  wr.className = "scrollable";
  wr.appendChild(canvas);
  let co = document.createElement("div");
  co.className = "combouter";
  co.appendChild(wr);
  document.body.appendChild(co);
}

//**********************************TEST ***************************************/

function example() {
  const canvas = Router.newCanvas();

  let a = new Router("a", new Coords(0, 0));
  let b = new Router("b", new Coords(1, 0));
  let c = new Router("c", new Coords(2, 0));
  let u = new Router("u", new Coords(0, 2));
  let v = new Router("v", new Coords(1, 2));
  let w = new Router("w", new Coords(2, 2));
  let d = new Router("d", new Coords(3, 1));

  new Link(a, b, 1);
  new Link(b, c, 1);
  new Link(b, v, 1);
  new Link(c, d, 10);
  new Link(a, u, 1);
  new Link(u, v, 1);
  new Link(v, w, 1);
  new Link(w, d, 10);

  Link.setupLinks();
  Router.initRoutingTableAll();

  Link.drawAllLinks(canvas);
  Router.drawAll(canvas);
  document.body.appendChild(canvas);

  d.distance = new DistanceState(0, 0, d);
  d.ignoreall = true;
  Router.draw = false;
  d.sendUpdates();
  Router.doStep();

  Link.drawAllLinks(canvas);
  Router.drawAll(canvas);
  document.body.appendChild(canvas);

  Router.draw = true;
  // d.links.filter((x) => x.getOther(d) == c)[0].updateSelf(8);
  // d.links.filter((x) => x.getOther(d) == w)[0].updateSelf(4);
  let n = new Link(a, d, 1);
  a.links.push(n);
  a.routingTable.set(d, 0);
  a.runChecks();
  Router.doStep();

  n.removeSelf();
  Router.doStep();

  //
  //   Link.drawAllLinks(canvas);
  //   Router.drawAll(canvas);
}

function example2() {
  const canvas = Router.newCanvas();
  let a = new Router("a", new Coords(0, 0));
  let b = new Router("b", new Coords(0, 2));
  let c = new Router("c", new Coords(1, 0));
  let d = new Router("d", new Coords(1, 2));
  let j = new Router("j", new Coords(3, 1));

  new Link(a, b, 1);
  new Link(b, d, 1);
  new Link(d, c, 1);
  new Link(c, a, 10);
  new Link(c, j, 2);

  Link.setupLinks();
  Router.initRoutingTableAll();

  Link.drawAllLinks(canvas);
  Router.drawAll(canvas);
  document.body.appendChild(canvas);

  j.distance = new DistanceState(0, 0, j);
  j.ignoreall = true;
  Router.draw = false;
  j.sendUpdates();
  Router.doStep();

  Link.drawAllLinks(canvas);
  Router.drawAll(canvas);
  document.body.appendChild(canvas);

  Router.draw = true;
  j.links.filter((x) => x.getOther(j) == c)[0].updateSelf(20);
  Router.doStep();
  //
  //   Link.drawAllLinks(canvas);
  //   Router.drawAll(canvas);
}

function example3() {
  const canvas = Router.newCanvas();
  let a = new Router("a", new Coords(0, 1));
  let b = new Router("b", new Coords(0, 0));
  let c = new Router("c", new Coords(1, 0));
  let d = new Router("d", new Coords(2, 1));
  let e = new Router("e", new Coords(1, 1));

  new Link(a, b, 1);
  new Link(a, e, 1);
  new Link(b, c, 1);
  new Link(c, d, 3);
  new Link(c, e, 10);
  new Link(e, d, 1);

  Link.setupLinks();
  Router.initRoutingTableAll();

  Link.drawAllLinks(canvas);
  Router.drawAll(canvas);
  document.body.appendChild(canvas);

  d.distance = new DistanceState(0, 0, d);
  d.ignoreall = true;
  Router.draw = false;
  d.sendUpdates();
  Router.doStep();

  Link.drawAllLinks(canvas);
  Router.drawAll(canvas);
  document.body.appendChild(canvas);

  Router.draw = true;
  d.links.filter((x) => x.getOther(d) == c)[0].removeSelf();
  Router.doStep();

  //
  //   Link.drawAllLinks(canvas);
  //   Router.drawAll(canvas);
}

function example4() {
  const canvas = Router.newCanvas();
  let a = new Router("a", new Coords(1, 0));
  let b = new Router("b", new Coords(1, 1));
  let c = new Router("c", new Coords(2, 0));
  let d = new Router("d", new Coords(2, 1));
  let j = new Router("j", new Coords(3, 0.5));
  let s = new Router("s", new Coords(0, 0.5));

  new Link(s, a, 1);
  new Link(s, b, 5);
  new Link(a, b, 3);
  new Link(a, c, 3);
  new Link(b, c, 20);
  new Link(b, d, 2);
  new Link(c, d, 2);
  new Link(c, j, 2);
  new Link(d, j, 1);

  Link.setupLinks();
  Router.initRoutingTableAll();

  Link.drawAllLinks(canvas);
  Router.drawAll(canvas);
  document.body.appendChild(canvas);

  j.distance = new DistanceState(0, 0, j);
  j.ignoreall = true;
  Router.draw = false;
  j.sendUpdates();
  Router.doStep();

  Link.drawAllLinks(canvas);
  Router.drawAll(canvas);
  document.body.appendChild(canvas);

  Router.draw = true;
  j.links.filter((x) => x.getOther(j) == c)[0].removeSelf();
  j.links.filter((x) => x.getOther(j) == d)[0].removeSelf();
  Router.doStep();
  //
  //   Link.drawAllLinks(canvas);
  //   Router.drawAll(canvas);
}

function example6() {
  let a = new Router("a", new Coords(0, 0));
  let b = new Router("b", new Coords(0, 2));
  let c = new Router("c", new Coords(1, 0));
  let d = new Router("d", new Coords(1, 2));
  let e = new Router("e", new Coords(2, 1));
  let f = new Router("f", new Coords(3, 0));
  let g = new Router("g", new Coords(3, 2));
  let h = new Router("h", new Coords(4, 0));
  let i = new Router("i", new Coords(4, 2));
  let j = new Router("j", new Coords(5, 1));

  new Link(a, b, 1);
  new Link(b, d, 1);
  new Link(d, c, 1);
  new Link(c, a, 10);
  new Link(c, j, 2);
  new Link(j, e, 3);
  new Link(e, f, 2);
  new Link(f, g, 1);
  new Link(g, h, 1);
  new Link(h, i, 2);
  new Link(i, j, 1);
  new Link(d, g, 3);

  Link.setupLinks();
  Router.initRoutingTableAll();

  simpleDraw();

  j.distance = new DistanceState(0, 0, j);
  j.ignoreall = true;
  Router.draw = false;
  j.sendUpdates();
  Router.doStep();

  simpleDraw();

  Router.draw = true;
  j.links.filter((x) => x.getOther(j) == c)[0].updateSelf(20); // or removeSelf() to remove link
  Router.doStep();

  j.links.filter((x) => x.getOther(j) == i)[0].removeSelf(); // or removeSelf() to remove link
  Router.doStep();

  j.links.filter((x) => x.getOther(j) == e)[0].removeSelf(); // or removeSelf() to remove link
  Router.doStep();

  j.links.filter((x) => x.getOther(j) == c)[0].removeSelf(); // or removeSelf() to remove link
  Router.doStep();
}

const arrowpadding = 30;

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
 * @param {HTMLCanvasElement} canvas - The canvas element to draw on.
 * @param {number} startX - The x-coordinate of the starting point of the line.
 * @param {number} startY - The y-coordinate of the starting point of the line.
 * @param {number} endX - The x-coordinate of the ending point of the line.
 * @param {number} endY - The y-coordinate of the ending point of the line.
 */
function drawLine(canvas, startX, startY, endX, endY) {
  const context = canvas.getContext("2d");
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.stroke();
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
 * @param {HTMLCanvasElement} canvas - The canvas element to draw on.
 * @param {number} startX - The x-coordinate of the starting point of the arrow.
 * @param {number} startY - The y-coordinate of the starting point of the arrow.
 * @param {number} endX - The x-coordinate of the ending point of the arrow.
 * @param {number} endY - The y-coordinate of the ending point of the arrow.
 * @param {number} padding - The padding value for the arrow.
 */
function drawArrow(canvas, startX, startY, endX, endY, padding) {
  const context = canvas.getContext("2d");

  // Calculate the angle and length of the arrow
  const angle = Math.atan2(endY - startY, endX - startX);
  const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);

  // Calculate the padded start and end points
  const paddedStartX = startX + padding * Math.cos(angle);
  const paddedStartY = startY + padding * Math.sin(angle);
  const paddedEndX = endX + padding * Math.cos(angle);
  const paddedEndY = endY + padding * Math.sin(angle);

  // Draw the line
  const arrowheadSize = 60;
  const arrowheadX = paddedEndX - arrowheadSize * Math.cos(angle);
  const arrowheadY = paddedEndY - arrowheadSize * Math.sin(angle);

  const _arrowheadX = paddedEndX - (arrowheadSize + 12) * Math.cos(angle);
  const _arrowheadY = paddedEndY - (arrowheadSize + 12) * Math.sin(angle);

  context.beginPath();
  context.moveTo(paddedStartX, paddedStartY);
  context.lineTo(_arrowheadX, _arrowheadY);
  let prew = context.lineWidth;
  context.lineWidth = 12;
  context.stroke();
  context.lineWidth = prew;

  // Draw the arrowhead
  context.beginPath();
  context.moveTo(arrowheadX, arrowheadY);
  context.lineTo(
    arrowheadX - arrowheadSize * Math.cos(angle - Math.PI / 6),
    arrowheadY - arrowheadSize * Math.sin(angle - Math.PI / 6)
  );
  context.lineTo(
    arrowheadX - arrowheadSize * Math.cos(angle + Math.PI / 6),
    arrowheadY - arrowheadSize * Math.sin(angle + Math.PI / 6)
  );
  context.closePath();
  context.fill();
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

  static routerScaleFactor = 200;
  static routerPadding = 100;

  translate() {
    return new Coords(
      Coords.routerScaleFactor + this.x * Coords.routerScaleFactor,
      Coords.routerScaleFactor + this.y * Coords.routerScaleFactor
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
    canvas.getContext("2d").strokeStyle = "blue";
    let t = [this.a.coords.translate(), this.b.coords.translate()];
    drawLine(canvas, t[0].x, t[0].y, t[1].x, t[1].y);
    canvas.getContext("2d").strokeStyle = "black";
    let center = [(t[0].x + t[1].x) / 2, (t[0].y + t[1].y) / 2];
    writeText(canvas, this.cost, center[0] + 10, center[1] + 10);
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
    this.a.runChecks();
    this.b.runChecks();
  }
  updateSelf(nc) {
    this.cost = nc;
    this.a.firstReply = undefined;
    this.b.firstReply = undefined;
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
    console.log(this, x);
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

  drawSelf(canvas) {
    let t = this.coords.translate();
    let radius = 60;
    canvas.getContext("2d").fillStyle = this.state == 0 ? "green" : "red";
    drawCircle(canvas, radius, t.x, t.y);
    canvas.getContext("2d").fillStyle = "black";
    writeText(canvas, this.id, t.x, t.y - 20);
    writeText(
      canvas,
      this.distance.toString() +
        " " +
        (this.firstReply != null ? this.firstReply.id : "-"),
      t.x,
      t.y + 20
    );
  }

  static drawAll(canvas) {
    Router.allRouters.forEach((x) => x.drawSelf(canvas));
  }

  static newCanvas() {
    let canv = document.createElement("canvas");
    canv.width = 1800;
    canv.height = 1000;
    return canv;
  }

  static newDrawing(callbacks) {
    if (Router.draw == false) return;
    let canvas = Router.newCanvas();
    Link.drawAllLinks(canvas);
    Router.drawAll(canvas);
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
    document.body.appendChild(canvas);
  }

  sendUpdates() {
    this.getNeighbors().forEach((x) => {
      Router.nextStep.push([
        [
          (canvas) => {
            // todo check x state
            let t = this.coords.translate();
            canvas.getContext("2d").fillStyle = "pink";

            // check state cheat ?? (filter above)
            let t2 = x.coords.translate();
            canvas.getContext("2d").fillStyle = "pink";
            canvas.getContext("2d").strokeStyle = "pink";
            drawArrow(canvas, t.x, t.y, t2.x, t2.y, arrowpadding);
            canvas.getContext("2d").fillStyle = "black";
            writeText(
              canvas,
              `U: ${this.distance.dist}`,
              (t.x + t2.x) / 2,
              (t.y + t2.y) / 2
            );
          },
          this,
          x,
          0,
        ],
        () => x.getUpdate(this, this.distance.dist),
      ]);
    });
  }

  runChecks(ns = 2) {
    if (this.ignoreall) return;
    if (this.state != 0) {
      console.error("STATE IS NOT 0, SHOULD NOT RUN CHECKS!", this);
      return;
    }
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
          this.sendUpdates();
        }
      } else {
        // an update turned us to diffusion computations
        this.state = ns;
        this.startDiffuse();
        return;
      }
    } else {
      if (min_dist_fd >= this.distance.fd) {
        // start diffusing computation
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
          this.sendUpdates();
        }
      }
    }
  }

  startDiffuse() {
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
          canvas.getContext("2d").fillStyle = "orange";
          let t2 = target.coords.translate();
          canvas.getContext("2d").fillStyle = "orange";
          canvas.getContext("2d").strokeStyle = "orange";
          drawArrow(canvas, t.x, t.y, t2.x, t2.y, arrowpadding);
          canvas.getContext("2d").fillStyle = "black";
          writeText(
            canvas,
            `Q: ${this.distance.dist}`,
            (t.x + t2.x) / 2,
            (t.y + t2.y) / 2
          );
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
    this.routingTable.set(from, dist);
    switch (this.state) {
      case 0:
        {
          if (this.distance.next == from) {
            this.distance.dist = dist;
            this.distance.fd = Infinity;
            this.state = 4;
            this.startDiffuse();
          } else {
            let min = this.minFrom();
            if (min[1] >= this.distance.fd) {
              // feasable distance not satisfied!
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
          } else {
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
          } else {
            // what does distance increases mean??
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
    if (!flag) return;
    this.state = 0;
    this.routingTable = this.queryStatus;
    this.queryStatus = new Map();
    // send awaiting replies
    // this.sendLater.forEach((x) => this.sendReply(x));
    // this.sendLater = [];
    let tolater = this.distance.next;
    this.runChecks();
    if (tolater != null) this.sendReply(tolater);
  }

  sendReply(target) {
    Router.nextStep.push([
      [
        (canvas) => {
          let t = this.coords.translate();
          canvas.getContext("2d").fillStyle = "cyan";
          let t2 = target.coords.translate();
          canvas.getContext("2d").fillStyle = "cyan";
          canvas.getContext("2d").strokeStyle = "cyan";
          drawArrow(canvas, t.x, t.y, t2.x, t2.y, arrowpadding);
          canvas.getContext("2d").fillStyle = "black";
          writeText(
            canvas,
            `R: ${this.distance.dist}`,
            (t.x + t2.x) / 2,
            (t.y + t2.y) / 2
          );
        },
        this,
        target,
        2,
      ],
      () => target.processReply(this, this.distance.dist),
    ]);
  }
}

//**********************************TEST ***************************************/

function example() {
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = document.getElementById("maincanvas");
  const context = canvas.getContext("2d");

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

  d.distance = new DistanceState(0, 0, d);
  d.ignoreall = true;
  Router.draw = false;
  d.sendUpdates();
  Router.doStep();

  context.clearRect(0, 0, canvas.width, canvas.height);
  Link.drawAllLinks(canvas);
  Router.drawAll(canvas);

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

  //   context.clearRect(0, 0, canvas.width, canvas.height);
  //   Link.drawAllLinks(canvas);
  //   Router.drawAll(canvas);
}

function example2() {
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = document.getElementById("maincanvas");
  const context = canvas.getContext("2d");

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

  j.distance = new DistanceState(0, 0, j);
  j.ignoreall = true;
  Router.draw = false;
  j.sendUpdates();
  Router.doStep();

  context.clearRect(0, 0, canvas.width, canvas.height);
  Link.drawAllLinks(canvas);
  Router.drawAll(canvas);

  Router.draw = true;
  j.links.filter((x) => x.getOther(j) == c)[0].updateSelf(20);
  Router.doStep();
  //   context.clearRect(0, 0, canvas.width, canvas.height);
  //   Link.drawAllLinks(canvas);
  //   Router.drawAll(canvas);
}

function example3() {
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = document.getElementById("maincanvas");
  const context = canvas.getContext("2d");

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

  d.distance = new DistanceState(0, 0, d);
  d.ignoreall = true;
  Router.draw = false;
  d.sendUpdates();
  Router.doStep();

  context.clearRect(0, 0, canvas.width, canvas.height);
  Link.drawAllLinks(canvas);
  Router.drawAll(canvas);

  Router.draw = true;
  d.links.filter((x) => x.getOther(d) == c)[0].removeSelf();
  Router.doStep();

  //   context.clearRect(0, 0, canvas.width, canvas.height);
  //   Link.drawAllLinks(canvas);
  //   Router.drawAll(canvas);
}

function example4() {
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = document.getElementById("maincanvas");
  const context = canvas.getContext("2d");

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

  j.distance = new DistanceState(0, 0, j);
  j.ignoreall = true;
  Router.draw = false;
  j.sendUpdates();
  Router.doStep();

  context.clearRect(0, 0, canvas.width, canvas.height);
  Link.drawAllLinks(canvas);
  Router.drawAll(canvas);

  Router.draw = true;
  j.links.filter((x) => x.getOther(j) == c)[0].removeSelf();
  j.links.filter((x) => x.getOther(j) == d)[0].removeSelf();
  Router.doStep();
  //   context.clearRect(0, 0, canvas.width, canvas.height);
  //   Link.drawAllLinks(canvas);
  //   Router.drawAll(canvas);
}

function example6() {
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = document.getElementById("maincanvas");
  const context = canvas.getContext("2d");

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

  Link.drawAllLinks(canvas);
  Router.drawAll(canvas);

  j.distance = new DistanceState(0, 0, j);
  j.ignoreall = true;
  Router.draw = false;
  j.sendUpdates();
  Router.doStep();

  context.clearRect(0, 0, canvas.width, canvas.height);
  Link.drawAllLinks(canvas);
  Router.drawAll(canvas);

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

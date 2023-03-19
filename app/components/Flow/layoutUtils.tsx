import type { Node, Edge } from "reactflow";

// the class ProgressBar is used to validate the progress bar value
// The contructor receives a string and identifies if there is a ProgressBar tag in the string
export class ProgressBar {
  progress: string;
  bar: boolean;
  constructor(line: string) {
    this.bar = line.match(/__pb_.*__/g) ? true : false;
    const progressRegex = /__pb_(?<value>\d+)__/g;
    const match = progressRegex.exec(line);
    this.progress = match?.groups?.value ?? "0";
  }
  // The getProgress method returns the progress value
  getProgress() {
    return this.progress;
  }
  // The getBar method returns the boolean value of the bar
  getBar() {
    return this.bar;
  }
}

// The class Estimate is used to validate the estimate value
// The contructor receives a string and identifies if there is a Estimate tag (__est_.*__) in the string
export class Estimate {
  est: string;
  constructor(line: string) {
    const estRegex = /__est_(?<est>.*)__/g;
    const match = estRegex.exec(line);
    this.est = match?.groups?.est ?? "";
  }
  // The getEstimate method returns the estimate value
  getEstimate() {
    return this.est;
  }
}

// The class Indicator is used to validate the indicator
// The contructor receives a string and identifies if there is a Indicator tag (__is__, __iw__ or __ie__) in the string
export class Indicator {
  indicator: string;
  constructor(line: string) {
    this.indicator = line.match(/__is__/g) ? "success" : "";
    this.indicator = line.match(/__iw__/g) ? "warning" : this.indicator;
    this.indicator = line.match(/__ie__/g) ? "error" : this.indicator;
  }
  // The getIndicator method returns the indicator value
  getIndicator() {
    return this.indicator;
  }
}

// The class DueDate is used to validate the due date
// The contructor receives a string and identifies if there is a DueDate tag (__due_.*__) in the string
export class DueDate {
  dueDate: string;
  constructor(line: string) {
    const dueDateRegex = /__due_(?<date>.*)__/g;
    const match = dueDateRegex.exec(line);
    this.dueDate = match?.groups?.date ?? "";
  }
  // The getDueDate method returns the due date value
  getDueDate() {
    return this.dueDate;
  }
}

export class WBSNode {
  lineLevel: number;
  lineText: string;
  lineComment: string;
  lineLabel: string;
  lineLabelShort: string;
  dueDate: string;
  indicator: string;
  estimate: string;
  progressBar = { showProgressBar: false, progress: "0" };
  node: Node = {} as Node;
  position: {
    x: number;
    y: number;
  };
  type: string;
  id: string;
  edgeSource: string = "";
  edgeTarget: string = "";
  edgePrevParent: string = "";

  children: Node[] = [];
  parent: Node | undefined;

  constructor(line: string, id: string) {
    const regex = /^(?<level>\*+)\s*(?<text>.+?)(?<comment>\s*\/\/.*)?$/gm;
    const found = regex.exec(line.trimStart());
    this.lineLevel = found?.groups?.level?.length ?? 0;
    this.lineText = found?.groups?.text ?? "";
    this.lineComment = found?.groups?.comment?.trim() ?? "";
    this.lineLabel = this.lineText.replace(/__.*__/g, "").trim();
    this.lineLabelShort =
      this.lineLabel.length > 50 ? this.lineLabel.substring(0, 50) + "..." : this.lineLabel;

    const _d = new DueDate(this.lineText);
    this.dueDate = _d.getDueDate();

    const _i = new Indicator(this.lineText);
    this.indicator = _i.getIndicator();

    const _e = new Estimate(this.lineText);
    this.estimate = _e.getEstimate();

    const _p = new ProgressBar(this.lineText);
    this.progressBar = { showProgressBar: _p.getBar(), progress: _p.getProgress() };

    this.id = id;
    this.type = "";
    this.position = {
      x: 0,
      y: 0,
    };
    if (this.lineLevel === 1) {
      this.type = "top";
    } else if (this.lineLevel === 2) {
      this.type = "parent";
    } else if (this.lineLevel === 3) {
      this.type = "child";
    }

    this.node = {
      id,
      data: {
        label: this.lineLabelShort,
        due: this.dueDate,
        indicator: this.indicator,
        est: this.estimate,
        comment: this.lineComment,
        progressBar: this.progressBar.showProgressBar,
        progressValue: this.progressBar.progress,
      },
      position: this.position,
      type: this.type,
    };
  }

  // The getProgress method returns the progress value
  getProgressBar() {
    return this.progressBar;
  }

  getLineLabel() {
    return this.lineLabel;
  }

  level() {
    return this.lineLevel;
  }

  isValidLevel() {
    return this.lineLevel > 0 && this.lineLevel <= 3;
  }
  connectParents() {
    return this.lineLevel === 1 && (this.lineText.match(/__connect_parents__/g) ? true : false);
  }

  setPos(x: number, y: number) {
    this.position = { x, y };
    this.node.position = this.position;
  }

  addChild(child: Node) {
    this.children.push(child);
  }
}

// The class WBS is used to validate the WBS
// The contructor receives a string and extracts the WBS lines and count level2 nodes
export class WBS {
  #id: number;
  wbsLines: string[];
  parentNodes: number;
  validWBS: boolean;
  connectParents: boolean = false;
  prevNode: WBSNode = {} as WBSNode;
  nodes = new Array<WBSNode>();

  constructor(data: string) {
    this.#id = 0;
    if (data) {
      this.wbsLines = data.trim().split("\n");
      this.parentNodes = this.wbsLines.filter((line: string) =>
        line.trim().startsWith("** ")
      ).length;
      this.validWBS = true;
    } else {
      console.log("No WBS found");
      this.wbsLines = [];
      this.parentNodes = 0;
      this.validWBS = false;
    }
  }
  // The getWbsLines method returns the WBS lines
  getWbsLines() {
    return this.wbsLines;
  }
  // The getLevel2Nodes method returns the number of level2 nodes
  getNumberOfParentNodes() {
    return this.parentNodes;
  }

  // The getValidWBS method returns the boolean value of the WBS
  isValidWBS() {
    return this.validWBS;
  }

  setConnectParents(value: boolean) {
    this.connectParents = value;
  }

  getConnectParents() {
    return this.connectParents;
  }

  getNewId() {
    this.#id += 1;
    return this.#id.toString();
  }

  addNode(node: WBSNode) {
    this.nodes.push(node);

    // First node
    if (this.nodes.length === 1) {
      node.parent = undefined;
    }

    if (node.level() === 2) {
      node.parent = this.nodes[0];
      node.parent.addChild(node);

      node.edgePrevParent = this.getSecondToLastLevel2Node().id; // previous parent
      node.edgeSource = node.parent.id;
      node.edgeTarget = node.id;
    }

    if (node.level() === 3) {
      node.parent = this.getLastLevel2Node();
      node.parent.addChild(node);

      node.edgeSource = node.parent.id;
      node.edgeTarget = node.id;
    }
  }

  getSecondToLastLevel2Node() {
    return this.nodes.filter((node) => node.level() === 2).slice(-2)[0];
  }

  getLastLevel2Node() {
    return this.nodes.filter((node) => node.level() === 2).pop();
  }

  getFirstLevel2Node() {
    return this.nodes.filter((node) => node.level() === 2).shift();
  }
}

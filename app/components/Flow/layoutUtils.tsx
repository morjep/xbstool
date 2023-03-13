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

//The class content is used to validate the content of the node
//The contructor receives a string and identifies the content of the node
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

  constructor(line: string) {
    const regex = /^(?<level>\*+)\s*(?<text>.+?)(?<comment>\s*\/\/.*)?$/gm;
    const found = regex.exec(line.trimStart());
    this.lineLevel = found?.groups?.level?.length ?? 0;
    this.lineText = found?.groups?.text ?? "";
    this.lineComment = found?.groups?.comment?.trim() ?? "";
    this.lineLabel = this.lineText.replace(/__.*__/g, "").trim();
    // Shorten the label if it is too long
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
  }

  // The getProgress method returns the progress value
  getProgressBar() {
    return this.progressBar;
  }

  // The getEstimate method returns the estimate value
  getEstimate() {
    return this.estimate;
  }

  // The getDueDate method returns the due date value
  getDueDate() {
    return this.dueDate;
  }

  // The getIndicator method returns the indicator value
  getIndicator() {
    return this.indicator;
  }
  //The getLineLevel method returns the level of the node
  getLineLevel() {
    return this.lineLevel;
  }
  //The getLineText method returns the text of the node
  getLineText() {
    return this.lineText;
  }
  //The getLineComment method returns the comment of the node
  getLineComment() {
    return this.lineComment;
  }
  //The getLineLabel method returns the label of the node
  getLineLabel() {
    return this.lineLabel;
  }
  //The getLineLabelShort method returns the short label of the node
  getLineLabelShort() {
    return this.lineLabelShort;
  }

  isTop() {
    return this.lineLevel === 1;
  }
  isParent() {
    return this.lineLevel === 2;
  }
  isChild() {
    return this.lineLevel === 3;
  }
  isValidLevel() {
    return this.lineLevel > 0 && this.lineLevel <= 3;
  }
  connectParents() {
    return this.lineLevel === 1 && (this.lineText.match(/__connect_parents__/g) ? true : false);
  }
}

// The class WBS is used to validate the WBS
// The contructor receives a string and extracts the WBS lines and count level2 nodes
export class WBS {
  wbsLines: string[];
  parentNodes: number;
  validWBS: boolean;
  connectParents: boolean = false;
  constructor(data: string) {
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
}

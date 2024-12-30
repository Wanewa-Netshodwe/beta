import { sectionData } from "../Types";

class TNode {
  value: sectionData | number;
  left: TNode;
  right: TNode;

  constructor(val: sectionData | number) {
    this.value = val;

    if (this.isPlaceHolder()) {
      this.left = this;
      this.right = this;
    } else {
      this.left = new TNode(0);
      this.right = new TNode(0);
    }
  }

  isPlaceHolder(): boolean {
    return typeof this.value === "number" && this.value === 0;
  }
}

export class SectionTree {
  root: TNode;

  constructor() {
    this.root = new TNode(0);
  }

  insert(val: sectionData) {
    if (val.type === "banner" || val.type === "carousel") {
      let currentNode = this.root.left;

      if (currentNode.isPlaceHolder()) {
        if (val.type === "banner") {
          this.root.left = new TNode(val);
        } else if (currentNode.right.isPlaceHolder()) {
          currentNode.right = new TNode(val);
        }
      } else {
        while (true) {
          if (val.type === "banner") {
            if (currentNode.left.isPlaceHolder()) {
              currentNode.left = new TNode(val);
              break;
            }
            currentNode = currentNode.left;
          }
          if (val.type === "carousel") {
            if (currentNode.right.isPlaceHolder()) {
              currentNode.right = new TNode(val);
              break;
            }
            currentNode = currentNode.right;
          }
        }
      }
    }
    if (val.type === "section" || val.type === "categories") {
      let currentNode = this.root.right;

      if (currentNode.isPlaceHolder()) {
        if (val.type === "section") {
          this.root.right = new TNode(val);
        } else if (currentNode.right.isPlaceHolder()) {
          currentNode.right.left = new TNode(val);
        }
      } else {
        while (true) {
          if (val.type === "section") {
            if (currentNode.right.isPlaceHolder()) {
              currentNode.right = new TNode(val);
              break;
            }
            currentNode = currentNode.right;
          }
          if (val.type === "categories") {
            if (currentNode.left.isPlaceHolder()) {
              currentNode.left = new TNode(val);
              break;
            }
            currentNode = currentNode.left;
          }
        }
      }
    }
  }

  GetBanners(): sectionData[] {
    const values: sectionData[] = [];

    const traverseLeftSide = (node: TNode) => {
      if (node.isPlaceHolder()) {
        return;
      }
      if (typeof node.value !== "number") {
        values.push(node.value);
      }
      traverseLeftSide(node.left);
    };

    traverseLeftSide(this.root.left);
    return values;
  }
  getCarousels(): sectionData[] {
    const values: sectionData[] = [];

    const traverseRightSide = (node: TNode) => {
      if (node.isPlaceHolder()) {
        return;
      }
      if (typeof node.value !== "number") {
        values.push(node.value);
      }
      traverseRightSide(node.right);
    };

    traverseRightSide(this.root.left.right);
    return values;
  }
  GetCategories(): sectionData[] {
    const values: sectionData[] = [];

    const traverseLeftSide = (node: TNode) => {
      if (node.isPlaceHolder()) {
        return;
      }
      if (typeof node.value !== "number") {
        values.push(node.value);
      }
      traverseLeftSide(node.left);
    };

    traverseLeftSide(this.root.right.left);
    return values;
  }
  getSections(): sectionData[] {
    const values: sectionData[] = [];

    const traverseRightSide = (node: TNode) => {
      if (node.isPlaceHolder()) {
        return;
      }
      if (typeof node.value !== "number") {
        values.push(node.value);
      }
      traverseRightSide(node.right);
    };

    traverseRightSide(this.root.right);
    return values;
  }
}

import { sectionData } from "../Types";
class Node {
  value: sectionData | number;
  left: Node;
  right: Node;

  constructor(val: sectionData | number) {
    this.value = val;

    if (this.isPlaceHolder()) {
      this.left = this;
      this.right = this;
    } else {
      this.left = new Node(0);
      this.right = new Node(0);
    }
  }

  isPlaceHolder(): boolean {
    return typeof this.value === "number" && this.value === 0;
  }
}

export class SectionTree {
  root: Node;

  constructor() {
    this.root = new Node(0);
  }

  insert(val: sectionData) {
    if (val.type === "banner" || val.type === "carousel") {
      let currenNode = this.root.left;

      if (currenNode.isPlaceHolder()) {
        if (val.type === "banner") {
          this.root.left = new Node(val);
        } else if (currenNode.right.isPlaceHolder()) {
          currenNode.right = new Node(val);
        }
      } else {
        while (true) {
          if (val.type === "banner") {
            if (currenNode.left.isPlaceHolder()) {
              currenNode.left = new Node(val);
              break;
            }
            currenNode = currenNode.left;
          }
          if (val.type === "carousel") {
            if (currenNode.right.isPlaceHolder()) {
              currenNode.right = new Node(val);
              break;
            }
            currenNode = currenNode.right;
          }
        }
      }
    }
    if (val.type === "section" || val.type === "categories") {
      let currenNode = this.root.right;

      if (currenNode.isPlaceHolder()) {
        if (val.type === "section") {
          this.root.right = new Node(val);
        } else if (currenNode.right.isPlaceHolder()) {
          currenNode.right.left = new Node(val);
        }
      } else {
        while (true) {
          if (val.type === "section") {
            if (currenNode.right.isPlaceHolder()) {
              currenNode.right = new Node(val);
              break;
            }
            currenNode = currenNode.right;
          }
          if (val.type === "categories") {
            if (currenNode.left.isPlaceHolder()) {
              currenNode.left = new Node(val);
              break;
            }
            currenNode = currenNode.left;
          }
        }
      }
    }
  }
  delete(val: sectionData) {
    if (val.type === "banner" || val.type === "carousel") {
      let currentNode = this.root.left;
      let prevNode = this.root;
      if (val.type === "banner") {
        while (currentNode && !currentNode.isPlaceHolder()) {
          if (
            typeof currentNode.value !== "number" &&
            val.name === currentNode.value.name
          ) {
            if (prevNode.left === currentNode) {
              prevNode.left = currentNode.left;
            }
          }
          prevNode = currentNode;
          currentNode = currentNode.left;
        }
      } else {
        while (currentNode && !currentNode.isPlaceHolder()) {
          if (
            typeof currentNode.value !== "number" &&
            val.name === currentNode.value.name
          ) {
            if (prevNode.left === currentNode) {
              prevNode.right = currentNode.right;
            }
          }
          prevNode = currentNode;
          currentNode = currentNode.right;
        }
      }
    } else {
      let currentNode = this.root.right;
      let prevNode = this.root;
      if (val.type === "section") {
        while (currentNode && !currentNode.isPlaceHolder()) {
          if (
            typeof currentNode.value !== "number" &&
            val.name === currentNode.value.name
          ) {
            if (prevNode.right === currentNode) {
              prevNode.right = currentNode.right;
            }
          }
          prevNode = currentNode;
          currentNode = currentNode.right;
        }
      } else {
        while (currentNode && !currentNode.isPlaceHolder()) {
          if (
            typeof currentNode.value !== "number" &&
            val.name === currentNode.value.name
          ) {
            if (prevNode.left === currentNode) {
              prevNode.left = currentNode.left;
            }
          }
          prevNode = currentNode;
          currentNode = currentNode.left;
        }
      }
    }
  }

  GetBanners(): sectionData[] {
    const values: sectionData[] = [];

    const traverseLeftSide = (node: Node) => {
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

    const traverseRightSide = (node: Node) => {
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

    const traverseLeftSide = (node: Node) => {
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

    const traverseRightSide = (node: Node) => {
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

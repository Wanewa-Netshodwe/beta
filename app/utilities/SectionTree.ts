import { sectionData } from "./Types";

class Tnode {
  left: Tnode | undefined = undefined;
  right: Tnode | undefined = undefined;
  value: sectionData;

  constructor(value: sectionData) {
    this.value = value;
  }
}

class SectionTree {
  root: Tnode | undefined = undefined;

  insert(val: sectionData) {
    if (!this.root) {
      this.root = new Tnode(val);
      return;
    }

    const isLeft = val.type === "Banner" || val.type === "Carousel";
    let currentNode = isLeft ? this.root.left : this.root.right;

    if (!currentNode) {
      if (isLeft) {
        this.root.left = new Tnode(val);
      } else {
        this.root.right = new Tnode(val);
      }
      return;
    }

    while (currentNode) {
      if (
        (isLeft && val.type === "Banner") ||
        (!isLeft && val.type === "categories")
      ) {
        if (!currentNode.left) {
          currentNode.left = new Tnode(val);
          return;
        }
        currentNode = currentNode.left;
      } else {
        if (!currentNode.right) {
          currentNode.right = new Tnode(val);
          return;
        }
        currentNode = currentNode.right;
      }
    }
  }
}

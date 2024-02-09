import Experience from "../Experience.js";
import Environment from "./Environment.js";
import Floor from "./Floor.js";
import Tower from "./Tower.js";

import Bunny from "./Bunny.js";
import Action from "./Action.js";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.floor = new Floor();
      this.bunny = new Bunny();
      this.action = new Action();
      this.tower = new Tower();
      this.environment = new Environment();
    });
  }

  update() {
    if (this.tower) {
      this.tower.update();
    }
    if (this.bunny) {
      this.bunny.update();
    }
    if (this.action) {
      this.action.update();
    }
  }
}

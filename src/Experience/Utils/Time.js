import EventEmitter from "./EventEmitter.js";
import * as THREE from 'three'

export default class Time extends EventEmitter {
  constructor() {
    super();
    this.clock = new THREE.Clock();
    this.oldElapsedTime = 0;

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  tick() {
    const elapsedTime = this.clock.getElapsedTime();
    this.delta = elapsedTime - this.oldElapsedTime;
    this.oldElapsedTime = elapsedTime;

    this.trigger("tick");

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}

import * as THREE from "three";
import * as CANNON from "cannon-es";
import Experience from "../Experience.js";

export default class Action {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.physicsWorld = this.experience.physicsWorld;
    this.defaultMaterial = this.experience.defaultMaterial;

    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    this.move = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    };

    window.addEventListener("keydown", (event) => this.onKeyDown(event.code));
    window.addEventListener("keyup", (event) => this.onKeyUp(event.code));

    this.setCollisionSphere();
  }

  onKeyDown(key) {
    switch (key) {
      case "KeyW":
        this.move.forward = true;
        break;
      case "KeyA":
        this.move.left = true;
        break;
      case "KeyS":
        this.move.backward = true;
        break;
      case "KeyD":
        this.move.right = true;
        break;
    }
  }

  onKeyUp(key) {
    switch (key) {
      case "KeyW":
        this.move.forward = false;
        break;
      case "KeyA":
        this.move.left = false;
        break;
      case "KeyS":
        this.move.backward = false;
        break;
      case "KeyD":
        this.move.right = false;
        break;
    }
  }

  setCollisionSphere() {
    this.collisionSphereShape = new CANNON.Sphere(1.5);
    this.collisionSphereBody = new CANNON.Body({
      mass: 2,
      material: this.defaultMaterial,
    });
    this.collisionSphereBody.addShape(this.collisionSphereShape);
    this.collisionSphereBody.linearDamping = 0.9;
    this.physicsWorld.addBody(this.collisionSphereBody);
  }

  setShootDirection() {
    const shootVector = new THREE.Vector3(0, 0, 1);
    shootVector.unproject(this.camera.instance);
    const shootRay = new THREE.Ray(
      this.collisionSphereBody.position,
      shootVector.sub(this.collisionSphereBody.position).normalize()
    );

    return shootRay.direction;
  }

  update() {
    if (this.camera.controls.isLocked === true) {
      this.velocity.x -= this.velocity.x * 10 * this.time.delta;
      this.velocity.z -= this.velocity.z * 10 * this.time.delta;
      this.velocity.y -= 9.8 * 70.0 * this.time.delta;

      this.direction.z = Number(this.move.forward) - Number(this.move.backward);
      this.direction.x = Number(this.move.right) - Number(this.move.left);
      this.direction.normalize();

      if (this.move.forward || this.move.backward)
        this.velocity.z -= this.direction.z * 100.0 * this.time.delta;
      if (this.move.left || this.move.right)
        this.velocity.x -= this.direction.x * 100.0 * this.time.delta;

      this.camera.controls.moveRight(-this.velocity.x * this.time.delta);
      this.camera.controls.moveForward(-this.velocity.z * this.time.delta);
    }
  }
}

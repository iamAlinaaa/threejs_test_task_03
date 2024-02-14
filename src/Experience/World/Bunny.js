import * as CANNON from "cannon-es";
import Experience from "../Experience.js";
import Action from "./Action.js";

export default class Bunny {
  constructor() {
    this.experience = new Experience();
    this.camera = this.experience.camera;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.physicsWorld = this.experience.physicsWorld;
    this.action = new Action();
    this.defaultMaterial = this.experience.defaultMaterial;

    // Resource
    this.modelBunny = this.resources.items.bunnyModel.scene;
    this.modelBunny.rotateX(-Math.PI / 2);
    this.modelBunny.scale.set(0.5, 0.5, 0.5);

    this.bunnyModelMeshBalls = [];
    this.bunnyPhysicsBalls = [];
    this.shootVelocity = 25;
    this.physicsShape = new CANNON.Sphere(0.5);
    this.collisionSphereShape = this.action.collisionSphereShape;
    this.collisionSphereBody = this.action.collisionSphereBody;
  }

  shoot() {
    const model = this.modelBunny.clone();
    model.castShadow = true;
    model.receiveShadow = true;
    const physicsBody = this.setupPhysicsBody(model);

    this.physicsWorld.addBody(physicsBody);
    this.scene.add(model);
    this.bunnyPhysicsBalls.push(physicsBody);
    this.bunnyModelMeshBalls.push(model);

    const shootDirection = this.action.setShootDirection();

    this.applyShootVelocity(physicsBody, model, shootDirection);
    this.playShootSound();
  }

  playShootSound() {
    const audio = new Audio("sounds/bunny_fly.mp3");
    audio.play();
  }

  setupModel() {
    const model = this.modelBunny.clone;
    model.castShadow = true;
    model.receiveShadow = true;

    return model;
  }

  setupPhysicsBody() {
    const physicsBody = new CANNON.Body({
      mass: 5,
      shape: this.physicsShape,
      material: this.defaultMaterial,
      fixedRotation:true
    });

    return physicsBody;
  }

  applyShootVelocity(physicsBody, model, shootDirection) {
    shootDirection.normalize();
    physicsBody.velocity.set(
      shootDirection.x * this.shootVelocity,
      shootDirection.y * this.shootVelocity,
      shootDirection.z * this.shootVelocity
    );
    physicsBody.position.copy(this.camera.controls.getObject().position);
    model.position.copy(physicsBody.position);
  }

  update() {
    if (this.camera.controls.isLocked === true) {
      for (let i = 0; i < this.bunnyPhysicsBalls.length; i++) {
        this.bunnyModelMeshBalls[i].position.copy(
          this.bunnyPhysicsBalls[i].position
        );
        this.bunnyModelMeshBalls[i].quaternion.copy(
          this.bunnyPhysicsBalls[i].quaternion
        );
      }
    }
  }
}

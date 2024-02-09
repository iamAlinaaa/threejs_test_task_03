import * as THREE from "three";
import * as CANNON from "cannon-es";
import Experience from "../Experience.js";

export default class Floor {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.physicsWorld = this.experience.physicsWorld;
    this.defaultMaterial = this.experience.defaultMaterial;

    this.setGeometry();
    this.setMaterial();
    this.setMesh();

    this.setPhysicsShape();
    this.setPhysicsMaterial();
    this.setPhysicsBody();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(50, 50);
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0,
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }

  setPhysicsShape() {
    this.physicsShape = new CANNON.Plane();
  }

  setPhysicsMaterial() {
    this.physicsMaterial = this.defaultMaterial;
  }

  setPhysicsBody() {
    this.physicsBody = new CANNON.Body({
      mass: 0,
      shape: this.physicsShape,
      material: this.physicsMaterial,
    });

    this.physicsBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 0.5
    );

    this.physicsWorld.addBody(this.physicsBody);
  }
}

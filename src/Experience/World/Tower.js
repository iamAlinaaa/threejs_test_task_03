import * as THREE from "three";
import * as CANNON from "cannon-es";
import Experience from "../Experience.js";

export default class Tower {
  constructor() {
    this.experience = new Experience();
    this.time = this.experience.time;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.physicsWorld = this.experience.physicsWorld;

    this.brickMass = 1;
    this.brickSize = 0.5;
    this.brickGap = 0.04;

    this.bricksToUpdate = [];
    this.defaultMaterial = this.experience.defaultMaterial;

    this.setMeshMaterial();
    this.setTower();
  }

  setMeshMaterial() {
    this.texture = this.resources.items.woodTexture;
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.material = new THREE.MeshBasicMaterial({ map: this.texture });
  }

  setTower() {
    for (let col = 0; col < 10; col++) {
      for (let row = 0; row < 3; row++) {
        const physicsBody = new CANNON.Body({
          mass: this.brickMass,
          material: this.defaultMaterial,
        });

        let halfExtendsVec = new CANNON.Vec3(
          this.brickSize * 3,
          this.brickSize,
          this.brickSize
        );

        let x = 0;
        let z = 1;
        if (col % 2 === 0) {
          halfExtendsVec.set(
            this.brickSize,
            this.brickSize,
            this.brickSize * 3
          );

          x = 1;
          z = 0;
        }

        let physicsShape = new CANNON.Box(halfExtendsVec);
        physicsBody.addShape(physicsShape);
        physicsBody.position.set(
          2 * (this.brickSize + this.brickGap) * (row - 1) * x - 5,
          2 * (this.brickSize + this.brickGap) * (col + 0.5),
          2 * (this.brickSize + this.brickGap) * (row - 1) * z
        );

        const geometry = new THREE.BoxGeometry(
          halfExtendsVec.x * 2,
          halfExtendsVec.y * 2,
          halfExtendsVec.z * 2
        );

        const mesh = new THREE.Mesh(geometry, this.material);

        mesh.position.copy(physicsBody.position);
        mesh.quaternion.copy(physicsBody.quaternion);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        this.physicsWorld.addBody(physicsBody);
        this.scene.add(mesh);
        this.bricksToUpdate.push({ mesh: mesh, body: physicsBody });
      }
    }
  }

  update() {
    this.physicsWorld.step(1 / 60, this.time.delta, 3);
    for (const brick of this.bricksToUpdate) {
      brick.mesh.position.copy(brick.body.position);
      brick.mesh.quaternion.copy(brick.body.quaternion);
    }
  }
}

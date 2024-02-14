import * as THREE from "three";
import * as CANNON from "cannon-es";
import Experience from "../Experience.js";
import { GroundProjectedSkybox } from "three/addons/objects/GroundProjectedSkybox.js";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.physicsWorld = this.experience.physicsWorld;
    this.defaultMaterial = this.experience.defaultMaterial;

    this.setSunLight();
    this.setEnvironmentMap();
    this.setPhysicsWorld();
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight("#ffffff", 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3.5, 2, -1.25);
    this.scene.add(this.sunLight);

    this.ambientLight = new THREE.AmbientLight("#ffffff", 1.5);
    this.scene.add(this.ambientLight);
  }

  setEnvironmentMap() {
    this.environmentMap = {};
    this.resources.items.environmentMap.colorSpace = THREE.SRGBColorSpace;
    this.resources.items.environmentMap.mapping =
      THREE.EquirectangularReflectionMapping;

    // this.scene.environment = this.resources.items.environmentMap;
    // this.scene.background = this.resources.items.environmentMap;

    this.skybox = new GroundProjectedSkybox(
      this.resources.items.environmentMap
    );

    this.skybox.scale.setScalar(50);
    // this.scene.add(this.skybox);

    this.scene.backgroundBlurriness = 0;
    this.scene.backgroundIntensity = 1;

    this.environmentMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMap = this.environmentMap.texture;
          child.material.envMapIntensity = this.environmentMap.intensity;
          child.material.needsUpdate = true;
        }
      });
    };
    this.environmentMap.updateMaterials();
  }

  setPhysicsWorld() {
    this.physicsWorld.gravity.set(0, -9.82, 0);
    this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld);
    this.physicsWorld.allowSleep = true;
    this.physicsWorld.defaultContactMaterial = new CANNON.ContactMaterial(
      this.defaultMaterial,
      this.defaultMaterial,
      {
        friction: 0.1,
        restitution: 0.7,
      }
    );
    this.physicsWorld.addContactMaterial(
      this.physicsWorld.defaultContactMaterial
    );
  }
}

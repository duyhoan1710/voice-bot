/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.3 src/assets/model.glb
*/

// import { useGLTF } from "@react-three/drei";

// export function Model(props: any) {
//   const { nodes, materials } = useGLTF("/model.glb") as any;

//   return (
//     <group {...props} dispose={null}>
//       <primitive object={nodes.Hips} />
//       <skinnedMesh
//         name="Wolf3D_Avatar"
//         geometry={nodes.Wolf3D_Avatar.geometry}
//         material={materials.Wolf3D_Avatar}
//         skeleton={nodes.Wolf3D_Avatar.skeleton}
//         morphTargetDictionary={nodes.Wolf3D_Avatar.morphTargetDictionary}
//         morphTargetInfluences={nodes.Wolf3D_Avatar.morphTargetInfluences}
//       />
//     </group>
//   );
// }

// useGLTF.preload("/model.glb");

import { useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as THREE from "three";

export function Model3D({
  fileName = "/models/model_dancing.fbx",
}: {
  fileName: string;
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let mixer: any = null;
    const clock = new THREE.Clock();
    const scene = new THREE.Scene();

    const light = new THREE.PointLight();
    light.castShadow = true;
    light.position.set(0.8, 1.4, 1.0);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight();
    ambientLight.intensity = 0.1;
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight();
    directionalLight.castShadow = true;
    directionalLight.intensity = 0.4;
    scene.add(directionalLight);

    const camera = new THREE.PerspectiveCamera(
      12,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(2, 1, 10);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current as any,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true; // Enable shadow rendering
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Choose shadow map type

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.target.set(0, 1, 0);

    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true; // Enable shadow receiving
    scene.add(groundMesh);

    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      fileName,
      (object) => {
        object.traverse(function (child) {
          if ((child as THREE.Mesh).isMesh) {
            if ((child as THREE.Mesh).material) {
              (
                (child as THREE.Mesh).material as THREE.MeshBasicMaterial
              ).transparent = false;
            }
          }
        });
        object.scale.set(0.03, 0.011, 0.03);
        object.position.set(0.1, 0, 0);
        scene.add(object);

        const animations = object.animations;
        if (animations && animations.length > 0) {
          mixer = new THREE.AnimationMixer(object);
          for (let i = 0; i < animations.length; i++) {
            const animation = animations[i];
            const action = mixer.clipAction(animation);
            action.play();
          }
        }
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.log(error);
      }
    );

    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }
      controls.update();
      renderer.render(scene, camera);
    }

    animate();
  }, [fileName]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        backgroundColor: "transparent",
        width: "100%",
        height: "100%",
      }}
    ></canvas>
  );
}

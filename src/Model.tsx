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

import { useFBX } from "@react-three/drei";

export function Model(props: any) {
  const fbx = useFBX("/model.fbx");

  return <primitive object={fbx} scale={1} />;
}
useFBX.preload("/model.fbx");

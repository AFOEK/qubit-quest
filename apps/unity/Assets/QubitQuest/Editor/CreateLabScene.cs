using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

namespace QubitQuest.Editor
{
    public static class CreateLabScene
    {
        [MenuItem("Quantum Grove/Create lab scene")]
        public static void Create()
        {
            if (!EditorSceneManager.SaveCurrentModifiedScenesIfUserWantsTo()) return;
            var scene = EditorSceneManager.NewScene(NewSceneSetup.DefaultGameObjects);
            var root = new GameObject("Qubit lab"); var lab = root.AddComponent<QubitLab>();
            var sphere = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            sphere.name = "State space (visual model)"; sphere.transform.position = new Vector3(0, 1.5f, 2);
            Object.DestroyImmediate(sphere.GetComponent<Collider>());
            // Three great circles show the sphere without occluding the state arrow.
            Object.DestroyImmediate(sphere.GetComponent<MeshRenderer>());
            for (int axis = 0; axis < 3; axis++)
            {
                var ring = new GameObject("Bloch ring " + axis); ring.transform.SetParent(sphere.transform, false);
                var line = ring.AddComponent<LineRenderer>(); line.useWorldSpace = false;
                line.positionCount = 65; line.startWidth = line.endWidth = .007f;
                line.sharedMaterial = new Material(Shader.Find("Sprites/Default"));
                line.startColor = line.endColor = new Color(.5f, .8f, .65f);
                for (int i = 0; i <= 64; i++)
                {
                    float a = i * Mathf.PI * 2 / 64; float c = Mathf.Cos(a) * .5f, s = Mathf.Sin(a) * .5f;
                    line.SetPosition(i, axis == 0 ? new Vector3(c,s,0) : axis == 1 ? new Vector3(c,0,s) : new Vector3(0,c,s));
                }
            }
            var pivot = new GameObject("State arrow pivot"); pivot.transform.position = sphere.transform.position;
            var arrow = GameObject.CreatePrimitive(PrimitiveType.Cylinder); arrow.name = "State arrow";
            arrow.transform.SetParent(pivot.transform, false); arrow.transform.localPosition = new Vector3(0,.25f,0);
            arrow.transform.localScale = new Vector3(.02f,.25f,.02f);
            Object.DestroyImmediate(arrow.GetComponent<Collider>());
            var label = new GameObject("Readout"); label.transform.position = new Vector3(-.65f,.8f,2);
            var text = label.AddComponent<TextMesh>(); text.characterSize = .035f; text.fontSize = 48;
            var settings = new SerializedObject(lab);
            settings.FindProperty("stateArrow").objectReferenceValue = pivot.transform;
            settings.FindProperty("readout").objectReferenceValue = text; settings.ApplyModifiedProperties();
            System.IO.Directory.CreateDirectory("Assets/QubitQuest/Scenes");
            EditorSceneManager.SaveScene(scene, "Assets/QubitQuest/Scenes/QubitLab.unity");
            Selection.activeGameObject = root;
        }
    }
}

# Native Quest lab starter

This folder contains Unity source and an editor scene generator. It is **not yet a headset-tested Unity project or APK**. The web app includes a separate functional Three.js/WebXR lab.

1. Create a Unity 6 LTS project with the Universal 3D template. Install Android Build Support through Unity Hub.
2. Copy `Assets/QubitQuest` into the project. Run **Qubit Quest > Create lab scene**. This saves a scene with Bloch rings, a state arrow, and API readout.
3. Install XR Plug-in Management, OpenXR, Unity OpenXR: Meta, Input System, and XR Interaction Toolkit through Package Manager using versions compatible with your editor. Enable OpenXR on Android and the Meta Quest support feature. Use the official [Meta setup guide](https://developers.meta.com/vr/documentation/unity/unity-project-setup/).
4. Replace the generated desktop camera with an XR Origin rig. Add three XR Simple Interactable objects, with colliders, labelled H, X, S. Bind their Select Entered UnityEvents to `QubitLab.ApplyH`, `ApplyX`, `ApplyS`. Add a Reset object bound to `ResetState`.
5. Start the API: `python -m uvicorn main:app --app-dir services/api --host 0.0.0.0 --port 8000`. Set the scene's API Base URL to the laptop's LAN IP, not `127.0.0.1` on the headset. Put both devices on the same trusted network. Permit the private-network firewall prompt if appropriate.
6. For a local HTTP development server, enable **Allow downloads over HTTP** for development builds only. Use HTTPS for distributed builds. Enable Internet access in Android Player Settings.
7. Choose Android, ARM64, IL2CPP; add the generated scene to Build Profiles. Build and run on a developer-mode Quest 3. Check controller selection, text legibility, sphere orientation, network disconnects, and repeated gate presses.

The model maps Qiskit `(x,y,z)` to Unity `(x,z,-y)`. A pure qubit stays on the sphere; a mixed reduced qubit can lie inside it. No native build was validated by the initial scaffold. Commit scene assets and `.meta` files after creating them; exclude Library, Temp, Logs, and Builds.

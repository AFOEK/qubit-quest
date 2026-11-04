using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;

namespace QubitQuest
{
    // Attach to a scene object. Bind H/X/S to XR Simple Interactable select events.
    public class QubitLab : MonoBehaviour
    {
        [SerializeField] private string apiBaseUrl = "http://127.0.0.1:8000";
        [SerializeField] private Transform stateArrow;
        [SerializeField] private TextMesh readout;
        private readonly List<Gate> gates = new List<Gate>();
        private Coroutine pending;
        [Serializable] public class Gate { public string name; public int target = 0; }
        [Serializable] private class Request { public int qubits = 1; public int shots = 1024; public Gate[] gates; }
        [Serializable] private class Bloch { public float x; public float y; public float z; }
        [Serializable] private class Response { public Bloch bloch; }

        public void ApplyH() { AddGate("h"); }
        public void ApplyX() { AddGate("x"); }
        public void ApplyS() { AddGate("s"); }
        public void ResetState() { gates.Clear(); Refresh(); }
        private void AddGate(string name)
        {
            if (gates.Count >= 32) { readout.text = "Reset before adding more gates."; return; }
            gates.Add(new Gate { name = name }); Refresh();
        }
        private void Start() { Refresh(); }
        private void Refresh()
        {
            if (pending != null) StopCoroutine(pending);
            pending = StartCoroutine(Simulate());
        }
        private IEnumerator Simulate()
        {
            var body = JsonUtility.ToJson(new Request { gates = gates.ToArray() });
            using (var request = new UnityWebRequest(apiBaseUrl.TrimEnd('/') + "/api/simulate", "POST"))
            {
                request.uploadHandler = new UploadHandlerRaw(Encoding.UTF8.GetBytes(body));
                request.downloadHandler = new DownloadHandlerBuffer();
                request.SetRequestHeader("Content-Type", "application/json"); request.timeout = 15;
                readout.text = "Simulating with Qiskit...";
                yield return request.SendWebRequest();
                if (request.result != UnityWebRequest.Result.Success)
                {
                    readout.text = "API unavailable. Check the server URL and network.\n" + request.error;
                    yield break;
                }
                var response = JsonUtility.FromJson<Response>(request.downloadHandler.text);
                // Qiskit z is vertical; Unity uses y as up. Right-handed Bloch y maps to -Unity z.
                var direction = new Vector3(response.bloch.x, response.bloch.z, -response.bloch.y);
                stateArrow.gameObject.SetActive(direction.sqrMagnitude > 0.00001f);
                if (direction.sqrMagnitude > 0.00001f) stateArrow.up = direction.normalized;
                readout.text = $"Qiskit state · {gates.Count} gates\nP(0): {(1 + response.bloch.z) / 2:P0}   P(1): {(1 - response.bloch.z) / 2:P0}";
            }
        }
    }
}

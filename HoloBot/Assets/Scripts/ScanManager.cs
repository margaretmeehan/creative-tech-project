using System;
using HoloToolkit.Unity;
using HoloToolkit.Unity.InputModule;
using UnityEngine.XR.WSA.Input;
using UnityEngine;
using System.Collections.Generic;

public class ScanManager : MonoBehaviour
{
    public TextMesh InstructionTextMesh;
    public Transform PaintingPrefab;
    public GameObject bot;
    private Transform painting;
    private GameObject cam;

    //public GameObject test_paint;

    // Represents the hologram that is currently being gazed at.
    public GameObject FocusedObject { get; private set; }

    GestureRecognizer recognizer;

    private List<Vector3> image_positions = new List<Vector3>();

    // Use this for initialization
    void Start()
    {
        SpatialUnderstanding.Instance.RequestBeginScanning();
        SpatialUnderstanding.Instance.ScanStateChanged += ScanStateChanged;

        // Set up a GestureRecognizer to detect Select gestures.
        recognizer = new GestureRecognizer();
        recognizer.Tapped += (args) =>
        {
            this.InstructionTextMesh.text = "Requested Finish Scan";

            SpatialUnderstanding.Instance.RequestFinishScan();

            bot.SetActive(true);
            //test_paint.SetActive(true);
            cam = GameObject.Find("MixedRealityCamera");
            cam.GetComponent<Camera>().nearClipPlane = 0.01f;
        };
        recognizer.StartCapturingGestures();
    }

    private void ScanStateChanged()
    {
        if (SpatialUnderstanding.Instance.ScanState == SpatialUnderstanding.ScanStates.Scanning)
        {
            LogSurfaceState();
        }
        else if (SpatialUnderstanding.Instance.ScanState == SpatialUnderstanding.ScanStates.Done)
        {
            InstanciateObjectOnFloor();

        }
    }

    private void OnDestroy()
    {
        SpatialUnderstanding.Instance.ScanStateChanged -= ScanStateChanged;
    }

    // Update is called once per frame
    void Update()
    {
        switch (SpatialUnderstanding.Instance.ScanState)
        {
            case SpatialUnderstanding.ScanStates.None:
            case SpatialUnderstanding.ScanStates.ReadyToScan:
                break;
            case SpatialUnderstanding.ScanStates.Scanning:
                this.LogSurfaceState();
                break;
            case SpatialUnderstanding.ScanStates.Finishing:
                this.InstructionTextMesh.text = "State: Finishing Scan";
                break;
            case SpatialUnderstanding.ScanStates.Done:
                this.InstructionTextMesh.text = "State: Scan Finished";
                break;
            default:
                break;
        }
    }

    private void LogSurfaceState()
    {
        IntPtr statsPtr = SpatialUnderstanding.Instance.UnderstandingDLL.GetStaticPlayspaceStatsPtr();
        if (SpatialUnderstandingDll.Imports.QueryPlayspaceStats(statsPtr) != 0)
        {
            var stats = SpatialUnderstanding.Instance.UnderstandingDLL.GetStaticPlayspaceStats();
            this.InstructionTextMesh.text = string.Format("TotalSurfaceArea: {0:0.##}\nWallSurfaceArea: {1:0.##}\nHorizSurfaceArea: {2:0.##}", stats.TotalSurfaceArea, stats.WallSurfaceArea, stats.HorizSurfaceArea);
        }
    }

    private bool CloseToOthers(Vector3 check_pos)
    {
        if (image_positions.Count == 0) return false;
        for (int i = 0; i < image_positions.Count; i++)
        {
            if (1.2f > Vector3.Distance(check_pos, image_positions[i]))
            {
                return true;
            }
        }
        return false;
    }

    private void InstanciateObjectOnFloor()
    {
        const int QueryResultMaxCount = 512;

        SpatialUnderstandingDllTopology.TopologyResult[] _resultsTopology = new SpatialUnderstandingDllTopology.TopologyResult[QueryResultMaxCount];

        var minHeightWallSpace = 1.2f;
        var minWidthWallSpace = 1.2f;

        var resultsTopologyPtr = SpatialUnderstanding.Instance.UnderstandingDLL.PinObject(_resultsTopology);
        var locationCount = SpatialUnderstandingDllTopology.QueryTopology_FindPositionsOnWalls(minHeightWallSpace, minWidthWallSpace, 1.0f, 1.0f,_resultsTopology.Length, resultsTopologyPtr);

        Renderer[] rs = SpatialUnderstanding.Instance.GetComponentsInChildren<Renderer>();
        foreach (Renderer r in rs)
            r.enabled = false;

        if (locationCount > 0)
        {
            System.Random rand = new System.Random();
            for (int i=0; i < locationCount; i++)
            {
                if (!CloseToOthers(_resultsTopology[i].position))
                {
                    image_positions.Add(_resultsTopology[i].position);
                    //if (rand.Next(1, 100) % 2 == 0)
                    //{
                    //    painting = Instantiate(PaintingPrefab, new Vector3(_resultsTopology[i].position.x, 0.3f, _resultsTopology[i].position.z), Quaternion.LookRotation(_resultsTopology[i].normal, Vector3.up));

                    //}
                    //else
                    //{
                    //    painting = Instantiate(PaintingPrefab, new Vector3(_resultsTopology[i].position.x, 0.3f, _resultsTopology[i].position.z), Quaternion.LookRotation(_resultsTopology[i].normal, Vector3.up+new Vector3(0,0,90)));
                    //}

                    ////Instantiate(this.PaintingPrefab, new Vector3(_resultsTopology[i].position.x, 0.7f, _resultsTopology[i].position.z), Quaternion.LookRotation(_resultsTopology[i].normal, new Vector3(0,0,90)));
                    painting = Instantiate(PaintingPrefab, new Vector3(_resultsTopology[i].position.x, 0.3f, _resultsTopology[i].position.z), Quaternion.LookRotation(_resultsTopology[i].normal, Vector3.up));
                    //if (rand.Next(1, 100) % 2 == 0) painting.Rotate(0, 0, 90);
                    painting.name = string.Format("painting{0}", i);
                }
            };

            this.InstructionTextMesh.text = "Placed the hologram";
        }
        else
        {
            this.InstructionTextMesh.text = "I can't found the enough space to place the hologram.";
        }
        this.InstructionTextMesh.text = "Scanned Room";
    }
}
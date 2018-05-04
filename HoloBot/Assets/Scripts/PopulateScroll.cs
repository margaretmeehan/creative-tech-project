using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PopulateScroll : MonoBehaviour {

    [SerializeField]
    public GameObject button;

    string[] artists = {"Picasso", "Dali", "Matisse", "Monet", "Michelangelo", "Van Gogh", "Frida Kahlo", "Warhol", "Jackson Pollock", "Georgia O'Keeffe" };
	
    void Start () {
		foreach(var artist in artists)
        {
            Debug.Log(artist);
            GameObject b = Instantiate(button, gameObject.transform.parent);
            b.GetComponentInChildren<Text>().text = artist;
        }
        Destroy(gameObject);
	}
	
	// Update is called once per frame
	void Update () {
		
	}
}

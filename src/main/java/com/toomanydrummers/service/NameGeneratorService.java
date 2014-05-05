package com.toomanydrummers.service;

import java.util.ArrayList;
import java.util.Random;

import javax.persistence.Tuple;

import org.springframework.stereotype.Service;

@Service
public class NameGeneratorService {

	private String[] nouns = {
			"Example","Balance","Name","Rain","Blood","Credit","Pleasure","Grass"
		,	"War","Value","Thunder","Art","Idea","Top","Front","Wood","Market","Sugar"
		,	"Representative","Desire","Purpose","Leather","Approval","Cough","History"
		,	"Organisation","Control","Time","Condition","Sister","Mother","Copy","Care","Year"
		,	"Comfort","Thing","Authority","Wax","Song","Smash","Day","Debt","Gold","Harmony"
		,	"Society","Mist","Road","Steel","Exchange","Insurance"
	};
	
	private String[] adjectives = {
			"Recondite","Attractive","Dynamic","Miscreant","Rustic","Faint","Endurable"
		,	"Hateful","Four","Separate","Shallow","Brown","Creepy","Imported","Comfortable"
		,	"Gray","Classy","Steadfast","Foolish","Dry","Hospitable","Skillful","Invincible"
		,	"Reflective","Supreme","Divergent","Abject","Spiritual","Sharp","Cowardly","Naughty","Valuable"
		,	"Amusing","Glorious","Devilish","Aware","Full","Victorious","Cool","Adhoc","Hapless","Lethal"
		,	"Depressed","Serious","Crowded","Omniscient","Optimal","Material","Mushy","Handsomely"
	};
	
	public String generateFirstName(){
		Random rng = new Random();
		return adjectives[rng.nextInt(adjectives.length)];
	}
	
	public String generateLastName(){
		Random rng = new Random();
		return nouns[rng.nextInt(nouns.length)];
	}
	
}

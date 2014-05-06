package com.toomanydrummers.service;

import java.util.Random;

import org.springframework.stereotype.Service;

/**
 * This service generates a name for a User who does not specify
 * a name.
 */
@Service
public class NameGeneratorService {

	private String[] nouns = {
			"Example","Balance","Name","Rain","Blood","Credit","Pleasure","Grass"
		,	"War","Value","Thunder","Art","Idea","Top","Front","Wood","Market","Sugar"
		,	"Representative","Desire","Purpose","Leather","Approval","Cough","History"
		,	"Organisation","Control","Time","Condition","Sister","Mother","Copy","Care","Year"
		,	"Comfort","Thing","Authority","Wax","Song","Smash","Day","Debt","Gold","Harmony"
		,	"Society","Mist","Road","Steel","Exchange","Insurance","Bag","Pipe","Cuica","Herny"
		,	"Idiot","Spookyghost","Intestines","Colon","Perjury","Coward","Bustard","Cretin"
		,	"Imbecile","Teenrock","Jungle","JNugle","JFriend","JJohn","Man","Honk","GEP Gun"
		,	"Hobo","Gypsy","Filth","Travelers","Offal","Discharge","Cube","Burdened","Kyle"
		,	"Bogdan","Victim","Bee","Wasp","Enthusiast","Zino","Mazino","Cake","Burger","Flan"
		,	"Polearm","Project","Goo","Drumkit","Cyclist","Tube","Cymbal","Amoeba","Octopus"
		,	"Sausage","Banger","Pasty","Bread","Crust","Matter","Smear","Cheese","Energy","M"
		,	"Zygote","K","Hammer","Toilet","Bed","Mouse","Rat","Thadeus","Mangroove","ASIMO"
		,	"Apollo","Mango","Twit","Gorilla","Egghead","Member","Nugget","Nug","Milk","Cheeks"
		,	"John Madden","Peacock","Scrabble","Um Bongo","Spanky","Helmet","Brain","Underwear"
		,	"Silver","Return Dirty","Chunk","Flesh","Quack","Duck","Goose","Rocket","Herb","Sack"
		,	"Coin","Paper","Computer","Shoes","Nose","Head","Feet","Water","Sewage","Bastion","Barry"
	};
	
	private String[] adjectives = {
			"Recondite","Attractive","Dynamic","Miscreant","Rustic","Faint","Endurable"
		,	"Hateful","Four","Separate","Shallow","Brown","Creepy","Imported","Comfortable"
		,	"Gray","Classy","Steadfast","Foolish","Dry","Hospitable","Skillful","Invincible"
		,	"Reflective","Supreme","Divergent","Abject","Spiritual","Sharp","Cowardly","Naughty","Valuable"
		,	"Amusing","Glorious","Devilish","Aware","Full","Victorious","Cool","Adhoc","Hapless","Lethal"
		,	"Depressed","Serious","Crowded","Omniscient","Optimal","Material","Mushy","Handsomely"
		,	"Jungular","Sentient","Cretinous","Baglike","Enthusiastic","Effervescent","Cacophonous"
		,	"Meatbased","Cumbersome","Scratch n sniff","Thoroughly","Hellomynameis","I am","Lazy"
		,	"Quintessential","Missspeled","Sorry","Stupid","Morbid","Turgid","Embiggened","Delicious"
		,	"Nutritious","Vile","Vulgar","Possibly","Vasodialated","Augmented","WHOAREYOU","onehundredpercent"
		,	"Unfriendly","Ugly","Unclean","Unwashed","Rabid","Unacceptable","Bagpipe Fan","Accordion Master"
		,	"Madame","Goatlord","Bovine","Catbag","Filthy","Irish","Missing","Gooey","uuuuuuu","Despicable"
		,	"Undulous","Ullulating","Classic","Radical","Tubular","Gangrenous","Rotten","Diseased","Fermented"
		,	"Floppy","Buy One Get One","Loadsa","Greetings","Christmas","Legendary","Special","The","Bogdan"
		,	"Unlikely","Usually","Spandexclad","Bernie","Unfortunate","Bumbled","Postman","I love","Lieutenant"
		,	"Captain","Master","Major","Brigadier General","MC","Dr","Mr","Mrs","Little Miss","Marry me","Why am I so"
		,	"Always the","Toothless","Impudent","Hairy","Scary","Dadamuga","Buttery","Wired","Big","Mungo"
		,	"Soiled","Embarassing","Angry","Mad","Porous","Spongy","Wet","Lumpy","Collateral","Incoming","Long John"
		,
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

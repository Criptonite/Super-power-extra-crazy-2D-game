"use strict";

function Sound(file)
{
	this.snd = new Howl(
		{
			src: ["sounds/" + file + ".wav"],
			onloaderror: function(id, message)
			{
				assert(false, file + ".wav: " + message);
			},
			onload: function()
			{
				Console.info("Loaded sound " + file + ".wav");
			}
		});
	this.vol = 1;
}

Sound.prototype.setVolume = function(vol)
{
	this.vol = vol;
};

Sound.prototype.play = function(pos)
{
	var vol = Sound.getVolume(pos);
	if (vol < 0.1)
		return null;

	var id = this.snd.play();
	this.snd.volume(vol * this.vol, id);
	return id;
};

Sound.prototype.volume = function(pos, id)
{
	var vol = Sound.getVolume(pos);
	this.snd.volume(vol * this.vol, id);
};

Event.on("botRespawn", function(pos)
{
	Bot.snd_respawn.play(pos);
});

Event.on("botDead", function(pos, dir, botId)
{
	var level = gameClient.getLevelRender().getLevel();

	Bot.snd_gib.play(pos);
});

Event.on("takeWeapon", function(pos)
{
	Item.sndWeapon.play(pos);
});

Event.on("takeHealth", function(pos)
{
	Item.sndHealth.play(pos);
});


Event.on("shoot", function(bullet)
{
	var center = bullet.dynent.pos;
	var pos = Vector.sub(center, Vector.sub(bullet.dest, center));
	var id = Weapon.skins[bullet.type].sndShoot.play(pos);
	if (bullet.power === ITEM.QUAD)
	{
		Weapon.skins[bullet.type].sndShoot.snd.rate(2, id);
	}
});

//pos - Vector
Sound.getVolume = function(pos)
{
	var vec = Vector.sub(pos, gameClient.getCamera().dynent.pos);
	var vol = 1 - vec.length() / 16;
	if (vol < 0) vol = 0;
	return vol;
};

Sound.setup = function()
{
	var volume = 0.2;
	Howler.mute(true);
	Howler.volume(volume);

	Console.addCommand("soundVolume", "volume of sound 0 - 1 (default 0.2)", function(val)
	{
		if (!val)
		{
			Console.debug("Volume =", volume);
		}
		else
		{
			volume = parseFloat(val);
			Howler.volume(parseFloat(volume));
		}
	});
};
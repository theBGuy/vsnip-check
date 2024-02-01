"use strict";
/* eslint-disable dot-notation */
/**
*  @filename    NTItemAlias.js
*  @author      kolton
*  @credit      d2nt
*  @desc        Item alias's to work with NTItemParser for kolbots pickit system
*
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.NTIPAliasStat = exports.NTIPAliasColor = exports.NTIPAliasFlag = exports.NTIPAliasQuality = exports.NTIPAliasClass = exports.NTIPAliasClassID = exports.NTIPAliasType = void 0;
const sdk = {
    skills: {
        get: {
            RightName: 0,
            LeftName: 1,
            RightId: 2,
            LeftId: 3,
            AllSkills: 4
        },
        hand: {
            Right: 0,
            Left: 1,
            LeftNoShift: 2,
            RightShift: 3,
        },
        subindex: {
            HardPoints: 0,
            SoftPoints: 1
        },
        // General
        Attack: 0,
        Kick: 1,
        Throw: 2,
        Unsummon: 3,
        LeftHandThrow: 4,
        LeftHandSwing: 5,
        // Amazon
        MagicArrow: 6,
        FireArrow: 7,
        InnerSight: 8,
        CriticalStrike: 9,
        Jab: 10,
        ColdArrow: 11,
        MultipleShot: 12,
        Dodge: 13,
        PowerStrike: 14,
        PoisonJavelin: 15,
        ExplodingArrow: 16,
        SlowMissiles: 17,
        Avoid: 18,
        Impale: 19,
        LightningBolt: 20,
        IceArrow: 21,
        GuidedArrow: 22,
        Penetrate: 23,
        ChargedStrike: 24,
        PlagueJavelin: 25,
        Strafe: 26,
        ImmolationArrow: 27,
        Dopplezon: 28,
        Decoy: 28,
        Evade: 29,
        Fend: 30,
        FreezingArrow: 31,
        Valkyrie: 32,
        Pierce: 33,
        LightningStrike: 34,
        LightningFury: 35,
        // Sorc
        FireBolt: 36,
        Warmth: 37,
        ChargedBolt: 38,
        IceBolt: 39,
        FrozenArmor: 40,
        Inferno: 41,
        StaticField: 42,
        Telekinesis: 43,
        FrostNova: 44,
        IceBlast: 45,
        Blaze: 46,
        FireBall: 47,
        Nova: 48,
        Lightning: 49,
        ShiverArmor: 50,
        FireWall: 51,
        Enchant: 52,
        ChainLightning: 53,
        Teleport: 54,
        GlacialSpike: 55,
        Meteor: 56,
        ThunderStorm: 57,
        EnergyShield: 58,
        Blizzard: 59,
        ChillingArmor: 60,
        FireMastery: 61,
        Hydra: 62,
        LightningMastery: 63,
        FrozenOrb: 64,
        ColdMastery: 65,
        // Necro
        AmplifyDamage: 66,
        Teeth: 67,
        BoneArmor: 68,
        SkeletonMastery: 69,
        RaiseSkeleton: 70,
        DimVision: 71,
        Weaken: 72,
        PoisonDagger: 73,
        CorpseExplosion: 74,
        ClayGolem: 75,
        IronMaiden: 76,
        Terror: 77,
        BoneWall: 78,
        GolemMastery: 79,
        RaiseSkeletalMage: 80,
        Confuse: 81,
        LifeTap: 82,
        PoisonExplosion: 83,
        BoneSpear: 84,
        BloodGolem: 85,
        Attract: 86,
        Decrepify: 87,
        BonePrison: 88,
        SummonResist: 89,
        IronGolem: 90,
        LowerResist: 91,
        PoisonNova: 92,
        BoneSpirit: 93,
        FireGolem: 94,
        Revive: 95,
        // Paladin
        Sacrifice: 96,
        Smite: 97,
        Might: 98,
        Prayer: 99,
        ResistFire: 100,
        HolyBolt: 101,
        HolyFire: 102,
        Thorns: 103,
        Defiance: 104,
        ResistCold: 105,
        Zeal: 106,
        Charge: 107,
        BlessedAim: 108,
        Cleansing: 109,
        ResistLightning: 110,
        Vengeance: 111,
        BlessedHammer: 112,
        Concentration: 113,
        HolyFreeze: 114,
        Vigor: 115,
        Conversion: 116,
        HolyShield: 117,
        HolyShock: 118,
        Sanctuary: 119,
        Meditation: 120,
        FistoftheHeavens: 121,
        Fanaticism: 122,
        Conviction: 123,
        Redemption: 124,
        Salvation: 125,
        // Barb
        Bash: 126,
        SwordMastery: 127,
        AxeMastery: 128,
        MaceMastery: 129,
        Howl: 130,
        FindPotion: 131,
        Leap: 132,
        DoubleSwing: 133,
        PoleArmMastery: 134,
        ThrowingMastery: 135,
        SpearMastery: 136,
        Taunt: 137,
        Shout: 138,
        Stun: 139,
        DoubleThrow: 140,
        IncreasedStamina: 141,
        FindItem: 142,
        LeapAttack: 143,
        Concentrate: 144,
        IronSkin: 145,
        BattleCry: 146,
        Frenzy: 147,
        IncreasedSpeed: 148,
        BattleOrders: 149,
        GrimWard: 150,
        Whirlwind: 151,
        Berserk: 152,
        NaturalResistance: 153,
        WarCry: 154,
        BattleCommand: 155,
        // General stuff
        IdentifyScroll: 217,
        BookofIdentify: 218,
        TownPortalScroll: 219,
        BookofTownPortal: 220,
        // Druid
        Raven: 221,
        PoisonCreeper: 222, // External
        PlaguePoppy: 222, // Internal
        Werewolf: 223, // External
        Wearwolf: 223, // Internal
        Lycanthropy: 224, // External
        ShapeShifting: 224, // Internal
        Firestorm: 225,
        OakSage: 226,
        SpiritWolf: 227, // External
        SummonSpiritWolf: 227, // Internal
        Werebear: 228, // External
        Wearbear: 228, // Internal
        MoltenBoulder: 229,
        ArcticBlast: 230,
        CarrionVine: 231, // External
        CycleofLife: 231, // Internal
        FeralRage: 232,
        Maul: 233,
        Fissure: 234, // Internal
        Eruption: 234, // Internal
        CycloneArmor: 235,
        HeartofWolverine: 236,
        SummonDireWolf: 237, // External
        SummonFenris: 237, // Internal
        Rabies: 238,
        FireClaws: 239,
        Twister: 240,
        SolarCreeper: 241, // External
        Vines: 241, // Internal
        Hunger: 242,
        ShockWave: 243,
        Volcano: 244,
        Tornado: 245,
        SpiritofBarbs: 246,
        Grizzly: 247, // External
        SummonGrizzly: 247, // Internal
        Fury: 248,
        Armageddon: 249,
        Hurricane: 250,
        // Assa
        FireBlast: 251, // External
        FireTrauma: 251, // Internal
        ClawMastery: 252,
        PsychicHammer: 253,
        TigerStrike: 254,
        DragonTalon: 255,
        ShockWeb: 256, // External
        ShockField: 256, // Internal
        BladeSentinel: 257,
        Quickness: 258, // Internal name
        BurstofSpeed: 258, // Shown name
        FistsofFire: 259,
        DragonClaw: 260,
        ChargedBoltSentry: 261,
        WakeofFire: 262, // External
        WakeofFireSentry: 262, // Internal
        WeaponBlock: 263,
        CloakofShadows: 264,
        CobraStrike: 265,
        BladeFury: 266,
        Fade: 267,
        ShadowWarrior: 268,
        ClawsofThunder: 269,
        DragonTail: 270,
        LightningSentry: 271,
        WakeofInferno: 272, // External
        InfernoSentry: 272, // Internal
        MindBlast: 273,
        BladesofIce: 274,
        DragonFlight: 275,
        DeathSentry: 276,
        BladeShield: 277,
        Venom: 278,
        ShadowMaster: 279,
        PhoenixStrike: 280, // External
        RoyalStrike: 280, // Internal
        WakeofDestructionSentry: 281, // Not used?
        Summoner: 500, // special
        tabs: {
            // Ama
            BowandCrossbow: 0,
            PassiveandMagic: 1,
            JavelinandSpear: 2,
            // Sorc
            Fire: 8,
            Lightning: 9,
            Cold: 10,
            // Necro
            Curses: 16,
            PoisonandBone: 17,
            NecroSummoning: 18,
            // Pala
            PalaCombat: 24,
            Offensive: 25,
            Defensive: 26,
            // Barb
            BarbCombat: 32,
            Masteries: 33,
            Warcries: 34,
            // Druid
            DruidSummon: 40,
            ShapeShifting: 41,
            Elemental: 42,
            // Assa
            Traps: 48,
            ShadowDisciplines: 49,
            MartialArts: 50,
        }
    },
};
/** @global */
exports.NTIPAliasType = {};
exports.NTIPAliasType["shield"] = 2;
exports.NTIPAliasType["armor"] = 3;
exports.NTIPAliasType["gold"] = 4;
exports.NTIPAliasType["bowquiver"] = 5;
exports.NTIPAliasType["crossbowquiver"] = 6;
exports.NTIPAliasType["playerbodypart"] = 7;
exports.NTIPAliasType["herb"] = 8;
exports.NTIPAliasType["potion"] = 9;
exports.NTIPAliasType["ring"] = 10;
exports.NTIPAliasType["elixir"] = 11;
exports.NTIPAliasType["amulet"] = 12;
exports.NTIPAliasType["charm"] = 13;
exports.NTIPAliasType["notused"] = 14;
exports.NTIPAliasType["boots"] = 15;
exports.NTIPAliasType["gloves"] = 16;
exports.NTIPAliasType["notused"] = 17;
exports.NTIPAliasType["book"] = 18;
exports.NTIPAliasType["belt"] = 19;
exports.NTIPAliasType["gem"] = 20;
exports.NTIPAliasType["torch"] = 21;
exports.NTIPAliasType["scroll"] = 22;
exports.NTIPAliasType["notused"] = 23;
exports.NTIPAliasType["scepter"] = 24;
exports.NTIPAliasType["wand"] = 25;
exports.NTIPAliasType["staff"] = 26;
exports.NTIPAliasType["bow"] = 27;
exports.NTIPAliasType["axe"] = 28;
exports.NTIPAliasType["club"] = 29;
exports.NTIPAliasType["sword"] = 30;
exports.NTIPAliasType["hammer"] = 31;
exports.NTIPAliasType["knife"] = 32;
exports.NTIPAliasType["spear"] = 33;
exports.NTIPAliasType["polearm"] = 34;
exports.NTIPAliasType["crossbow"] = 35;
exports.NTIPAliasType["mace"] = 36;
exports.NTIPAliasType["helm"] = 37;
exports.NTIPAliasType["missilepotion"] = 38;
exports.NTIPAliasType["quest"] = 39;
exports.NTIPAliasType["bodypart"] = 40;
exports.NTIPAliasType["key"] = 41;
exports.NTIPAliasType["throwingknife"] = 42;
exports.NTIPAliasType["throwingaxe"] = 43;
exports.NTIPAliasType["javelin"] = 44;
exports.NTIPAliasType["weapon"] = 45;
exports.NTIPAliasType["meleeweapon"] = 46;
exports.NTIPAliasType["missileweapon"] = 47;
exports.NTIPAliasType["thrownweapon"] = 48;
exports.NTIPAliasType["comboweapon"] = 49;
exports.NTIPAliasType["anyarmor"] = 50;
exports.NTIPAliasType["anyshield"] = 51;
exports.NTIPAliasType["miscellaneous"] = 52;
exports.NTIPAliasType["socketfiller"] = 53;
exports.NTIPAliasType["secondhand"] = 54;
exports.NTIPAliasType["stavesandrods"] = 55;
exports.NTIPAliasType["missile"] = 56;
exports.NTIPAliasType["blunt"] = 57;
exports.NTIPAliasType["jewel"] = 58;
exports.NTIPAliasType["classspecific"] = 59;
exports.NTIPAliasType["amazonitem"] = 60;
exports.NTIPAliasType["barbarianitem"] = 61;
exports.NTIPAliasType["necromanceritem"] = 62;
exports.NTIPAliasType["paladinitem"] = 63;
exports.NTIPAliasType["sorceressitem"] = 64;
exports.NTIPAliasType["assassinitem"] = 65;
exports.NTIPAliasType["druiditem"] = 66;
exports.NTIPAliasType["handtohand"] = 67;
exports.NTIPAliasType["orb"] = 68;
exports.NTIPAliasType["voodooheads"] = 69;
exports.NTIPAliasType["auricshields"] = 70;
exports.NTIPAliasType["primalhelm"] = 71;
exports.NTIPAliasType["pelt"] = 72;
exports.NTIPAliasType["cloak"] = 73;
exports.NTIPAliasType["rune"] = 74;
exports.NTIPAliasType["circlet"] = 75;
exports.NTIPAliasType["healingpotion"] = 76;
exports.NTIPAliasType["manapotion"] = 77;
exports.NTIPAliasType["rejuvpotion"] = 78;
exports.NTIPAliasType["staminapotion"] = 79;
exports.NTIPAliasType["antidotepotion"] = 80;
exports.NTIPAliasType["thawingpotion"] = 81;
exports.NTIPAliasType["smallcharm"] = 82;
exports.NTIPAliasType["mediumcharm"] = 83;
exports.NTIPAliasType["largecharm"] = 84;
exports.NTIPAliasType["amazonbow"] = 85;
exports.NTIPAliasType["amazonspear"] = 86;
exports.NTIPAliasType["amazonjavelin"] = 87;
exports.NTIPAliasType["assassinclaw"] = 88;
exports.NTIPAliasType["magicbowquiv"] = 89;
exports.NTIPAliasType["magicxbowquiv"] = 90;
exports.NTIPAliasType["chippedgem"] = 91;
exports.NTIPAliasType["flawedgem"] = 92;
exports.NTIPAliasType["standardgem"] = 93;
exports.NTIPAliasType["flawlessgem"] = 94;
exports.NTIPAliasType["perfectgem"] = 95;
exports.NTIPAliasType["amethyst"] = 96;
exports.NTIPAliasType["diamond"] = 97;
exports.NTIPAliasType["emerald"] = 98;
exports.NTIPAliasType["ruby"] = 99;
exports.NTIPAliasType["sapphire"] = 100;
exports.NTIPAliasType["topaz"] = 101;
exports.NTIPAliasType["skull"] = 102;
/** @global */
exports.NTIPAliasClassID = {};
exports.NTIPAliasClassID["hax"] = 0;
exports.NTIPAliasClassID["handaxe"] = 0;
exports.NTIPAliasClassID["axe"] = 1;
exports.NTIPAliasClassID["2ax"] = 2;
exports.NTIPAliasClassID["doubleaxe"] = 2;
exports.NTIPAliasClassID["mpi"] = 3;
exports.NTIPAliasClassID["militarypick"] = 3;
exports.NTIPAliasClassID["wax"] = 4;
exports.NTIPAliasClassID["waraxe"] = 4;
exports.NTIPAliasClassID["lax"] = 5;
exports.NTIPAliasClassID["largeaxe"] = 5;
exports.NTIPAliasClassID["bax"] = 6;
exports.NTIPAliasClassID["broadaxe"] = 6;
exports.NTIPAliasClassID["btx"] = 7;
exports.NTIPAliasClassID["battleaxe"] = 7;
exports.NTIPAliasClassID["gax"] = 8;
exports.NTIPAliasClassID["greataxe"] = 8;
exports.NTIPAliasClassID["gix"] = 9;
exports.NTIPAliasClassID["giantaxe"] = 9;
exports.NTIPAliasClassID["wnd"] = 10;
exports.NTIPAliasClassID["wand"] = 10;
exports.NTIPAliasClassID["ywn"] = 11;
exports.NTIPAliasClassID["yewwand"] = 11;
exports.NTIPAliasClassID["bwn"] = 12;
exports.NTIPAliasClassID["bonewand"] = 12;
exports.NTIPAliasClassID["gwn"] = 13;
exports.NTIPAliasClassID["grimwand"] = 13;
exports.NTIPAliasClassID["clb"] = 14;
exports.NTIPAliasClassID["club"] = 14;
exports.NTIPAliasClassID["scp"] = 15;
exports.NTIPAliasClassID["scepter"] = 15;
exports.NTIPAliasClassID["gsc"] = 16;
exports.NTIPAliasClassID["grandscepter"] = 16;
exports.NTIPAliasClassID["wsp"] = 17;
exports.NTIPAliasClassID["warscepter"] = 17;
exports.NTIPAliasClassID["spc"] = 18;
exports.NTIPAliasClassID["spikedclub"] = 18;
exports.NTIPAliasClassID["mac"] = 19;
exports.NTIPAliasClassID["mace"] = 19;
exports.NTIPAliasClassID["mst"] = 20;
exports.NTIPAliasClassID["morningstar"] = 20;
exports.NTIPAliasClassID["fla"] = 21;
exports.NTIPAliasClassID["flail"] = 21;
exports.NTIPAliasClassID["whm"] = 22;
exports.NTIPAliasClassID["warhammer"] = 22;
exports.NTIPAliasClassID["mau"] = 23;
exports.NTIPAliasClassID["maul"] = 23;
exports.NTIPAliasClassID["gma"] = 24;
exports.NTIPAliasClassID["greatmaul"] = 24;
exports.NTIPAliasClassID["ssd"] = 25;
exports.NTIPAliasClassID["shortsword"] = 25;
exports.NTIPAliasClassID["scm"] = 26;
exports.NTIPAliasClassID["scimitar"] = 26;
exports.NTIPAliasClassID["sbr"] = 27;
exports.NTIPAliasClassID["sabre"] = 27;
exports.NTIPAliasClassID["flc"] = 28;
exports.NTIPAliasClassID["falchion"] = 28;
exports.NTIPAliasClassID["crs"] = 29;
exports.NTIPAliasClassID["crystalsword"] = 29;
exports.NTIPAliasClassID["bsd"] = 30;
exports.NTIPAliasClassID["broadsword"] = 30;
exports.NTIPAliasClassID["lsd"] = 31;
exports.NTIPAliasClassID["longsword"] = 31;
exports.NTIPAliasClassID["wsd"] = 32;
exports.NTIPAliasClassID["warsword"] = 32;
exports.NTIPAliasClassID["2hs"] = 33;
exports.NTIPAliasClassID["twohandedsword"] = 33;
exports.NTIPAliasClassID["clm"] = 34;
exports.NTIPAliasClassID["claymore"] = 34;
exports.NTIPAliasClassID["gis"] = 35;
exports.NTIPAliasClassID["giantsword"] = 35;
exports.NTIPAliasClassID["bsw"] = 36;
exports.NTIPAliasClassID["bastardsword"] = 36;
exports.NTIPAliasClassID["flb"] = 37;
exports.NTIPAliasClassID["flamberge"] = 37;
exports.NTIPAliasClassID["gsd"] = 38;
exports.NTIPAliasClassID["greatsword"] = 38;
exports.NTIPAliasClassID["dgr"] = 39;
exports.NTIPAliasClassID["dagger"] = 39;
exports.NTIPAliasClassID["dir"] = 40;
exports.NTIPAliasClassID["dirk"] = 40;
exports.NTIPAliasClassID["kri"] = 41;
exports.NTIPAliasClassID["kris"] = 41;
exports.NTIPAliasClassID["bld"] = 42;
exports.NTIPAliasClassID["blade"] = 42;
exports.NTIPAliasClassID["tkf"] = 43;
exports.NTIPAliasClassID["throwingknife"] = 43;
exports.NTIPAliasClassID["tax"] = 44;
exports.NTIPAliasClassID["throwingaxe"] = 44;
exports.NTIPAliasClassID["bkf"] = 45;
exports.NTIPAliasClassID["balancedknife"] = 45;
exports.NTIPAliasClassID["bal"] = 46;
exports.NTIPAliasClassID["balancedaxe"] = 46;
exports.NTIPAliasClassID["jav"] = 47;
exports.NTIPAliasClassID["javelin"] = 47;
exports.NTIPAliasClassID["pil"] = 48;
exports.NTIPAliasClassID["pilum"] = 48;
exports.NTIPAliasClassID["ssp"] = 49;
exports.NTIPAliasClassID["shortspear"] = 49;
exports.NTIPAliasClassID["glv"] = 50;
exports.NTIPAliasClassID["glaive"] = 50;
exports.NTIPAliasClassID["tsp"] = 51;
exports.NTIPAliasClassID["throwingspear"] = 51;
exports.NTIPAliasClassID["spr"] = 52;
exports.NTIPAliasClassID["spear"] = 52;
exports.NTIPAliasClassID["tri"] = 53;
exports.NTIPAliasClassID["trident"] = 53;
exports.NTIPAliasClassID["brn"] = 54;
exports.NTIPAliasClassID["brandistock"] = 54;
exports.NTIPAliasClassID["spt"] = 55;
exports.NTIPAliasClassID["spetum"] = 55;
exports.NTIPAliasClassID["pik"] = 56;
exports.NTIPAliasClassID["pike"] = 56;
exports.NTIPAliasClassID["bar"] = 57;
exports.NTIPAliasClassID["bardiche"] = 57;
exports.NTIPAliasClassID["vou"] = 58;
exports.NTIPAliasClassID["voulge"] = 58;
exports.NTIPAliasClassID["scy"] = 59;
exports.NTIPAliasClassID["scythe"] = 59;
exports.NTIPAliasClassID["pax"] = 60;
exports.NTIPAliasClassID["poleaxe"] = 60;
exports.NTIPAliasClassID["hal"] = 61;
exports.NTIPAliasClassID["halberd"] = 61;
exports.NTIPAliasClassID["wsc"] = 62;
exports.NTIPAliasClassID["warscythe"] = 62;
exports.NTIPAliasClassID["sst"] = 63;
exports.NTIPAliasClassID["shortstaff"] = 63;
exports.NTIPAliasClassID["lst"] = 64;
exports.NTIPAliasClassID["longstaff"] = 64;
exports.NTIPAliasClassID["cst"] = 65;
exports.NTIPAliasClassID["gnarledstaff"] = 65;
exports.NTIPAliasClassID["bst"] = 66;
exports.NTIPAliasClassID["battlestaff"] = 66;
exports.NTIPAliasClassID["wst"] = 67;
exports.NTIPAliasClassID["warstaff"] = 67;
exports.NTIPAliasClassID["sbw"] = 68;
exports.NTIPAliasClassID["shortbow"] = 68;
exports.NTIPAliasClassID["hbw"] = 69;
exports.NTIPAliasClassID["hunter'sbow"] = 69;
exports.NTIPAliasClassID["lbw"] = 70;
exports.NTIPAliasClassID["longbow"] = 70;
exports.NTIPAliasClassID["cbw"] = 71;
exports.NTIPAliasClassID["compositebow"] = 71;
exports.NTIPAliasClassID["sbb"] = 72;
exports.NTIPAliasClassID["shortbattlebow"] = 72;
exports.NTIPAliasClassID["lbb"] = 73;
exports.NTIPAliasClassID["longbattlebow"] = 73;
exports.NTIPAliasClassID["swb"] = 74;
exports.NTIPAliasClassID["shortwarbow"] = 74;
exports.NTIPAliasClassID["lwb"] = 75;
exports.NTIPAliasClassID["longwarbow"] = 75;
exports.NTIPAliasClassID["lxb"] = 76;
exports.NTIPAliasClassID["lightcrossbow"] = 76;
exports.NTIPAliasClassID["mxb"] = 77;
exports.NTIPAliasClassID["crossbow"] = 77;
exports.NTIPAliasClassID["hxb"] = 78;
exports.NTIPAliasClassID["heavycrossbow"] = 78;
exports.NTIPAliasClassID["rxb"] = 79;
exports.NTIPAliasClassID["repeatingcrossbow"] = 79;
exports.NTIPAliasClassID["gps"] = 80;
exports.NTIPAliasClassID["rancidgaspotion"] = 80;
exports.NTIPAliasClassID["ops"] = 81;
exports.NTIPAliasClassID["oilpotion"] = 81;
exports.NTIPAliasClassID["gpm"] = 82;
exports.NTIPAliasClassID["chokinggaspotion"] = 82;
exports.NTIPAliasClassID["opm"] = 83;
exports.NTIPAliasClassID["explodingpotion"] = 83;
exports.NTIPAliasClassID["gpl"] = 84;
exports.NTIPAliasClassID["stranglinggaspotion"] = 84;
exports.NTIPAliasClassID["opl"] = 85;
exports.NTIPAliasClassID["fulminatingpotion"] = 85;
exports.NTIPAliasClassID["d33"] = 86;
exports.NTIPAliasClassID["decoygidbinn"] = 86;
exports.NTIPAliasClassID["g33"] = 87;
exports.NTIPAliasClassID["thegidbinn"] = 87;
exports.NTIPAliasClassID["leg"] = 88;
exports.NTIPAliasClassID["wirt'sleg"] = 88;
exports.NTIPAliasClassID["hdm"] = 89;
exports.NTIPAliasClassID["horadricmalus"] = 89;
exports.NTIPAliasClassID["hfh"] = 90;
exports.NTIPAliasClassID["hellforgehammer"] = 90;
exports.NTIPAliasClassID["hst"] = 91;
exports.NTIPAliasClassID["horadricstaff"] = 91;
exports.NTIPAliasClassID["msf"] = 92;
exports.NTIPAliasClassID["shaftofthehoradricstaff"] = 92;
exports.NTIPAliasClassID["9ha"] = 93;
exports.NTIPAliasClassID["hatchet"] = 93;
exports.NTIPAliasClassID["9ax"] = 94;
exports.NTIPAliasClassID["cleaver"] = 94;
exports.NTIPAliasClassID["92a"] = 95;
exports.NTIPAliasClassID["twinaxe"] = 95;
exports.NTIPAliasClassID["9mp"] = 96;
exports.NTIPAliasClassID["crowbill"] = 96;
exports.NTIPAliasClassID["9wa"] = 97;
exports.NTIPAliasClassID["naga"] = 97;
exports.NTIPAliasClassID["9la"] = 98;
exports.NTIPAliasClassID["militaryaxe"] = 98;
exports.NTIPAliasClassID["9ba"] = 99;
exports.NTIPAliasClassID["beardedaxe"] = 99;
exports.NTIPAliasClassID["9bt"] = 100;
exports.NTIPAliasClassID["tabar"] = 100;
exports.NTIPAliasClassID["9ga"] = 101;
exports.NTIPAliasClassID["gothicaxe"] = 101;
exports.NTIPAliasClassID["9gi"] = 102;
exports.NTIPAliasClassID["ancientaxe"] = 102;
exports.NTIPAliasClassID["9wn"] = 103;
exports.NTIPAliasClassID["burntwand"] = 103;
exports.NTIPAliasClassID["9yw"] = 104;
exports.NTIPAliasClassID["petrifiedwand"] = 104;
exports.NTIPAliasClassID["9bw"] = 105;
exports.NTIPAliasClassID["tombwand"] = 105;
exports.NTIPAliasClassID["9gw"] = 106;
exports.NTIPAliasClassID["gravewand"] = 106;
exports.NTIPAliasClassID["9cl"] = 107;
exports.NTIPAliasClassID["cudgel"] = 107;
exports.NTIPAliasClassID["9sc"] = 108;
exports.NTIPAliasClassID["runescepter"] = 108;
exports.NTIPAliasClassID["9qs"] = 109;
exports.NTIPAliasClassID["holywatersprinkler"] = 109;
exports.NTIPAliasClassID["9ws"] = 110;
exports.NTIPAliasClassID["divinescepter"] = 110;
exports.NTIPAliasClassID["9sp"] = 111;
exports.NTIPAliasClassID["barbedclub"] = 111;
exports.NTIPAliasClassID["9ma"] = 112;
exports.NTIPAliasClassID["flangedmace"] = 112;
exports.NTIPAliasClassID["9mt"] = 113;
exports.NTIPAliasClassID["jaggedstar"] = 113;
exports.NTIPAliasClassID["9fl"] = 114;
exports.NTIPAliasClassID["knout"] = 114;
exports.NTIPAliasClassID["9wh"] = 115;
exports.NTIPAliasClassID["battlehammer"] = 115;
exports.NTIPAliasClassID["9m9"] = 116;
exports.NTIPAliasClassID["warclub"] = 116;
exports.NTIPAliasClassID["9gm"] = 117;
exports.NTIPAliasClassID["marteldefer"] = 117;
exports.NTIPAliasClassID["9ss"] = 118;
exports.NTIPAliasClassID["gladius"] = 118;
exports.NTIPAliasClassID["9sm"] = 119;
exports.NTIPAliasClassID["cutlass"] = 119;
exports.NTIPAliasClassID["9sb"] = 120;
exports.NTIPAliasClassID["shamshir"] = 120;
exports.NTIPAliasClassID["9fc"] = 121;
exports.NTIPAliasClassID["tulwar"] = 121;
exports.NTIPAliasClassID["9cr"] = 122;
exports.NTIPAliasClassID["dimensionalblade"] = 122;
exports.NTIPAliasClassID["9bs"] = 123;
exports.NTIPAliasClassID["battlesword"] = 123;
exports.NTIPAliasClassID["9ls"] = 124;
exports.NTIPAliasClassID["runesword"] = 124;
exports.NTIPAliasClassID["9wd"] = 125;
exports.NTIPAliasClassID["ancientsword"] = 125;
exports.NTIPAliasClassID["92h"] = 126;
exports.NTIPAliasClassID["espandon"] = 126;
exports.NTIPAliasClassID["9cm"] = 127;
exports.NTIPAliasClassID["dacianfalx"] = 127;
exports.NTIPAliasClassID["9gs"] = 128;
exports.NTIPAliasClassID["tusksword"] = 128;
exports.NTIPAliasClassID["9b9"] = 129;
exports.NTIPAliasClassID["gothicsword"] = 129;
exports.NTIPAliasClassID["9fb"] = 130;
exports.NTIPAliasClassID["zweihander"] = 130;
exports.NTIPAliasClassID["9gd"] = 131;
exports.NTIPAliasClassID["executionersword"] = 131;
exports.NTIPAliasClassID["9dg"] = 132;
exports.NTIPAliasClassID["poignard"] = 132;
exports.NTIPAliasClassID["9di"] = 133;
exports.NTIPAliasClassID["rondel"] = 133;
exports.NTIPAliasClassID["9kr"] = 134;
exports.NTIPAliasClassID["cinquedeas"] = 134;
exports.NTIPAliasClassID["9bl"] = 135;
exports.NTIPAliasClassID["stiletto"] = 135;
exports.NTIPAliasClassID["9tk"] = 136;
exports.NTIPAliasClassID["battledart"] = 136;
exports.NTIPAliasClassID["9ta"] = 137;
exports.NTIPAliasClassID["francisca"] = 137;
exports.NTIPAliasClassID["9bk"] = 138;
exports.NTIPAliasClassID["wardart"] = 138;
exports.NTIPAliasClassID["9b8"] = 139;
exports.NTIPAliasClassID["hurlbat"] = 139;
exports.NTIPAliasClassID["9ja"] = 140;
exports.NTIPAliasClassID["warjavelin"] = 140;
exports.NTIPAliasClassID["9pi"] = 141;
exports.NTIPAliasClassID["greatpilum"] = 141;
exports.NTIPAliasClassID["9s9"] = 142;
exports.NTIPAliasClassID["simbilan"] = 142;
exports.NTIPAliasClassID["9gl"] = 143;
exports.NTIPAliasClassID["spiculum"] = 143;
exports.NTIPAliasClassID["9ts"] = 144;
exports.NTIPAliasClassID["harpoon"] = 144;
exports.NTIPAliasClassID["9sr"] = 145;
exports.NTIPAliasClassID["warspear"] = 145;
exports.NTIPAliasClassID["9tr"] = 146;
exports.NTIPAliasClassID["fuscina"] = 146;
exports.NTIPAliasClassID["9br"] = 147;
exports.NTIPAliasClassID["warfork"] = 147;
exports.NTIPAliasClassID["9st"] = 148;
exports.NTIPAliasClassID["yari"] = 148;
exports.NTIPAliasClassID["9p9"] = 149;
exports.NTIPAliasClassID["lance"] = 149;
exports.NTIPAliasClassID["9b7"] = 150;
exports.NTIPAliasClassID["lochaberaxe"] = 150;
exports.NTIPAliasClassID["9vo"] = 151;
exports.NTIPAliasClassID["bill"] = 151;
exports.NTIPAliasClassID["9s8"] = 152;
exports.NTIPAliasClassID["battlescythe"] = 152;
exports.NTIPAliasClassID["9pa"] = 153;
exports.NTIPAliasClassID["partizan"] = 153;
exports.NTIPAliasClassID["9h9"] = 154;
exports.NTIPAliasClassID["becdecorbin"] = 154;
exports.NTIPAliasClassID["9wc"] = 155;
exports.NTIPAliasClassID["grimscythe"] = 155;
exports.NTIPAliasClassID["8ss"] = 156;
exports.NTIPAliasClassID["jostaff"] = 156;
exports.NTIPAliasClassID["8ls"] = 157;
exports.NTIPAliasClassID["quarterstaff"] = 157;
exports.NTIPAliasClassID["8cs"] = 158;
exports.NTIPAliasClassID["cedarstaff"] = 158;
exports.NTIPAliasClassID["8bs"] = 159;
exports.NTIPAliasClassID["gothicstaff"] = 159;
exports.NTIPAliasClassID["8ws"] = 160;
exports.NTIPAliasClassID["runestaff"] = 160;
exports.NTIPAliasClassID["8sb"] = 161;
exports.NTIPAliasClassID["edgebow"] = 161;
exports.NTIPAliasClassID["8hb"] = 162;
exports.NTIPAliasClassID["razorbow"] = 162;
exports.NTIPAliasClassID["8lb"] = 163;
exports.NTIPAliasClassID["cedarbow"] = 163;
exports.NTIPAliasClassID["8cb"] = 164;
exports.NTIPAliasClassID["doublebow"] = 164;
exports.NTIPAliasClassID["8s8"] = 165;
exports.NTIPAliasClassID["shortsiegebow"] = 165;
exports.NTIPAliasClassID["8l8"] = 166;
exports.NTIPAliasClassID["largesiegebow"] = 166;
exports.NTIPAliasClassID["8sw"] = 167;
exports.NTIPAliasClassID["runebow"] = 167;
exports.NTIPAliasClassID["8lw"] = 168;
exports.NTIPAliasClassID["gothicbow"] = 168;
exports.NTIPAliasClassID["8lx"] = 169;
exports.NTIPAliasClassID["arbalest"] = 169;
exports.NTIPAliasClassID["8mx"] = 170;
exports.NTIPAliasClassID["siegecrossbow"] = 170;
exports.NTIPAliasClassID["8hx"] = 171;
exports.NTIPAliasClassID["ballista"] = 171;
exports.NTIPAliasClassID["8rx"] = 172;
exports.NTIPAliasClassID["chukonu"] = 172;
exports.NTIPAliasClassID["qf1"] = 173;
exports.NTIPAliasClassID["khalim'sflail"] = 173;
exports.NTIPAliasClassID["qf2"] = 174;
exports.NTIPAliasClassID["khalim'swill"] = 174;
exports.NTIPAliasClassID["ktr"] = 175;
exports.NTIPAliasClassID["katar"] = 175;
exports.NTIPAliasClassID["wrb"] = 176;
exports.NTIPAliasClassID["wristblade"] = 176;
exports.NTIPAliasClassID["axf"] = 177;
exports.NTIPAliasClassID["hatchethands"] = 177;
exports.NTIPAliasClassID["ces"] = 178;
exports.NTIPAliasClassID["cestus"] = 178;
exports.NTIPAliasClassID["clw"] = 179;
exports.NTIPAliasClassID["claws"] = 179;
exports.NTIPAliasClassID["btl"] = 180;
exports.NTIPAliasClassID["bladetalons"] = 180;
exports.NTIPAliasClassID["skr"] = 181;
exports.NTIPAliasClassID["scissorskatar"] = 181;
exports.NTIPAliasClassID["9ar"] = 182;
exports.NTIPAliasClassID["quhab"] = 182;
exports.NTIPAliasClassID["9wb"] = 183;
exports.NTIPAliasClassID["wristspike"] = 183;
exports.NTIPAliasClassID["9xf"] = 184;
exports.NTIPAliasClassID["fascia"] = 184;
exports.NTIPAliasClassID["9cs"] = 185;
exports.NTIPAliasClassID["handscythe"] = 185;
exports.NTIPAliasClassID["9lw"] = 186;
exports.NTIPAliasClassID["greaterclaws"] = 186;
exports.NTIPAliasClassID["9tw"] = 187;
exports.NTIPAliasClassID["greatertalons"] = 187;
exports.NTIPAliasClassID["9qr"] = 188;
exports.NTIPAliasClassID["scissorsquhab"] = 188;
exports.NTIPAliasClassID["7ar"] = 189;
exports.NTIPAliasClassID["suwayyah"] = 189;
exports.NTIPAliasClassID["7wb"] = 190;
exports.NTIPAliasClassID["wristsword"] = 190;
exports.NTIPAliasClassID["7xf"] = 191;
exports.NTIPAliasClassID["warfist"] = 191;
exports.NTIPAliasClassID["7cs"] = 192;
exports.NTIPAliasClassID["battlecestus"] = 192;
exports.NTIPAliasClassID["7lw"] = 193;
exports.NTIPAliasClassID["feralclaws"] = 193;
exports.NTIPAliasClassID["7tw"] = 194;
exports.NTIPAliasClassID["runictalons"] = 194;
exports.NTIPAliasClassID["7qr"] = 195;
exports.NTIPAliasClassID["scissorssuwayyah"] = 195;
exports.NTIPAliasClassID["7ha"] = 196;
exports.NTIPAliasClassID["tomahawk"] = 196;
exports.NTIPAliasClassID["7ax"] = 197;
exports.NTIPAliasClassID["smallcrescent"] = 197;
exports.NTIPAliasClassID["72a"] = 198;
exports.NTIPAliasClassID["ettinaxe"] = 198;
exports.NTIPAliasClassID["7mp"] = 199;
exports.NTIPAliasClassID["warspike"] = 199;
exports.NTIPAliasClassID["7wa"] = 200;
exports.NTIPAliasClassID["berserkeraxe"] = 200;
exports.NTIPAliasClassID["7la"] = 201;
exports.NTIPAliasClassID["feralaxe"] = 201;
exports.NTIPAliasClassID["7ba"] = 202;
exports.NTIPAliasClassID["silveredgedaxe"] = 202;
exports.NTIPAliasClassID["7bt"] = 203;
exports.NTIPAliasClassID["decapitator"] = 203;
exports.NTIPAliasClassID["7ga"] = 204;
exports.NTIPAliasClassID["championaxe"] = 204;
exports.NTIPAliasClassID["7gi"] = 205;
exports.NTIPAliasClassID["gloriousaxe"] = 205;
exports.NTIPAliasClassID["7wn"] = 206;
exports.NTIPAliasClassID["polishedwand"] = 206;
exports.NTIPAliasClassID["7yw"] = 207;
exports.NTIPAliasClassID["ghostwand"] = 207;
exports.NTIPAliasClassID["7bw"] = 208;
exports.NTIPAliasClassID["lichwand"] = 208;
exports.NTIPAliasClassID["7gw"] = 209;
exports.NTIPAliasClassID["unearthedwand"] = 209;
exports.NTIPAliasClassID["7cl"] = 210;
exports.NTIPAliasClassID["truncheon"] = 210;
exports.NTIPAliasClassID["7sc"] = 211;
exports.NTIPAliasClassID["mightyscepter"] = 211;
exports.NTIPAliasClassID["7qs"] = 212;
exports.NTIPAliasClassID["seraphrod"] = 212;
exports.NTIPAliasClassID["7ws"] = 213;
exports.NTIPAliasClassID["caduceus"] = 213;
exports.NTIPAliasClassID["7sp"] = 214;
exports.NTIPAliasClassID["tyrantclub"] = 214;
exports.NTIPAliasClassID["7ma"] = 215;
exports.NTIPAliasClassID["reinforcedmace"] = 215;
exports.NTIPAliasClassID["7mt"] = 216;
exports.NTIPAliasClassID["devilstar"] = 216;
exports.NTIPAliasClassID["7fl"] = 217;
exports.NTIPAliasClassID["scourge"] = 217;
exports.NTIPAliasClassID["7wh"] = 218;
exports.NTIPAliasClassID["legendarymallet"] = 218;
exports.NTIPAliasClassID["7m7"] = 219;
exports.NTIPAliasClassID["ogremaul"] = 219;
exports.NTIPAliasClassID["7gm"] = 220;
exports.NTIPAliasClassID["thundermaul"] = 220;
exports.NTIPAliasClassID["7ss"] = 221;
exports.NTIPAliasClassID["falcata"] = 221;
exports.NTIPAliasClassID["7sm"] = 222;
exports.NTIPAliasClassID["ataghan"] = 222;
exports.NTIPAliasClassID["7sb"] = 223;
exports.NTIPAliasClassID["elegantblade"] = 223;
exports.NTIPAliasClassID["7fc"] = 224;
exports.NTIPAliasClassID["hydraedge"] = 224;
exports.NTIPAliasClassID["7cr"] = 225;
exports.NTIPAliasClassID["phaseblade"] = 225;
exports.NTIPAliasClassID["7bs"] = 226;
exports.NTIPAliasClassID["conquestsword"] = 226;
exports.NTIPAliasClassID["7ls"] = 227;
exports.NTIPAliasClassID["crypticsword"] = 227;
exports.NTIPAliasClassID["7wd"] = 228;
exports.NTIPAliasClassID["mythicalsword"] = 228;
exports.NTIPAliasClassID["72h"] = 229;
exports.NTIPAliasClassID["legendsword"] = 229;
exports.NTIPAliasClassID["7cm"] = 230;
exports.NTIPAliasClassID["highlandblade"] = 230;
exports.NTIPAliasClassID["7gs"] = 231;
exports.NTIPAliasClassID["balrogblade"] = 231;
exports.NTIPAliasClassID["7b7"] = 232;
exports.NTIPAliasClassID["championsword"] = 232;
exports.NTIPAliasClassID["7fb"] = 233;
exports.NTIPAliasClassID["colossussword"] = 233;
exports.NTIPAliasClassID["7gd"] = 234;
exports.NTIPAliasClassID["colossusblade"] = 234;
exports.NTIPAliasClassID["7dg"] = 235;
exports.NTIPAliasClassID["boneknife"] = 235;
exports.NTIPAliasClassID["7di"] = 236;
exports.NTIPAliasClassID["mithrilpoint"] = 236;
exports.NTIPAliasClassID["7kr"] = 237;
exports.NTIPAliasClassID["fangedknife"] = 237;
exports.NTIPAliasClassID["7bl"] = 238;
exports.NTIPAliasClassID["legendspike"] = 238;
exports.NTIPAliasClassID["7tk"] = 239;
exports.NTIPAliasClassID["flyingknife"] = 239;
exports.NTIPAliasClassID["7ta"] = 240;
exports.NTIPAliasClassID["flyingaxe"] = 240;
exports.NTIPAliasClassID["7bk"] = 241;
exports.NTIPAliasClassID["wingedknife"] = 241;
exports.NTIPAliasClassID["7b8"] = 242;
exports.NTIPAliasClassID["wingedaxe"] = 242;
exports.NTIPAliasClassID["7ja"] = 243;
exports.NTIPAliasClassID["hyperionjavelin"] = 243;
exports.NTIPAliasClassID["7pi"] = 244;
exports.NTIPAliasClassID["stygianpilum"] = 244;
exports.NTIPAliasClassID["7s7"] = 245;
exports.NTIPAliasClassID["balrogspear"] = 245;
exports.NTIPAliasClassID["7gl"] = 246;
exports.NTIPAliasClassID["ghostglaive"] = 246;
exports.NTIPAliasClassID["7ts"] = 247;
exports.NTIPAliasClassID["wingedharpoon"] = 247;
exports.NTIPAliasClassID["7sr"] = 248;
exports.NTIPAliasClassID["hyperionspear"] = 248;
exports.NTIPAliasClassID["7tr"] = 249;
exports.NTIPAliasClassID["stygianpike"] = 249;
exports.NTIPAliasClassID["7br"] = 250;
exports.NTIPAliasClassID["mancatcher"] = 250;
exports.NTIPAliasClassID["7st"] = 251;
exports.NTIPAliasClassID["ghostspear"] = 251;
exports.NTIPAliasClassID["7p7"] = 252;
exports.NTIPAliasClassID["warpike"] = 252;
exports.NTIPAliasClassID["7o7"] = 253;
exports.NTIPAliasClassID["ogreaxe"] = 253;
exports.NTIPAliasClassID["7vo"] = 254;
exports.NTIPAliasClassID["colossusvoulge"] = 254;
exports.NTIPAliasClassID["7s8"] = 255;
exports.NTIPAliasClassID["thresher"] = 255;
exports.NTIPAliasClassID["7pa"] = 256;
exports.NTIPAliasClassID["crypticaxe"] = 256;
exports.NTIPAliasClassID["7h7"] = 257;
exports.NTIPAliasClassID["greatpoleaxe"] = 257;
exports.NTIPAliasClassID["7wc"] = 258;
exports.NTIPAliasClassID["giantthresher"] = 258;
exports.NTIPAliasClassID["6ss"] = 259;
exports.NTIPAliasClassID["walkingstick"] = 259;
exports.NTIPAliasClassID["6ls"] = 260;
exports.NTIPAliasClassID["stalagmite"] = 260;
exports.NTIPAliasClassID["6cs"] = 261;
exports.NTIPAliasClassID["elderstaff"] = 261;
exports.NTIPAliasClassID["6bs"] = 262;
exports.NTIPAliasClassID["shillelagh"] = 262;
exports.NTIPAliasClassID["6ws"] = 263;
exports.NTIPAliasClassID["archonstaff"] = 263;
exports.NTIPAliasClassID["6sb"] = 264;
exports.NTIPAliasClassID["spiderbow"] = 264;
exports.NTIPAliasClassID["6hb"] = 265;
exports.NTIPAliasClassID["bladebow"] = 265;
exports.NTIPAliasClassID["6lb"] = 266;
exports.NTIPAliasClassID["shadowbow"] = 266;
exports.NTIPAliasClassID["6cb"] = 267;
exports.NTIPAliasClassID["greatbow"] = 267;
exports.NTIPAliasClassID["6s7"] = 268;
exports.NTIPAliasClassID["diamondbow"] = 268;
exports.NTIPAliasClassID["6l7"] = 269;
exports.NTIPAliasClassID["crusaderbow"] = 269;
exports.NTIPAliasClassID["6sw"] = 270;
exports.NTIPAliasClassID["wardbow"] = 270;
exports.NTIPAliasClassID["6lw"] = 271;
exports.NTIPAliasClassID["hydrabow"] = 271;
exports.NTIPAliasClassID["6lx"] = 272;
exports.NTIPAliasClassID["pelletbow"] = 272;
exports.NTIPAliasClassID["6mx"] = 273;
exports.NTIPAliasClassID["gorgoncrossbow"] = 273;
exports.NTIPAliasClassID["6hx"] = 274;
exports.NTIPAliasClassID["colossuscrossbow"] = 274;
exports.NTIPAliasClassID["6rx"] = 275;
exports.NTIPAliasClassID["demoncrossbow"] = 275;
exports.NTIPAliasClassID["ob1"] = 276;
exports.NTIPAliasClassID["eagleorb"] = 276;
exports.NTIPAliasClassID["ob2"] = 277;
exports.NTIPAliasClassID["sacredglobe"] = 277;
exports.NTIPAliasClassID["ob3"] = 278;
exports.NTIPAliasClassID["smokedsphere"] = 278;
exports.NTIPAliasClassID["ob4"] = 279;
exports.NTIPAliasClassID["claspedorb"] = 279;
exports.NTIPAliasClassID["ob5"] = 280;
exports.NTIPAliasClassID["jared'sstone"] = 280;
exports.NTIPAliasClassID["am1"] = 281;
exports.NTIPAliasClassID["stagbow"] = 281;
exports.NTIPAliasClassID["am2"] = 282;
exports.NTIPAliasClassID["reflexbow"] = 282;
exports.NTIPAliasClassID["am3"] = 283;
exports.NTIPAliasClassID["maidenspear"] = 283;
exports.NTIPAliasClassID["am4"] = 284;
exports.NTIPAliasClassID["maidenpike"] = 284;
exports.NTIPAliasClassID["am5"] = 285;
exports.NTIPAliasClassID["maidenjavelin"] = 285;
exports.NTIPAliasClassID["ob6"] = 286;
exports.NTIPAliasClassID["glowingorb"] = 286;
exports.NTIPAliasClassID["ob7"] = 287;
exports.NTIPAliasClassID["crystallineglobe"] = 287;
exports.NTIPAliasClassID["ob8"] = 288;
exports.NTIPAliasClassID["cloudysphere"] = 288;
exports.NTIPAliasClassID["ob9"] = 289;
exports.NTIPAliasClassID["sparklingball"] = 289;
exports.NTIPAliasClassID["oba"] = 290;
exports.NTIPAliasClassID["swirlingcrystal"] = 290;
exports.NTIPAliasClassID["am6"] = 291;
exports.NTIPAliasClassID["ashwoodbow"] = 291;
exports.NTIPAliasClassID["am7"] = 292;
exports.NTIPAliasClassID["ceremonialbow"] = 292;
exports.NTIPAliasClassID["am8"] = 293;
exports.NTIPAliasClassID["ceremonialspear"] = 293;
exports.NTIPAliasClassID["am9"] = 294;
exports.NTIPAliasClassID["ceremonialpike"] = 294;
exports.NTIPAliasClassID["ama"] = 295;
exports.NTIPAliasClassID["ceremonialjavelin"] = 295;
exports.NTIPAliasClassID["obb"] = 296;
exports.NTIPAliasClassID["heavenlystone"] = 296;
exports.NTIPAliasClassID["obc"] = 297;
exports.NTIPAliasClassID["eldritchorb"] = 297;
exports.NTIPAliasClassID["obd"] = 298;
exports.NTIPAliasClassID["demonheart"] = 298;
exports.NTIPAliasClassID["obe"] = 299;
exports.NTIPAliasClassID["vortexorb"] = 299;
exports.NTIPAliasClassID["obf"] = 300;
exports.NTIPAliasClassID["dimensionalshard"] = 300;
exports.NTIPAliasClassID["amb"] = 301;
exports.NTIPAliasClassID["matriarchalbow"] = 301;
exports.NTIPAliasClassID["amc"] = 302;
exports.NTIPAliasClassID["grandmatronbow"] = 302;
exports.NTIPAliasClassID["amd"] = 303;
exports.NTIPAliasClassID["matriarchalspear"] = 303;
exports.NTIPAliasClassID["ame"] = 304;
exports.NTIPAliasClassID["matriarchalpike"] = 304;
exports.NTIPAliasClassID["amf"] = 305;
exports.NTIPAliasClassID["matriarchaljavelin"] = 305;
exports.NTIPAliasClassID["cap"] = 306;
exports.NTIPAliasClassID["skp"] = 307;
exports.NTIPAliasClassID["skullcap"] = 307;
exports.NTIPAliasClassID["hlm"] = 308;
exports.NTIPAliasClassID["helm"] = 308;
exports.NTIPAliasClassID["fhl"] = 309;
exports.NTIPAliasClassID["fullhelm"] = 309;
exports.NTIPAliasClassID["ghm"] = 310;
exports.NTIPAliasClassID["greathelm"] = 310;
exports.NTIPAliasClassID["crn"] = 311;
exports.NTIPAliasClassID["crown"] = 311;
exports.NTIPAliasClassID["msk"] = 312;
exports.NTIPAliasClassID["mask"] = 312;
exports.NTIPAliasClassID["qui"] = 313;
exports.NTIPAliasClassID["quiltedarmor"] = 313;
exports.NTIPAliasClassID["lea"] = 314;
exports.NTIPAliasClassID["leatherarmor"] = 314;
exports.NTIPAliasClassID["hla"] = 315;
exports.NTIPAliasClassID["hardleatherarmor"] = 315;
exports.NTIPAliasClassID["stu"] = 316;
exports.NTIPAliasClassID["studdedleather"] = 316;
exports.NTIPAliasClassID["rng"] = 317;
exports.NTIPAliasClassID["ringmail"] = 317;
exports.NTIPAliasClassID["scl"] = 318;
exports.NTIPAliasClassID["scalemail"] = 318;
exports.NTIPAliasClassID["chn"] = 319;
exports.NTIPAliasClassID["chainmail"] = 319;
exports.NTIPAliasClassID["brs"] = 320;
exports.NTIPAliasClassID["breastplate"] = 320;
exports.NTIPAliasClassID["spl"] = 321;
exports.NTIPAliasClassID["splintmail"] = 321;
exports.NTIPAliasClassID["plt"] = 322;
exports.NTIPAliasClassID["platemail"] = 322;
exports.NTIPAliasClassID["fld"] = 323;
exports.NTIPAliasClassID["fieldplate"] = 323;
exports.NTIPAliasClassID["gth"] = 324;
exports.NTIPAliasClassID["gothicplate"] = 324;
exports.NTIPAliasClassID["ful"] = 325;
exports.NTIPAliasClassID["fullplatemail"] = 325;
exports.NTIPAliasClassID["aar"] = 326;
exports.NTIPAliasClassID["ancientarmor"] = 326;
exports.NTIPAliasClassID["ltp"] = 327;
exports.NTIPAliasClassID["lightplate"] = 327;
exports.NTIPAliasClassID["buc"] = 328;
exports.NTIPAliasClassID["buckler"] = 328;
exports.NTIPAliasClassID["sml"] = 329;
exports.NTIPAliasClassID["smallshield"] = 329;
exports.NTIPAliasClassID["lrg"] = 330;
exports.NTIPAliasClassID["largeshield"] = 330;
exports.NTIPAliasClassID["kit"] = 331;
exports.NTIPAliasClassID["kiteshield"] = 331;
exports.NTIPAliasClassID["tow"] = 332;
exports.NTIPAliasClassID["towershield"] = 332;
exports.NTIPAliasClassID["gts"] = 333;
exports.NTIPAliasClassID["gothicshield"] = 333;
exports.NTIPAliasClassID["lgl"] = 334;
exports.NTIPAliasClassID["leathergloves"] = 334;
exports.NTIPAliasClassID["vgl"] = 335;
exports.NTIPAliasClassID["heavygloves"] = 335;
exports.NTIPAliasClassID["mgl"] = 336;
exports.NTIPAliasClassID["chaingloves"] = 336;
exports.NTIPAliasClassID["tgl"] = 337;
exports.NTIPAliasClassID["lightgauntlets"] = 337;
exports.NTIPAliasClassID["hgl"] = 338;
exports.NTIPAliasClassID["gauntlets"] = 338;
exports.NTIPAliasClassID["lbt"] = 339;
exports.NTIPAliasClassID["boots"] = 339;
exports.NTIPAliasClassID["vbt"] = 340;
exports.NTIPAliasClassID["heavyboots"] = 340;
exports.NTIPAliasClassID["mbt"] = 341;
exports.NTIPAliasClassID["chainboots"] = 341;
exports.NTIPAliasClassID["tbt"] = 342;
exports.NTIPAliasClassID["lightplatedboots"] = 342;
exports.NTIPAliasClassID["hbt"] = 343;
exports.NTIPAliasClassID["greaves"] = 343;
exports.NTIPAliasClassID["lbl"] = 344;
exports.NTIPAliasClassID["sash"] = 344;
exports.NTIPAliasClassID["vbl"] = 345;
exports.NTIPAliasClassID["lightbelt"] = 345;
exports.NTIPAliasClassID["mbl"] = 346;
exports.NTIPAliasClassID["belt"] = 346;
exports.NTIPAliasClassID["tbl"] = 347;
exports.NTIPAliasClassID["heavybelt"] = 347;
exports.NTIPAliasClassID["hbl"] = 348;
exports.NTIPAliasClassID["platedbelt"] = 348;
exports.NTIPAliasClassID["bhm"] = 349;
exports.NTIPAliasClassID["bonehelm"] = 349;
exports.NTIPAliasClassID["bsh"] = 350;
exports.NTIPAliasClassID["boneshield"] = 350;
exports.NTIPAliasClassID["spk"] = 351;
exports.NTIPAliasClassID["spikedshield"] = 351;
exports.NTIPAliasClassID["xap"] = 352;
exports.NTIPAliasClassID["warhat"] = 352;
exports.NTIPAliasClassID["xkp"] = 353;
exports.NTIPAliasClassID["sallet"] = 353;
exports.NTIPAliasClassID["xlm"] = 354;
exports.NTIPAliasClassID["casque"] = 354;
exports.NTIPAliasClassID["xhl"] = 355;
exports.NTIPAliasClassID["basinet"] = 355;
exports.NTIPAliasClassID["xhm"] = 356;
exports.NTIPAliasClassID["wingedhelm"] = 356;
exports.NTIPAliasClassID["xrn"] = 357;
exports.NTIPAliasClassID["grandcrown"] = 357;
exports.NTIPAliasClassID["xsk"] = 358;
exports.NTIPAliasClassID["deathmask"] = 358;
exports.NTIPAliasClassID["xui"] = 359;
exports.NTIPAliasClassID["ghostarmor"] = 359;
exports.NTIPAliasClassID["xea"] = 360;
exports.NTIPAliasClassID["serpentskinarmor"] = 360;
exports.NTIPAliasClassID["xla"] = 361;
exports.NTIPAliasClassID["demonhidearmor"] = 361;
exports.NTIPAliasClassID["xtu"] = 362;
exports.NTIPAliasClassID["trellisedarmor"] = 362;
exports.NTIPAliasClassID["xng"] = 363;
exports.NTIPAliasClassID["linkedmail"] = 363;
exports.NTIPAliasClassID["xcl"] = 364;
exports.NTIPAliasClassID["tigulatedmail"] = 364;
exports.NTIPAliasClassID["xhn"] = 365;
exports.NTIPAliasClassID["mesharmor"] = 365;
exports.NTIPAliasClassID["xrs"] = 366;
exports.NTIPAliasClassID["cuirass"] = 366;
exports.NTIPAliasClassID["xpl"] = 367;
exports.NTIPAliasClassID["russetarmor"] = 367;
exports.NTIPAliasClassID["xlt"] = 368;
exports.NTIPAliasClassID["templarcoat"] = 368;
exports.NTIPAliasClassID["xld"] = 369;
exports.NTIPAliasClassID["sharktootharmor"] = 369;
exports.NTIPAliasClassID["xth"] = 370;
exports.NTIPAliasClassID["embossedplate"] = 370;
exports.NTIPAliasClassID["xul"] = 371;
exports.NTIPAliasClassID["chaosarmor"] = 371;
exports.NTIPAliasClassID["xar"] = 372;
exports.NTIPAliasClassID["ornateplate"] = 372;
exports.NTIPAliasClassID["xtp"] = 373;
exports.NTIPAliasClassID["mageplate"] = 373;
exports.NTIPAliasClassID["xuc"] = 374;
exports.NTIPAliasClassID["defender"] = 374;
exports.NTIPAliasClassID["xml"] = 375;
exports.NTIPAliasClassID["roundshield"] = 375;
exports.NTIPAliasClassID["xrg"] = 376;
exports.NTIPAliasClassID["scutum"] = 376;
exports.NTIPAliasClassID["xit"] = 377;
exports.NTIPAliasClassID["dragonshield"] = 377;
exports.NTIPAliasClassID["xow"] = 378;
exports.NTIPAliasClassID["pavise"] = 378;
exports.NTIPAliasClassID["xts"] = 379;
exports.NTIPAliasClassID["ancientshield"] = 379;
exports.NTIPAliasClassID["xlg"] = 380;
exports.NTIPAliasClassID["demonhidegloves"] = 380;
exports.NTIPAliasClassID["xvg"] = 381;
exports.NTIPAliasClassID["sharkskingloves"] = 381;
exports.NTIPAliasClassID["xmg"] = 382;
exports.NTIPAliasClassID["heavybracers"] = 382;
exports.NTIPAliasClassID["xtg"] = 383;
exports.NTIPAliasClassID["battlegauntlets"] = 383;
exports.NTIPAliasClassID["xhg"] = 384;
exports.NTIPAliasClassID["wargauntlets"] = 384;
exports.NTIPAliasClassID["xlb"] = 385;
exports.NTIPAliasClassID["demonhideboots"] = 385;
exports.NTIPAliasClassID["xvb"] = 386;
exports.NTIPAliasClassID["sharkskinboots"] = 386;
exports.NTIPAliasClassID["xmb"] = 387;
exports.NTIPAliasClassID["meshboots"] = 387;
exports.NTIPAliasClassID["xtb"] = 388;
exports.NTIPAliasClassID["battleboots"] = 388;
exports.NTIPAliasClassID["xhb"] = 389;
exports.NTIPAliasClassID["warboots"] = 389;
exports.NTIPAliasClassID["zlb"] = 390;
exports.NTIPAliasClassID["demonhidesash"] = 390;
exports.NTIPAliasClassID["zvb"] = 391;
exports.NTIPAliasClassID["sharkskinbelt"] = 391;
exports.NTIPAliasClassID["zmb"] = 392;
exports.NTIPAliasClassID["meshbelt"] = 392;
exports.NTIPAliasClassID["ztb"] = 393;
exports.NTIPAliasClassID["battlebelt"] = 393;
exports.NTIPAliasClassID["zhb"] = 394;
exports.NTIPAliasClassID["warbelt"] = 394;
exports.NTIPAliasClassID["xh9"] = 395;
exports.NTIPAliasClassID["grimhelm"] = 395;
exports.NTIPAliasClassID["xsh"] = 396;
exports.NTIPAliasClassID["grimshield"] = 396;
exports.NTIPAliasClassID["xpk"] = 397;
exports.NTIPAliasClassID["barbedshield"] = 397;
exports.NTIPAliasClassID["dr1"] = 398;
exports.NTIPAliasClassID["wolfhead"] = 398;
exports.NTIPAliasClassID["dr2"] = 399;
exports.NTIPAliasClassID["hawkhelm"] = 399;
exports.NTIPAliasClassID["dr3"] = 400;
exports.NTIPAliasClassID["antlers"] = 400;
exports.NTIPAliasClassID["dr4"] = 401;
exports.NTIPAliasClassID["falconmask"] = 401;
exports.NTIPAliasClassID["dr5"] = 402;
exports.NTIPAliasClassID["spiritmask"] = 402;
exports.NTIPAliasClassID["ba1"] = 403;
exports.NTIPAliasClassID["jawbonecap"] = 403;
exports.NTIPAliasClassID["ba2"] = 404;
exports.NTIPAliasClassID["fangedhelm"] = 404;
exports.NTIPAliasClassID["ba3"] = 405;
exports.NTIPAliasClassID["hornedhelm"] = 405;
exports.NTIPAliasClassID["ba4"] = 406;
exports.NTIPAliasClassID["assaulthelmet"] = 406;
exports.NTIPAliasClassID["ba5"] = 407;
exports.NTIPAliasClassID["avengerguard"] = 407;
exports.NTIPAliasClassID["pa1"] = 408;
exports.NTIPAliasClassID["targe"] = 408;
exports.NTIPAliasClassID["pa2"] = 409;
exports.NTIPAliasClassID["rondache"] = 409;
exports.NTIPAliasClassID["pa3"] = 410;
exports.NTIPAliasClassID["heraldicshield"] = 410;
exports.NTIPAliasClassID["pa4"] = 411;
exports.NTIPAliasClassID["aerinshield"] = 411;
exports.NTIPAliasClassID["pa5"] = 412;
exports.NTIPAliasClassID["crownshield"] = 412;
exports.NTIPAliasClassID["ne1"] = 413;
exports.NTIPAliasClassID["preservedhead"] = 413;
exports.NTIPAliasClassID["ne2"] = 414;
exports.NTIPAliasClassID["zombiehead"] = 414;
exports.NTIPAliasClassID["ne3"] = 415;
exports.NTIPAliasClassID["unravellerhead"] = 415;
exports.NTIPAliasClassID["ne4"] = 416;
exports.NTIPAliasClassID["gargoylehead"] = 416;
exports.NTIPAliasClassID["ne5"] = 417;
exports.NTIPAliasClassID["demonhead"] = 417;
exports.NTIPAliasClassID["ci0"] = 418;
exports.NTIPAliasClassID["circlet"] = 418;
exports.NTIPAliasClassID["ci1"] = 419;
exports.NTIPAliasClassID["coronet"] = 419;
exports.NTIPAliasClassID["ci2"] = 420;
exports.NTIPAliasClassID["tiara"] = 420;
exports.NTIPAliasClassID["ci3"] = 421;
exports.NTIPAliasClassID["diadem"] = 421;
exports.NTIPAliasClassID["uap"] = 422;
exports.NTIPAliasClassID["shako"] = 422;
exports.NTIPAliasClassID["ukp"] = 423;
exports.NTIPAliasClassID["hydraskull"] = 423;
exports.NTIPAliasClassID["ulm"] = 424;
exports.NTIPAliasClassID["armet"] = 424;
exports.NTIPAliasClassID["uhl"] = 425;
exports.NTIPAliasClassID["giantconch"] = 425;
exports.NTIPAliasClassID["uhm"] = 426;
exports.NTIPAliasClassID["spiredhelm"] = 426;
exports.NTIPAliasClassID["urn"] = 427;
exports.NTIPAliasClassID["corona"] = 427;
exports.NTIPAliasClassID["usk"] = 428;
exports.NTIPAliasClassID["demonhead"] = 428;
exports.NTIPAliasClassID["uui"] = 429;
exports.NTIPAliasClassID["duskshroud"] = 429;
exports.NTIPAliasClassID["uea"] = 430;
exports.NTIPAliasClassID["wyrmhide"] = 430;
exports.NTIPAliasClassID["ula"] = 431;
exports.NTIPAliasClassID["scarabhusk"] = 431;
exports.NTIPAliasClassID["utu"] = 432;
exports.NTIPAliasClassID["wirefleece"] = 432;
exports.NTIPAliasClassID["ung"] = 433;
exports.NTIPAliasClassID["diamondmail"] = 433;
exports.NTIPAliasClassID["ucl"] = 434;
exports.NTIPAliasClassID["loricatedmail"] = 434;
exports.NTIPAliasClassID["uhn"] = 435;
exports.NTIPAliasClassID["boneweave"] = 435;
exports.NTIPAliasClassID["urs"] = 436;
exports.NTIPAliasClassID["greathauberk"] = 436;
exports.NTIPAliasClassID["upl"] = 437;
exports.NTIPAliasClassID["balrogskin"] = 437;
exports.NTIPAliasClassID["ult"] = 438;
exports.NTIPAliasClassID["hellforgeplate"] = 438;
exports.NTIPAliasClassID["uld"] = 439;
exports.NTIPAliasClassID["krakenshell"] = 439;
exports.NTIPAliasClassID["uth"] = 440;
exports.NTIPAliasClassID["lacqueredplate"] = 440;
exports.NTIPAliasClassID["uul"] = 441;
exports.NTIPAliasClassID["shadowplate"] = 441;
exports.NTIPAliasClassID["uar"] = 442;
exports.NTIPAliasClassID["sacredarmor"] = 442;
exports.NTIPAliasClassID["utp"] = 443;
exports.NTIPAliasClassID["archonplate"] = 443;
exports.NTIPAliasClassID["uuc"] = 444;
exports.NTIPAliasClassID["heater"] = 444;
exports.NTIPAliasClassID["uml"] = 445;
exports.NTIPAliasClassID["luna"] = 445;
exports.NTIPAliasClassID["urg"] = 446;
exports.NTIPAliasClassID["hyperion"] = 446;
exports.NTIPAliasClassID["uit"] = 447;
exports.NTIPAliasClassID["monarch"] = 447;
exports.NTIPAliasClassID["uow"] = 448;
exports.NTIPAliasClassID["aegis"] = 448;
exports.NTIPAliasClassID["uts"] = 449;
exports.NTIPAliasClassID["ward"] = 449;
exports.NTIPAliasClassID["ulg"] = 450;
exports.NTIPAliasClassID["bramblemitts"] = 450;
exports.NTIPAliasClassID["uvg"] = 451;
exports.NTIPAliasClassID["vampirebonegloves"] = 451;
exports.NTIPAliasClassID["umg"] = 452;
exports.NTIPAliasClassID["vambraces"] = 452;
exports.NTIPAliasClassID["utg"] = 453;
exports.NTIPAliasClassID["crusadergauntlets"] = 453;
exports.NTIPAliasClassID["uhg"] = 454;
exports.NTIPAliasClassID["ogregauntlets"] = 454;
exports.NTIPAliasClassID["ulb"] = 455;
exports.NTIPAliasClassID["wyrmhideboots"] = 455;
exports.NTIPAliasClassID["uvb"] = 456;
exports.NTIPAliasClassID["scarabshellboots"] = 456;
exports.NTIPAliasClassID["umb"] = 457;
exports.NTIPAliasClassID["boneweaveboots"] = 457;
exports.NTIPAliasClassID["utb"] = 458;
exports.NTIPAliasClassID["mirroredboots"] = 458;
exports.NTIPAliasClassID["uhb"] = 459;
exports.NTIPAliasClassID["myrmidongreaves"] = 459;
exports.NTIPAliasClassID["ulc"] = 460;
exports.NTIPAliasClassID["spiderwebsash"] = 460;
exports.NTIPAliasClassID["uvc"] = 461;
exports.NTIPAliasClassID["vampirefangbelt"] = 461;
exports.NTIPAliasClassID["umc"] = 462;
exports.NTIPAliasClassID["mithrilcoil"] = 462;
exports.NTIPAliasClassID["utc"] = 463;
exports.NTIPAliasClassID["trollbelt"] = 463;
exports.NTIPAliasClassID["uhc"] = 464;
exports.NTIPAliasClassID["colossusgirdle"] = 464;
exports.NTIPAliasClassID["uh9"] = 465;
exports.NTIPAliasClassID["bonevisage"] = 465;
exports.NTIPAliasClassID["ush"] = 466;
exports.NTIPAliasClassID["trollnest"] = 466;
exports.NTIPAliasClassID["upk"] = 467;
exports.NTIPAliasClassID["bladebarrier"] = 467;
exports.NTIPAliasClassID["dr6"] = 468;
exports.NTIPAliasClassID["alphahelm"] = 468;
exports.NTIPAliasClassID["dr7"] = 469;
exports.NTIPAliasClassID["griffonheaddress"] = 469;
exports.NTIPAliasClassID["dr8"] = 470;
exports.NTIPAliasClassID["hunter'sguise"] = 470;
exports.NTIPAliasClassID["dr9"] = 471;
exports.NTIPAliasClassID["sacredfeathers"] = 471;
exports.NTIPAliasClassID["dra"] = 472;
exports.NTIPAliasClassID["totemicmask"] = 472;
exports.NTIPAliasClassID["ba6"] = 473;
exports.NTIPAliasClassID["jawbonevisor"] = 473;
exports.NTIPAliasClassID["ba7"] = 474;
exports.NTIPAliasClassID["lionhelm"] = 474;
exports.NTIPAliasClassID["ba8"] = 475;
exports.NTIPAliasClassID["ragemask"] = 475;
exports.NTIPAliasClassID["ba9"] = 476;
exports.NTIPAliasClassID["savagehelmet"] = 476;
exports.NTIPAliasClassID["baa"] = 477;
exports.NTIPAliasClassID["slayerguard"] = 477;
exports.NTIPAliasClassID["pa6"] = 478;
exports.NTIPAliasClassID["akarantarge"] = 478;
exports.NTIPAliasClassID["pa7"] = 479;
exports.NTIPAliasClassID["akaranrondache"] = 479;
exports.NTIPAliasClassID["pa8"] = 480;
exports.NTIPAliasClassID["protectorshield"] = 480;
exports.NTIPAliasClassID["pa9"] = 481;
exports.NTIPAliasClassID["gildedshield"] = 481;
exports.NTIPAliasClassID["paa"] = 482;
exports.NTIPAliasClassID["royalshield"] = 482;
exports.NTIPAliasClassID["ne6"] = 483;
exports.NTIPAliasClassID["mummifiedtrophy"] = 483;
exports.NTIPAliasClassID["ne7"] = 484;
exports.NTIPAliasClassID["fetishtrophy"] = 484;
exports.NTIPAliasClassID["ne8"] = 485;
exports.NTIPAliasClassID["sextontrophy"] = 485;
exports.NTIPAliasClassID["ne9"] = 486;
exports.NTIPAliasClassID["cantortrophy"] = 486;
exports.NTIPAliasClassID["nea"] = 487;
exports.NTIPAliasClassID["hierophanttrophy"] = 487;
exports.NTIPAliasClassID["drb"] = 488;
exports.NTIPAliasClassID["bloodspirit"] = 488;
exports.NTIPAliasClassID["drc"] = 489;
exports.NTIPAliasClassID["sunspirit"] = 489;
exports.NTIPAliasClassID["drd"] = 490;
exports.NTIPAliasClassID["earthspirit"] = 490;
exports.NTIPAliasClassID["dre"] = 491;
exports.NTIPAliasClassID["skyspirit"] = 491;
exports.NTIPAliasClassID["drf"] = 492;
exports.NTIPAliasClassID["dreamspirit"] = 492;
exports.NTIPAliasClassID["bab"] = 493;
exports.NTIPAliasClassID["carnagehelm"] = 493;
exports.NTIPAliasClassID["bac"] = 494;
exports.NTIPAliasClassID["furyvisor"] = 494;
exports.NTIPAliasClassID["bad"] = 495;
exports.NTIPAliasClassID["destroyerhelm"] = 495;
exports.NTIPAliasClassID["bae"] = 496;
exports.NTIPAliasClassID["conquerorcrown"] = 496;
exports.NTIPAliasClassID["baf"] = 497;
exports.NTIPAliasClassID["guardiancrown"] = 497;
exports.NTIPAliasClassID["pab"] = 498;
exports.NTIPAliasClassID["sacredtarge"] = 498;
exports.NTIPAliasClassID["pac"] = 499;
exports.NTIPAliasClassID["sacredrondache"] = 499;
exports.NTIPAliasClassID["pad"] = 500;
exports.NTIPAliasClassID["kurastshield"] = 500;
exports.NTIPAliasClassID["pae"] = 501;
exports.NTIPAliasClassID["zakarumshield"] = 501;
exports.NTIPAliasClassID["paf"] = 502;
exports.NTIPAliasClassID["vortexshield"] = 502;
exports.NTIPAliasClassID["neb"] = 503;
exports.NTIPAliasClassID["minionskull"] = 503;
exports.NTIPAliasClassID["neg"] = 504;
exports.NTIPAliasClassID["hellspawnskull"] = 504;
exports.NTIPAliasClassID["ned"] = 505;
exports.NTIPAliasClassID["overseerskull"] = 505;
exports.NTIPAliasClassID["nee"] = 506;
exports.NTIPAliasClassID["succubusskull"] = 506;
exports.NTIPAliasClassID["nef"] = 507;
exports.NTIPAliasClassID["bloodlordskull"] = 507;
exports.NTIPAliasClassID["elx"] = 508;
exports.NTIPAliasClassID["elixir"] = 508;
exports.NTIPAliasClassID["hpo"] = 509;
exports.NTIPAliasClassID["mpo"] = 510;
exports.NTIPAliasClassID["hpf"] = 511;
exports.NTIPAliasClassID["mpf"] = 512;
exports.NTIPAliasClassID["vps"] = 513;
exports.NTIPAliasClassID["staminapotion"] = 513;
exports.NTIPAliasClassID["yps"] = 514;
exports.NTIPAliasClassID["antidotepotion"] = 514;
exports.NTIPAliasClassID["rvs"] = 515;
exports.NTIPAliasClassID["rejuvenationpotion"] = 515;
exports.NTIPAliasClassID["rvl"] = 516;
exports.NTIPAliasClassID["fullrejuvenationpotion"] = 516;
exports.NTIPAliasClassID["wms"] = 517;
exports.NTIPAliasClassID["thawingpotion"] = 517;
exports.NTIPAliasClassID["tbk"] = 518;
exports.NTIPAliasClassID["tomeoftownportal"] = 518;
exports.NTIPAliasClassID["ibk"] = 519;
exports.NTIPAliasClassID["tomeofidentify"] = 519;
exports.NTIPAliasClassID["amu"] = 520;
exports.NTIPAliasClassID["amulet"] = 520;
exports.NTIPAliasClassID["vip"] = 521;
exports.NTIPAliasClassID["topofthehoradricstaff"] = 521;
exports.NTIPAliasClassID["rin"] = 522;
exports.NTIPAliasClassID["ring"] = 522;
exports.NTIPAliasClassID["gld"] = 523;
exports.NTIPAliasClassID["gold"] = 523;
exports.NTIPAliasClassID["bks"] = 524;
exports.NTIPAliasClassID["scrollofinifuss"] = 524;
exports.NTIPAliasClassID["bkd"] = 525;
exports.NTIPAliasClassID["keytothecairnstones"] = 525;
exports.NTIPAliasClassID["aqv"] = 526;
exports.NTIPAliasClassID["arrows"] = 526;
exports.NTIPAliasClassID["tch"] = 527;
exports.NTIPAliasClassID["torch"] = 527;
exports.NTIPAliasClassID["cqv"] = 528;
exports.NTIPAliasClassID["bolts"] = 528;
exports.NTIPAliasClassID["tsc"] = 529;
exports.NTIPAliasClassID["scrolloftownportal"] = 529;
exports.NTIPAliasClassID["isc"] = 530;
exports.NTIPAliasClassID["scrollofidentify"] = 530;
exports.NTIPAliasClassID["hrt"] = 531;
exports.NTIPAliasClassID["heart"] = 531;
exports.NTIPAliasClassID["brz"] = 532;
exports.NTIPAliasClassID["brain"] = 532;
exports.NTIPAliasClassID["jaw"] = 533;
exports.NTIPAliasClassID["jawbone"] = 533;
exports.NTIPAliasClassID["eyz"] = 534;
exports.NTIPAliasClassID["eye"] = 534;
exports.NTIPAliasClassID["hrn"] = 535;
exports.NTIPAliasClassID["horn"] = 535;
exports.NTIPAliasClassID["tal"] = 536;
exports.NTIPAliasClassID["tail"] = 536;
exports.NTIPAliasClassID["flg"] = 537;
exports.NTIPAliasClassID["flag"] = 537;
exports.NTIPAliasClassID["fng"] = 538;
exports.NTIPAliasClassID["fang"] = 538;
exports.NTIPAliasClassID["qll"] = 539;
exports.NTIPAliasClassID["quill"] = 539;
exports.NTIPAliasClassID["sol"] = 540;
exports.NTIPAliasClassID["soul"] = 540;
exports.NTIPAliasClassID["scz"] = 541;
exports.NTIPAliasClassID["scalp"] = 541;
exports.NTIPAliasClassID["spe"] = 542;
exports.NTIPAliasClassID["spleen"] = 542;
exports.NTIPAliasClassID["key"] = 543;
exports.NTIPAliasClassID["luv"] = 544;
exports.NTIPAliasClassID["theblacktowerkey"] = 544;
exports.NTIPAliasClassID["xyz"] = 545;
exports.NTIPAliasClassID["potionoflife"] = 545;
exports.NTIPAliasClassID["j34"] = 546;
exports.NTIPAliasClassID["ajadefigurine"] = 546;
exports.NTIPAliasClassID["g34"] = 547;
exports.NTIPAliasClassID["thegoldenbird"] = 547;
exports.NTIPAliasClassID["bbb"] = 548;
exports.NTIPAliasClassID["lamesen'stome"] = 548;
exports.NTIPAliasClassID["box"] = 549;
exports.NTIPAliasClassID["horadriccube"] = 549;
exports.NTIPAliasClassID["tr1"] = 550;
exports.NTIPAliasClassID["horadricscroll"] = 550;
exports.NTIPAliasClassID["mss"] = 551;
exports.NTIPAliasClassID["mephisto'ssoulstone"] = 551;
exports.NTIPAliasClassID["ass"] = 552;
exports.NTIPAliasClassID["bookofskill"] = 552;
exports.NTIPAliasClassID["qey"] = 553;
exports.NTIPAliasClassID["khalim'seye"] = 553;
exports.NTIPAliasClassID["qhr"] = 554;
exports.NTIPAliasClassID["khalim'sheart"] = 554;
exports.NTIPAliasClassID["qbr"] = 555;
exports.NTIPAliasClassID["khalim'sbrain"] = 555;
exports.NTIPAliasClassID["ear"] = 556;
exports.NTIPAliasClassID["gcv"] = 557;
exports.NTIPAliasClassID["chippedamethyst"] = 557;
exports.NTIPAliasClassID["gfv"] = 558;
exports.NTIPAliasClassID["flawedamethyst"] = 558;
exports.NTIPAliasClassID["gsv"] = 559;
exports.NTIPAliasClassID["amethyst"] = 559;
exports.NTIPAliasClassID["gzv"] = 560;
exports.NTIPAliasClassID["flawlessamethyst"] = 560;
exports.NTIPAliasClassID["gpv"] = 561;
exports.NTIPAliasClassID["perfectamethyst"] = 561;
exports.NTIPAliasClassID["gcy"] = 562;
exports.NTIPAliasClassID["chippedtopaz"] = 562;
exports.NTIPAliasClassID["gfy"] = 563;
exports.NTIPAliasClassID["flawedtopaz"] = 563;
exports.NTIPAliasClassID["gsy"] = 564;
exports.NTIPAliasClassID["topaz"] = 564;
exports.NTIPAliasClassID["gly"] = 565;
exports.NTIPAliasClassID["flawlesstopaz"] = 565;
exports.NTIPAliasClassID["gpy"] = 566;
exports.NTIPAliasClassID["perfecttopaz"] = 566;
exports.NTIPAliasClassID["gcb"] = 567;
exports.NTIPAliasClassID["chippedsapphire"] = 567;
exports.NTIPAliasClassID["gfb"] = 568;
exports.NTIPAliasClassID["flawedsapphire"] = 568;
exports.NTIPAliasClassID["gsb"] = 569;
exports.NTIPAliasClassID["sapphire"] = 569;
exports.NTIPAliasClassID["glb"] = 570;
exports.NTIPAliasClassID["flawlesssapphire"] = 570;
exports.NTIPAliasClassID["gpb"] = 571;
exports.NTIPAliasClassID["perfectsapphire"] = 571;
exports.NTIPAliasClassID["gcg"] = 572;
exports.NTIPAliasClassID["chippedemerald"] = 572;
exports.NTIPAliasClassID["gfg"] = 573;
exports.NTIPAliasClassID["flawedemerald"] = 573;
exports.NTIPAliasClassID["gsg"] = 574;
exports.NTIPAliasClassID["emerald"] = 574;
exports.NTIPAliasClassID["glg"] = 575;
exports.NTIPAliasClassID["flawlessemerald"] = 575;
exports.NTIPAliasClassID["gpg"] = 576;
exports.NTIPAliasClassID["perfectemerald"] = 576;
exports.NTIPAliasClassID["gcr"] = 577;
exports.NTIPAliasClassID["chippedruby"] = 577;
exports.NTIPAliasClassID["gfr"] = 578;
exports.NTIPAliasClassID["flawedruby"] = 578;
exports.NTIPAliasClassID["gsr"] = 579;
exports.NTIPAliasClassID["ruby"] = 579;
exports.NTIPAliasClassID["glr"] = 580;
exports.NTIPAliasClassID["flawlessruby"] = 580;
exports.NTIPAliasClassID["gpr"] = 581;
exports.NTIPAliasClassID["perfectruby"] = 581;
exports.NTIPAliasClassID["gcw"] = 582;
exports.NTIPAliasClassID["chippeddiamond"] = 582;
exports.NTIPAliasClassID["gfw"] = 583;
exports.NTIPAliasClassID["flaweddiamond"] = 583;
exports.NTIPAliasClassID["gsw"] = 584;
exports.NTIPAliasClassID["diamond"] = 584;
exports.NTIPAliasClassID["glw"] = 585;
exports.NTIPAliasClassID["flawlessdiamond"] = 585;
exports.NTIPAliasClassID["gpw"] = 586;
exports.NTIPAliasClassID["perfectdiamond"] = 586;
exports.NTIPAliasClassID["hp1"] = 587;
exports.NTIPAliasClassID["minorhealingpotion"] = 587;
exports.NTIPAliasClassID["hp2"] = 588;
exports.NTIPAliasClassID["lighthealingpotion"] = 588;
exports.NTIPAliasClassID["hp3"] = 589;
exports.NTIPAliasClassID["healingpotion"] = 589;
exports.NTIPAliasClassID["hp4"] = 590;
exports.NTIPAliasClassID["greaterhealingpotion"] = 590;
exports.NTIPAliasClassID["hp5"] = 591;
exports.NTIPAliasClassID["superhealingpotion"] = 591;
exports.NTIPAliasClassID["mp1"] = 592;
exports.NTIPAliasClassID["minormanapotion"] = 592;
exports.NTIPAliasClassID["mp2"] = 593;
exports.NTIPAliasClassID["lightmanapotion"] = 593;
exports.NTIPAliasClassID["mp3"] = 594;
exports.NTIPAliasClassID["manapotion"] = 594;
exports.NTIPAliasClassID["mp4"] = 595;
exports.NTIPAliasClassID["greatermanapotion"] = 595;
exports.NTIPAliasClassID["mp5"] = 596;
exports.NTIPAliasClassID["supermanapotion"] = 596;
exports.NTIPAliasClassID["skc"] = 597;
exports.NTIPAliasClassID["chippedskull"] = 597;
exports.NTIPAliasClassID["skf"] = 598;
exports.NTIPAliasClassID["flawedskull"] = 598;
exports.NTIPAliasClassID["sku"] = 599;
exports.NTIPAliasClassID["skull"] = 599;
exports.NTIPAliasClassID["skl"] = 600;
exports.NTIPAliasClassID["flawlessskull"] = 600;
exports.NTIPAliasClassID["skz"] = 601;
exports.NTIPAliasClassID["perfectskull"] = 601;
exports.NTIPAliasClassID["hrb"] = 602;
exports.NTIPAliasClassID["herb"] = 602;
exports.NTIPAliasClassID["cm1"] = 603;
exports.NTIPAliasClassID["smallcharm"] = 603;
exports.NTIPAliasClassID["cm2"] = 604;
exports.NTIPAliasClassID["largecharm"] = 604;
exports.NTIPAliasClassID["cm3"] = 605;
exports.NTIPAliasClassID["grandcharm"] = 605;
exports.NTIPAliasClassID["rps"] = 606;
exports.NTIPAliasClassID["rpl"] = 607;
exports.NTIPAliasClassID["bps"] = 608;
exports.NTIPAliasClassID["bpl"] = 609;
exports.NTIPAliasClassID["r01"] = 610;
exports.NTIPAliasClassID["elrune"] = 610;
exports.NTIPAliasClassID["r02"] = 611;
exports.NTIPAliasClassID["eldrune"] = 611;
exports.NTIPAliasClassID["r03"] = 612;
exports.NTIPAliasClassID["tirrune"] = 612;
exports.NTIPAliasClassID["r04"] = 613;
exports.NTIPAliasClassID["nefrune"] = 613;
exports.NTIPAliasClassID["r05"] = 614;
exports.NTIPAliasClassID["ethrune"] = 614;
exports.NTIPAliasClassID["r06"] = 615;
exports.NTIPAliasClassID["ithrune"] = 615;
exports.NTIPAliasClassID["r07"] = 616;
exports.NTIPAliasClassID["talrune"] = 616;
exports.NTIPAliasClassID["r08"] = 617;
exports.NTIPAliasClassID["ralrune"] = 617;
exports.NTIPAliasClassID["r09"] = 618;
exports.NTIPAliasClassID["ortrune"] = 618;
exports.NTIPAliasClassID["r10"] = 619;
exports.NTIPAliasClassID["thulrune"] = 619;
exports.NTIPAliasClassID["r11"] = 620;
exports.NTIPAliasClassID["amnrune"] = 620;
exports.NTIPAliasClassID["r12"] = 621;
exports.NTIPAliasClassID["solrune"] = 621;
exports.NTIPAliasClassID["r13"] = 622;
exports.NTIPAliasClassID["shaelrune"] = 622;
exports.NTIPAliasClassID["r14"] = 623;
exports.NTIPAliasClassID["dolrune"] = 623;
exports.NTIPAliasClassID["r15"] = 624;
exports.NTIPAliasClassID["helrune"] = 624;
exports.NTIPAliasClassID["r16"] = 625;
exports.NTIPAliasClassID["iorune"] = 625;
exports.NTIPAliasClassID["r17"] = 626;
exports.NTIPAliasClassID["lumrune"] = 626;
exports.NTIPAliasClassID["r18"] = 627;
exports.NTIPAliasClassID["korune"] = 627;
exports.NTIPAliasClassID["r19"] = 628;
exports.NTIPAliasClassID["falrune"] = 628;
exports.NTIPAliasClassID["r20"] = 629;
exports.NTIPAliasClassID["lemrune"] = 629;
exports.NTIPAliasClassID["r21"] = 630;
exports.NTIPAliasClassID["pulrune"] = 630;
exports.NTIPAliasClassID["r22"] = 631;
exports.NTIPAliasClassID["umrune"] = 631;
exports.NTIPAliasClassID["r23"] = 632;
exports.NTIPAliasClassID["malrune"] = 632;
exports.NTIPAliasClassID["r24"] = 633;
exports.NTIPAliasClassID["istrune"] = 633;
exports.NTIPAliasClassID["r25"] = 634;
exports.NTIPAliasClassID["gulrune"] = 634;
exports.NTIPAliasClassID["r26"] = 635;
exports.NTIPAliasClassID["vexrune"] = 635;
exports.NTIPAliasClassID["r27"] = 636;
exports.NTIPAliasClassID["ohmrune"] = 636;
exports.NTIPAliasClassID["r28"] = 637;
exports.NTIPAliasClassID["lorune"] = 637;
exports.NTIPAliasClassID["r29"] = 638;
exports.NTIPAliasClassID["surrune"] = 638;
exports.NTIPAliasClassID["r30"] = 639;
exports.NTIPAliasClassID["berrune"] = 639;
exports.NTIPAliasClassID["r31"] = 640;
exports.NTIPAliasClassID["jahrune"] = 640;
exports.NTIPAliasClassID["r32"] = 641;
exports.NTIPAliasClassID["chamrune"] = 641;
exports.NTIPAliasClassID["r33"] = 642;
exports.NTIPAliasClassID["zodrune"] = 642;
exports.NTIPAliasClassID["jew"] = 643;
exports.NTIPAliasClassID["jewel"] = 643;
exports.NTIPAliasClassID["ice"] = 644;
exports.NTIPAliasClassID["malah'spotion"] = 644;
exports.NTIPAliasClassID["0sc"] = 645;
exports.NTIPAliasClassID["scrollofknowledge"] = 645;
exports.NTIPAliasClassID["tr2"] = 646;
exports.NTIPAliasClassID["scrollofresistance"] = 646;
exports.NTIPAliasClassID["pk1"] = 647;
exports.NTIPAliasClassID["keyofterror"] = 647;
exports.NTIPAliasClassID["pk2"] = 648;
exports.NTIPAliasClassID["keyofhate"] = 648;
exports.NTIPAliasClassID["pk3"] = 649;
exports.NTIPAliasClassID["keyofdestruction"] = 649;
exports.NTIPAliasClassID["dhn"] = 650;
exports.NTIPAliasClassID["diablo'shorn"] = 650;
exports.NTIPAliasClassID["bey"] = 651;
exports.NTIPAliasClassID["baal'seye"] = 651;
exports.NTIPAliasClassID["mbr"] = 652;
exports.NTIPAliasClassID["mephisto'sbrain"] = 652;
exports.NTIPAliasClassID["toa"] = 653;
exports.NTIPAliasClassID["tokenofabsolution"] = 653;
exports.NTIPAliasClassID["tes"] = 654;
exports.NTIPAliasClassID["twistedessenceofsuffering"] = 654;
exports.NTIPAliasClassID["ceh"] = 655;
exports.NTIPAliasClassID["chargedessenceofhatred"] = 655;
exports.NTIPAliasClassID["bet"] = 656;
exports.NTIPAliasClassID["burningessenceofterror"] = 656;
exports.NTIPAliasClassID["fed"] = 657;
exports.NTIPAliasClassID["festeringessenceofdestruction"] = 657;
exports.NTIPAliasClassID["std"] = 658;
exports.NTIPAliasClassID["standardofheroes"] = 658;
/** @global */
exports.NTIPAliasClass = {};
exports.NTIPAliasClass["normal"] = 0;
exports.NTIPAliasClass["exceptional"] = 1;
exports.NTIPAliasClass["elite"] = 2;
/** @global */
exports.NTIPAliasQuality = {};
exports.NTIPAliasQuality["lowquality"] = 1;
exports.NTIPAliasQuality["normal"] = 2;
exports.NTIPAliasQuality["superior"] = 3;
exports.NTIPAliasQuality["magic"] = 4;
exports.NTIPAliasQuality["set"] = 5;
exports.NTIPAliasQuality["rare"] = 6;
exports.NTIPAliasQuality["unique"] = 7;
exports.NTIPAliasQuality["crafted"] = 8;
/** @global */
exports.NTIPAliasFlag = {};
exports.NTIPAliasFlag["identified"] = 0x10;
exports.NTIPAliasFlag["eth"] = 0x400000;
exports.NTIPAliasFlag["ethereal"] = 0x400000;
exports.NTIPAliasFlag["runeword"] = 0x4000000;
// rare item colors
/** @global */
exports.NTIPAliasColor = {};
exports.NTIPAliasColor["black"] = 3;
exports.NTIPAliasColor["white"] = 20;
exports.NTIPAliasColor["orange"] = 19;
exports.NTIPAliasColor["lightyellow"] = 13;
exports.NTIPAliasColor["lightred"] = 7;
exports.NTIPAliasColor["lightgold"] = 15;
exports.NTIPAliasColor["lightblue"] = 4;
exports.NTIPAliasColor["lightpurple"] = 17;
exports.NTIPAliasColor["crystalblue"] = 6;
exports.NTIPAliasColor["crystalred"] = 9;
exports.NTIPAliasColor["crystalgreen"] = 12;
exports.NTIPAliasColor["darkyellow"] = 14;
exports.NTIPAliasColor["darkred"] = 8;
exports.NTIPAliasColor["darkgold"] = 16;
exports.NTIPAliasColor["darkgreen"] = 11;
exports.NTIPAliasColor["darkblue"] = 5;
/** @global */
exports.NTIPAliasStat = {};
exports.NTIPAliasStat["strength"] = 0;
exports.NTIPAliasStat["energy"] = 1;
exports.NTIPAliasStat["dexterity"] = 2;
exports.NTIPAliasStat["vitality"] = 3;
exports.NTIPAliasStat["statpts"] = 4;
exports.NTIPAliasStat["newskills"] = 5;
exports.NTIPAliasStat["hitpoints"] = 6;
exports.NTIPAliasStat["maxhp"] = 7;
exports.NTIPAliasStat["mana"] = 8;
exports.NTIPAliasStat["maxmana"] = 9;
exports.NTIPAliasStat["stamina"] = 10;
exports.NTIPAliasStat["maxstamina"] = 11;
exports.NTIPAliasStat["level"] = 12;
exports.NTIPAliasStat["experience"] = 13;
exports.NTIPAliasStat["gold"] = 14;
exports.NTIPAliasStat["goldbank"] = 15;
exports.NTIPAliasStat["itemarmorpercent"] = [16, 0];
exports.NTIPAliasStat["enhanceddefense"] = [16, 0];
exports.NTIPAliasStat["itemmaxdamagepercent"] = [17, 0];
exports.NTIPAliasStat["itemmindamagepercent"] = [18, 0];
exports.NTIPAliasStat["enhanceddamage"] = [18, 0];
exports.NTIPAliasStat["tohit"] = 19;
exports.NTIPAliasStat["toblock"] = 20;
exports.NTIPAliasStat["plusmindamage"] = [21, 1];
exports.NTIPAliasStat["mindamage"] = 21;
exports.NTIPAliasStat["plusmaxdamage"] = [22, 1];
exports.NTIPAliasStat["maxdamage"] = 22;
exports.NTIPAliasStat["secondarymindamage"] = 23;
exports.NTIPAliasStat["secondarymaxdamage"] = 24;
exports.NTIPAliasStat["damagepercent"] = 25;
exports.NTIPAliasStat["manarecovery"] = 26;
exports.NTIPAliasStat["manarecoverybonus"] = 27;
exports.NTIPAliasStat["staminarecoverybonus"] = 28;
exports.NTIPAliasStat["lastexp"] = 29;
exports.NTIPAliasStat["nextexp"] = 30;
exports.NTIPAliasStat["armorclass"] = 31;
exports.NTIPAliasStat["defense"] = 31;
exports.NTIPAliasStat["plusdefense"] = [31, 0];
exports.NTIPAliasStat["armorclassvsmissile"] = 32;
exports.NTIPAliasStat["armorclassvshth"] = 33;
exports.NTIPAliasStat["normaldamagereduction"] = 34;
exports.NTIPAliasStat["magicdamagereduction"] = 35;
exports.NTIPAliasStat["damageresist"] = 36;
exports.NTIPAliasStat["magicresist"] = 37;
exports.NTIPAliasStat["maxmagicresist"] = 38;
exports.NTIPAliasStat["fireresist"] = 39;
exports.NTIPAliasStat["maxfireresist"] = 40;
exports.NTIPAliasStat["lightresist"] = 41;
exports.NTIPAliasStat["maxlightresist"] = 42;
exports.NTIPAliasStat["coldresist"] = 43;
exports.NTIPAliasStat["maxcoldresist"] = 44;
exports.NTIPAliasStat["poisonresist"] = 45;
exports.NTIPAliasStat["maxpoisonresist"] = 46;
exports.NTIPAliasStat["damageaura"] = 47;
exports.NTIPAliasStat["firemindam"] = 48;
exports.NTIPAliasStat["firemaxdam"] = 49;
exports.NTIPAliasStat["lightmindam"] = 50;
exports.NTIPAliasStat["lightmaxdam"] = 51;
exports.NTIPAliasStat["magicmindam"] = 52;
exports.NTIPAliasStat["magicmaxdam"] = 53;
exports.NTIPAliasStat["coldmindam"] = 54;
exports.NTIPAliasStat["coldmaxdam"] = 55;
exports.NTIPAliasStat["coldlength"] = 56;
exports.NTIPAliasStat["poisondamage"] = [57, 1];
exports.NTIPAliasStat["poisonmindam"] = 57;
exports.NTIPAliasStat["poisonmaxdam"] = 58;
exports.NTIPAliasStat["poisonlength"] = 59;
exports.NTIPAliasStat["lifedrainmindam"] = 60;
exports.NTIPAliasStat["lifeleech"] = 60;
exports.NTIPAliasStat["lifedrainmaxdam"] = 61;
exports.NTIPAliasStat["manadrainmindam"] = 62;
exports.NTIPAliasStat["manaleech"] = 62;
exports.NTIPAliasStat["manadrainmaxdam"] = 63;
exports.NTIPAliasStat["stamdrainmindam"] = 64;
exports.NTIPAliasStat["stamdrainmaxdam"] = 65;
exports.NTIPAliasStat["stunlength"] = 66;
exports.NTIPAliasStat["velocitypercent"] = 67;
exports.NTIPAliasStat["attackrate"] = 68;
exports.NTIPAliasStat["otheranimrate"] = 69;
exports.NTIPAliasStat["quantity"] = 70;
exports.NTIPAliasStat["value"] = 71;
exports.NTIPAliasStat["durability"] = 72;
exports.NTIPAliasStat["maxdurability"] = 73;
exports.NTIPAliasStat["hpregen"] = 74;
exports.NTIPAliasStat["itemmaxdurabilitypercent"] = 75;
exports.NTIPAliasStat["itemmaxhppercent"] = 76;
exports.NTIPAliasStat["itemmaxmanapercent"] = 77;
exports.NTIPAliasStat["itemattackertakesdamage"] = 78;
exports.NTIPAliasStat["itemgoldbonus"] = 79;
exports.NTIPAliasStat["itemmagicbonus"] = 80;
exports.NTIPAliasStat["itemknockback"] = 81;
exports.NTIPAliasStat["itemtimeduration"] = 82;
exports.NTIPAliasStat["itemaddclassskills"] = 83;
exports.NTIPAliasStat["itemaddamazonskills"] = [83, 0];
exports.NTIPAliasStat["amazonskills"] = [83, 0];
exports.NTIPAliasStat["itemaddsorceressskills"] = [83, 1];
exports.NTIPAliasStat["sorceressskills"] = [83, 1];
exports.NTIPAliasStat["itemaddnecromancerskills"] = [83, 2];
exports.NTIPAliasStat["necromancerskills"] = [83, 2];
exports.NTIPAliasStat["itemaddpaladinskills"] = [83, 3];
exports.NTIPAliasStat["paladinskills"] = [83, 3];
exports.NTIPAliasStat["itemaddbarbarianskills"] = [83, 4];
exports.NTIPAliasStat["barbarianskills"] = [83, 4];
exports.NTIPAliasStat["itemadddruidskills"] = [83, 5];
exports.NTIPAliasStat["druidskills"] = [83, 5];
exports.NTIPAliasStat["itemaddassassinskills"] = [83, 6];
exports.NTIPAliasStat["assassinskills"] = [83, 6];
exports.NTIPAliasStat["unsentparam1"] = 84;
exports.NTIPAliasStat["itemaddexperience"] = 85;
exports.NTIPAliasStat["itemhealafterkill"] = 86;
exports.NTIPAliasStat["itemreducedprices"] = 87;
exports.NTIPAliasStat["itemdoubleherbduration"] = 88;
exports.NTIPAliasStat["itemlightradius"] = 89;
exports.NTIPAliasStat["itemlightcolor"] = 90;
exports.NTIPAliasStat["itemreqpercent"] = 91;
exports.NTIPAliasStat["itemlevelreq"] = 92;
exports.NTIPAliasStat["itemfasterattackrate"] = 93;
exports.NTIPAliasStat["ias"] = 93;
exports.NTIPAliasStat["itemlevelreqpct"] = 94;
exports.NTIPAliasStat["lastblockframe"] = 95;
exports.NTIPAliasStat["itemfastermovevelocity"] = 96;
exports.NTIPAliasStat["frw"] = 96;
// oskill
exports.NTIPAliasStat["itemnonclassskill"] = 97;
// Amazon
exports.NTIPAliasStat["plusskillcriticalstrike"] = [97, 9];
exports.NTIPAliasStat["plusskillguidedarrow"] = [97, 22];
exports.NTIPAliasStat["plusskillvalkyrie"] = [97, sdk.skills.Valkyrie];
// Sorceress
exports.NTIPAliasStat["plusskillwarmth"] = [97, sdk.skills.Warmth];
exports.NTIPAliasStat["plusskillinferno"] = [97, sdk.skills.Inferno];
exports.NTIPAliasStat["plusskillfireball"] = [97, sdk.skills.FireBall];
exports.NTIPAliasStat["plusskillfirewall"] = [97, sdk.skills.FireWall];
exports.NTIPAliasStat["plusskillteleport"] = [97, sdk.skills.Teleport];
exports.NTIPAliasStat["plusskillmeteor"] = [97, sdk.skills.Meteor];
exports.NTIPAliasStat["plusskillfiremastery"] = [97, sdk.skills.FireMastery];
exports.NTIPAliasStat["plusskillhydra"] = [97, sdk.skills.Hydra];
// Barbarian
exports.NTIPAliasStat["plusskillbattlecry"] = [97, 146];
exports.NTIPAliasStat["plusskillbattleorders"] = [97, 149];
exports.NTIPAliasStat["plusskillbattlecommand"] = [97, 155];
exports.NTIPAliasStat["plusskillwhirlwind"] = [97, sdk.skills.Whirlwind];
exports.NTIPAliasStat["plusskillberserk"] = [97, sdk.skills.Berserk];
// Druid
exports.NTIPAliasStat["plusskillwerewolf"] = [97, 223];
exports.NTIPAliasStat["plusskillwerebear"] = [97, sdk.skills.Werebear];
exports.NTIPAliasStat["plusskillshapeshifting"] = [97, 224];
exports.NTIPAliasStat["plusskilllycanthropy"] = [97, 224];
exports.NTIPAliasStat["plusskillsummonspiritwolf"] = [97, 227];
exports.NTIPAliasStat["plusskillferalrage"] = [97, 232];
exports.NTIPAliasStat["plusskillarticblast"] = [97, sdk.skills.ArcticBlast];
// paladin
exports.NTIPAliasStat["plusskillzeal"] = [97, sdk.skills.Zeal];
exports.NTIPAliasStat["plusskillvengeance"] = [97, sdk.skills.Vengeance];
exports.NTIPAliasStat["state"] = 98;
exports.NTIPAliasStat["itemfastergethitrate"] = 99;
exports.NTIPAliasStat["fhr"] = 99;
exports.NTIPAliasStat["monsterplayercount"] = 100;
exports.NTIPAliasStat["skillpoisonoverridelength"] = 101;
exports.NTIPAliasStat["itemfasterblockrate"] = 102;
exports.NTIPAliasStat["fbr"] = 102;
exports.NTIPAliasStat["skillbypassundead"] = 103;
exports.NTIPAliasStat["skillbypassdemons"] = 104;
exports.NTIPAliasStat["itemfastercastrate"] = 105;
exports.NTIPAliasStat["fcr"] = 105;
exports.NTIPAliasStat["skillbypassbeasts"] = 106;
exports.NTIPAliasStat["itemsingleskill"] = 107;
// Amazon skills
exports.NTIPAliasStat["skillmagicarrow"] = [107, 6];
exports.NTIPAliasStat["skillfirearrow"] = [107, 7];
exports.NTIPAliasStat["skillinnersight"] = [107, 8];
exports.NTIPAliasStat["skillcriticalstrike"] = [107, 9];
exports.NTIPAliasStat["skilljab"] = [107, 10];
exports.NTIPAliasStat["skillcoldarrow"] = [107, 11];
exports.NTIPAliasStat["skillmultipleshot"] = [107, 12];
exports.NTIPAliasStat["skilldodge"] = [107, 13];
exports.NTIPAliasStat["skillpowerstrike"] = [107, 14];
exports.NTIPAliasStat["skillpoisonjavelin"] = [107, 15];
exports.NTIPAliasStat["skillexplodingarrow"] = [107, 16];
exports.NTIPAliasStat["skillslowmissiles"] = [107, 17];
exports.NTIPAliasStat["skillavoid"] = [107, 18];
exports.NTIPAliasStat["skillimpale"] = [107, 19];
exports.NTIPAliasStat["skilllightningbolt"] = [107, 20];
exports.NTIPAliasStat["skillicearrow"] = [107, 21];
exports.NTIPAliasStat["skillguidedarrow"] = [107, 22];
exports.NTIPAliasStat["skillpenetrate"] = [107, 23];
exports.NTIPAliasStat["skillchargedstrike"] = [107, 24];
exports.NTIPAliasStat["skillplaguejavelin"] = [107, 25];
exports.NTIPAliasStat["skillstrafe"] = [107, 26];
exports.NTIPAliasStat["skillimmolationarrow"] = [107, 27];
exports.NTIPAliasStat["skilldecoy"] = [107, 28];
exports.NTIPAliasStat["skillevade"] = [107, 29];
exports.NTIPAliasStat["skillfend"] = [107, 30];
exports.NTIPAliasStat["skillfreezingarrow"] = [107, 31];
exports.NTIPAliasStat["skillvalkyrie"] = [107, 32];
exports.NTIPAliasStat["skillpierce"] = [107, 33];
exports.NTIPAliasStat["skilllightningstrike"] = [107, 34];
exports.NTIPAliasStat["skilllightningfury"] = [107, 35];
// Sorceress skills
exports.NTIPAliasStat["skillfirebolt"] = [107, 36];
exports.NTIPAliasStat["skillwarmth"] = [107, 37];
exports.NTIPAliasStat["skillchargedbolt"] = [107, 38];
exports.NTIPAliasStat["skillicebolt"] = [107, 39];
exports.NTIPAliasStat["skillfrozenarmor"] = [107, 40];
exports.NTIPAliasStat["skillinferno"] = [107, 41];
exports.NTIPAliasStat["skillstaticfield"] = [107, 42];
exports.NTIPAliasStat["skilltelekinesis"] = [107, 43];
exports.NTIPAliasStat["skillfrostnova"] = [107, 44];
exports.NTIPAliasStat["skilliceblast"] = [107, 45];
exports.NTIPAliasStat["skillblaze"] = [107, 46];
exports.NTIPAliasStat["skillfireball"] = [107, 47];
exports.NTIPAliasStat["skillnova"] = [107, 48];
exports.NTIPAliasStat["skilllightning"] = [107, 49];
exports.NTIPAliasStat["skillshiverarmor"] = [107, 50];
exports.NTIPAliasStat["skillfirewall"] = [107, 51];
exports.NTIPAliasStat["skillenchant"] = [107, 52];
exports.NTIPAliasStat["skillchainlightning"] = [107, 53];
exports.NTIPAliasStat["skillteleport"] = [107, 54];
exports.NTIPAliasStat["skillglacialspike"] = [107, 55];
exports.NTIPAliasStat["skillmeteor"] = [107, 56];
exports.NTIPAliasStat["skillthunderstorm"] = [107, 57];
exports.NTIPAliasStat["skillenergyshield"] = [107, 58];
exports.NTIPAliasStat["skillblizzard"] = [107, 59];
exports.NTIPAliasStat["skillchillingarmor"] = [107, 60];
exports.NTIPAliasStat["skillfiremastery"] = [107, 61];
exports.NTIPAliasStat["skillhydra"] = [107, 62];
exports.NTIPAliasStat["skilllightningmastery"] = [107, 63];
exports.NTIPAliasStat["skillfrozenorb"] = [107, 64];
exports.NTIPAliasStat["skillcoldmastery"] = [107, 65];
// Necromancer skills
exports.NTIPAliasStat["skillamplifydamage"] = [107, 66];
exports.NTIPAliasStat["skillteeth"] = [107, 67];
exports.NTIPAliasStat["skillbonearmor"] = [107, 68];
exports.NTIPAliasStat["skillskeletonmastery"] = [107, 69];
exports.NTIPAliasStat["skillraiseskeleton"] = [107, 70];
exports.NTIPAliasStat["skilldimvision"] = [107, 71];
exports.NTIPAliasStat["skillweaken"] = [107, 72];
exports.NTIPAliasStat["skillpoisondagger"] = [107, 73];
exports.NTIPAliasStat["skillcorpseexplosion"] = [107, 74];
exports.NTIPAliasStat["skillclaygolem"] = [107, 75];
exports.NTIPAliasStat["skillironmaiden"] = [107, 76];
exports.NTIPAliasStat["skillterror"] = [107, 77];
exports.NTIPAliasStat["skillbonewall"] = [107, 78];
exports.NTIPAliasStat["skillgolemmastery"] = [107, 79];
exports.NTIPAliasStat["skillskeletalmage"] = [107, 80];
exports.NTIPAliasStat["skillconfuse"] = [107, 81];
exports.NTIPAliasStat["skilllifetap"] = [107, 82];
exports.NTIPAliasStat["skillpoisonexplosion"] = [107, 83];
exports.NTIPAliasStat["skillbonespear"] = [107, 84];
exports.NTIPAliasStat["skillbloodgolem"] = [107, 85];
exports.NTIPAliasStat["skillattract"] = [107, 86];
exports.NTIPAliasStat["skilldecrepify"] = [107, 87];
exports.NTIPAliasStat["skillboneprison"] = [107, 88];
exports.NTIPAliasStat["skillsummonresist"] = [107, 89];
exports.NTIPAliasStat["skillirongolem"] = [107, 90];
exports.NTIPAliasStat["skilllowerresist"] = [107, 91];
exports.NTIPAliasStat["skillpoisonnova"] = [107, 92];
exports.NTIPAliasStat["skillbonespirit"] = [107, 93];
exports.NTIPAliasStat["skillfiregolem"] = [107, 94];
exports.NTIPAliasStat["skillrevive"] = [107, 95];
// Paladin skills
exports.NTIPAliasStat["skillsacrifice"] = [107, 96];
exports.NTIPAliasStat["skillsmite"] = [107, 97];
exports.NTIPAliasStat["skillmight"] = [107, 98];
exports.NTIPAliasStat["skillprayer"] = [107, 99];
exports.NTIPAliasStat["skillresistfire"] = [107, 100];
exports.NTIPAliasStat["skillholybolt"] = [107, 101];
exports.NTIPAliasStat["skillholyfire"] = [107, 102];
exports.NTIPAliasStat["skillthorns"] = [107, 103];
exports.NTIPAliasStat["skilldefiance"] = [107, 104];
exports.NTIPAliasStat["skillresistcold"] = [107, 105];
exports.NTIPAliasStat["skillzeal"] = [107, 106];
exports.NTIPAliasStat["skillcharge"] = [107, 107];
exports.NTIPAliasStat["skillblessedaim"] = [107, 108];
exports.NTIPAliasStat["skillcleansing"] = [107, 109];
exports.NTIPAliasStat["skillresistlightning"] = [107, 110];
exports.NTIPAliasStat["skillvengeance"] = [107, 111];
exports.NTIPAliasStat["skillblessedhammer"] = [107, 112];
exports.NTIPAliasStat["skillconcentration"] = [107, 113];
exports.NTIPAliasStat["skillholyfreeze"] = [107, 114];
exports.NTIPAliasStat["skillvigor"] = [107, 115];
exports.NTIPAliasStat["skillconversion"] = [107, 116];
exports.NTIPAliasStat["skillholyshield"] = [107, 117];
exports.NTIPAliasStat["skillholyshock"] = [107, 118];
exports.NTIPAliasStat["skillsanctuary"] = [107, 119];
exports.NTIPAliasStat["skillmeditation"] = [107, 120];
exports.NTIPAliasStat["skillfistoftheheavens"] = [107, 121];
exports.NTIPAliasStat["skillfanaticism"] = [107, 122];
exports.NTIPAliasStat["skillconviction"] = [107, 123];
exports.NTIPAliasStat["skillredemption"] = [107, 124];
exports.NTIPAliasStat["skillsalvation"] = [107, 125];
// Barbarian skills
exports.NTIPAliasStat["skillbash"] = [107, 126];
exports.NTIPAliasStat["skillswordmastery"] = [107, 127];
exports.NTIPAliasStat["skillaxemastery"] = [107, 128];
exports.NTIPAliasStat["skillmacemastery"] = [107, 129];
exports.NTIPAliasStat["skillhowl"] = [107, 130];
exports.NTIPAliasStat["skillfindpotion"] = [107, 131];
exports.NTIPAliasStat["skillleap"] = [107, 132];
exports.NTIPAliasStat["skilldoubleswing"] = [107, 133];
exports.NTIPAliasStat["skillpolearmmastery"] = [107, 134];
exports.NTIPAliasStat["skillthrowingmastery"] = [107, 135];
exports.NTIPAliasStat["skillspearmastery"] = [107, 136];
exports.NTIPAliasStat["skilltaunt"] = [107, 137];
exports.NTIPAliasStat["skillshout"] = [107, 138];
exports.NTIPAliasStat["skillstun"] = [107, 139];
exports.NTIPAliasStat["skilldoublethrow"] = [107, 140];
exports.NTIPAliasStat["skillincreasedstamina"] = [107, 141];
exports.NTIPAliasStat["skillfinditem"] = [107, 142];
exports.NTIPAliasStat["skillleapattack"] = [107, 143];
exports.NTIPAliasStat["skillconcentrate"] = [107, 144];
exports.NTIPAliasStat["skillironskin"] = [107, 145];
exports.NTIPAliasStat["skillbattlecry"] = [107, 146];
exports.NTIPAliasStat["skillfrenzy"] = [107, 147];
exports.NTIPAliasStat["skillincreasedspeed"] = [107, 148];
exports.NTIPAliasStat["skillbattleorders"] = [107, 149];
exports.NTIPAliasStat["skillgrimward"] = [107, 150];
exports.NTIPAliasStat["skillwhirlwind"] = [107, 151];
exports.NTIPAliasStat["skillberserk"] = [107, 152];
exports.NTIPAliasStat["skillnaturalresistance"] = [107, 153];
exports.NTIPAliasStat["skillwarcry"] = [107, 154];
exports.NTIPAliasStat["skillbattlecommand"] = [107, 155];
// Druid skills
exports.NTIPAliasStat["skillraven"] = [107, 221];
exports.NTIPAliasStat["skillpoisoncreeper"] = [107, 222];
exports.NTIPAliasStat["skillwerewolf"] = [107, 223];
exports.NTIPAliasStat["skilllycanthropy"] = [107, 224];
exports.NTIPAliasStat["skillfirestorm"] = [107, 225];
exports.NTIPAliasStat["skilloaksage"] = [107, 226];
exports.NTIPAliasStat["skillsummonspiritwolf"] = [107, 227];
exports.NTIPAliasStat["skillwerebear"] = [107, 228];
exports.NTIPAliasStat["skillmoltenboulder"] = [107, 229];
exports.NTIPAliasStat["skillarcticblast"] = [107, 230];
exports.NTIPAliasStat["skillcarrionvine"] = [107, 231];
exports.NTIPAliasStat["skillferalrage"] = [107, 232];
exports.NTIPAliasStat["skillmaul"] = [107, 233];
exports.NTIPAliasStat["skillfissure"] = [107, 234];
exports.NTIPAliasStat["skillcyclonearmor"] = [107, 235];
exports.NTIPAliasStat["skillheartofwolverine"] = [107, 236];
exports.NTIPAliasStat["skillsummondirewolf"] = [107, 237];
exports.NTIPAliasStat["skillrabies"] = [107, 238];
exports.NTIPAliasStat["skillfireclaws"] = [107, 239];
exports.NTIPAliasStat["skilltwister"] = [107, 240];
exports.NTIPAliasStat["skillsolarcreeper"] = [107, 241];
exports.NTIPAliasStat["skillhunger"] = [107, 242];
exports.NTIPAliasStat["skillshockwave"] = [107, 243];
exports.NTIPAliasStat["skillvolcano"] = [107, 244];
exports.NTIPAliasStat["skilltornado"] = [107, 245];
exports.NTIPAliasStat["skillspiritofbarbs"] = [107, 246];
exports.NTIPAliasStat["skillsummongrizzly"] = [107, 247];
exports.NTIPAliasStat["skillfury"] = [107, 248];
exports.NTIPAliasStat["skillarmageddon"] = [107, 249];
exports.NTIPAliasStat["skillhurricane"] = [107, 250];
// Assassin skills
exports.NTIPAliasStat["skillfireblast"] = [107, 251];
exports.NTIPAliasStat["skillclawmastery"] = [107, 252];
exports.NTIPAliasStat["skillpsychichammer"] = [107, 253];
exports.NTIPAliasStat["skilltigerstrike"] = [107, 254];
exports.NTIPAliasStat["skilldragontalon"] = [107, 255];
exports.NTIPAliasStat["skillshockweb"] = [107, 256];
exports.NTIPAliasStat["skillbladesentinel"] = [107, 257];
exports.NTIPAliasStat["skillburstofspeed"] = [107, 258];
exports.NTIPAliasStat["skillfistsoffire"] = [107, 259];
exports.NTIPAliasStat["skilldragonclaw"] = [107, 260];
exports.NTIPAliasStat["skillchargedboltsentry"] = [107, 261];
exports.NTIPAliasStat["skillwakeoffire"] = [107, 262];
exports.NTIPAliasStat["skillweaponblock"] = [107, 263];
exports.NTIPAliasStat["skillcloakofshadows"] = [107, 264];
exports.NTIPAliasStat["skillcobrastrike"] = [107, 265];
exports.NTIPAliasStat["skillbladefury"] = [107, 266];
exports.NTIPAliasStat["skillfade"] = [107, 267];
exports.NTIPAliasStat["skillshadowwarrior"] = [107, 268];
exports.NTIPAliasStat["skillclawsofthunder"] = [107, 269];
exports.NTIPAliasStat["skilldragontail"] = [107, 270];
exports.NTIPAliasStat["skilllightningsentry"] = [107, 271];
exports.NTIPAliasStat["skillwakeofinferno"] = [107, 272];
exports.NTIPAliasStat["skillmindblast"] = [107, 273];
exports.NTIPAliasStat["skillbladesofice"] = [107, 274];
exports.NTIPAliasStat["skilldragonflight"] = [107, 275];
exports.NTIPAliasStat["skilldeathsentry"] = [107, 276];
exports.NTIPAliasStat["skillbladeshield"] = [107, 277];
exports.NTIPAliasStat["skillvenom"] = [107, 278];
exports.NTIPAliasStat["skillshadowmaster"] = [107, 279];
exports.NTIPAliasStat["skillphoenixstrike"] = [107, 280];
exports.NTIPAliasStat["itemrestinpeace"] = 108;
exports.NTIPAliasStat["curseresistance"] = 109;
exports.NTIPAliasStat["itempoisonlengthresist"] = 110;
exports.NTIPAliasStat["itemnormaldamage"] = 111;
exports.NTIPAliasStat["itemhowl"] = 112;
exports.NTIPAliasStat["itemstupidity"] = 113;
exports.NTIPAliasStat["itemdamagetomana"] = 114;
exports.NTIPAliasStat["itemignoretargetac"] = 115;
exports.NTIPAliasStat["itemfractionaltargetac"] = 116;
exports.NTIPAliasStat["itempreventheal"] = 117;
exports.NTIPAliasStat["itemhalffreezeduration"] = 118;
exports.NTIPAliasStat["itemtohitpercent"] = 119;
exports.NTIPAliasStat["itemdamagetargetac"] = 120;
exports.NTIPAliasStat["itemdemondamagepercent"] = 121;
exports.NTIPAliasStat["itemundeaddamagepercent"] = 122;
exports.NTIPAliasStat["itemdemontohit"] = 123;
exports.NTIPAliasStat["itemundeadtohit"] = 124;
exports.NTIPAliasStat["itemthrowable"] = 125;
exports.NTIPAliasStat["itemelemskill"] = 126;
exports.NTIPAliasStat["itemallskills"] = 127;
exports.NTIPAliasStat["itemattackertakeslightdamage"] = 128;
exports.NTIPAliasStat["ironmaidenlevel"] = 129;
exports.NTIPAliasStat["lifetaplevel"] = 130;
exports.NTIPAliasStat["thornspercent"] = 131;
exports.NTIPAliasStat["bonearmor"] = 132;
exports.NTIPAliasStat["bonearmormax"] = 133;
exports.NTIPAliasStat["itemfreeze"] = 134;
exports.NTIPAliasStat["itemopenwounds"] = 135;
exports.NTIPAliasStat["itemcrushingblow"] = 136;
exports.NTIPAliasStat["itemkickdamage"] = 137;
exports.NTIPAliasStat["itemmanaafterkill"] = 138;
exports.NTIPAliasStat["itemhealafterdemonkill"] = 139;
exports.NTIPAliasStat["itemextrablood"] = 140;
exports.NTIPAliasStat["itemdeadlystrike"] = 141;
exports.NTIPAliasStat["itemabsorbfirepercent"] = 142;
exports.NTIPAliasStat["itemabsorbfire"] = 143;
exports.NTIPAliasStat["itemabsorblightpercent"] = 144;
exports.NTIPAliasStat["itemabsorblight"] = 145;
exports.NTIPAliasStat["itemabsorbmagicpercent"] = 146;
exports.NTIPAliasStat["itemabsorbmagic"] = 147;
exports.NTIPAliasStat["itemabsorbcoldpercent"] = 148;
exports.NTIPAliasStat["itemabsorbcold"] = 149;
exports.NTIPAliasStat["itemslow"] = 150;
exports.NTIPAliasStat["itemaura"] = 151;
exports.NTIPAliasStat["mightaura"] = [151, 98];
exports.NTIPAliasStat["holyfireaura"] = [151, 102];
exports.NTIPAliasStat["thornsaura"] = [151, 103];
exports.NTIPAliasStat["defianceaura"] = [151, 104];
exports.NTIPAliasStat["concentrationaura"] = [151, 113];
exports.NTIPAliasStat["holyfreezeaura"] = [151, 114];
exports.NTIPAliasStat["vigoraura"] = [151, 115];
exports.NTIPAliasStat["holyshockaura"] = [151, 118];
exports.NTIPAliasStat["sanctuaryaura"] = [151, 119];
exports.NTIPAliasStat["meditationaura"] = [151, 120];
exports.NTIPAliasStat["fanaticismaura"] = [151, 122];
exports.NTIPAliasStat["convictionaura"] = [151, 123];
exports.NTIPAliasStat["redemptionaura"] = [151, 124];
exports.NTIPAliasStat["itemindestructible"] = 152;
exports.NTIPAliasStat["itemcannotbefrozen"] = 153;
exports.NTIPAliasStat["itemstaminadrainpct"] = 154;
exports.NTIPAliasStat["itemreanimate"] = 155;
exports.NTIPAliasStat["itempierce"] = 156;
exports.NTIPAliasStat["itemmagicarrow"] = 157;
exports.NTIPAliasStat["itemexplosivearrow"] = 158;
exports.NTIPAliasStat["itemthrowmindamage"] = 159;
exports.NTIPAliasStat["itemthrowmaxdamage"] = 160;
exports.NTIPAliasStat["itemskillhandofathena"] = 161;
exports.NTIPAliasStat["itemskillstaminapercent"] = 162;
exports.NTIPAliasStat["itemskillpassivestaminapercent"] = 163;
exports.NTIPAliasStat["itemskillconcentration"] = 164;
exports.NTIPAliasStat["itemskillenchant"] = 165;
exports.NTIPAliasStat["itemskillpierce"] = 166;
exports.NTIPAliasStat["itemskillconviction"] = 167;
exports.NTIPAliasStat["itemskillchillingarmor"] = 168;
exports.NTIPAliasStat["itemskillfrenzy"] = 169;
exports.NTIPAliasStat["itemskilldecrepify"] = 170;
exports.NTIPAliasStat["itemskillarmorpercent"] = 171;
exports.NTIPAliasStat["alignment"] = 172;
exports.NTIPAliasStat["target0"] = 173;
exports.NTIPAliasStat["target1"] = 174;
exports.NTIPAliasStat["goldlost"] = 175;
exports.NTIPAliasStat["conversionlevel"] = 176;
exports.NTIPAliasStat["conversionmaxhp"] = 177;
exports.NTIPAliasStat["unitdooverlay"] = 178;
exports.NTIPAliasStat["attackvsmontype"] = 179;
exports.NTIPAliasStat["damagevsmontype"] = 180;
exports.NTIPAliasStat["fade"] = 181;
exports.NTIPAliasStat["armoroverridepercent"] = 182;
exports.NTIPAliasStat["unused183"] = 183;
exports.NTIPAliasStat["unused184"] = 184;
exports.NTIPAliasStat["unused185"] = 185;
exports.NTIPAliasStat["unused186"] = 186;
exports.NTIPAliasStat["unused187"] = 187;
exports.NTIPAliasStat["itemaddskilltab"] = 188;
exports.NTIPAliasStat["itemaddbowandcrossbowskilltab"] = [188, 0];
exports.NTIPAliasStat["bowandcrossbowskilltab"] = [188, 0];
exports.NTIPAliasStat["itemaddpassiveandmagicskilltab"] = [188, 1];
exports.NTIPAliasStat["passiveandmagicskilltab"] = [188, 1];
exports.NTIPAliasStat["itemaddjavelinandspearskilltab"] = [188, 2];
exports.NTIPAliasStat["javelinandspearskilltab"] = [188, 2];
exports.NTIPAliasStat["itemaddfireskilltab"] = [188, 8];
exports.NTIPAliasStat["fireskilltab"] = [188, 8];
exports.NTIPAliasStat["itemaddlightningskilltab"] = [188, 9];
exports.NTIPAliasStat["lightningskilltab"] = [188, 9];
exports.NTIPAliasStat["itemaddcoldskilltab"] = [188, 10];
exports.NTIPAliasStat["coldskilltab"] = [188, 10];
exports.NTIPAliasStat["itemaddcursesskilltab"] = [188, 16];
exports.NTIPAliasStat["cursesskilltab"] = [188, 16];
exports.NTIPAliasStat["itemaddpoisonandboneskilltab"] = [188, 17];
exports.NTIPAliasStat["poisonandboneskilltab"] = [188, 17];
exports.NTIPAliasStat["itemaddnecromancersummoningskilltab"] = [188, 18];
exports.NTIPAliasStat["necromancersummoningskilltab"] = [188, 18];
exports.NTIPAliasStat["itemaddpalicombatskilltab"] = [188, 24];
exports.NTIPAliasStat["palicombatskilltab"] = [188, 24];
exports.NTIPAliasStat["itemaddoffensiveaurasskilltab"] = [188, 25];
exports.NTIPAliasStat["offensiveaurasskilltab"] = [188, 25];
exports.NTIPAliasStat["itemadddefensiveaurasskilltab"] = [188, 26];
exports.NTIPAliasStat["defensiveaurasskilltab"] = [188, 26];
exports.NTIPAliasStat["itemaddbarbcombatskilltab"] = [188, 32];
exports.NTIPAliasStat["barbcombatskilltab"] = [188, 32];
exports.NTIPAliasStat["itemaddmasteriesskilltab"] = [188, 33];
exports.NTIPAliasStat["masteriesskilltab"] = [188, 33];
exports.NTIPAliasStat["itemaddwarcriesskilltab"] = [188, 34];
exports.NTIPAliasStat["warcriesskilltab"] = [188, 34];
exports.NTIPAliasStat["itemadddruidsummoningskilltab"] = [188, 40];
exports.NTIPAliasStat["druidsummoningskilltab"] = [188, 40];
exports.NTIPAliasStat["itemaddshapeshiftingskilltab"] = [188, 41];
exports.NTIPAliasStat["shapeshiftingskilltab"] = [188, 41];
exports.NTIPAliasStat["itemaddelementalskilltab"] = [188, 42];
exports.NTIPAliasStat["elementalskilltab"] = [188, 42];
exports.NTIPAliasStat["itemaddtrapsskilltab"] = [188, 48];
exports.NTIPAliasStat["trapsskilltab"] = [188, 48];
exports.NTIPAliasStat["itemaddshadowdisciplinesskilltab"] = [188, 49];
exports.NTIPAliasStat["shadowdisciplinesskilltab"] = [188, 49];
exports.NTIPAliasStat["itemaddmartialartsskilltab"] = [188, 50];
exports.NTIPAliasStat["martialartsskilltab"] = [188, 50];
exports.NTIPAliasStat["unused189"] = 189;
exports.NTIPAliasStat["unused190"] = 190;
exports.NTIPAliasStat["unused191"] = 191;
exports.NTIPAliasStat["unused192"] = 192;
exports.NTIPAliasStat["unused193"] = 193;
exports.NTIPAliasStat["itemnumsockets"] = 194;
exports.NTIPAliasStat["sockets"] = 194;
exports.NTIPAliasStat["itemskillonattack"] = [195, 1];
exports.NTIPAliasStat["itemskillonattacklevel"] = [195, 2];
exports.NTIPAliasStat["itemskillonkill"] = [196, 1];
exports.NTIPAliasStat["itemskillonkilllevel"] = [196, 2];
exports.NTIPAliasStat["itemskillondeath"] = [197, 1];
exports.NTIPAliasStat["itemskillondeathlevel"] = [197, 2];
exports.NTIPAliasStat["itemskillonhit"] = [198, 1];
exports.NTIPAliasStat["itemskillonhitlevel"] = [198, 2];
exports.NTIPAliasStat["amplifydamageonhit"] = [198, 4225];
exports.NTIPAliasStat["itemskillonlevelup"] = [199, 1];
exports.NTIPAliasStat["itemskillonleveluplevel"] = [199, 2];
exports.NTIPAliasStat["unused200"] = 200;
exports.NTIPAliasStat["itemskillongethit"] = [201, 1];
exports.NTIPAliasStat["itemskillongethitlevel"] = [201, 2];
exports.NTIPAliasStat["unused202"] = 202;
exports.NTIPAliasStat["unused203"] = 203;
exports.NTIPAliasStat["itemchargedskill"] = [204, 1];
exports.NTIPAliasStat["itemchargedskilllevel"] = [204, 2];
exports.NTIPAliasStat["teleportcharges"] = [204, 3461];
exports.NTIPAliasStat["unused204"] = 205;
exports.NTIPAliasStat["unused205"] = 206;
exports.NTIPAliasStat["unused206"] = 207;
exports.NTIPAliasStat["unused207"] = 208;
exports.NTIPAliasStat["unused208"] = 209;
exports.NTIPAliasStat["unused209"] = 210;
exports.NTIPAliasStat["unused210"] = 211;
exports.NTIPAliasStat["unused211"] = 212;
exports.NTIPAliasStat["unused212"] = 213;
exports.NTIPAliasStat["itemarmorperlevel"] = 214;
exports.NTIPAliasStat["itemarmorpercentperlevel"] = 215;
exports.NTIPAliasStat["itemhpperlevel"] = 216;
exports.NTIPAliasStat["itemmanaperlevel"] = 217;
exports.NTIPAliasStat["itemmaxdamageperlevel"] = 218;
exports.NTIPAliasStat["itemmaxdamagepercentperlevel"] = 219;
exports.NTIPAliasStat["itemstrengthperlevel"] = 220;
exports.NTIPAliasStat["itemdexterityperlevel"] = 221;
exports.NTIPAliasStat["itemenergyperlevel"] = 222;
exports.NTIPAliasStat["itemvitalityperlevel"] = 223;
exports.NTIPAliasStat["itemtohitperlevel"] = 224;
exports.NTIPAliasStat["itemtohitpercentperlevel"] = 225;
exports.NTIPAliasStat["itemcolddamagemaxperlevel"] = 226;
exports.NTIPAliasStat["itemfiredamagemaxperlevel"] = 227;
exports.NTIPAliasStat["itemltngdamagemaxperlevel"] = 228;
exports.NTIPAliasStat["itempoisdamagemaxperlevel"] = 229;
exports.NTIPAliasStat["itemresistcoldperlevel"] = 230;
exports.NTIPAliasStat["itemresistfireperlevel"] = 231;
exports.NTIPAliasStat["itemresistltngperlevel"] = 232;
exports.NTIPAliasStat["itemresistpoisperlevel"] = 233;
exports.NTIPAliasStat["itemabsorbcoldperlevel"] = 234;
exports.NTIPAliasStat["itemabsorbfireperlevel"] = 235;
exports.NTIPAliasStat["itemabsorbltngperlevel"] = 236;
exports.NTIPAliasStat["itemabsorbpoisperlevel"] = 237;
exports.NTIPAliasStat["itemthornsperlevel"] = 238;
exports.NTIPAliasStat["itemfindgoldperlevel"] = 239;
exports.NTIPAliasStat["itemfindmagicperlevel"] = 240;
exports.NTIPAliasStat["itemregenstaminaperlevel"] = 241;
exports.NTIPAliasStat["itemstaminaperlevel"] = 242;
exports.NTIPAliasStat["itemdamagedemonperlevel"] = 243;
exports.NTIPAliasStat["itemdamageundeadperlevel"] = 244;
exports.NTIPAliasStat["itemtohitdemonperlevel"] = 245;
exports.NTIPAliasStat["itemtohitundeadperlevel"] = 246;
exports.NTIPAliasStat["itemcrushingblowperlevel"] = 247;
exports.NTIPAliasStat["itemopenwoundsperlevel"] = 248;
exports.NTIPAliasStat["itemkickdamageperlevel"] = 249;
exports.NTIPAliasStat["itemdeadlystrikeperlevel"] = 250;
exports.NTIPAliasStat["itemfindgemsperlevel"] = 251;
exports.NTIPAliasStat["itemreplenishdurability"] = 252;
exports.NTIPAliasStat["itemreplenishquantity"] = 253;
exports.NTIPAliasStat["itemextrastack"] = 254;
exports.NTIPAliasStat["itemfinditem"] = 255;
exports.NTIPAliasStat["itemslashdamage"] = 256;
exports.NTIPAliasStat["itemslashdamagepercent"] = 257;
exports.NTIPAliasStat["itemcrushdamage"] = 258;
exports.NTIPAliasStat["itemcrushdamagepercent"] = 259;
exports.NTIPAliasStat["itemthrustdamage"] = 260;
exports.NTIPAliasStat["itemthrustdamagepercent"] = 261;
exports.NTIPAliasStat["itemabsorbslash"] = 262;
exports.NTIPAliasStat["itemabsorbcrush"] = 263;
exports.NTIPAliasStat["itemabsorbthrust"] = 264;
exports.NTIPAliasStat["itemabsorbslashpercent"] = 265;
exports.NTIPAliasStat["itemabsorbcrushpercent"] = 266;
exports.NTIPAliasStat["itemabsorbthrustpercent"] = 267;
exports.NTIPAliasStat["itemarmorbytime"] = 268;
exports.NTIPAliasStat["itemarmorpercentbytime"] = 269;
exports.NTIPAliasStat["itemhpbytime"] = 270;
exports.NTIPAliasStat["itemmanabytime"] = 271;
exports.NTIPAliasStat["itemmaxdamagebytime"] = 272;
exports.NTIPAliasStat["itemmaxdamagepercentbytime"] = 273;
exports.NTIPAliasStat["itemstrengthbytime"] = 274;
exports.NTIPAliasStat["itemdexteritybytime"] = 275;
exports.NTIPAliasStat["itemenergybytime"] = 276;
exports.NTIPAliasStat["itemvitalitybytime"] = 277;
exports.NTIPAliasStat["itemtohitbytime"] = 278;
exports.NTIPAliasStat["itemtohitpercentbytime"] = 279;
exports.NTIPAliasStat["itemcolddamagemaxbytime"] = 280;
exports.NTIPAliasStat["itemfiredamagemaxbytime"] = 281;
exports.NTIPAliasStat["itemltngdamagemaxbytime"] = 282;
exports.NTIPAliasStat["itempoisdamagemaxbytime"] = 283;
exports.NTIPAliasStat["itemresistcoldbytime"] = 284;
exports.NTIPAliasStat["itemresistfirebytime"] = 285;
exports.NTIPAliasStat["itemresistltngbytime"] = 286;
exports.NTIPAliasStat["itemresistpoisbytime"] = 287;
exports.NTIPAliasStat["itemabsorbcoldbytime"] = 288;
exports.NTIPAliasStat["itemabsorbfirebytime"] = 289;
exports.NTIPAliasStat["itemabsorbltngbytime"] = 290;
exports.NTIPAliasStat["itemabsorbpoisbytime"] = 291;
exports.NTIPAliasStat["itemfindgoldbytime"] = 292;
exports.NTIPAliasStat["itemfindmagicbytime"] = 293;
exports.NTIPAliasStat["itemregenstaminabytime"] = 294;
exports.NTIPAliasStat["itemstaminabytime"] = 295;
exports.NTIPAliasStat["itemdamagedemonbytime"] = 296;
exports.NTIPAliasStat["itemdamageundeadbytime"] = 297;
exports.NTIPAliasStat["itemtohitdemonbytime"] = 298;
exports.NTIPAliasStat["itemtohitundeadbytime"] = 299;
exports.NTIPAliasStat["itemcrushingblowbytime"] = 300;
exports.NTIPAliasStat["itemopenwoundsbytime"] = 301;
exports.NTIPAliasStat["itemkickdamagebytime"] = 302;
exports.NTIPAliasStat["itemdeadlystrikebytime"] = 303;
exports.NTIPAliasStat["itemfindgemsbytime"] = 304;
exports.NTIPAliasStat["itempiercecold"] = 305;
exports.NTIPAliasStat["itempiercefire"] = 306;
exports.NTIPAliasStat["itempierceltng"] = 307;
exports.NTIPAliasStat["itempiercepois"] = 308;
exports.NTIPAliasStat["itemdamagevsmonster"] = 309;
exports.NTIPAliasStat["itemdamagepercentvsmonster"] = 310;
exports.NTIPAliasStat["itemtohitvsmonster"] = 311;
exports.NTIPAliasStat["itemtohitpercentvsmonster"] = 312;
exports.NTIPAliasStat["itemacvsmonster"] = 313;
exports.NTIPAliasStat["itemacpercentvsmonster"] = 314;
exports.NTIPAliasStat["firelength"] = 315;
exports.NTIPAliasStat["burningmin"] = 316;
exports.NTIPAliasStat["burningmax"] = 317;
exports.NTIPAliasStat["progressivedamage"] = 318;
exports.NTIPAliasStat["progressivesteal"] = 319;
exports.NTIPAliasStat["progressiveother"] = 320;
exports.NTIPAliasStat["progressivefire"] = 321;
exports.NTIPAliasStat["progressivecold"] = 322;
exports.NTIPAliasStat["progressivelightning"] = 323;
exports.NTIPAliasStat["itemextracharges"] = 324;
exports.NTIPAliasStat["progressivetohit"] = 325;
exports.NTIPAliasStat["poisoncount"] = 326;
exports.NTIPAliasStat["damageframerate"] = 327;
exports.NTIPAliasStat["pierceidx"] = 328;
exports.NTIPAliasStat["passivefiremastery"] = 329;
exports.NTIPAliasStat["passiveltngmastery"] = 330;
exports.NTIPAliasStat["passivecoldmastery"] = 331;
exports.NTIPAliasStat["passivepoismastery"] = 332;
exports.NTIPAliasStat["passivefirepierce"] = 333;
exports.NTIPAliasStat["passiveltngpierce"] = 334;
exports.NTIPAliasStat["passivecoldpierce"] = 335;
exports.NTIPAliasStat["passivepoispierce"] = 336;
exports.NTIPAliasStat["passivecriticalstrike"] = 337;
exports.NTIPAliasStat["passivedodge"] = 338;
exports.NTIPAliasStat["passiveavoid"] = 339;
exports.NTIPAliasStat["passiveevade"] = 340;
exports.NTIPAliasStat["passivewarmth"] = 341;
exports.NTIPAliasStat["passivemasterymeleeth"] = 342;
exports.NTIPAliasStat["passivemasterymeleedmg"] = 343;
exports.NTIPAliasStat["passivemasterymeleecrit"] = 344;
exports.NTIPAliasStat["passivemasterythrowth"] = 345;
exports.NTIPAliasStat["passivemasterythrowdmg"] = 346;
exports.NTIPAliasStat["passivemasterythrowcrit"] = 347;
exports.NTIPAliasStat["passiveweaponblock"] = 348;
exports.NTIPAliasStat["passivesummonresist"] = 349;
exports.NTIPAliasStat["modifierlistskill"] = 350;
exports.NTIPAliasStat["modifierlistlevel"] = 351;
exports.NTIPAliasStat["lastsenthppct"] = 352;
exports.NTIPAliasStat["sourceunittype"] = 353;
exports.NTIPAliasStat["sourceunitid"] = 354;
exports.NTIPAliasStat["shortparam1"] = 355;
exports.NTIPAliasStat["questitemdifficulty"] = 356;
exports.NTIPAliasStat["passivemagmastery"] = 357;
exports.NTIPAliasStat["passivemagpierce"] = 358;
// Doesnt really exists, but is calculated in getStatEx
exports.NTIPAliasStat["allres"] = 555;

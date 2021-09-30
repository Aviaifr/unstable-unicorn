//Missing card - SUPER NEIGH
const _cardList = {
    "base": {
        "targeteddestruction": {
            "count": 1,
            "type": "magic",
            "text": "SACRIFICE or DESTROY an Upgrade or Downgrade card.",
            "name": "TARGETED DESTRUCTION"
        },
        "slowdown": {
            "count": 1,
            "type": "downgrade",
            "text": "As long as this card is in your Stable, you cannot play instant cards.",
            "name": "SLOWDOWN"
        },
        "twoforone": {
            "count": 2,
            "type": "magic",
            "text": "SACRIFICE a card, then DESTROY two cards.",
            "name": "TWO-FOR-ONE"
        },
        "basicgreen": {
            "count": 3,
            "type": "basic",
            "text": "Vinyl records and mixtapes only.",
            "name": "BASIC UNICORN"
        },
        "basicindigo": {
            "count": 3,
            "type": "basic",
            "text": "(SOME EMOJIIS!)",
            "name": "BASIC UNICORN"
        },
        "barbedwire": {
            "count": 1,
            "type": "downgrade",
            "text": "As long as this card is in your Stable, you must DISCARD a card each time a Unicorn enters or leaves your Stable.",
            "name": "BARBED WIRE"
        },
        "blackknight": {
            "count": 1,
            "type": "magical",
            "text": "If one of your Unicorns would be destroyed, you may SACRIFICE this card instead. ",
            "name": "BLACK KNIGHT UNICORN"
        },
        "babynarwhal": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY NARWHAL"
        },
        "neigh": {
            "count": 14,
            "type": "instant",
            "text": "Play this card when any player tries to play a card. Stop that player’s card from coming into play and send it to the discard pile instead.",
            "name": "NEIGH"
        },
        "majesticflying": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may choose a Unicorn from the discard pile and add it to your hand. If this card is sacrificed or destroyed, return it to your hand.",
            "name": "MAJESTIC FLYING UNICORN"
        },
        "babydeath": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY UNICORN"
        },
        "rainbowaura": {
            "count": 1,
            "type": "upgrade",
            "text": "As long as this card is in your Stable, your Unicorns cannot be destroyed.",
            "name": "RAINBOW AURA"
        },
        "extratail": {
            "count": 3,
            "type": "upgrade",
            "text": "You must have a Basic Unicorn in your Stable in order to play this card. If this card in your Stable at the beginning of your turn, you may DRAW an extra card.",
            "name": "EXTRA TAIL"
        },
        "queenbee": {
            "count": 1,
            "type": "magical",
            "text": "As long as this card is in your Stable, no other player can play Basic Unicorns.",
            "name": "QUEEN BEE UNICORN"
        },
        "extremelydestructive": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, each player must SACRIFICE a Unicorn. ",
            "name": "EXTREMELY DESTRUCTIVE UNICORN"
        },
        "basicred": {
            "count": 3,
            "type": "basic",
            "text": "Beards are like, so hot.",
            "name": "BASIC UNICORN"
        },
        "americorn": {
            "count": 1,
            "type": "magical",
            "text": "When this cardenters your Stable, you may take a card at random from any player’s hand and add it to your hand. ",
            "name": "AMERICORN"
        },
        "extremelyfertile": {
            "count": 1,
            "type": "magical",
            "text": "If this card is in your Stable at the beginning of your turn, you may DISCARD a card. If you do, bring a Baby Unicorn directly into your Stable from the Nursery.",
            "name": "EXTREMELY FERTILE UNICORN"
        },
        "babywhite": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY UNICORN"
        },
        "glitterbomb": {
            "count": 2,
            "type": "upgrade",
            "text": "If this card is in your Stable at the beginning of your turn, you may SACRIFICE a card, then DESTROY a card.",
            "name": "GLITTER BOMB"
        },
        "babypurple": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY UNICORN"
        },
        "rhinocorn": {
            "count": 1,
            "type": "magical",
            "text": "If this card is in your Stable at the beginning of your turn, you may DESTROY a Unicorn, then end your turn immediately.",
            "name": "RHINOCORN"
        },
        "unicornonthecob": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, DRAW two cards then DISCARD a card.",
            "name": "UNICORN ON THE COB"
        },
        "magicalkittencorn": {
            "count": 1,
            "type": "magical",
            "text": "As long as this card is in your Stable, it cannot be destroyed or affected by Magic cards.",
            "name": "MAGICAL KITTENCORN"
        },
        "babypink": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY UNICORN"
        },
        "basicnarwhal": {
            "count": 1,
            "type": "basic",
            "text": "This card has no special powers, but it sure is cute!",
            "name": "NARWHAL"
        },
        "gooddeal": {
            "count": 1,
            "type": "magic",
            "text": "DRAW three cards, then DISCARD a card.",
            "name": "GOOD DEAL"
        },
        "shabby": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may search the deck for a Downgrade card. Add it to your hand, then shuffle the deck.",
            "name": "SHABBY THE NARWHAL"
        },
        "retarget": {
            "count": 2,
            "type": "magic",
            "text": "Move an Upgrade or Downgrade card from any player’s Stable to another player’s Stable.",
            "name": "RE-TARGET"
        },
        "changeofluck": {
            "count": 2,
            "type": "magic",
            "text": "DRAW two cards, DISCARD three cards, then take another turn.",
            "name": "CHANGE OF LUCK"
        },
        "annoying": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may choose any player. That player must DISCARD a card. If this card is sacrificed or destroyed, return it to your hand. ",
            "name": "ANNOYING FLYING UNICORN"
        },
        "magicalflying": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may choose a Magic card from the discard pile and add it to your hand. If this card is sacrificed or destroyed, return it to your hand.",
            "name": "MAGICAL FLYING UNICORN"
        },
        "rainbowmane": {
            "count": 3,
            "type": "upgrade",
            "text": "You must have a Basic Unicorn in your Stable in order to play this card. If this card is in your Stable at the beginning of your turn, you may bring Basic Unicorn from your hand directly into your Stable.",
            "name": "RAINBOW MANE"
        },
        "basicpurple": {
            "count": 3,
            "type": "basic",
            "text": "#nomakeup #nofilter #sunnies #shameless #selfie #basic #TGIF #unicornhairdontcare",
            "name": "BASIC UNICORN"
        },
        "summoningritual": {
            "count": 1,
            "type": "upgrade",
            "text": "If this card is in your Stable at the beginning of your turn, you may DISCARD two Unicorns, then bring a Unicorn directly into your Stable from the discard pile.",
            "name": "SUMMONING RITUAL"
        },
        "doubledutch": {
            "count": 1,
            "type": "upgrade",
            "text": "If this card is in your Stable at the beginning of your turn, you may play two cards during your turn instead of one.",
            "name": "DOUBLE DUTCH"
        },
        "basicblue": {
            "count": 3,
            "type": "basic",
            "text": "Popped collars are for date nights only.",
            "name": "BASIC UNICORN"
        },
        "llamacorn": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, each player must DISCARD a card. Shuffle the discard pile back into the deck.",
            "name": "LLAMACORN"
        },
        "puppicorn": {
            "count": 1,
            "type": "magical",
            "text": "At the end of your turn, move Puppicorn to the Stable of the player on your left. This card cannot be sacrificed or destroyed.",
            "name": "PUPPICORN"
        },
        "babyblue": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY UNICORN"
        },
        "unicornpoison": {
            "count": 3,
            "type": "magic",
            "text": "DESTROY a Unicorn.",
            "name": "UNICORN POISON"
        },
        "babyrainbow": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY UNICORN"
        },
        "unfairbargain": {
            "count": 2,
            "type": "magic",
            "text": "Trade hands with any player.",
            "name": "UNFAIR BARGAIN"
        },
        "seductive": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may move a Unicorn from any player’s Stable to your Stable. If this card leaves your Stable, move the Unicorn back to its original Stable.",
            "name": "SEDUCTIVE UNICORN"
        },
        "babyorange": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY UNICORN"
        },
        "zombie": {
            "count": 1,
            "type": "magical",
            "text": "If this card is in your Stable at the beginning of your turn, you may DISCARD a Unicorn. If you do, choose a Unicorn from the discard pile and Bring it directly into your Stable, then immediately end your turn.",
            "name": "ZOMBIE UNICORN"
        },
        "greedyflying": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, DRAW a card. If this card is sacrificed or destroyed, return it to your hand.",
            "name": "GREEDY FLYING UNICORN"
        },
        "narwhaltorpedo": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, SACRIFICE all Downgrade cards in your Stable.",
            "name": "NARWHAL TORPEDO"
        },
        "phoenix": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, DISCARD a card. If this card is sacrificed or destroyed, bring it directly back into your Stable. If you are unable to DISCARD a card, this card is permanently destroyed.",
            "name": "UNICORN PHOENIX"
        },
        "basicorange": {
            "count": 3,
            "type": "basic",
            "text": "Pumpkin spice is the pumpkin spice of life.",
            "name": "BASIC UNICORN"
        },
        "backkick": {
            "count": 3,
            "type": "magic",
            "text": "Return a card in any player’s Stable to that player's hand. That player must then DISCARD a card.",
            "name": "BACK KICK"
        },
        "chainsaw": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may SACRIFICE or DESTROY an Upgrade or Downgrade card.",
            "name": "CHAINSAW UNICORN"
        },
        "brokenstable": {
            "count": 1,
            "type": "downgrade",
            "text": "As long as this card is in your Stable, you cannot play Upgrade cards. ",
            "name": "BROKEN STABLE"
        },
        "classynarwhal": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may search the deck for an Upgrade card. Add it to your hand, then shuffle the deck.",
            "name": "CLASSY NARWHAL"
        },
        "stabby": {
            "count": 1,
            "type": "magical",
            "text": "If this card is sacrificed or destroyed, you may DESTROY a Unicorn.",
            "name": "STABBY THE UNICORN"
        },
        "pandamonium": {
            "count": 1,
            "type": "downgrade",
            "text": "As long as this card is in your Stable, all of your Unicorns are considered Pandas and NOT Unicorns. Cards that affect Unicorns do not affect Pandas.",
            "name": "@ PANDAMONIUM"
        },
        "babyblack": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY UNICORN"
        },
        "mysticalvortex": {
            "count": 1,
            "type": "magic",
            "text": "Each player must DISCARD a card. Shuffle the discard pile back into the deck.",
            "name": "MYSTICAL VORTEX"
        },
        "unicornshrinkray": {
            "count": 1,
            "type": "magic",
            "text": "Replace all Unicorns in any player's Stable with Baby Unicorns from the Nursery. All of the replaced Unicorns go to the Discard Pile.",
            "name": "UNICORN SHRINKRAY"
        },
        "mermaid": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may return a card in any player’s Stable to that player’s hand. ",
            "name": "MERMAID UNICORN"
        },
        "glittertornado": {
            "count": 2,
            "type": "magic",
            "text": "Return a card in each player’s Stable to that player’s hand.",
            "name": "GLITTER TORNADO"
        },
        "thegreatnarwhal": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may search the deck for a card with “Narwhal” in its name. Add it to your hand, then shuffle the deck.",
            "name": "THE GREAT NARWHAL"
        },
        "rainbow": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may also bring a Basic Unicorn directly into your Stable from your hand.",
            "name": "RAINBOW UNICORN"
        },
        "basicyellow": {
            "count": 3,
            "type": "basic",
            "text": "Dance like nobody’s watching.",
            "name": "BASIC UNICORN"
        },
        "resetbutton": {
            "count": 1,
            "type": "magic",
            "text": "Each player must SACRIFICE all of their Upgrade and Downgrade cards. Shuffle the discard pile back into the deck.",
            "name": "RESET BUTTON"
        },
        "sharkwithahorn": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may DESTROY a Unicorn. If you do, SACRIFICE this card.",
            "name": "SHARK WITH A HORN"
        },
        "babybrown": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY UNICORN"
        },
        "nannycam": {
            "count": 1,
            "type": "downgrade",
            "text": "As long as this card is in your Stable, you must play with your hand visible to all players.",
            "name": "NANNY CAM"
        },
        "angel": {
            "count": 1,
            "type": "magical",
            "text": "If this card is in your Stable at the beginning of your turn, you may SACRIFICE it. If you do, choose a Unicorn from the discard pile and bring it directly into your Stable.",
            "name": "ANGEL UNICORN"
        },
        "shakeup": {
            "count": 1,
            "type": "magic",
            "text": "Shuffle this card, your hand, and the discard pile back into the deck, then DRAW five cards.",
            "name": "SHAKE UP"
        },
        "ginormous": {
            "count": 1,
            "type": "basic",
            "text": "ssss",
            "name": "GINORMOUS UNICORN"
        },
        "yay": {
            "count": 2,
            "type": "upgrade",
            "text": "As ong as this card is in your Stable, cards you play cannot be Neigh’d.",
            "name": "YAY"
        },
        "sadisticritual": {
            "count": 1,
            "type": "downgrade",
            "text": "If this card is in your Stable at the beginning of your turn, SACRIFICE a Unicorn, then DRAW an extra card.",
            "name": "SADISTIC RITUAL"
        },
        "babyyellow": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY UNICORN"
        },
        "unicornswap": {
            "count": 2,
            "type": "magic",
            "text": "Trade a Unicorn in your Stable for a Unicorn in any player’s Stable.",
            "name": "UNICORN SWAP"
        },
        "babygreen": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY UNICORN"
        },
        "unicornlasso": {
            "count": 1,
            "type": "upgrade",
            "text": "If this card is in your Stable at the beginning of your turn, you may move a Unicorn from any player’s Stable to your Stable. At the end of your turn, move the Unicorn back to its original Stable.",
            "name": "UNICORN LASSO"
        },
        "tinystable": {
            "count": 1,
            "type": "downgrade",
            "text": "As long as this card is in your Stable, you can only have five Unicorns in your Stable.",
            "name": "TINY STABLE"
        },
        "swiftflying": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may choose an Instant card from the discard pile and add it to your hand. If this card is sacrificed or destroyed, return it to your hand.",
            "name": "SWIFT FLYING UNICORN"
        },
        "blatantthievery": {
            "count": 1,
            "type": "magic",
            "text": "Look at any player's hand. Take a card of your choice and add it to your hand.",
            "name": "BLATANT THIEVERY"
        },
        "blindinglight": {
            "count": 1,
            "type": "downgrade",
            "text": "As long as this card is in your Stable, your Unicorn card effects cannot be activated.",
            "name": "BLINDING LIGHT"
        }
    },
    "expension": {
        "UU-ChCo-037": {
            "count": 1,
            "type": "basic",
            "text": "“Hi, hungry. I'm Dad!”",
            "name": "SUBURBAN DADICORN"
        },
        "UU-ChCo-087": {
            "count": 1,
            "type": "magical",
            "text": "When any other player plays a Unicorn card, you may SACRIFICE this card. if you do, STEAL that Unicorn card.",
            "name": "TROJAN UNICORN"
        },
        "UU-ChCo-056": {
            "count": 1,
            "type": "magic",
            "text": "STEAL an Upgrade or Downgrade card.",
            "name": "YOINK!"
        },
        "cupcakesforeveryone": {
            "count": 1,
            "type": "downgrade",
            "text": "As long as this card is in your Stable, all of your Upgrade cards count towards all players’ Stables.",
            "name": "CUPCAKES FOR EVERYONE"
        },
        "UU-ChCo-053": {
            "count": 1,
            "type": "magic",
            "text": "DISCARD a card, then DRAW 3 cards.",
            "name": "WISHING WELL"
        },
        "hornyflying": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, move a Unicorn from any player's Stable to your Stable. At the end of your turn, move the Unicorn back to its original Stable. If this cards sacrificed or destroyed, return it to your hand.",
            "name": "HORNY FLYING UNICORN"
        },
        "UU-ChCo-084": {
            "count": 1,
            "type": "magical",
            "text": "Each time any player would DISCARD a card, that player may DRAW a card instead if they have not reached their hand limit.",
            "name": "PARALLEL UNIVERSICORN"
        },
        "UU-ChCo-072": {
            "count": 1,
            "type": "magical",
            "text": "Triggered effects of your Magical Unicorn cards do not activate.",
            "name": "SLOTHICORN"
        },
        "UU-ChCo-065": {
            "count": 1,
            "type": "magical",
            "text": "If this card is in your Stable at the beginning of your turn, you may SACRIFICE it. If you do, DISCARD your hand and DRAW 5 cards.",
            "name": "SACRIFICIAL LAMBICORN"
        },
        "UU-ChCo-068": {
            "count": 1,
            "type": "magical",
            "text": "If this card is in your Stable at the beginning of your turn, you may move an Upgrade or Downgrade card from any player's Stable to any other player's Stable. If you do, skip your Action phase.",
            "name": "TRAFFIC DIRECTOR UNICORN"
        },
        "horsewithadildo": {
            "count": 1,
            "type": "basic",
            "text": "Sometimes a horse just needs to feel a little special.",
            "name": "HORSE WITH A DILDO"
        },
        "polyamorous": {
            "count": 1,
            "type": "magical",
            "text": "If this card is in your Stable at the beginning of your turn, you may trade it for a Unicorn in any player’s Stable.",
            "name": "POLYAMOROUS UNICORN"
        },
        "UU-Cntl-022": {
            "count": 1,
            "type": "ultimate",
            "text": "When this card enters your Stable, SACRIFICE a card. If a card in your Stable would be destroyed, you may DISCARD 2 cards instead.",
            "name": "THE RAD SCIENTIST UNICORN"
        },
        "UU-ChCo-045": {
            "count": 1,
            "type": "magic",
            "text": "DESTROY a card in any player's Stable without triggering any of its triggered effects.",
            "name": "CONTROLLED DESTRUCTION"
        },
        "fuckmarrykill": {
            "count": 1,
            "type": "magic",
            "text": "Choose any player. That player must DISCARD a card. Give another player a card from your hand, then DESTROY a Unicorn.",
            "name": "FUCK, MARRY, KILL"
        },
        "dragonsfire": {
            "count": 1,
            "type": "magic",
            "text": "SACRIFICE or DESTROY an Upgrade or Downgrade card. ",
            "name": "DRAGON'S FIRE"
        },
        "UU-Cntl-027": {
            "count": 1,
            "type": "downgrade",
            "text": "Each time you DRAW at least 1 card, DISCARD a card.",
            "name": "UNICORN TAX"
        },
        "unicorgy": {
            "count": 1,
            "type": "magic",
            "text": "DRAW a card for each Unicorn over three in your Stable.",
            "name": "UNICORGY"
        },
        "UU-Chao-006": {
            "count": 1,
            "type": "instant",
            "text": "Play this card when any other player tries to SACRIFICE a card. Stop that sacrifice effect and choose any player. SACRIFICE or DESTROY a card in that player's Stable.",
            "name": "INTERVENTION"
        },
        "UU-ChCo-015": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY ARCHANGEL UNICORN"
        },
        "UU-Chao-026": {
            "count": 1,
            "type": "ultimate",
            "text": "When this card enters yout Stable, SACRIFICE a Unicorn card, When any player plays an Upgrade card in their Stable, you may DISCARD a card. If you do, search the deck for a Downgrade card and bring it directly into that player's Stable. Shuffle the Deck.",
            "name": "UNICORN OF FOREBODING DOOM"
        },
        "beardaddy": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may search the deck for a “Twinkicorn” card. Add it to your hand, then shuffle the deck.",
            "name": "BEAR DADDY UNICORN"
        },
        "dragonrider": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may move an UPGRADE or DOWNGRADE card from any player’s Stable to another player’s Stable.",
            "name": "DRAGON RIDER UNICORN"
        },
        "UU-Cntl-005": {
            "count": 1,
            "type": "instant",
            "text": "Play this card when any other player tries to play an Upgrade or Downgrade card. Choose the Stable that card enters.",
            "name": "DESTABILIZE"
        },
        "UU-ChCo-002": {
            "count": 1,
            "type": "instant",
            "text": "Play this card when any other player tries to play a card. Stop that player's card from being played and send it to the discard pile.",
            "name": "NEIGH"
        },
        "UU-Cntl-044": {
            "count": 1,
            "type": "magic",
            "text": "SACRIFICE a Unicorn card, an Upgrade card, and a Downgrade card. Search the deck for a Unicorn card and an Upgrade card and bring them directly into your Stable.",
            "name": "ARCHANGEL’S BLESSING"
        },
        "dragontamer": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may search the deck for a card with “Dragon” in its name. Add it to your hand, then shuffle the deck.",
            "name": "DRAGON TAMER UNICORN"
        },
        "UU-ChCo-054": {
            "count": 1,
            "type": "magic",
            "text": "DRAW 4 cards and DISCARD 4 cards.",
            "name": "QUID PRO QUO"
        },
        "llamapocalypse": {
            "count": 1,
            "type": "magic",
            "text": "SACRIFICE all of your Unicorns, then DESTROY a Unicorn in each player's Stable. Search the deck for a “Llamacorn” card. Bring it directly into play, then shuffle the deck.",
            "name": "LLAMAPOCALYPSE"
        },
        "UU-Cntl-003": {
            "count": 1,
            "type": "instant",
            "text": "Play this card when any other player tries to play a card. Stop that card from being played, then add it to the top of the deck.",
            "name": "UNWIND AND REWIND"
        },
        "UU-Chao-017": {
            "count": 1,
            "type": "ultimate",
            "text": "When this card enters your Stable, SACRIFICE a Unicorn card. If this card in your stable at the beginning of your turn, you may SACRIFICE a Unicorn card, If you do, bring a Unicorn card from the discard pile directly into your Stable. ",
            "name": "VALKYRIE UNICORN"
        },
        "unicornhangover": {
            "count": 1,
            "type": "magic",
            "text": "Choose any player. That player must skip their next turn.",
            "name": "UNICORN HANGOVER"
        },
        "manticore": {
            "count": 1,
            "type": "ultimate",
            "text": "When this card enters your Stable, SACRIFICE 2 cards. if this card is in your stable at the beginning of your turn, you may choose a card from the discard pile and add it to your hand. if you do, skip your Draw phase.",
            "name": "MANTICORE UNICORN"
        },
        "single": {
            "count": 1,
            "type": "basic",
            "text": "The single life.",
            "name": "SINGLE UNICORN"
        },
        "UU-Chao-043": {
            "count": 1,
            "type": "magic",
            "text": "DISCARD a card, then choose a card from the discard pile and bring it directly into your Stable.",
            "name": "NIGHTMARE’S CONJURING"
        },
        "alluring": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may move an Upgrade card from any player’s Stable to your Stable. ",
            "name": "ALLURING NARWHAL"
        },
        "UU-ChCo-075": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may DISCARD a card. If you do, bring an Upgrade card from your hand directly into your Stable.",
            "name": "EXCITED SEALICORN"
        },
        "dragonslayer": {
            "count": 1,
            "type": "magical",
            "text": "As long as this card is in your Stable, your Unicorns cannot be destroyed or affected by any card with “Dragon” in its name.",
            "name": "DRAGON SLAYER UNICORN"
        },
        "UU-ChCo-029": {
            "count": 1,
            "type": "downgrade",
            "text": "If this card is in your Stable at the beginning of your turn, you may DISCARD 3 cards. If you do, SACRIFICE this card. If you don’t, move a Unicorn card from your Stable to any other player’s Stable.",
            "name": "GREENER PASTURES"
        },
        "acuteattack": {
            "count": 1,
            "type": "magic",
            "text": "Replace three Unicorns in any player's Stable with Baby Unicorns. All of the replaced Unicorns goto the Discard Pile.",
            "name": "A CUTE ATTACK"
        },
        "thetiniest": {
            "count": 1,
            "type": "magical",
            "text": "This card cannot be destroyed by card effects.",
            "name": "THE TINIEST UNICORN"
        },
        "UU-ChCo-001": {
            "count": 1,
            "type": "instant",
            "text": "Play this card when any other player tries to play a card, Stop that player's card from being played and send it to the discard pile. This card cannot be Neigh'd.",
            "name": "SUPER NEIGH"
        },
        "UU-Chao-019": {
            "count": 1,
            "type": "ultimate",
            "text": "When this card enters your Stable, SACRIFICE a Unicorn card. If this card is in your Stable at the beginning of your turn, you may SACRIFICE an Upgrade card, then DESTROY 2 Unicorn cards.    ",
            "name": "THE REAPER UNICORN"
        },
        "UU-ChCo-088": {
            "count": 1,
            "type": "magical",
            "text": "If this card is in your Stable at the beginning of your turn, you may look at the top 2 cards of the deck and return them in the same order.",
            "name": "UNICORN PROPHET"
        },
        "UU-Cntl-006": {
            "count": 1,
            "type": "instant",
            "text": "Play this card when any other player tries to play a Unicorn card. Bring a Basic Unicorn card from your hand directly into your Stable.",
            "name": "IMITATION"
        },
        "UU-Chao-003": {
            "count": 1,
            "type": "instant",
            "text": "Play this card when any other player tries to play a Magic card. Stop that card from being played and add it to your hand, then immediately play it.",
            "name": "ABSORB AND REFLECT"
        },
        "UU-ChCo-007": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY BELUGACORN"
        },
        "UU-Cntl-025": {
            "count": 1,
            "type": "ultimate",
            "text": "When this card enters your Stable, DISCARD a card. This card can be played as an Instant card.",
            "name": "CHRONOCORN"
        },
        "UU-ChCo-076": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may choose any player. DESTROY a Unicorn card in that player's Stable, then search the deck for a Unicorn card and bring it directly into that player's Stable. Shuffle the deck.",
            "name": "ALCHEMIST UNICORN"
        },
        "plagueofdeath": {
            "count": 1,
            "type": "magic",
            "text": "SACRIFICE any number of cards, then DESTROY the same number of cards.",
            "name": "PLAGUE OF DEATH"
        },
        "UU-ChCo-089": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may move a Unicorn card from the Stable with the most Unicorns to the Stable with the fewest Unicorns.",
            "name": "LADY JUSTICE UNICORN"
        },
        "hellneigh": {
            "count": 1,
            "type": "instant",
            "text": "Play this card when any player tries to play a card. Stop that player’s card from coming into play and send it to the discard pile instead.",
            "name": "HELL NEIGH"
        },
        "glitter": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may bring an Upgrade card directly into play from your hand.",
            "name": "GLITTER UNICORN"
        },
        "unicornoffamine": {
            "count": 1,
            "type": "magical",
            "text": "As long as this card is in your Stable, all players have a hand limit of two cards.",
            "name": "UNICORN OF FAMINE"
        },
        "UU-ChCo-086": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may move a Downgrade card from your Stable to any other player's Stable.",
            "name": "REGIFTING UNICORN"
        },
        "UU-ChCo-013": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY BEARICORN"
        },
        "neightmotherfucker": {
            "count": 1,
            "type": "instant",
            "text": "Play this card when any player tries to play a card. Stop that player’s card from coming into play and send it to the discard pile instead. That player must DISCARD a card.",
            "name": "NEIGH, MOTHERFUCKER"
        },
        "rainbowsprinkles": {
            "count": 1,
            "type": "upgrade",
            "text": "If this card is in your Stable at the beginning of your turn, you may DRAW three cards, then immediately end your turn.",
            "name": "RAINBOW SPRINKLES"
        },
        "UU-ChCo-046": {
            "count": 1,
            "type": "magic",
            "text": "SACRIFICE a Baby Unicorn card, then search the deck for a Unicorn card and bring it directly into your Stable. Shuffle the deck. ",
            "name": "GROW UP"
        },
        "UU-ChCo-048": {
            "count": 1,
            "type": "magic",
            "text": "DISCARD any number of cards. Choose a number of players equal to the number of cards you discarded, then DESTROY a Unicorn card in each of their Stables.",
            "name": "SPRING CLEANING"
        },
        "unicornwithadragontattoo": {
            "count": 1,
            "type": "basic",
            "text": "At least it's not a lower back tattoo...",
            "name": "UNICORN WITH A DRAGON TATTOO"
        },
        "UU-Chao-004": {
            "count": 1,
            "type": "instant",
            "text": "Play this card when any other player tries to DRAW a card. Stop that player from drawing that card. That player must DISCARD a card instead.",
            "name": "TRAPPED CHEST"
        },
        "UU-ChCo-009": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY SLOTHICORN"
        },
        "UU-ChCo-066": {
            "count": 1,
            "type": "magical",
            "text": "When this card leaves your Stable, you may choose any other player. Pull a card from that player's hand and add it to your hand.",
            "name": "PICKPOCKET UNICORN"
        },
        "tinyhooves": {
            "count": 1,
            "type": "downgrade",
            "text": "If this card is in your Stable at the beginning of your turn, your hand limit is three cards.",
            "name": "TINY HOOVES"
        },
        "UU-Chao-005": {
            "count": 1,
            "type": "instant",
            "text": "Play this card when an effect would DESTROY a Unicorn card. Choose the target of that destruction effect.",
            "name": "REDIRECT"
        },
        "UU-ChCo-047": {
            "count": 1,
            "type": "magic",
            "text": "Each player must pass their hand to the player on their left.",
            "name": "MERRY-GO-ROUND"
        },
        "unicornofwar": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may choose any number of players and DESTROY a Unicorn in each of their Stables. Each of those players may then DESTROY one of your Unicorns.",
            "name": "UNICORN OF WAR"
        },
        "UU-ChCo-051": {
            "count": 1,
            "type": "magic",
            "text": "Return a card in any player's Stable to that player's hand and DRAW a card. ",
            "name": "TEMPORAL PARADOX"
        },
        "UU-ChCo-085": {
            "count": 1,
            "type": "magical",
            "text": "Each time any player would SACRIFICE a card, that player must SACRIFICE 2 cards instead.",
            "name": "PATIENT ZERO UNICORN"
        },
        "safesex": {
            "count": 1,
            "type": "magic",
            "text": "Each player must return a Baby Unicorn from their Stable to the Nursery.",
            "name": "SAFE SEX"
        },
        "unicornofdeath": {
            "count": 1,
            "type": "magical",
            "text": "If this card is in your Stable at the beginning of your turn, you may SACRIFICE a Unicorn, If you do, DESTROY a Unicorn.",
            "name": "UNICORN OF DEATH"
        },
        "babygrenade": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY UNICORN"
        },
        "UU-Chao-090": {
            "count": 1,
            "type": "upgrade",
            "text": "When this card enters your Stable, name a type of card. If this card is in your Stable at the beginning of your tur, you may bring a card of that type from the discard pile directly into your Stable, then immediately skip to your End of Turn phase.",
            "name": "NIGHTMARE PACT"
        },
        "UU-ChCo-055": {
            "count": 1,
            "type": "magic",
            "text": "STEAL a Unicorn card.",
            "name": "UNICORN TRAP"
        },
        "UU-Cntl-004": {
            "count": 1,
            "type": "instant",
            "text": "Play this card when any other player tries to DESTROY a card in your Stable. Stop the estruction effect and DRAW a card instead.",
            "name": "BULLETPROOF VEST"
        },
        "UU-ChCo-095": {
            "count": 1,
            "type": "upgrade",
            "text": "Each time any other player destroys a Unicorn card in your Stable, you may DESTROY a Unicorn card in that player's Stable.",
            "name": "RETRIBUTION"
        },
        "UU-Chao-027": {
            "count": 1,
            "type": "downgrade",
            "text": "Each time you play a Unicorn card from your hand, DISCARD a card.",
            "name": "TOLL BOOTH"
        },
        "UU-ChCo-058": {
            "count": 1,
            "type": "magic",
            "text": "DRAW until you reach your hand limit. Each other player may DRAW 2 cards.",
            "name": "UNICORNUCOPIA"
        },
        "UU-Cntl-061": {
            "count": 1,
            "type": "magical",
            "text": "When any other player tries to trigger a Unicorn card effect, you may DISCARD a card. If you do, stop that effect from triggering.",
            "name": "Hn HYPNOCORN"
        },
        "UU-Chao-025": {
            "count": 1,
            "type": "ultimate",
            "text": "When this card enters your Stable, SACRIFICE 2 Unicorn cards. Each time you DESTROY a card, you may DESTROY a second card.",
            "name": "EPIC LEVEL UNICORN"
        },
        "UU-ChCo-073": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may move an Upgrade card from your Stable to any other player's Stable. If you do, STEAL an Upgrade card from that player's Stable.",
            "name": "ACADEMICORN"
        },
        "UU-Chao-061": {
            "count": 1,
            "type": "magical",
            "text": "If this card is in your Stable at the beginning of your turn, you may DESTROY a Unicorn card. If you do, skip your Action phase.",
            "name": "SNIPER UNICORN"
        },
        "UU-ChCo-028": {
            "count": 1,
            "type": "downgrade",
            "text": "If this card is in your Stable at the beginning of your turn, SACRIFICE a Magical Unicorn card. Search the deck for a Basic Unicorn card and bring it directly into your Stable. Shuffle the deck.",
            "name": "BLACK HOLE"
        },
        "stormofcuteness": {
            "count": 1,
            "type": "magic",
            "text": "SACRIFICE all of your Unicorns, then DESTROY a Unicorn in each player's Stable. Search the deck for a “Kittencorn” card. Bring it directly into play, then shuffle the deck.",
            "name": "STORM OF CUTENESS"
        },
        "UU-ChCo-097": {
            "count": 1,
            "type": "upgrade",
            "text": "If this card is in your Stable at the beginning of your turn, you may DISCARD 2 cards. If you do, SACRIFICE or DESTROY a card.",
            "name": "UNICORN MAFIA"
        },
        "dragonscorchedstables": {
            "count": 1,
            "type": "magic",
            "text": "Each player must SACRIFICE all Upgrade and Downgrade cards.",
            "name": "DRAGON-SCORCHED STABLES"
        },
        "UU-ChCo-091": {
            "count": 1,
            "type": "upgrade",
            "text": "When any other player tries to play a Neigh card, you may DISCARD a card. If you do, stop that card from being played and return the Neigh card to that player's hand, That player cannot play a Neigh card this turn.",
            "name": "OBJECTION"
        },
        "neighthankyou": {
            "count": 1,
            "type": "instant",
            "text": "Play this card when any player tries to play a card, Stop that player’s card from coming into play and send it to the discard pile instead. Each of you DRAW a card.",
            "name": "NEIGH, THANK YOU"
        },
        "UU-Cntl-043": {
            "count": 1,
            "type": "magic",
            "text": "DRAW a card. If it's an Upgrade, Downgrade, or Unicorn card, bring that card directly into your Stable, then DRAW another card.",
            "name": "RAINBOW BRIDGE"
        },
        "freecandy": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, move a Baby Unicorn from any player’s Stable to your Stable. If this card leaves your Stable, move the Unicorn back to its original Stable.",
            "name": "FREE CANDY UNICORN"
        },
        "UU-Cntl-090": {
            "count": 1,
            "type": "upgrade",
            "text": "If one of your Unicorn cards would be sacrificed or destroyed, you may SACRIFICE an Upgrade or Downgrade card instead.",
            "name": "UNICORN BRIBE"
        },
        "stoner": {
            "count": 1,
            "type": "basic",
            "text": "It’s 4:20 somewhere.",
            "name": "STONER UNICORN"
        },
        "UU-ChCo-011": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "ANGELIC BABY UNICORN"
        },
        "babycannibal": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY UNICORN"
        },
        "unicornofpestilence": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, each player must DISCARD their entire hand.",
            "name": "UNICORN OF PESTILENCE"
        },
        "dragonsblessing": {
            "count": 1,
            "type": "upgrade",
            "text": "As longas this card is in your Stable, Downgrades in your Stable have no effect.",
            "name": "DRAGON'S BLESSING"
        },
        "UU-ChCo-040": {
            "count": 1,
            "type": "basic",
            "text": "“Have you tried turning it off and then on again?”",
            "name": "TECH SUPPORTICORN"
        },
        "dominatrixwhip": {
            "count": 1,
            "type": "upgrade",
            "text": "If this card is in your Stable at the beginning of your turn, you may move a Unicorn from any player's Stable to another player's Stable. You cannot move the Unicorn into your own Stable.",
            "name": "DOMINATRIX WHIP"
        },
        "blowup": {
            "count": 1,
            "type": "upgrade",
            "text": "If one of your Unicorns would be sacrificed or destroyed, you may SACRIFICE this card instead.",
            "name": "BLOW UP UNICORN"
        },
        "dragon": {
            "count": 1,
            "type": "magical",
            "text": "If this card leaves your Stable, you may DESTROY a Unicorn.",
            "name": "DRAGON UNICORN"
        },
        "UU-ChCo-096": {
            "count": 1,
            "type": "upgrade",
            "text": "If this card is in your Stable at the beginning of your turn, you may DISCARD 2 cards. If you do, DESTROY a Unicorn card OR search the deck for a Unicorn card and add it to your hand. Shuffle the deck.",
            "name": "CONTROLLED CHAOS"
        },
        "neightfoulbeast": {
            "count": 1,
            "type": "instant",
            "text": "Play this card when any player tries to play a card. Stop that player’s card from coming into play and send it to the discard pile instead.",
            "name": "NEIGH, FOUL BEAST"
        },
        "UU-ChCo-039": {
            "count": 1,
            "type": "basic",
            "text": "\"I'm not a fox, I just look foxy!\"",
            "name": "RED PANDACORN"
        },
        "UU-Chao-020": {
            "count": 1,
            "type": "ultimate",
            "text": "When this card enters your Stable, DISCARD a card. When any other player tries to play a card you may SACRIFICE this card. If you do, add that card to your hand instead, then immediately play it.",
            "name": "FRANKENCORN"
        },
        "babyupsidedown": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY UNICORN"
        },
        "UU-ChCo-049": {
            "count": 1,
            "type": "magic",
            "text": "DRAW a card, then play 2 cards from your hand, Skip your next turn.",
            "name": "TOTALLY NOT TWO UNICORNS"
        },
        "fourunicornsoftheapocalypse": {
            "count": 1,
            "type": "magic",
            "text": "SACRIFICE four Unicorns, then search the deck for four Unicorns. Bring them directly into play, then shuffle the deck.",
            "name": "UNICORNS OF THE APOCALYPSE"
        },
        "neightbitch": {
            "count": 1,
            "type": "instant",
            "text": "Play this card when any player tries to play a card. Stop that player's card from coming into play and send it to the discard pile instead.",
            "name": "NEIGH, BITCH"
        },
        "straightbutcurious": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may look at the next three cards in the deck, then return them in the same order.",
            "name": "STRAIGHT BUT CURIOUS UNICORN"
        },
        "sharingiscaring": {
            "count": 1,
            "type": "magic",
            "text": "Choose a Unicorn from each player's Stable. Shuffle them together, then deal them out face down. Those unicorns come directly into play in the new players’ Stables.",
            "name": "SHARING IS CARING"
        },
        "horsewithanicecreamcone": {
            "count": 1,
            "type": "basic",
            "text": "Ice cream always saves the day!",
            "name": "HORSE WITH AN ICE CREAM CONE"
        },
        "UU-ChCo-078": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may look at the top 3 cards of the deck. Move any number of those cards to the discard pile, then return the rest to the top of the deck in any order.",
            "name": "FORTUNE TELLER UNICORN"
        },
        "UU-ChCo-008": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY PEGACORN"
        },
        "UU-ChCo-064": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may return all Baby Unicorn cards in each player's Stable to the Nursery.",
            "name": "DINGOCORN"
        },
        "babygarbage": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY UNICORN"
        },
        "UU-ChCo-050": {
            "count": 1,
            "type": "magic",
            "text": "Choose any other player. DESTROY a Unicorn card in that player's Stable. You and that player may each DRAW a card.",
            "name": "RAINBOW BAZOOKA"
        },
        "unicornnap": {
            "count": 1,
            "type": "magic",
            "text": "Choose any player. That player must skip their next turn.",
            "name": "UNICORN NAP"
        },
        "cottoncandyllamacorn": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, each player must SACRIFICE a Unicorn, then DRAW a card. ",
            "name": "COTTON CANDY LLAMACORN"
        },
        "UU-ChCo-079": {
            "count": 1,
            "type": "magical",
            "text": "If this card is in your Stable at the beginning of your turn, you may bring a Baby Unicorn card from the Nursery directly into your Stable. If you do, do not play a card from your hand during your Action phase.",
            "name": "NANNYCORN"
        },
        "thebitchiest": {
            "count": 1,
            "type": "magical",
            "text": "You must have a Basic Unicorn in your Stable in order to play this card. If this card is in your Stable at the beginning of your turn, you may choose any player. That player must DISCARD a card.",
            "name": "THE BITCHIEST UNICORN"
        },
        "ultimatedestruction": {
            "count": 1,
            "type": "magic",
            "text": "SACRIFICE all of your Unicorns, then DESTROY a Unicorn in each player's Stable. Search the deck for an “Extremely Destructive Unicorn” card. Bring it directly into play, then shuffle the deck.",
            "name": "ULTIMATE DESTRUCTION"
        },
        "UU-ChCo-081": {
            "count": 1,
            "type": "magical",
            "text": "This card cannot be Neigh'd.",
            "name": "WRECKING BALL UNICORN"
        },
        "UU-Cntl-026": {
            "count": 1,
            "type": "ultimate",
            "text": "When this card enters your Stable, SACRIFICE 2 Unicorn cards. No other player may play Neigh cards. This card cannot be Neigh'd.",
            "name": "ELUSIVE OCELOTICORN"
        },
        "adorableflying": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, each player must SACRIFICE a card. If this card is sacrificed or destroyed, return it to your hand.",
            "name": "ADORABLE FLYING UNICORN"
        },
        "UU-Cntl-017": {
            "count": 1,
            "type": "ultimate",
            "text": "When this card enters your Stable, SACRIFICE 3 cards. If a card in your Stable would be sacrificed or destroyed, you may DISCARD a card instead. If this card is in your Stable at the beginning of your turn, you may DRAW an extra card.",
            "name": "ARCHANGEL UNICORN"
        },
        "UU-ChCo-002b": {
            "count": 1,
            "type": "instant",
            "text": "Play this card when any other player tries to play a card. Stop that player's card from being played and send it to the discard pile.",
            "name": "NEIGH"
        },
        "time-shifting": {
            "count": 1,
            "type": "ultimate",
            "text": "When this card enters your Stable, SACRIFICE 2 cards. If this card is in your Stable at the beginning of your turn, you may look at the top 3 cards of the deck, then return them in any order.",
            "name": "TIME-SHIFTING UNICORN"
        },
        "UU-ChCo-083": {
            "count": 1,
            "type": "magical",
            "text": "Each time any player would DISCARD a card, that player must DISCARD 2 cards instead.",
            "name": "DREAD PIRATE UNICORN"
        },
        "UU-ChCo-071": {
            "count": 1,
            "type": "magical",
            "text": "If this card is sacrificed or destroyed, each other player must SACRIFICE a card.",
            "name": "MUTUALLY ASSURED DESTRUCTICORN"
        },
        "unicornbuttplug": {
            "count": 1,
            "type": "downgrade",
            "text": "As long as this card is in your Stable, your hand limit is three cards.",
            "name": "UNICORN BUTT PLUG"
        },
        "UU-ChCo-032": {
            "count": 1,
            "type": "downgrade",
            "text": "All of your Unicorns are considered Otters. Cards that affect Unicorn cards do not affect your Otters.",
            "name": "OTTER DEVASTATION"
        },
        "UU-ChCo-067": {
            "count": 1,
            "type": "magical",
            "text": "If this card is in your Stable at the beginning of your turn, you may DISCARD a card. If you do, play 2 cards during your Action phase.",
            "name": "TWIN UNICORNS"
        },
        "UU-ChCo-092": {
            "count": 1,
            "type": "upgrade",
            "text": "If this card is in your Stable at the beginning of your turn, you may look at the top 3 cards of the deck. If you do, add 1 of them to your hand, then shuffle the other 2 back into the deck and skip your Draw phase.",
            "name": "FORESIGHT"
        },
        "dragonsbreath": {
            "count": 1,
            "type": "magic",
            "text": "DESTROY a Unicorn.",
            "name": "DRAGON'S BREATH"
        },
        "unicornrainbowprincess": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may allow any number of players to draw a card. Draw cards equal to the number of players you selected.",
            "name": "UNICORN RAINBOW PRINCESS"
        },
        "babyflowers": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY UNICORN"
        },
        "UU-ChCo-034": {
            "count": 1,
            "type": "downgrade",
            "text": "You cannot play Instant cards.",
            "name": "BRAIN FREEZE"
        },
        "UU-ChCo-094": {
            "count": 1,
            "type": "upgrade",
            "text": "If a Unicorn card in your Stable is sacrificed or destroyed, you may SACRIFICE this card. If you do, bring that card from the discard pile directly into your Stable.",
            "name": "EXTRA LIFE"
        },
        "babysparkles": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY UNICORN"
        },
        "UU-Cntl-023": {
            "count": 1,
            "type": "ultimate",
            "text": "When this card enters your Stable, DISCARD your hand. If this card is in your Stable at the beginning of your turn, you may DRAW an extra card. Your hand limit increases by 3 cards.",
            "name": "GAME MASTER UNICORN"
        },
        "UU-ChCo-016": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY NIGHTMARE UNICORN"
        },
        "UU-Chao-062": {
            "count": 1,
            "type": "magic",
            "text": "When this card enters your Stable, you may DESTROY a Unicorn card. If this card would be destroyed by any other player's card, that player may STEAL it instead.",
            "name": "UNICORN OF BETRAYAL"
        },
        "UU-ChCo-082": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may search the deck for an Upgrade card and bring it directly into your Stable, then shuffle the deck. if you do, each other player may DRAW a card.",
            "name": "GOLDEN RETRIEVERCORN"
        },
        "specialdelivery": {
            "count": 1,
            "type": "upgrade",
            "text": "If this card is in your Stable at the beginning of your turn, you may bring a Baby Unicorn directly into play from the Nursery instead of playing a card this turn.",
            "name": "SPECIAL DELIVERY"
        },
        "UU-ChCo-030": {
            "count": 1,
            "type": "downgrade",
            "text": "When this card enters your Stable, SACRIFICE all other Downgrade cards. You cannot play Magic cards. If a Downgrade card enters your Stable, SACRIFICE this card.",
            "name": "ANTI-MAGIC BUBBLE"
        },
        "dragoncosplay": {
            "count": 1,
            "type": "basic",
            "text": "It’s not a costume. It's away of life. ",
            "name": "DRAGON COSPLAY UNICORN"
        },
        "dragonskies": {
            "count": 1,
            "type": "downgrade",
            "text": "If this card is in your Stable at the beginning of your turn, you must shuffle a Unicorn from your stable into the deck, then DRAW an extra card.",
            "name": "DRAGON SKIES"
        },
        "UU-Cntl-021": {
            "count": 1,
            "type": "ultimate",
            "text": "When this card enters your Stable, SACRIFICE a Unicorn card. if one of your Unicorn cards would be destroyed, you may SACRIFICE an Upgrade or Downgrade card instead.",
            "name": "UNICORN OF CONNIVING ARTISTRY"
        },
        "dragonkiss": {
            "count": 1,
            "type": "magic",
            "text": "Search the deck for a Magic card. Play it immediately, then shuffle the deck.",
            "name": "DRAGON KISS"
        },
        "babysnake": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY UNICORN"
        },
        "UU-ChCo-059": {
            "count": 1,
            "type": "magic",
            "text": "Choose any player. Return all cards in that player's Stable to that player's hand, then immediately bring the same cards directly into that player's Stable.",
            "name": "TIME RIFT"
        },
        "UU-ChCo-074": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may DISCARD a card. If you do, bring a Baby Unicorn card from the Nursery directly into your Stable.",
            "name": "MAMA UNICORN"
        },
        "nakednarwhal": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, move a Basic Unicorn from any player’s Stable to your Stable. If this card leaves your Stable, move the Unicorn back to its original Stable.",
            "name": "NAKED NARWHAL"
        },
        "UU-ChCo-014": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "MILLION DOLLAR BABY UNICORN"
        },
        "rainbowshitstorm": {
            "count": 1,
            "type": "magic",
            "text": "Each player must SACRIFICE a card and DISCARD their entire hand. Shuffle the discard pile into the deck, then deal five cards to each player.",
            "name": "RAINBOW SHITSTORM"
        },
        "UU-Chao-024": {
            "count": 1,
            "type": "ultimate",
            "text": "When this card enters your Stable, DISCARD 2 cards. If this card is in your Stable at the beginning of your turn, each other player must DISCARD a card.",
            "name": "UNICORN OF MISFORTUNE"
        },
        "UU-ChCo-035": {
            "count": 1,
            "type": "downgrade",
            "text": "If this card is in your Stable at the beginning of your turn, shuffle a Unicorn card from your Stable into the deck, then DRAW a card. If at any time you have no Unicorn cards in your Stable, SACRIFICE this card.",
            "name": "UNICORN ABDUCTION"
        },
        "UU-Chao-022": {
            "count": 1,
            "type": "ultimate",
            "text": "When this card enters your Stable, SACRIFICE a Unicorn card. When a Unicorn card in any other player's Stable would be sacrificed or returned to a player's hand, you may DISCARD up to 2 cards. If you DISCARD 1 card, add that card to your hand instead, If you DISCARD 2 cards, bring that card directly into your Stable instead. ",
            "name": "SHADOW UNICORN"
        },
        "dirtymind": {
            "count": 1,
            "type": "magic",
            "text": "Search the deck for a NSFW card. Add it to your hand, then shuffle the deck.",
            "name": "DIRTY MIND"
        },
        "innocentbunnicorn": {
            "count": 1,
            "type": "basic",
            "text": "Look mom! I'm a unicorn!",
            "name": "INNOCENT BUNNICORN"
        },
        "UU-ChCo-057": {
            "count": 1,
            "type": "magic",
            "text": "Choose any other player. Choose 2 cards from that player's hand and add them to your hand. That player may choose a card from your hand and add it to their hand. That player may not choose either card you chose.",
            "name": "UNICORN BLACK MARKET"
        },
        "UU-ChCo-060": {
            "count": 1,
            "type": "magic",
            "text": "Shuffle the discard pile into the deck. Search the deck for a Unicorn card and bring that card directly into your Stable. Shuffle the deck. Each other player may DRAW a card. ",
            "name": "UNICORNS FOREVER"
        },
        "UU-ChCo-063": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may DISCARD a card. If you do, bring a Downgrade card from your hand directly into any player's Stable.",
            "name": "UNICORN TRAP MASTER"
        },
        "themagicalpugcorn": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your stable, each player must give a card from their hand to the player on their left.",
            "name": "THE MAGICAL PUGICORN"
        },
        "UU-ChCo-033": {
            "count": 1,
            "type": "downgrade",
            "text": "When this card enters your Stable, SACRIFICE all other Downgrade cards. You cannot play Magical Unicorn cards. If a Downgrade card enters your Stable, SACRIFICE this card.",
            "name": "RESTRICTED AREA"
        },
        "UU-Cntl-018": {
            "count": 1,
            "type": "ultimate",
            "text": "When this card enters your Stable, DISCARD a card. When any other player plays a Downgrade card in your Stable, you may search the deck for an Upgrade card and bring it directly into your Stable. Shuffle the deck. ",
            "name": "UNICORN OF GLORY"
        },
        "ginormous": {
            "count": 1,
            "type": "magical",
            "text": "This card counts for two Unicorns in your Stable. As long as this card is in your Stable, you cannot play any Instant cards.",
            "name": "GINORMOUS UNICORN"
        },
        "dragonscurse": {
            "count": 1,
            "type": "downgrade",
            "text": "If this card is in your Stable at the beginning of your turn, you must DISCARD a card.",
            "name": "DRAGON'S CURSE"
        },
        "UU-ChCo-038": {
            "count": 1,
            "type": "basic",
            "text": "Hold the relish!",
            "name": "WEENIECORN"
        },
        "UU-ChCo-052": {
            "count": 1,
            "type": "magic",
            "text": "Flip one card at a time from the top of the deck into the discard pile until you find a Unicorn card. Bring that card directly into your Stable.",
            "name": "PROSPECTING"
        },
        "UU-ChCo-069": {
            "count": 1,
            "type": "magical",
            "text": "If this card is in your Stable at the beginning of your turn, each player that does not have a Magical Unicorn card in their Stable must DISCARD a card.",
            "name": "NYMPHICORN"
        },
        "UU-ChCo-099": {
            "count": 1,
            "type": "upgrade",
            "text": "Each time a Downgrade card enters your Stable, you may search the deck for an Upgrade card and bring it directly into your Stable. Shuffle the deck.",
            "name": "GLASS HALF FULL"
        },
        "UU-ChCo-010": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "DEMONIC BABY UNICORN"
        },
        "UU-ChCo-031": {
            "count": 1,
            "type": "downgrade",
            "text": "All of your Unicorns are considered Cats. Cards that affect Unicorn cards do not affect your Cats.",
            "name": "CATASTROPHE"
        },
        "UU-ChCo-042": {
            "count": 1,
            "type": "basic",
            "text": "“We're not lost. We're on an adventure!”",
            "name": "UNICORN TOURIST"
        },
        "fireandbrimstone": {
            "count": 1,
            "type": "magic",
            "text": "SACRIFICE all of your Unicorns, then DESTROY a Unicorn in each player’s Stable. Search the deck for a “Unicorn Phoenix” card. Bring it directly into play, then shuffle the deck.",
            "name": "FIRE AND BRIMSTONE"
        },
        "twinkicorn": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may search the deck for a “Bear Daddy Unicorn” card. Add it to your hand, then shuffle the deck.",
            "name": "TWINKICORN"
        },
        "ponyplay": {
            "count": 1,
            "type": "upgrade",
            "text": "If this card is in your Stable at the beginning of your turn, you may take a card at random from any player's hand instead of drawing a card.",
            "name": "PONY PLAY"
        },
        "UU-ChCo-077": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, you may choose any player. That player must shuffle their hand into the deck, then DRAW 3 cards.",
            "name": "FOXICORN"
        },
        "UU-ChCo-070": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, choose any other player. That player must show you their hand.",
            "name": "SPY UNICORN"
        },
        "UU-ChCo-080": {
            "count": 1,
            "type": "magical",
            "text": "When any other player tries to bring a Baby Unicorn card from the Nursery into their Stable, you may DISCARD a card. If you do, bring that Baby Unicorn card directly into your Stable instead.",
            "name": "PIED PIPERCORN"
        },
        "overpopulation": {
            "count": 1,
            "type": "magic",
            "text": "SACRIFICE all of your Unicorns, then DESTROY a Unicorn in each player’s Stable. Search the deck for an “Extremely Fertile Unicorn” card. Bring it directly into play, then shuffle the deck.",
            "name": "OVERPOPULATION"
        },
        "cultleader": {
            "count": 1,
            "type": "magical",
            "text": "When this card enters your Stable, each player must SACRIFICE a Unicorn. ",
            "name": "CULT LEADER UNICORN"
        },
        "UU-ChCo-098": {
            "count": 1,
            "type": "upgrade",
            "text": "If you have a Baby Unicorn card in your Stable, you need 1 fewer Unicorn to win.",
            "name": "IMAGINARY FRIENDICORN"
        },
        "heavenlysmite": {
            "count": 1,
            "type": "magic",
            "text": "SACRIFICE all of your Unicorns, then DESTROY a Unicorn in each player's Stable. Search the deck for an “Angel Unicorn” card. Bring it directly into play, then shuffle the deck.",
            "name": "HEAVENLY SMITE"
        },
        "autoerotic": {
            "count": 1,
            "type": "downgrade",
            "text": "If this card is in your Stable at the beginning of your turn, DISCARD a card.",
            "name": "AUTOEROTIC ASPHYXIATION"
        },
        "UU-Chao-018": {
            "count": 1,
            "type": "ultimate",
            "text": "When this card enters your Stable, SACRIFICE 3 cards. if this card is in your Stable at the beginning of your turn, you may choose a Unicorn card from the discard pile and bring it directly into your stable.",
            "name": "NIGHTMARE UNICORN"
        },
        "UU-ChCo-012": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY PENGUINCORN"
        },
        "UU-ChCo-036": {
            "count": 1,
            "type": "basic",
            "text": "One Unicorn's trash is another Raccoonicorn's hat.",
            "name": "RACCOONICORN"
        },
        "UU-Chao-021": {
            "count": 1,
            "type": "ultimate",
            "text": "When this card enters your Stable, DISCARD a card. Each time you DISCARD a card, you may choose up to 2 other players, Each of those players must also DISCARD a card.",
            "name": "PUPPETMASTER UNICORN"
        },
        "UU-Chao-044": {
            "count": 1,
            "type": "magic",
            "text": "DISCARD a card, then choose 2 cards from the discard pile and add them to your hand.",
            "name": "KITTENCORN BURGLAR"
        },
        "babyshotgun": {
            "count": 1,
            "type": "baby",
            "text": "If this card would be sacrificed, destroyed or returned to your hand, return it to the Nursery instead.",
            "name": "BABY UNICORN"
        },
        "UU-Cntl-019": {
            "count": 1,
            "type": "ultimate",
            "text": "When this card enters your Stable, SACRIFICE a Unicorn card. Search the deck for a Unicorn card and bring it directly into your Stable. Shuffle the deck.",
            "name": "THE ANCESTOR UNICORN"
        },
        "zombieapocalypse": {
            "count": 1,
            "type": "magic",
            "text": "SACRIFICE all of your Unicorns, then DESTROY a Unicorn in each player's Stable. Search the deck for a “Zombie Unicorn” card, Bring it directly into play, then shuffle the deck.",
            "name": "ZOMBIE APOCALYPSE"
        },
        "UU-ChCo-041": {
            "count": 1,
            "type": "basic",
            "text": "insert corny pun here.",
            "name": "CORN ON THE COB"
        },
        "UU-ChCo-093": {
            "count": 1,
            "type": "upgrade",
            "text": "If you have 2 or more Basic Unicorn cards in your Stable at the beginning of your turn, you may DISCARD a card. If you do, bring a Baby Unicorn card from the Nursery directly into your Stable.",
            "name": "UNICORN ADOPTION AGENCY"
        },
        "UU-Cntl-062": {
            "count": 1,
            "type": "magical",
            "text": "If this card is in your Stable at the beginning of your turn, you may DRAW an extra card. If you do, each other player may DRAW a card.",
            "name": "UNICORN OF CHARITY"
        },
        "UU-Cntl-020": {
            "count": 1,
            "type": "ultimate",
            "text": "When this card enters your Stable, SACRIFICE 2 Unicorn cards, then search the deck for a Unicorn card and bring it directly into your Stable. Shuffle the deck. If this card is sacrificed or destroyed, you may search the deck for a Unicorn card and bring it directly into your Stable. ",
            "name": "NINE-TAILED FOXICORN"
        },
        "wastedwhite": {
            "count": 1,
            "type": "basic",
            "text": "#livingfortheweekend",
            "name": "WASTED WHITE UNICORN"
        }
    }
}

interface cardDescriptor {
    name: string;
    count: number,
    type: string,
    text: string
}

export { _cardList as cardList, cardDescriptor as CardDescriptor};
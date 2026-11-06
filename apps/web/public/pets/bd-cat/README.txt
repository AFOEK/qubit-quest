BD CAT: animation metadata for Qubit Quest

Assets: spritesheet.webp (1536x1872 transparent RGBA), pet.json (original), animation-map.json (added metadata).

Sprite geometry: 8 columns x 9 rows, each cell 192x208 pixels. Not all rows contain 8 usable frames.

Animation row (zero based):
0 idle/blink (6 frames)
1 walking right (8 frames)
2 walking left (8 frames)
3 wave/paw raise (4 frames)
4 front-facing crouch/excited (5 frames, add CSS jumps to simulate celebration)
5 sad/ears-drooped (8 frames)
6 curious/head tilt/rest (6 frames)
7 playful/forward motion (6 frames)
8 idle/head tilt (6 frames)

Important: The spritesheet is a grid, not an individually packed texture atlas.
Render one 192x208 source region at a time in a CSS background-position sprite or HTML canvas. Scale uniformly (e.g. 96x104) without distortion.
No asset has native airborne jumping animation, audio, or confetti; provide motion/particles separately if desired.
Do not display full spritesheet or slice at arbitrary fixed widths. Keep user progress and rewards logic independent.

# Ivy and Ryan's Play Garden

A talking learning game for children age 2 and up, made for iPad and Android tablets (phones work too).
Pip the bird reads every instruction out loud, so children who can't read yet can play on their own.

## What's inside

| Section | Games |
|---|---|
| Letters | Learn the ABC, Find the letter |
| Reading | Find the picture for a word, Pop the word balloons, Rhymes |
| Vocabulary | Learn words by topic (10 topics), Show me, Sort it |
| Spelling | Spell it, Missing letter, Word families |
| Numbers | Count, Add (and take away at 5+), Which is more? |
| Writing | Trace lines, ABC, abc, 123 and the children's names on a ruled notebook page |
| Stories | Read-along stories, Make a story, What's first? |
| Memory | Match pairs, What's gone?, Copy Pip |
| Thinking | What's next? (patterns), Odd one out, Shadows |

Grown-ups: press and hold the gear on the home screen to set the age level (2, 3, 4, 5+),
the children's names, the voice speed and sounds.

## Play without internet (iPad)

The game saves itself on the device after one visit, but only when it is opened from a real
`https://` web link (Apple requires this). One-time setup:

1. Put this folder on any free static host. Two easy options:
   - **GitHub Pages:** make a new repository, upload every file in this folder, then turn on
     Settings → Pages (branch `main`, folder `/root`).
   - **Netlify Drop:** drag this folder onto https://app.netlify.com/drop.
2. On the iPad, open the link in **Safari** and wait for the home screen to appear.
3. Tap **Share → Add to Home Screen**.

From then on, open it from the Home Screen icon. It works offline in the car, on a plane or
anywhere else. The voice uses the iPad's built-in voice, which also works offline.

When you change `index.html`, bump `VERSION` at the top of `sw.js` so devices pick up the update
the next time they are online.

## Try it on this Mac

```bash
python3 -m http.server 8642
```

Then open http://localhost:8642 in a browser.

## Files

- `index.html`: the whole game (one file)
- `sw.js`: saves the game for offline play
- `manifest.webmanifest`, `icons/`: Home Screen name and icon

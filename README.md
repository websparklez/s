# Websparklez homepage redesign

## What's in here

- `index.html`: the full homepage, with SEO tags, Open Graph tags and structured data (business details plus FAQ)
- `css/style.css`: all styles, responsive from 360px phones up to wide desktops
- `js/main.js`: all interactions in plain JavaScript (no libraries)
- `images/`: optimised copies of your own logo, photos and project screenshots, renamed so the URLs are clean, plus a favicon cut from your logo mark
- `contact.php`: optional form handler, only for hosting that runs PHP

## Putting it live on GitHub Pages (websparklez/s)

1. Replace `index.html`, `css/style.css` and `js/main.js` in the repo with these files.
2. Copy everything in `images/` into your repo's `images/` folder. Your old images can stay; nothing on the new page uses them.
3. Commit and push. GitHub Pages updates in a minute or two.

You no longer need the Font Awesome kit or Typed.js. Icons are built into the page as SVG, which makes it load faster.

## The brief form

On GitHub Pages the form opens WhatsApp with the visitor's answers already typed out, and there's an email option under the button. If you ever move to hosting that runs PHP, upload `contact.php`, change `FROM_EMAIL` inside it to an address on your own domain, and set `FORM_ENDPOINT = 'contact.php'` near the top of `js/main.js`.

## Please check these before going live

These are written as you, so make sure they're true:

- "I usually reply the same day" (about section)
- "3 to 4 weeks" for a typical site (FAQ and process section)
- Fixed quotes, a free website check, the screen-recording walkthrough after launch, and Search Console and Analytics set up in the client's name
- The Lighthouse score targets (90+, 95+, 95+, 100)
- The eight sites under "More sites I've built" came from your repo's images folder. Remove any that you'd rather not show.

## Adding testimonials

There's a ready-styled testimonial block in a comment inside `index.html` (search for TESTIMONIALS). Paste real quotes from clients, ideally your Upwork reviews, and remove the comment marks.

---
title: About
order: 0
---

{::nomarkdown}
<img src="/public/images/me.png" alt="Me" />
{:/nomarkdown}

# Hi, I'm Max Barvian, a digital product designer from [{{ site.location }}](https://maps.google.com?q={{ site.location | url_param_escape }}). I enjoy thoughtful code, simple design, and making products that combine both. {% if site.availability == 'full' %}I'm looking for a remote mid-level position where I can work with like-minded people.{% endif %}

{::nomarkdown}
<a is="barvian-button" href="/public/CV.pdf">
  {% include /public/images/doc.svg %}
  Download my résumé
</a>
{:/nomarkdown}

I spent the last 4 years of my career learning from and working alongside great people at [WSOL](http://wsol.com). I had the opportunity to lead some projects while I was there, including a [redesigned website](/work/naperville) for the city of [Naperville, IL,](http://naperville.il.us) and some responsive redesigns for university websites.  Beyond that, I worked within the creative team, where we designed wireframes, developed prototypes, and thought long and hard about where to place search fields for clients ranging from local businesses to Fortune 500 companies.

I love making the most out of a project's constraints and picking the best tools for the job. I work well alone but better when I'm on a team, preferably one that values open design critiques.  More than anything, though, I enjoy working on projects that I find meaningful, and I think it's a privilege to work in an industry where these aren't hard to come by. My interests lie mostly in health and social issues, but if anything in this paragraph sounds like you or your company, [I'd love to chat](mailto:{{ site.email }}).

Tech-wise, I'm currently most interested in [Polymer](https://www.polymer-project.org/) (and Web Components, by extension) and potentially getting it to work nicely with [Redux](http://redux.js.org) for larger-scale applications. I like the flexibility and scale of Polymer as a platform; there's no massive library to load besides a lightweight web component shim so it works seamlessly with almost any architecture.  The build tools are still pretty young, though, and there are quite a few rough edges that will smooth out over the next few months as features become standardized and implemented by browser vendors.  This site uses Polymer under the hood and [page.js](https://visionmedia.github.io/page.js/) for routing, but otherwise it's just a plain-ol' Jekyll site hosted on Github pages with a [few tricks here and there](https://github.com/barvian/barvian.github.io/blob/master/_layouts/app.html).

Beyond web design, I'm an avid meditator and an occasional cinephile (I still log to [Letterboxd](https://letterboxd.com/{{ site.social.letterboxd }}) when I remember).  I've only written [a handful](http://blog.wsol.com/streamlining-the-html-prototyping-process) [of articles](http://blog.wsol.com/5-key-principles-of-user-centered-design) so far, but I plan on writing more in the future, particularly about health and tech issues. Oh, and recently I'm extremely interested in DIY home automation stuff, mostly because Max Braun blew my mind (and the rest of Medium's) with his [bathroom mirror](https://medium.com/@maxbraun/my-bathroom-mirror-is-smarter-than-yours-94b21c6671ba).  The bar has been raised.

Elsewhere, I share micro-opinions on [Twitter]({{ site.social.twitter }}), works-in-progress on [Dribbble]({{ site.social.dribbble }}), current rotations on [Spotify]({{ site.social.spotify }}), and work experience on [LinkedIn]({{ site.social.linkedin }}). I try to host any code I can on [Github](http://github.com/{{ site.social.github }}), including this website. Thanks for reading. 🖐

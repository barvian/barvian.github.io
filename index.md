---
title: Home
order: 1
---

<floating-greeting id="greeting">
  <a href="/about/">
    I'm a digital product designer who delights in creating thoughtful, selfless interfaces and codebases.
  </a>
  <a href="/contact/" class="highlight">
    I'm currently seeking a position at a company that delivers meaningful, quality products and services.
  </a>
</floating-greeting>

<ul id="works">
  {% for work in site.works %}
    <li><a href="{{work.url}}">{{ work.title }}</a></li>
  {% endfor %}
</ul>

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

<iron-media-query query="(min-width: 520px)" query-matches="{% raw %}{{gridIsFluid}}{% endraw %}"></iron-media-query>

<mason-ry id="works" is-fit-width="[[!gridIsFluid]]" percent-position="[[gridIsFluid]]" column-width=".sizer" gutter=".gutter" item-selector="article" transition-duration="0.1s">
  <div class="sizer"></div>
  {% for work in site.works %}
    <article>
      <a href="{{ work.url }}">
        <h1>{{ work.title }}</h1>
      </a>
    </article>
  {% endfor %}
</mason-ry>
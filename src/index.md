---
layout: layouts/splashPage.njk
title: ioio lab
headerImg: cutting-mat.jpg
headerTitle: The Institute of Interactive Objects
---

The ioio lab is the place where IxD students can get help with projects, studies or borrow electronic components for your prototypes.

## Opening hours

The teachers assistants are available during the opening hours but most days there will be people in the lab during normal office hours.

<ul class="Home-openingHours">
  {% for item in settings.openingHours %}
  <li><span class="Footer-day">{{item.day}}</span> <span class="Footer-time">{{item.start}} - {{item.end}}</span></li>
  {% endfor %}
</ul>

---
title: "The switch puzzle"
date: 2022-02-22
layout: default
---

Here is a really fun puzzle that I came up with. There are $$n$$ switches on the left, and $$n$$ lights on the right. Every switch is connected to exactly one light, and every light is connected to exactly one switch. You can send a *signal* by flipping a set of switches, and seeing the set of lights it lights up. Deduce which switch is connected to which light, in as few operations as possible.

For $$n = 4$$, you can do it in *2 signals*.

Can you figure out the general strategy for any $$n$$ that does it in as few operations as possible?

<script src="/assets/p5.min.js"></script>

<div id = "sketch-holder">
<script src="/2022/02/22/switchpuzzle.js"></script>

</div>
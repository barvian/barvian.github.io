---
title: SkinIO
description: Redesigning an app to save lives.
teaser: teaser.png
teaser2x: teaser@2x.png
tags:
  - iOS
---

# Redesigning SkinIO

I started at SkinIO in July of 2017, back when it was called ECD Network (short for Early Cancer Detection). I was the first full-time designer the company brought onboard, having outsourced it all before me. My first task was to help revision and redesign their existing iOS app; within a week and a half we redesigned nearly every screen in the app, and many of those designs haven’t changed over the last 9 months.


## Starting with principles

SkinIO in July of 2016 was a different company than it is now. Our product had not launched on the app store, the engineering team had just decided to rebuild the infrastructure from the ground up, and major business decisions were being made every few hours without much fuss. It was difficult to know just *where* to start with redesigning the entire app, what our desired outcomes were, and what constraints were in place technologically and timeline-wise. 

Given these questions, my first strategy was to gather a list of design principles from everyone in the company. I explained the concept, laid out some guidelines, and shared a Google Doc with the team. I populated it with a few initial ideas, but made it clear that the document was subject - and encouraged - to change.

[PRINCIPLES IMG]

Within two days our CEO and I had brainstormed 8 principles total. It served its purpose; as our product was fairly amorphous and constantly in flux at that point, this seemed like the sturdiest footing I would get to begin the UI overhaul, with the shared expectation that the redesign would be mostly surface-level. 


## Color

One of our established principles quickly created conflict with the existing iOS app’s color scheme. We discussed this as a group, brainstormed some potential, more appropriate palettes, then converged on a single solution. 

IMAGE OF COLOR PALETTE

I tried to ensure that we included numerous secondary colors, as color is the primary differentiator in how we present spot/detection types on skin pictures. Red and green were also helpful to include from a UI perspective, corresponding to negative and positive states.

I decided to duplicate this palette for maximum contrast on each theme in the app: a darker, less vibrant palette for our light theme (used in most of the standard UI), and a brighter, more saturated palette for our dark theme (used in all of the photo-related UI).

PICTURES OF BOTH PALETTES

This decision, while more involved, has proven worthwhile in my opinion. Contrast is prioritized and maintained in as many screens as possible, without enough differentiation between the palettes to appear jarring. 

On a technical note, I used Open Color Tools to create and manage these palettes, creating a shared file that we could all open and export into our own environments. I used the CSS export option to include the palette directly into our web work. Though the iOS engineers couldn't use the Swift export directly, there may be a way to automate their process sometime in the future. In any case, it will hopefully ensure we stay as up to date with the palette as possible. 

## Wireframing and ideating

I started every concept with multiple sketches, then asked the team for their input when they weren't busy with their individual work. At this point, most of these review sessions consisted of me, our CEO, and our lead iOS engineer.

After discussing the concepts, creating more variations, then converging them as a team, I moved into Sketch to flesh out the visuals. 


## Room for improvement 

Overall I'm proud with how this first scan and surfave-level redesign went, especially given the timeframe. It was also helpful to try to understand *why* the previous designers made the decision they did, versus discarding the results of their work in favor of my own ideas. It was a valuable exercise and the feedback from the team, potential investors and other inquirers has been largely positive. In retrospect, though, a few things didn't work as well as I hoped. 

### Color palette organization
This was my first time creating a color palette for use across web and iOS apps, and while the file format itself worked well, the organization became quickly unwieldy for the engineers to implement when building out the designs. I thought it would be helpful for their sake to list the use cases for each color, such as “Table view background color” and “Flagged disabled button color", but a few months into the project one of the engineers confessed how unhelpful he found the organization, for two reasons:

1. With so many use cases for each color in the palette, the engineers assumed there were dozens of colors, each one unique. (In reality, there were only 7-8 shades of blue/grays, then 6 secondary colors for each theme).
2. The use cases were too specific to maintain and even track down, so they often deferred to opening the sketch file directly and picking the color values, which was far more time consuming for them. Having too many cases was also counterproductive for their coded color palette helpers, as they had entries for each case which quickly became a burden to maintain. 

Knowing these pain points, I would've done away with the use case organization altogether and given numeric IDs to each blue/gray value (this was one of the iOS engineers’ preference as well). It may be helpful in the future to check in with the team on wide-reaching design implementation details, like color palettes, and make sure they're as frictionless as possible. 

### Premature polishing
I spent a tad longer on the initial body grid screen without fleshing out some of the other screens concurrently, because I was tempted by its aesthetic potential. I'm happy with how that screen turned out, but I unsurprisingly had a difficult time replicating the same level of polish on subsequent screens, which was a little frustrating. 

---
layout: post
title: Why do we have leap years?
summary: Approximating  365.242375  days in a calendar year
permalink: why-leap-years-exist
description: What are leap years? Why do they exist? Leap years exist because the Earth rotates about 365.242375 times a year. We have 365 days in a normal year and this leads to 0.242375 days extra. 29th Februrary exists to make up for this fraction in a genius way.
---
## How to check if a year is a leap year?

``(year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0));``

## What it means?
Every 4th year is a leap year, except it's not every 100th year, except it is every 400th year.

![Leap year calendar](https://images.unsplash.com/photo-1541696395-2abb1755c89a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1257&q=80)

## But, why?
Leap years exist because the Earth rotates about 365.242375 times a year. We have 365 days in a normal year and this leads to 0.242375 days extra. 29th Februrary exists to make up for this fraction.

- So, every 4th year we add an extra day, which makes 366 days that year and 365.25 days on average. Now, we went over the actual figure by 0.007625 days, which is almost a day every 131 years.

- So, every 100 years we need to skip the leap day and that means we have ``(366 * 24) + (365 * 76)`` per 100 years or 365.24 days per year. We are still lacking 0.002375 days per year. The error is small, almost a day every 421 years. This is still not small enough.

- So, every 400 years we add a leap day, which takes us to ``(366 * 97) + (365 * 303)`` per 400 years or 365.2425 days per year.

Now the difference is too low and it will take 8000 years when the total difference leads to an error of single day.

## Why not go further?
Due to several reasons like the tidal acceleration of sun and moon which slows the rotation of the earth. The actual rotation time of 365.242375 days will have changed by an amount which can not be accurately predicted. And this is accurate enough for most practical purposes.
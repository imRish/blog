---
layout: post
title: How AV sync works?
date: 2020-06-18 19:22
summary: Discoveries of my recent shindig with video editing and ffmpeg with php.
categories: ffmpeg audio video editing php
permalink: av-sync
published: false
---
## Background
I'm currently working on a [project](http://shasilluminated.org/) where we need video editing capabilities. A user can upload any type of video or audio. They can cut it or join it with other videos. We add the watermark,join prelude and postlude, and publish.

We thought about Cloudinary but I figured if there ever was be a perfect opportunity to learn ffmpeg, this was it. Being a fan of DIY and having a habit of biting more than I can chew, I jumped right in.

I won't get into the basics of ffmpeg right now, there are some very good tutorials like [this](http://dranger.com/ffmpeg/tutorial01.html) and an amazing documentation [here](https://ffmpeg.org/documentation.html). I am using a great wrapper for ffmpeg in PHP, you can find it [here](https://github.com/PHP-FFMpeg/PHP-FFMpeg).

## The Problem
The only big problem I've faced yet came when I tried to join two videos. There are two things which we can do,

- Joining videos which have previously encoded and known to be of same codecs.

```php
$useSameParameters = true;

$video = $ffmpeg->open( '/path/to/video' );
$video
    ->concat(array('/path/to/video1', '/path/to/video2'))
    ->saveFromSameCodecs('/path/to/new_file', $useSameParameters);
```

- Joining videos which can have different codecs.

```php
$video = $ffmpeg->open( '/path/to/video' );

$format = new FFMpeg\Format\Video\X264();
$format->setAudioCodec("libmp3lame");

$video
    ->concat(array('/path/to/video1', '/path/to/video2'))
    ->saveFromDifferentCodecs($format, '/path/to/new_file');

```

I chose to encode the videos beforehand and use the first method. The videos came out good and all was good, until I found that for some videos the video was not in sync. And this led to me discover how audio works in some popular containers like mp4.

Using the first method, there are a few properties that have to be equal.
- Video resolution
- Framerate
- Video codec
- Audio samplerate
- Audio channels and track / layout
- Audio codec(s)

I didn't know about one, **timebase**.

## How is audio synced into videos?
So, modern containers like MP4 have something called **Presentation TimeStamps**. I found an excellent answer explaining this on [stack overflow](https://stackoverflow.com/questions/43333542/what-is-video-timescale-timebase-or-timestamp-in-ffmpeg).


>Modern containers govern the time component of presentation of video (and audio) frames using timestamps, rather than framerate. So, instead of recording a video as 25 fps, and thus implying that each frame should be drawn 0.04 seconds apart, they store a timestamp for each frame e.g.
```
 Frame      pts_time
   0          0.00
   1          0.04
   2          0.08
   3          0.12
   ...
```
>For the sake of precise resolution of these time values, a timebase is used i.e. a unit of time which represents one tick of a clock, as it were. So, a timebase of 1/75 represents 1/75th of a second. The Presentation TimeStamps are then denominated in terms of this timebase. Timescale is simply the reciprocal of the timebase. FFmpeg shows the timescale as the tbn value in the readout of a stream.
```
Timebase = 1/75; Timescale = 75
 Frame        pts           pts_time
   0          0          0 x 1/75 = 0.00
   1          3          3 x 1/75 = 0.04
   2          6          6 x 1/75 = 0.08
   3          9          9 x 1/75 = 0.12
   ...
This method of regulating time allows variable frame-rate video.
```

----------

which are denominated with reference to a timebase. So, if the timebase value is 1/500 and a frame's PTS is 200, then that tells the video player to show that frame at 200*(1/500) = 0.4 seconds. The tbn values shown in the readouts are the reciprocals of this timebase. Now, the concat demuxer, due to a design oversight (or choice!?) does not rescale the PTS values so that all inputs have frames with PTS using the same timebase. Your two videos have different TBs, and so the long video after the concat is being sped up. The difference is perceptually invisible - except for the audio drift. That tbn value is for the video stream. Audio streams have their own timebase, related to the sample rate, which is the same here.


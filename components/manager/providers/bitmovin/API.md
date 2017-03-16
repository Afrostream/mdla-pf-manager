### Call API (Complete Request Profile or Template)

```
{
  "name": "bitcodin Encoding Profile",
  "videoStreamConfigs": [
    {
      "defaultStreamId": 0,
      "bitrate": 1024000,
      "profile": "Main",
      "preset": "Standard",
      "codec": "h264",
      "height": 480,
      "width": 204
    }
  ],
  "audioStreamConfigs": [
    {
      "defaultStreamId": 0,
      "bitrate": 256000
    }
  ]
}
```

### Call API Input (source)

```
{
  "inputId": 3,
  "status": "CREATED",
  "statusDescription": "Successfully created input!",
  "filename": "yourmovie.mp4",
  "createdAt": {
    "date": "11.03.2015 16:41:00",
    "timezone": {
      "timezone_type": 3,
      "timezone": "Europe/Berlin"
    }
  },
  "updatedAt": {
    "date": "11.03.2015 16:41:00",
    "timezone": {
      "timezone_type": 3,
      "timezone": "Europe/Berlin"
    }
  },
  "thumbnailUrl": "http://www.example.com/yourfolder/yourmovie_thumb.png",
  "inputType": "url",
  "url": "http://www.example.com/yourfolder/yourmovie.mp4",
  "basicAuthUser": "",
  "basicAuthPassword": "",
  "mediaConfigurations": [
    {
      "streamId": 0,
      "duration": 0,
      "rate": 24,
      "codec": "h264",
      "type": "video",
      "bitrate": 0,
      "width": 1280,
      "height": 544,
      "pixelFormat": "yuv420p"
    },
    {
      "streamId": 1,
      "duration": 0,
      "rate": 48000,
      "codec": "ac3",
      "type": "audio",
      "bitrate": 640000,
      "sampleFormat": 6,
      "channelFormat": 5.1
    }
  ]
}
```
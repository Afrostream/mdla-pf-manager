### Call API (Complete Request Profile or Template)

```
{
    "query": {
        "userid": "[UserID]",
        "userkey": "[UserKey]",
        "action": "[Action]",
        "mediaid": "[MediaID]",
        "source": [
            "[SourceFile]",
            "[SourceFile1]",
            "[SourceFileN]"
        ],
        "split_screen": {
            "columns": "[ColumnsNumber]",
            "rows": "[RowsNumber]",
            "padding_left": "[PaddingLeftInPx]",
            "padding_right": "[PaddingRightInPx]",
            "padding_bottom": "[PaddingBottomInPx]",
            "padding_top": "[PaddingTopInPx]"
        },
        "region": "[us-east-1|us-west-1|us-west-2|eu-west-1|eu-central-1|ap-southeast-1|ap-southeast-2|ap-northeast-1|sa-east-1]",
        "notify_format": "[xml|json]",
        "notify": "[NotifyURL]",
        "notify_encoding_errors": "[NotifyEncodingErrorURL]",
        "notify_upload": "[NotifyUploadURL]",
        "format": {
            "noise_reduction": "luma_spatial:chroma_spatial:luma_temp",
            "output": [
                "[Output format]",
                "mpeg2",
                "[PRESET_NAME]"
            ],
            "video_codec": "[Video Codec]",
            "audio_codec": "[Audio Codec]",
            "bitrate": "[Video bitrate]",
            "audio_bitrate": "[Audio bitrate]",
            "audio_sample_rate": "[Audio quality]",
            "audio_channels_number": "[Audio channels number]",
            "audio_volume": "[Volume]",
            "framerate": "[Frame Rate]",
            "framerate_upper_threshold": "[Frame Rate Upper Threshold]",
            "size": "[Size]",
            "fade_in": "[FadeInStart:FadeInDuration]",
            "fade_out": "[FadeOutStart:FadeOutDuration]",
            "crop_left": "[Crop Left]",
            "crop_top": "[Crop Top]",
            "crop_right": "[Crop Right]",
            "crop_bottom": "[Crop Bottom]",
            "keep_aspect_ratio": "[yes/no]",
            "set_aspect_ratio": "[ASPECT_RATIO|source]",
            "add_meta": "[yes/no]",
            "hint": "[yes/no]",
            "rc_init_occupancy": "[RC Occupancy]",
            "minrate": "[Min Rate]",
            "maxrate": "[Max Rate]",
            "bufsize": "[RC Buffer Size]",
            "keyframe": [
                "[Keyframe Period (GOP)]",
                "[12|15|25|30]"
            ],
            "start": "[Start From]",
            "duration": "[Result Duration]",
            "force_keyframes": "[Keyframe Period]",
            "bframes": "[2|0]",
            "gop": "[cgop|sgop]",
            "metadata": {
                "title": "[Title]",
                "copyright": "[Copyright]",
                "author": "[Author]",
                "description": "[Description]",
                "album": "[Album]"
            },
            "destination": [
                "[DestFile]",
                "[DestFile2]",
                "[DestFileN]"
            ],
            "logo": {
                "logo_source": "[LogoURL]",
                "logo_x": "[LogoLeft]",
                "logo_y": "[LogoTop]",
                "logo_mode": "[LogoMode]",
                "logo_threshold": "[LogoTreshold]"
            },
            "overlay": [
                {
                    "overlay_source": "[Overlay1Source]",
                    "overlay_left": "[Overlay1PositionXfromLeft]",
                    "overlay_right": "[Overlay1PositionXfromRight]",
                    "overlay_top": "[Overlay1PositionYfromTop]",
                    "overlay_bottom": "[Overlay1PositionYfromBottom]",
                    "size": "[Overlay1Size]",
                    "overlay_start": "[OverlayNStartInSeconds]",
                    "overlay_duration": "[OverlayNDurationInSeconds]"
                },
                {
                    "overlay_source": "[OverlayNSource]",
                    "overlay_left": "[OverlayNPositionXfromLeft]",
                    "overlay_right": "[OverlayNPositionXfromRight]",
                    "overlay_top": "[OverlayNPositionYfromTop]",
                    "overlay_bottom": "[OverlayNPositionYfromBottom]",
                    "size": "[OverlayNSize]",
                    "overlay_start": "[OverlayNStartInSeconds]",
                    "overlay_duration": "[OverlayNDurationInSeconds]"
                }
            ],
            "text_overlay": [
                {
                    "text": "[Text1]",
                    "font_source": "[Font1Source]",
                    "font_size": "[Font1Size]",
                    "font_rotate": "[Font1Rotate]",
                    "font_color": "[Font1Color]",
                    "align_center": "[0|1]",
                    "overlay_x": "[TextOverlay1PositionX]",
                    "overlay_y": "[TextOverlay1PositionY]",
                    "size": "[TextOverlay1Size]",
                    "overlay_start": "[TextOverlay1StartInSeconds]",
                    "overlay_duration": "[TextOverlay1DurationInSeconds]"
                },
                {
                    "text": "[TextN]",
                    "font_source": "[FontNSource]",
                    "font_size": "[FontNSize]",
                    "font_rotate": "[FontNRotate]",
                    "font_color": "[FontNColor]",
                    "align_center": "[0|1]",
                    "overlay_x": "[TextOverlayNPositionX]",
                    "overlay_y": "[TextOverlayNPositionY]",
                    "size": "[TextOverlayNSize]",
                    "overlay_start": "[TextOverlayNStartInSeconds]",
                    "overlay_duration": "[TextOverlayNDurationInSeconds]"
                }
            ],
            "video_codec_parameters": "To see the example for parameters please follow this link below *",
            "profile": "[high/main/baseline]",
            "turbo": "[yes/no]",
            "rotate": "def|0|90|270",
            "set_rotate": "def|0|90|270",
            "audio_sync": "[1..N]",
            "video_sync": "old|passthrough|cfr|vfr|auto",
            "force_interlaced": "tff|bff|no",
            "strip_chapters": "[yes|no]"
        }
    }
}

```

### Output Query MPEG DASH
```
{
    "query": {
        "userid": "[UserID]",
        "userkey": "[UserKey]",
        "action": "[Action]",
        "format": {
            "output": "mpeg_dash",
            "bitrates": "[CommaSeparatedList]",
            "sizes": "[CommaSeparatedList]",
            "pack_files": "[yes|no]",
            "dash_profile": "[full|ondemand|live|hbbtv]",
            "destination": "[DestFile]"
        }
    }
}
```

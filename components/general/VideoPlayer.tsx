"use client";
import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerMuteButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekBackwardButton,
  VideoPlayerSeekForwardButton,
  VideoPlayerTimeDisplay,
  VideoPlayerTimeRange,
  VideoPlayerVolumeRange,
} from "@/components/ui/shadcn-io/video-player";
import useConstructUrl from "@/hooks/useConstructUrl";
import { BookIcon } from "lucide-react";

const VideoPlayerComponent = ({
  videoUrlKey,
  thubnailUrlKey,
  startTime = 0, // 👈 preset start time (in seconds)
}: {
  videoUrlKey: string;
  thubnailUrlKey: string;
  startTime?: number;
}) => {
  const videoUrl = useConstructUrl(videoUrlKey || "");
  const imgUrl = useConstructUrl(thubnailUrlKey || "");

  if (!videoUrlKey) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center flex-col">
        <BookIcon className="size-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          This lesson does not have a video yet
        </p>
      </div>
    );
  }

  return (
    <VideoPlayer className="overflow-hidden rounded-lg border aspect-video">
      <VideoPlayerContent
        crossOrigin="anonymous"
        muted
        preload="auto"
        slot="media"
        src={videoUrl || ""}
        poster={imgUrl || undefined}
        onLoadedMetadata={(e) => {
          const video = e.currentTarget;
          if (startTime < video.duration) {
            video.currentTime = startTime; // 👈 jump to preset time
          }
        }}
      />
      <VideoPlayerControlBar>
        <VideoPlayerSeekBackwardButton />
        <VideoPlayerPlayButton />
        <VideoPlayerSeekForwardButton />
        <VideoPlayerTimeRange />
        <VideoPlayerTimeDisplay showDuration />
        <VideoPlayerMuteButton />
        <VideoPlayerVolumeRange />
      </VideoPlayerControlBar>
    </VideoPlayer>
  );
};
export default VideoPlayerComponent;

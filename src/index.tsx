import { ActionPanel, CopyToClipboardAction, Icon, List, OpenInBrowserAction, showToast, Toast } from "@raycast/api";
import { homedir } from "os";
import { join } from "path";
import { create } from "youtube-dl-exec";
import logger from "progress-estimator";

const youtubedl = create("/usr/local/bin/yt-dlp");

export default function YoutubeURLList() {
  let url = "";
  const items = [
    {
      title: "Convert YouTube Video to MP3",
      key: "mp3",
      url: "",
    },
    {
      title: "Convert YouTube Video to MP4",
      key: "mp4",
      url: "",
    },
  ];

  return (
    <List
      searchBarPlaceholder="Enter YouTube URL"
      onSearchTextChange={(text) => (url = text)}
      isLoading={items.length === 0}
      key={items[0].key}
    >
      {items.map((item) => (
        <List.Item
          id={url}
          title={item.title}
          actions={
            <ActionPanel>
              <ActionPanel.Item
                title="Convert and Save"
                icon={Icon.Download}
                onAction={() => convertAndSave(url, item.key)}
              />
              <CopyToClipboardAction content={url} />
              <OpenInBrowserAction url={url} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

async function convertAndSave(url: string, key: string) {
  const outputDir = join(homedir(), "Downloads");
  const filename = `video_${Date.now()}.${key}`;

  // use youtube-dl-exec to donwload the videos and use progress-estimator to show a progress bar
  try {
    await youtubedl(url, {
      output: join(outputDir, filename),
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ["referer:youtube.com", "user-agent:googlebot"],
      // if key is mp3, then extract the audio only
      // if key is mp4, then download the video with audio
      extractAudio: key === "mp3" ? true : undefined,
      audioFormat: key === "mp3" ? "mp3" : undefined,
      mergeOutputFormat: key === "mp4" ? "mp4" : undefined,
      ffmpegLocation: "/usr/local/bin/ffmpeg",
      format: key === "mp4" ? "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" : undefined,
    });
    showToast(Toast.Style.Success, "Downloaded " + filename);
  } catch (error) {
    showToast(Toast.Style.Failure, "Failed" + error);
    console.log(error);
  }
}

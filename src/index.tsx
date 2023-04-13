import {
  ActionPanel,
  CopyToClipboardAction,
  Icon,
  List,
  OpenInBrowserAction,
  showToast,
  Toast,
  ToastStyle,
} from "@raycast/api";
import { homedir } from "os";
import { join } from "path";
import { exec, create } from "youtube-dl-exec";
import logger from "progress-estimator";

const youtubedl = create("/usr/local/bin/yt-dlp");

export default function YoutubeURLList() {
  const items = [
    {
      title: "Convert YouTube Video to MP3",
      key: "convert",
      url: "https://www.youtube.com/watch?v=QH2-TGUlwu4",
    },
  ];

  return (
    <List
      searchBarPlaceholder="Enter YouTube URL"
      onSearchTextChange={(text) => (items[0].url = text)}
      isLoading={items.length === 0}
      key={items[0].key}
    >
      {items.map((item) => (
        <List.Item
          id={item.url}
          title={item.title}
          actions={
            <ActionPanel>
              <ActionPanel.Item
                title="Convert and Save"
                icon={Icon.Download}
                onAction={() => convertAndSave(item.url)}
              />
              <CopyToClipboardAction content={item.url} />
              <OpenInBrowserAction url={item.url} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

async function convertAndSave(url: string) {
  const outputDir = join(homedir(), "Downloads");
  const filename = `video_${Date.now()}.mp3`;

  // use youtube-dl-exec to donwload the videos and use progress-estimator to show a progress bar
  console.log(url);
  try {
    const output = await youtubedl(url, {
      output: join(outputDir, filename),
      extractAudio: true,
      audioFormat: "mp3",
      ffmpegLocation: "/usr/local/bin/ffmpeg",
    });
    showToast(Toast.Style.Success, "Downloaded " + filename + " from " + output.channel);
  } catch (error) {
    showToast(Toast.Style.Failure, "Failed to convert YouTube video to MP3!" + error);
  }
}

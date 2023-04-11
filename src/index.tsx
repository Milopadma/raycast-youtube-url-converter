import {
  ActionPanel,
  CopyToClipboardAction,
  Icon,
  List,
  OpenInBrowserAction,
  showToast,
  ToastStyle,
} from "@raycast/api";
import { spawn } from "child_process";
import { homedir } from "os";
import { join } from "path";
import { youtubedl } from "youtube-dl-exec";

export default function YoutubeURLList() {
  const items = [
    {
      title: "Convert YouTube Video to MP3",
      url: "",
    },
  ];

  return (
    <List
      searchBarPlaceholder="Enter YouTube URL"
      onSearchTextChange={(text) => (items[0].url = text)}
      isLoading={items.length === 0}
      key={items.length}
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

  const youtubeDl = spawn("youtube-dl", [
    "--extract-audio",
    "--audio-format",
    "mp3",
    "--output",
    join(outputDir, filename),
    url,
  ]);

  showToast(ToastStyle.Animated, "Converting YouTube video to MP3...");

  youtubeDl.on("close", (code) => {
    if (code === 0) {
      showToast(
        ToastStyle.Success,
        "Conversion complete!",
        `The MP3 file has been saved in your Downloads folder as ${filename}`
      );
    } else {
      showToast(ToastStyle.Failure, "Conversion failed", "Please make sure you entered a valid YouTube URL.");
    }
  });

  youtubeDl.on("error", (error) => {
    showToast(ToastStyle.Failure, "Error", error.message);
  });
}

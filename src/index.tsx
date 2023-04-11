import {
  ActionPanel,
  CopyToClipboardAction,
  Icon,
  List,
  OpenInBrowserAction,
  showToast,
  ToastStyle,
} from "@raycast/api";
import { homedir } from "os";
import { join } from "path";
import youtubedl from "youtube-dl-exec";
import createLogger from "progress-estimator";

export default function YoutubeURLList() {
  const items = [
    {
      title: "Convert YouTube Video to MP3",
      key: "convert",
      url: "",
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

  // use youtube-dl-exec
  const promise = youtubedl("https://www.youtube.com/watch?v=6W_qHa1wq60", {
    dumpSingleJson: true,
  });

  // use progress-estimator
  const estimate = createLogger({
    storagePath: join(homedir(), ".progress-estimator"),
  });

  // show progress
  const result = await estimate;
  console.log(result);

  showToast(ToastStyle.Animated, "Converting YouTube video to MP3...");

  // conversion to complete, and show toast if success
  // youtubeDl.then((output) => {
  //   console.log(output);
  // });
}

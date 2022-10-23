import { useEffect, useRef } from "react";
import { useState } from "react";
import create from "zustand";
import If from "components/If";

const isWindow = () => typeof window !== "undefined";

const getLocalStorage = (key) =>
  isWindow() && JSON.parse(window.localStorage.getItem(key));
const setLocalStorage = (key, value) =>
  isWindow() && window.localStorage.setItem(key, JSON.stringify(value));

const useStore = create((set) => ({
  recent: getLocalStorage("recent") || [],
  setRecent: async (recent) => {
    const normalized = recent.map(async (x) => {
      if (x && typeof x == "string") {
        const res = {};
        res.link = x;
        res.title = await fetch(`/api/info?link=${x}`)
          .then((r) => r.json())
          .then((d) => {
            return d.title;
          });
        x = res;
      }
      return x;
    });

    const data = await Promise.all(normalized);
    setLocalStorage(
      "recent",
      data.filter((x) => x)
    );
    set((state) => ({ recent: data }));
  },
}));

export default function () {
  const [link, setLink] = useState("");
  const audioRef = useRef();
  const recents = useStore((s) => s.recent);
  const setRecents = useStore((s) => s.setRecent);

  useEffect(() => {
    let recentList = recents.slice().filter((x) => x) || [];

    const exists = recentList.findIndex((x) => {
      if (typeof x === "string") {
        return x === link;
      }
      if (typeof x === "object") {
        return x.link === link;
      }
    });

    if (exists === -1) {
      recentList.push(link);
    }

    setRecents(recentList);

    audioRef.current?.pause();
  }, [link]);

  const audioSrc = link ? `/api/play?link=${link}` : null;

  return (
    <>
      <div className="music-container">
        <input
          placeholder="insert youtube link and click on the play button"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <If condition={audioSrc}>
          <audio controls={true} src={audioSrc} ref={audioRef} />
        </If>
        <div>
          <h3>Recents</h3>
          <If condition={recents.length > 0}>
            <ul>
              {recents.map((x) => (
                <li>
                  <a onClick={(e) => setLink(x.link)}>{x.title}</a>
                </li>
              ))}
            </ul>
          </If>
        </div>
        <If condition={recents.length === 0}>
          <p>Nothing to show...</p>
        </If>
      </div>
      <style jsx>
        {`
          h3 {
            color: var(--a8);
            margin: 4px 0px;
          }

          .music-container {
            display: flex;
            flex-direction: column;
            width: 400px;
            margin: 0 auto;
            margin-top: 25vh;
            gap: 14px;
          }

          ul {
            margin: 0px;
            padding: 0px;
          }

          li {
            color: var(--a4);
            margin: 12px 0px;
            list-style-type: none;
          }

          li:hover {
            color: var(--a9);
          }
        `}
      </style>
    </>
  );
}

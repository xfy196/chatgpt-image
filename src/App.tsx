import { useCallback, useEffect, useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import "./App.css";
import { openapiSk, originId } from "./config/config";
import { useCopyToClipboard } from "react-use";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./loading";
const configuration = new Configuration({
  organization: originId,
  apiKey: window.atob(openapiSk),
});
const openai = new OpenAIApi(configuration);

function App() {
  const [urls, setUrls] = useState<Array<any>>([]);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [state, copyToClipboard] = useCopyToClipboard();
  const handleChange = useCallback(
    (e: { target: any }) => {
      setValue(e.target.value);
    },
    [value]
  );
  useEffect(() => {
    if (state.value) {
      toast("复制成功", {
        autoClose: 2000,
      });
    }
    if (state.error?.message) {
      toast(state.error.message);
    }
  }, [state]);
  const handleClick = useCallback(async () => {
    try {
      setLoading(true);
      setUrls([]);
      const response = await openai.createImage({
        prompt: value,
        n: 2,
        size: "256x256",
      });
      const data = response.data.data;
      setUrls(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [value]);
  const handleCopy = (url: string) => {
    copyToClipboard(url);
  };
  return (
    <div className="container">
      <div className="inputBox">
        <input
          className="searchInput"
          type="text"
          value={value}
          placeholder="请输入图片的描述内容"
          onChange={handleChange}
        />
        <button onClick={handleClick} className="searchBtn">
          生成
        </button>
      </div>
      {loading && <Loading />}
      {urls.length > 0 && (
        <div className="imgBox">
          {urls.map((item: any, index: number) => (
            <div key={item.url} className="imgWrap">
              <img src={item.url} alt="" />
              <div
                onClick={handleCopy.bind(null, item.url)}
                className="copyBtn"
              >
                复制
              </div>
            </div>
          ))}
          <ToastContainer />
        </div>
      )}
    </div>
  );
}

export default App;

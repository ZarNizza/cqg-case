import { useEffect, useState } from "react";
import { styles } from "../styles/Home.module.css";
import io from "Socket.IO-client";
let socket;

const Home = () => {
  const [input, setInput] = useState("");
  const [ServEmitFlag, setServEmitFlag] = useState(false);
  const [tabData, setTabData] = useState("abc");

  useEffect(() => socketInitializer(), []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("update-input", (msg) => {
      setInput(msg);
    });

    socket.on("dataFlow", (msg) => {
      console.log("receivedData=", msg);
      setTabData(String(msg));
    });
  };

  const onChangeHandler = (e) => {
    setInput(e.target.value);
    socket.emit("input-change", e.target.value);
  };

  const servHandler = () => {
    setServEmitFlag(() => !ServEmitFlag);
    socket.emit("emitFlag", "ServEmitFlag");
  };

  const Tabloid = (props) => {
    console.log("props.data=", props.data);
    return (
      <div class="tabloid">
        <h3>TabDtata:</h3>
        {props.data}
      </div>
    );
  };

  return (
    <div>
      <input
        placeholder="Type something"
        value={input}
        onChange={onChangeHandler}
      />
      <div>
        <input type="checkbox" onChange={servHandler} checked={ServEmitFlag} />
        ServEmitFlag
      </div>
      <Tabloid data={tabData} />
    </div>
  );
};

export default Home;

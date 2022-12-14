import { Card } from "antd";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client"; //웹소켓
import LetterForm from "./letterForm";
import LetterProps from "./letterProps";

const Chatinguser = ({ me }) => {
  const [arrayList, setArrayList] = useState([]);

  const socket: Socket = io.connect("http://localhost:3065", {
    //웹 소켓 연결
    cors: {
      origin: "*",
      credentials: true,
    },
    transports: ["websocket"],
  });

  useEffect(() => {
    socket.emit("firstJoin", me.nickname);
  }, []); //나의 닉네임 보내기

  socket.on("userUpdate", (list) => {
    setArrayList(list); //arrayList는 이차원배열로 [x][0]엔 닉네임 [x][1]엔 socket Id가 들어있다
  });

  return (
    <div>
      <Card style={{ width: 300 }} title="접속중인 유저">
        {arrayList.map((props) => {
          return <LetterForm props={props} socket={socket} me={me} />;
        })}
      </Card>
      <LetterProps socket={socket} />
    </div>
  );
};

export default Chatinguser;

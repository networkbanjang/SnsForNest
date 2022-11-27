import { Button, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux'
import { Message_List_Request } from '../reducers/chat';

const LetterProps = ({ socket }) => {

  const dispatch = useDispatch();
  const { message } = useSelector((state) => state.chat);

  socket.on('letter', (data) => {
    dispatch({                          //서버로부터 메세지가 오면 redux에 message list를 요청
      type: Message_List_Request,
      data,
    })
  })


  return (
    Array.from(message).map((element) => {  //유사배열을 배열로
      return (<>
        <Tooltip key={element} placement="rightTop" title={element.message}>
          <Button>{element.nick}님의 메시지</Button>
        </Tooltip>
        <br />
      </>)
    })

  )
}

export default LetterProps;
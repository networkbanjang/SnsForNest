import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ConnectedSocket } from '@nestjs/websockets/decorators/connected-socket.decorator';
import { MessageBody } from '@nestjs/websockets/decorators/message-body.decorator';
import { Socket } from 'socket.io';

@WebSocketGateway(/*{namespace:"네임스페이스를 설정해줄수 있다"}*/)
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private userList = [];
  private usernick: string;
  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log(`${socket.id} 접속`);
  }
  
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log(`${socket.id} 접속해제`);
    this.userList.forEach((e, i) => {
      if (e[0] === this.usernick) {
        this.userList.splice(i, 1);
      }
    });
    socket.emit('userUpdate', this.userList);
  }

  @SubscribeMessage('firstJoin')
  userListSet(
    @MessageBody() nick: string,
    @ConnectedSocket() socket: Socket,
  ): void {
    this.usernick = nick;
    const check = this.userList.some((e) => e[0] === nick); //닉이 중복이있을시 true 리턴
    if (!check) {
      this.userList.push([nick, socket.id]);
    }
    socket.emit('userUpdate', this.userList); //유저리스트 최신화
  }

  @SubscribeMessage('message')
  sendMessage(
    @MessageBody() data: { id: string; nick: string; message: string },
    @ConnectedSocket() socket: Socket,
  ): void {
    socket.to(data.id).emit('letter', data); //유저리스트 최신화
  }
}

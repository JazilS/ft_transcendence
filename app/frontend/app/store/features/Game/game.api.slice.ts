import { GeneralEvent, PongEvent } from "../../../../shared/socketEvent";
import { GameInvitationType, PongGameType } from "../../../../models/Game/GameModel";
import { Basetype } from "../../../../models/Game/BaseType";
import {
  disconnectSocket,
  connectSocket,
  mySocket,
} from "../../../utils/getSockets";
import { apiSlice } from "../../api/apiSlice";

export const GameApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    joinBackCurrentGame: builder.mutation<
      {
        data: { gameId: string };
      },
      { gameId: string }
    >({
      queryFn: (data) => {
        return new Promise((resolve) => {
          connectSocket();

          mySocket.emit(PongEvent.JOIN_BACK_CURRENT_GAME, data);

          mySocket.on(GeneralEvent.SUCCESS, (data) => {
            disconnectSocket();
            resolve({ data });
          });

          mySocket.on(GeneralEvent.EXCEPTION, (error) => {
            disconnectSocket();
            resolve({ error });
          });
        });
      },
    }),
    joinQueue: builder.mutation<
      {
        data: { gameId: string };
      },
      PongGameType
    >({
      queryFn: (data) => {
        return new Promise((resolve) => {
          connectSocket();

          mySocket.emit(PongEvent.JOIN_QUEUE, data);

          mySocket.on(GeneralEvent.SUCCESS, (data) => {
            disconnectSocket();
            resolve({ data });
          });

          mySocket.on(GeneralEvent.EXCEPTION, (error) => {
            disconnectSocket();
            resolve({ error });
          });
        });
      },
    }),
    leaveQueue: builder.mutation<
      {
        data: unknown;
      },
      void
    >({
      queryFn: () => {
        return new Promise((resolve) => {
          connectSocket();

          mySocket.emit(PongEvent.LEAVE_QUEUE);

          mySocket.on(GeneralEvent.SUCCESS, (data) => {
            disconnectSocket();
            resolve({ data });
          });

          mySocket.on(GeneralEvent.EXCEPTION, (error) => {
            disconnectSocket();
            resolve({ error });
          });
        });
      },
    }),
    sendGameInvitation: builder.mutation<
      {
        data: unknown;
      },
      GameInvitationType
    >({
      queryFn: (data) => {
        return new Promise((resolve) => {
          connectSocket();

          mySocket.emit(PongEvent.SEND_GAME_INVITATION, data);

          mySocket.on(GeneralEvent.SUCCESS, (data) => {
            disconnectSocket();
            resolve({ data });
          });

          mySocket.on(GeneralEvent.EXCEPTION, (error) => {
            disconnectSocket();
            resolve({ error });
          });
        });
      },
    }),
    acceptGameInvitation: builder.mutation<
      {
        data: unknown;
      },
      Basetype
    >({
      queryFn: (data) => {
        return new Promise((resolve) => {
          connectSocket();

          mySocket.emit(PongEvent.ACCEPT_GAME_INVITATION, data);

          mySocket.on(GeneralEvent.SUCCESS, (data) => {
            disconnectSocket();
            resolve({ data });
          });

          mySocket.on(GeneralEvent.EXCEPTION, (error) => {
            disconnectSocket();
            resolve({ error });
          });
        });
      },
    }),
    getLeaderboard: builder.query<
      BaseServerResponse & { data: any[] },
      void
    >({
      query: () => ({
        url: "/pong/leaderboard",
      }),
    }),
    declineGameInvitation: builder.mutation<
      {
        data: unknown;
      },
      Basetype
    >({
      queryFn: (data) => {
        return new Promise((resolve) => {
          connectSocket();

          mySocket.emit(PongEvent.DECLINE_GAME_INVITATION, data);

          mySocket.on(GeneralEvent.SUCCESS, (data) => {
            disconnectSocket();
            resolve({ data });
          });

          mySocket.on(GeneralEvent.EXCEPTION, (error) => {
            disconnectSocket();
            resolve({ error });
          });
        });
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useJoinQueueMutation,
  useLeaveQueueMutation,
  useSendGameInvitationMutation,
  useAcceptGameInvitationMutation,
  useDeclineGameInvitationMutation,
  useGetLeaderboardQuery,
  useJoinBackCurrentGameMutation,
} = GameApiSlice;



export type BaseServerResponse = {
  message: string;
  statusCode: number;
};

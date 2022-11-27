import produce from '../util/produce';

export const initialState = {
  chatroom: [],
  message: [],
};

export const Message_List_Request = "Message_List_Request";

const reducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {

    case Message_List_Request:
      draft.message.unshift(action.data);
      break;

    default:
      break;
  }
});


export default reducer;
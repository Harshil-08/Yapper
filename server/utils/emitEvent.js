export const emitEvent = (req, event, users, data)=>{
	console.log("Emitting event", event,data);
}

const ALERT = "ALERT"
const REFETCH_CHATS = "REFETCH_CHATS"
const NEW_ATTACHEMENT = "NEW_ATTACHEMENT"
const NEW_MESSAGE_ALERT = "NEW_MESSAGE_ALERT"

export{ALERT, REFETCH_CHATS,NEW_ATTACHEMENT,NEW_MESSAGE_ALERT};



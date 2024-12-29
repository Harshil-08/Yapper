import multer from "multer";

const multerupload = multer({
	limits:{
 		fileSize: 1024*1024*5,
	},
});

const singleAvater = multerupload.single("avatar");

const attachmentsMulter = multerupload.array("files",5);

export {singleAvater, attachmentsMulter};
